import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/admin-check';

export async function GET(request: NextRequest) {
  // 1. Authorize Admin request
  const authResult = await verifyAdminRequest(request);
  if (!authResult.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized.', error: authResult.error }, { status: 401 });
  }

  const dbConfigured = isSupabaseConfigured();

  if (dbConfigured) {
    try {
      // 1. Fetch Paid Orders Sum & Count
      const { data: paidOrders, error: paidError } = await supabaseAdmin
        .from('orders')
        .select('total_amount, payment_status, created_at')
        .eq('payment_status', 'paid');

      if (paidError) throw paidError;

      const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
      const totalOrdersCount = paidOrders.length;

      // 2. Fetch pending cards count
      const { count: pendingCardsCount, error: cardsError } = await supabaseAdmin
        .from('astro_cards')
        .select('*', { count: 'exact', head: true })
        .not('status', 'eq', 'completed');

      if (cardsError) throw cardsError;

      // 3. Today's orders & revenue calculation
      const todayStr = new Date().toISOString().substring(0, 10);
      const todayOrders = paidOrders.filter(o => o.created_at.startsWith(todayStr));
      const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

      // Pending today orders
      const { count: todayPendingCount } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'pending')
        .gte('created_at', todayStr);

      // 4. Group status counts (including cancelled, etc.)
      const { data: allOrders, error: allOrdersError } = await supabaseAdmin
        .from('orders')
        .select('order_status, created_at');

      if (allOrdersError) throw allOrdersError;

      const statusCounts = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };

      allOrders.forEach(o => {
        const s = o.order_status as keyof typeof statusCounts;
        if (statusCounts[s] !== undefined) {
          statusCounts[s]++;
        }
      });

      // 5. Aggregate 7-day revenue trend
      const last7DaysData = Array.from({ length: 7 }).map((_, idx) => {
        const date = new Date();
        date.setDate(date.getDate() - idx);
        const dateStr = date.toISOString().substring(0, 10);
        const displayStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

        const daysOrders = paidOrders.filter(o => o.created_at.startsWith(dateStr));
        const revenue = daysOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const count = daysOrders.length;

        return { date: displayStr, dateFull: dateStr, revenue, orders: count };
      }).reverse();

      return NextResponse.json({
        success: true,
        stats: {
          totalRevenue,
          totalOrders: totalOrdersCount,
          pendingAstroCards: pendingCardsCount || 0,
          todayOrders: todayOrders.length,
          todayRevenue,
          todayPendingCount: todayPendingCount || 0
        },
        statusDistribution: Object.entries(statusCounts).map(([name, value]) => ({ name: name.toUpperCase(), value })),
        revenueTrend: last7DaysData
      });

    } catch (err: any) {
      console.error('Analytics compute error:', err);
      return NextResponse.json({ message: 'Error calculating analytics.', error: err.message }, { status: 500 });
    }
  }

  // Dev mode Mock Analytics: beautifully structured for Recharts rendering
  const mockStats = {
    totalRevenue: 48928.00,
    totalOrders: 32,
    pendingAstroCards: 14,
    todayOrders: 3,
    todayRevenue: 3016.00,
    todayPendingCount: 2
  };

  const mockStatusDistribution = [
    { name: 'PENDING', value: 4 },
    { name: 'PROCESSING', value: 12 },
    { name: 'SHIPPED', value: 8 },
    { name: 'DELIVERED', value: 6 },
    { name: 'CANCELLED', value: 2 }
  ];

  const mockRevenueTrend = [
    { date: '12 Jun', revenue: 4536, orders: 3 },
    { date: '13 Jun', revenue: 7560, orders: 5 },
    { date: '14 Jun', revenue: 3024, orders: 2 },
    { date: '15 Jun', revenue: 6048, orders: 4 },
    { date: '16 Jun', revenue: 9072, orders: 6 },
    { date: '17 Jun', revenue: 15608, orders: 9 },
    { date: '18 Jun', revenue: 3016, orders: 3 }
  ];

  return NextResponse.json({
    success: true,
    stats: mockStats,
    statusDistribution: mockStatusDistribution,
    revenueTrend: mockRevenueTrend
  });
}
