import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/admin-check';

export async function GET(request: NextRequest) {
  // 1. Authorize Admin request
  const authResult = await verifyAdminRequest(request);
  if (!authResult.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized.', error: authResult.error }, { status: 401 });
  }

  // 2. Fetch Customers from Database
  if (isSupabaseConfigured()) {
    try {
      const url = new URL(request.url);
      const search = url.searchParams.get('search') || '';

      let query = supabaseAdmin
        .from('customers')
        .select('*');

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      // Order by latest customer signup
      query = query.order('created_at', { ascending: false });

      const { data: customers, error } = await query;

      if (error) {
        console.error('Error fetching admin customers:', error);
        return NextResponse.json({ message: 'Failed to retrieve customers.' }, { status: 500 });
      }

      return NextResponse.json({ success: true, customers });
    } catch (err: any) {
      return NextResponse.json({ message: 'Error retrieving customers.', error: err.message }, { status: 500 });
    }
  }

  // Dev mode mock data
  const mockCustomers = [
    {
      id: 'cust-1',
      full_name: 'Anand Subramanian',
      dob: '1995-05-15',
      birth_time: '08:30:00',
      birth_place: 'Madurai, TN',
      phone: '9876543210',
      email: 'anand@gmail.com',
      address: '12 Sannidhi Street',
      city: 'Madurai',
      state: 'Tamil Nadu',
      pincode: '625001',
      country: 'India',
      zodiac_sign: 'Taurus (Vrishabha)',
      birth_star: 'Rohini',
      created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
    },
    {
      id: 'cust-2',
      full_name: 'Karthikeyan Pillai',
      dob: '1988-11-22',
      birth_time: '14:45:00',
      birth_place: 'Coimbatore, TN',
      phone: '9845612300',
      email: 'karthik@gmail.com',
      address: '45 Temple Road',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641002',
      country: 'India',
      zodiac_sign: 'Scorpio (Vrishchika)',
      birth_star: 'Anuradha',
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    }
  ];

  return NextResponse.json({ success: true, customers: mockCustomers });
}
