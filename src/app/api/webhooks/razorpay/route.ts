import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Helper to read the request body as text
async function getRawBody(req: NextRequest): Promise<string> {
  const reader = req.body?.getReader();
  if (!reader) return '';
  const decoder = new TextDecoder();
  let result = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-razorpay-signature');
    const rawBody = await request.text();
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature) {
      return NextResponse.json({ message: 'Missing Razorpay signature header.' }, { status: 400 });
    }

    // 1. Signature Verification
    if (webhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('RAZORPAY WEBHOOK ERROR: Signature verification failed.');
        return NextResponse.json({ message: 'Signature verification failed.' }, { status: 400 });
      }
    } else {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ message: 'Webhook secret is not configured in production.' }, { status: 500 });
      }
      console.warn('WEBHOOK WARNING: RAZORPAY_WEBHOOK_SECRET is not configured. Bypassing verification for local development.');
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    
    console.log(`Received Razorpay webhook event: ${event}`);

    // We listen to payment.captured or order.paid
    if (event === 'payment.captured' || event === 'order.paid') {
      let rzpOrderId = '';
      let rzpPaymentId = '';

      if (event === 'payment.captured') {
        const paymentEntity = payload.payload.payment.entity;
        rzpOrderId = paymentEntity.order_id;
        rzpPaymentId = paymentEntity.id;
      } else {
        const orderEntity = payload.payload.order.entity;
        rzpOrderId = orderEntity.id;
        // In order.paid, payment ID might not be directly in the order entity,
        // but it can be retrieved from standard entities or we update it during capture.
        rzpPaymentId = payload.payload.payment?.entity?.id || 'captured_via_order_paid';
      }

      console.log(`Processing capture for Razorpay Order ID: ${rzpOrderId}, Payment ID: ${rzpPaymentId}`);

      if (isSupabaseConfigured()) {
        // Find order by Razorpay Order ID
        const { data: order, error: orderFetchError } = await supabaseAdmin
          .from('orders')
          .select('*, customers(*)')
          .eq('razorpay_order_id', rzpOrderId)
          .single();

        if (orderFetchError || !order) {
          console.error(`Order not found for Razorpay Order ID ${rzpOrderId}:`, orderFetchError);
          return NextResponse.json({ message: 'Order matching Razorpay ID not found.' }, { status: 404 });
        }

        // Only update if not already marked paid (prevents double webhook triggers)
        if (order.payment_status !== 'paid') {
          // Update order status to paid and processing
          const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
              payment_status: 'paid',
              order_status: 'processing',
              razorpay_payment_id: rzpPaymentId,
              updated_at: new Date().toISOString()
            })
            .eq('id', order.id);

          if (updateError) {
            console.error('Failed to update order payment status in DB:', updateError);
            return NextResponse.json({ message: 'Failed to update order status.' }, { status: 500 });
          }

          console.log(`Order ${order.order_number} marked as paid. Triggering transactional emails...`);

          // Trigger Transactional Emails (Phase 6 implementation hook)
          try {
            // We import dynamically to avoid dependency loops or crashes if email helper isn't finalized
            const { sendNewOrderEmail, sendAdminNewOrderAlert } = await import('@/lib/email');
            
            await sendNewOrderEmail(order, order.customers);
            await sendAdminNewOrderAlert(order, order.customers);
            
            console.log('Transactional confirmation emails sent successfully.');
          } catch (emailErr) {
            console.error('Error sending transactional emails after payment capture:', emailErr);
            // We don't fail the webhook response because the DB write was successful
          }
        }
      } else {
        console.warn('DATABASE WARNING: Supabase not configured. Payment capture logged successfully (no-op).');
      }
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Razorpay Webhook API Error:', error);
    return NextResponse.json({ message: 'Internal server error processing webhook.', error: error.message }, { status: 500 });
  }
}
