import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/admin-check';
import { sendAdminOrderCancelledAlert, sendOrderStatusUpdateEmail } from '@/lib/email';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  // 1. Authorize Admin request
  const authResult = await verifyAdminRequest(request);
  if (!authResult.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized.', error: authResult.error }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    let refundStatus = 'Not Applicable (Unpaid)';

    if (isSupabaseConfigured()) {
      // Fetch order and customer details
      const { data: order, error: fetchError } = await supabaseAdmin
        .from('orders')
        .select('*, customers(*)')
        .eq('id', orderId)
        .single();

      if (fetchError || !order) {
        return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
      }

      if (order.order_status === 'cancelled') {
        return NextResponse.json({ message: 'Order is already cancelled.' }, { status: 400 });
      }

      // Check payment status for refund processing
      let updatedPaymentStatus = order.payment_status;
      if (order.payment_status === 'paid' && order.razorpay_payment_id) {
        const rzpKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;

        if (rzpKeyId && rzpKeySecret) {
          try {
            console.log(`Initiating Razorpay Refund for payment ${order.razorpay_payment_id}...`);
            const razorpay = new Razorpay({
              key_id: rzpKeyId,
              key_secret: rzpKeySecret
            });

            // Trigger actual Razorpay refund API
            await razorpay.payments.refund(order.razorpay_payment_id, {
              amount: Math.round(Number(order.total_amount) * 100) // in paise
            });
            
            refundStatus = 'Refund Processed via Razorpay';
            updatedPaymentStatus = 'refunded';
          } catch (refundErr: any) {
            console.error('Razorpay Refund API error:', refundErr);
            refundStatus = `Refund API Failed: ${refundErr.message || 'Unknown error'}. Manual refund required.`;
            updatedPaymentStatus = 'refunded'; // still set to refunded in status tracking, but with manual note
          }
        } else {
          refundStatus = 'Razorpay credentials missing. Manual refund required.';
          updatedPaymentStatus = 'refunded';
        }
      }

      // Update Order Status & Payment Status in DB
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          order_status: 'cancelled',
          payment_status: updatedPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error cancelling order:', updateError);
        return NextResponse.json({ message: 'Failed to update cancellation status.' }, { status: 500 });
      }

      // Send cancellation email to Admin
      try {
        await sendAdminOrderCancelledAlert(order, order.customers, refundStatus);
      } catch (emailErr) {
        console.error('Error sending admin cancellation email alert:', emailErr);
      }

      // Send status change update email to Customer
      try {
        await sendOrderStatusUpdateEmail(order, order.customers, 'cancelled');
      } catch (emailErr) {
        console.error('Error sending customer cancellation status update email:', emailErr);
      }

      return NextResponse.json({
        success: true,
        message: 'Order cancelled successfully.',
        refundStatus
      });
    }

    // Dev mode Mock
    console.log(`[MOCK CANCELLATION] Order ${orderId} has been cancelled.`);
    return NextResponse.json({
      success: true,
      message: '[MOCK] Order cancelled successfully.',
      refundStatus: 'Mock Refund Processed'
    });

  } catch (err: any) {
    return NextResponse.json({ message: 'Internal server error.', error: err.message }, { status: 500 });
  }
}
