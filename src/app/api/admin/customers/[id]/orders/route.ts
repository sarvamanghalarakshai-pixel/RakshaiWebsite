import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/admin-check';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authResult = await verifyAdminRequest(request);
  if (!authResult.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized.', error: authResult.error }, { status: 401 });
  }

  if (isSupabaseConfigured()) {
    try {
      const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return NextResponse.json({ success: true, orders: orders || [] });
    } catch (err: any) {
      console.error('Error fetching customer orders:', err);
      return NextResponse.json({ message: 'Failed to retrieve orders.', error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, orders: [] });
}