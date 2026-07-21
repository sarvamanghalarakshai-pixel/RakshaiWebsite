import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/admin-check';
import { sendOrderStatusUpdateEmail } from '@/lib/email';

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

    const { status: newStatus } = await request.json();
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!newStatus || !validStatuses.includes(newStatus)) {
      return NextResponse.json({ message: 'Invalid order status code.' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      // Fetch the order to ensure it exists and get customer ID
      const { data: order, error: fetchError } = await supabaseAdmin
        .from('orders')
        .select('*, customers(*)')
        .eq('id', orderId)
        .single();

      if (fetchError || !order) {
        return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
      }

      // Update Order Status
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({ order_status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order status:', updateError);
        return NextResponse.json({ message: 'Failed to update order status.' }, { status: 500 });
      }

      // Fire Customer status update email
      try {
        await sendOrderStatusUpdateEmail(order, order.customers, newStatus);
      } catch (emailErr) {
        console.error('Error sending order status change email:', emailErr);
      }

      return NextResponse.json({ success: true, message: `Status updated to ${newStatus}.` });
    }

    // Dev mode success log
    console.log(`[MOCK UPDATE] Order ${orderId} status set to ${newStatus}.`);
    return NextResponse.json({ success: true, message: `[MOCK] Status updated to ${newStatus}.` });

  } catch (err: any) {
    return NextResponse.json({ message: 'Internal server error.', error: err.message }, { status: 500 });
  }
}
