import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/admin-check';

export async function GET(request: NextRequest) {
  // 1. Authorize Admin request
  const authResult = await verifyAdminRequest(request);
  if (!authResult.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized.', error: authResult.error }, { status: 401 });
  }

  // 2. Fetch Astro Cards from Database
  if (isSupabaseConfigured()) {
    try {
      const url = new URL(request.url);
      const status = url.searchParams.get('status') || '';

      let query = supabaseAdmin
        .from('astro_cards')
        .select('*, orders(order_number, payment_status)');

      if (status) {
        query = query.eq('status', status);
      }

      // Order by oldest pending first (so administrators process oldest requests first)
      query = query.order('created_at', { ascending: true });

      const { data: astroCards, error } = await query;

      if (error) {
        console.error('Error fetching admin astro cards:', error);
        return NextResponse.json({ message: 'Failed to retrieve Astro Cards.' }, { status: 500 });
      }

      return NextResponse.json({ success: true, astroCards });
    } catch (err: any) {
      return NextResponse.json({ message: 'Error retrieving Astro Cards.', error: err.message }, { status: 500 });
    }
  }

  // Dev mode mock data
  const mockCards = [
    {
      id: 'card-1',
      order_id: 'order-1',
      is_free: true,
      full_name: 'Anand Subramanian',
      dob: '1995-05-15',
      birth_time: '08:30:00',
      birth_place: 'Madurai, TN',
      zodiac_sign: 'Taurus (Vrishabha)',
      birth_star: 'Rohini',
      status: 'pending',
      created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      orders: {
        order_number: 'SMR202600001',
        payment_status: 'paid'
      }
    },
    {
      id: 'card-2',
      order_id: 'order-1',
      is_free: false,
      full_name: 'Meera Subramanian',
      dob: '1998-03-10',
      birth_time: '11:15:00',
      birth_place: 'Madurai, TN',
      zodiac_sign: 'Pisces (Meena)',
      birth_star: 'Uttara Bhadrapada',
      status: 'in_progress',
      created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      orders: {
        order_number: 'SMR202600001',
        payment_status: 'paid'
      }
    }
  ];

  return NextResponse.json({ success: true, astroCards: mockCards });
}
