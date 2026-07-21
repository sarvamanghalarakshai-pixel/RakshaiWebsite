import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/admin-check';

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
    const cardId = resolvedParams.id;

    const { status: newStatus } = await request.json();
    
    const validStatuses = ['pending', 'in_progress', 'prepared', 'sent', 'completed'];
    if (!newStatus || !validStatuses.includes(newStatus)) {
      return NextResponse.json({ message: 'Invalid card status code.' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      // Check if Astro Card exists
      const { data: card, error: fetchError } = await supabaseAdmin
        .from('astro_cards')
        .select('*')
        .eq('id', cardId)
        .single();

      if (fetchError || !card) {
        return NextResponse.json({ message: 'Astro Card request not found.' }, { status: 404 });
      }

      // Update Card Status
      const { error: updateError } = await supabaseAdmin
        .from('astro_cards')
        .update({ status: newStatus })
        .eq('id', cardId);

      if (updateError) {
        console.error('Error updating Astro Card status:', updateError);
        return NextResponse.json({ message: 'Failed to update card status.' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `Astro Card status updated to ${newStatus}.` });
    }

    // Dev mode success log
    console.log(`[MOCK CARD UPDATE] Astro Card ${cardId} status set to ${newStatus}.`);
    return NextResponse.json({ success: true, message: `[MOCK] Card status updated to ${newStatus}.` });

  } catch (err: any) {
    return NextResponse.json({ message: 'Internal server error.', error: err.message }, { status: 500 });
  }
}
