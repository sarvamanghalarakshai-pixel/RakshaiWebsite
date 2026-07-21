import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { CheckoutPayloadSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate incoming payload using Zod schema
    const parseResult = CheckoutPayloadSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { message: 'Invalid payload details.', errors: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { customer, quantity, additionalCardsCount, additionalCards } = parseResult.data;

    // 2. Perform Server-side Pricing Verification
    const baseProductPrice = 999;
    const additionalCardPrice = 500;

    const productAmount = baseProductPrice * quantity;
    const astroCardAmount = additionalCardPrice * additionalCardsCount;
    const totalAmount = productAmount + astroCardAmount;

    // 3. Database Sync / Creation
    let customerId = 'mock-customer-id';
    let orderId = 'mock-order-id';
    let orderNumber = `SMR${new Date().getFullYear()}00001`;

    const supabaseReady = isSupabaseConfigured();

    if (supabaseReady) {
      // Calculate next sequential order number
      // We count existing orders in the DB to form a sequential zero-padded 5-digit number
      const { count, error: countError } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error fetching order count:', countError);
      }

      const nextSequence = (count || 0) + 1;
      const paddedSequence = String(nextSequence).padStart(5, '0');
      orderNumber = `SMR${new Date().getFullYear()}${paddedSequence}`;

      // Insert customer record
      const { data: customerData, error: customerError } = await supabaseAdmin
        .from('customers')
        .insert({
          full_name: customer.full_name,
          dob: customer.dob || null,
          birth_time: customer.birth_time || null,
          birth_place: customer.birth_place || null,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
          country: customer.country,
          zodiac_sign: customer.zodiac_sign || null,
          birth_star: customer.birth_star || null,
        })
        .select()
        .single();

      if (customerError) {
        console.error('Customer insert error:', customerError);
        return NextResponse.json({
          message: 'Database failed to save customer details.',
          error: customerError.message || customerError.details || JSON.stringify(customerError)
        }, { status: 500 });
      }

      customerId = customerData.id;
    } else {
      console.warn('DATABASE WARNING: Supabase not configured. Simulating customer and order sequences.');
      const mockRandom = Math.floor(10000 + Math.random() * 90000);
      orderNumber = `SMR${new Date().getFullYear()}${mockRandom}`;
    }

    // 4. Razorpay Order Creation
    const rzpKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;
    let rzpOrderId = `order_mock_${Math.random().toString(36).substring(7)}`;

    const rzpReady = !!rzpKeyId && !!rzpKeySecret;

    if (rzpReady) {
      const razorpay = new Razorpay({
        key_id: rzpKeyId,
        key_secret: rzpKeySecret,
      });

      const rzpOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // Amount in paise
        currency: 'INR',
        receipt: orderNumber,
        payment_capture: true,
      });

      rzpOrderId = rzpOrder.id;
    } else {
      console.warn('PAYMENTS WARNING: Razorpay credentials not configured. Generating a mock order ID.');
    }

    if (supabaseReady) {
      // Save Pending Order
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_id: customerId,
          product_name: 'Sarvamanghala Rakshai',
          quantity,
          additional_astro_cards: additionalCardsCount,
          product_amount: productAmount,
          astro_card_amount: astroCardAmount,
          total_amount: totalAmount,
          razorpay_order_id: rzpOrderId,
          payment_status: 'pending',
          order_status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order insert error:', orderError);
        return NextResponse.json({
          message: 'Database failed to save order details.',
          error: orderError.message || orderError.details || JSON.stringify(orderError)
        }, { status: 500 });
      }

      orderId = orderData.id;

      // Save primary (free) Astro Card request
      const { error: primaryCardError } = await supabaseAdmin
        .from('astro_cards')
        .insert({
          order_id: orderId,
          is_free: true,
          full_name: customer.full_name || null,
          dob: customer.dob || null,
          birth_time: customer.birth_time || null,
          birth_place: customer.birth_place || null,
          zodiac_sign: customer.zodiac_sign || null,
          birth_star: customer.birth_star || null,
          status: 'pending'
        });

      if (primaryCardError) {
        console.error('Primary card insert error:', primaryCardError);
      }

      // Save additional Astro Card requests
      if (additionalCardsCount > 0 && additionalCards.length > 0) {
        const cardsToInsert = additionalCards.map(card => ({
          order_id: orderId,
          is_free: false,
          full_name: card.full_name || null,
          dob: card.dob || null,
          birth_time: card.birth_time || null,
          birth_place: card.birth_place || null,
          zodiac_sign: card.zodiac_sign || null,
          birth_star: card.birth_star || null,
          status: 'pending'
        }));

        const { error: addCardsError } = await supabaseAdmin
          .from('astro_cards')
          .insert(cardsToInsert);

        if (addCardsError) {
          console.error('Additional cards insert error:', addCardsError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      razorpayOrderId: rzpOrderId,
      razorpayKeyId: rzpKeyId || 'rzp_test_placeholder_key',
      amount: totalAmount * 100,
    });

  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { message: 'Internal server error processing checkout.', error: error.message },
      { status: 500 }
    );
  }
}
