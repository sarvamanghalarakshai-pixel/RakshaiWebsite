import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone || phone.length !== 10) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ orders: [] });
  }

  try {
    // Query Supabase customers table for rows where phone contains that number
    const { data: customers, error: customersError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .like('phone', `%${phone}%`);

    if (customersError) {
      throw customersError;
    }

    if (!customers || customers.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    const customerIds = customers.map(c => c.id);

    // Query orders table with those customer IDs
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .in('customer_id', customerIds)
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
