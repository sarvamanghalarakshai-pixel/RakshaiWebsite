import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/admin-check';

export async function GET(request: NextRequest) {
  // 1. Authorize Admin request
  const authResult = await verifyAdminRequest(request);
  if (!authResult.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized.', error: authResult.error }, { status: 401 });
  }

  // 2. Fetch Orders from Database
  if (isSupabaseConfigured()) {
    try {
      const url = new URL(request.url);
      const search = url.searchParams.get('search') || '';
      const status = url.searchParams.get('status') || '';

      let query = supabaseAdmin
        .from('orders')
        .select('*, customers(*), astro_cards(*)');

      if (status) {
        query = query.eq('order_status', status);
      }

      if (search) {
        // Ripgrep or standard search
        query = query.or(`customers.full_name.ilike.%${search}%,order_number.ilike.%${search}%`);
      }

      // Order by latest
      query = query.order('created_at', { ascending: false });

      const { data: orders, error } = await query;

      if (error) {
        console.error('Error fetching admin orders:', error);
        return NextResponse.json({ message: 'Failed to retrieve orders.' }, { status: 500 });
      }

      return NextResponse.json({ success: true, orders });
    } catch (err: any) {
      return NextResponse.json({ message: 'Error retrieving orders.', error: err.message }, { status: 500 });
    }
  }

  // Dev mode mock data
  const mockOrders = [
    {
      id: 'order-1',
      order_number: 'SMR202600001',
      product_name: 'Sarvamanghala Rakshai',
      quantity: 1,
      additional_astro_cards: 1,
      product_amount: 1008.00,
      astro_card_amount: 500.00,
      total_amount: 1508.00,
      payment_status: 'paid',
      order_status: 'processing',
      razorpay_order_id: 'order_abc123',
      razorpay_payment_id: 'pay_xyz123',
      created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      customers: {
        id: 'cust-1',
        full_name: 'Anand Subramanian',
        email: 'anand@gmail.com',
        phone: '9876543210',
        address: '12 Sannidhi Street, Madurai, TN - 625001'
      }
    },
    {
      id: 'order-2',
      order_number: 'SMR202600002',
      product_name: 'Sarvamanghala Rakshai',
      quantity: 2,
      additional_astro_cards: 0,
      product_amount: 2016.00,
      astro_card_amount: 0.00,
      total_amount: 2016.00,
      payment_status: 'pending',
      order_status: 'pending',
      razorpay_order_id: 'order_def456',
      razorpay_payment_id: null,
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      customers: {
        id: 'cust-2',
        full_name: 'Karthikeyan Pillai',
        email: 'karthik@gmail.com',
        phone: '9845612300',
        address: '45 Temple Road, Coimbatore, TN - 641002'
      }
    }
  ];

  return NextResponse.json({ success: true, orders: mockOrders });
}
