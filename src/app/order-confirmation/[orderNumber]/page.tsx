import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { CheckCircle2, Shield, Calendar, MapPin, Mail, Sparkles, MessageCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Set revalidate to 0 so we always fetch fresh order details
export const revalidate = 0;

export default async function OrderConfirmation({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const orderNumber = resolvedParams.orderNumber;
  const paymentId = (resolvedSearchParams.pay_id as string) || '';

  let orderDetails: any = null;
  let customerDetails: any = null;
  let astroCardsDetails: any[] = [];
  let isMock = false;

  const dbConfigured = isSupabaseConfigured();

  if (dbConfigured) {
    try {
      // Fetch order by order number
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .select('*, customers(*)')
        .eq('order_number', orderNumber)
        .single();

      if (order && !orderError) {
        orderDetails = order;
        customerDetails = order.customers;

        // Fetch astro cards associated with this order
        const { data: cards, error: cardsError } = await supabaseAdmin
          .from('astro_cards')
          .select('*')
          .eq('order_id', order.id);

        if (cards && !cardsError) {
          astroCardsDetails = cards;
        }
      }
    } catch (err) {
      console.error('Error fetching order confirmation details:', err);
    }
  }

  // If order details are not found in DB or DB is not configured, generate mock details for testing
  if (!orderDetails) {
    isMock = true;
    orderDetails = {
      order_number: orderNumber,
      product_name: 'Sarvamanghala Rakshai',
      quantity: 1,
      additional_astro_cards: 1,
      product_amount: 1008.00,
      astro_card_amount: 500.00,
      total_amount: 1508.00,
      payment_status: 'paid',
      order_status: 'processing',
      razorpay_payment_id: paymentId || 'pay_mock_1234567890',
      created_at: new Date().toISOString()
    };
    
    customerDetails = {
      full_name: 'Anand Subramanian',
      phone: '9876543210',
      email: 'anand@example.com',
      address: '12, Sannidhi Street',
      city: 'Madurai',
      state: 'Tamil Nadu',
      pincode: '625001',
      birth_star: 'Rohini',
      zodiac_sign: 'Taurus (Vrishabha)',
      dob: '1995-05-15',
      birth_time: '08:30',
      birth_place: 'Madurai, TN'
    };

    astroCardsDetails = [
      { is_free: true, full_name: 'Anand Subramanian', birth_star: 'Rohini', zodiac_sign: 'Taurus (Vrishabha)' },
      { is_free: false, full_name: 'Meera Subramanian', birth_star: 'Swati', zodiac_sign: 'Libra (Tula)' }
    ];
  }

  return (
    <div className="flex flex-col min-h-screen bg-sand-bg text-charcoal-dark font-sans-outfit">
      <Navbar />

      <main className="flex-grow py-12 px-4 max-w-3xl mx-auto w-full">
        {/* Success Header */}
        <div className="bg-white rounded-2xl border-2 border-gold-accent p-6 sm:p-10 shadow-lg text-center space-y-4 mb-8">
          <div className="p-4 bg-green-50 text-green-700 rounded-full w-fit mx-auto shadow-md">
            <CheckCircle2 className="w-12 h-12 text-gold-accent" />
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-bold font-serif-cinzel text-deep-maroon">
            Om Namah Shivaya
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-charcoal-dark">
            Your Order has been Placed Successfully!
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Thank you for your purchase. Priests at our sanctum will begin the energization prayers, and our Vedic experts will start preparing your personalized Astro Card.
          </p>

          {isMock && (
            <div className="p-2 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded border border-yellow-200 w-fit mx-auto">
              Dev Mode: Using Mock Data Fallback
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto border-t border-gray-100 pt-6 mt-2 text-left">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Order Number</p>
              <p className="text-sm sm:text-base font-serif-cinzel font-bold text-deep-maroon">{orderDetails.order_number}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Payment ID</p>
              <p className="text-xs sm:text-sm text-gray-600 font-mono truncate">{orderDetails.razorpay_payment_id || 'Pending Webhook'}</p>
            </div>
          </div>
        </div>

        {/* Steps info */}
        <div className="bg-white rounded-2xl border border-gold-accent/15 p-6 sm:p-8 shadow-md space-y-6 mb-8">
          <h3 className="font-serif-cinzel font-bold text-lg text-deep-maroon border-b border-gold-accent/15 pb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-accent" />
            What Happens Next?
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-deep-maroon text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-charcoal-dark">Payment Verification</h4>
                <p className="text-xs text-gray-500 leading-normal">
                  Our server automatically registers the payment signature. (You will receive a confirmation email within 5-10 minutes).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-deep-maroon text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-charcoal-dark">Energization Rituals</h4>
                <p className="text-xs text-gray-500 leading-normal">
                  Your Sarvamanghala Rakshai will be offered at Lord Murugan's feet and energized during the next auspicious hour by temple priests.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-deep-maroon text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-charcoal-dark">Astro Card Preparation</h4>
                <p className="text-xs text-gray-500 leading-normal">
                  Vedic specialists calculate your birth stars and write the personalized guidelines for all {astroCardsDetails.length} cards in your package.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-deep-maroon text-white flex items-center justify-center font-bold text-sm shrink-0">4</div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-charcoal-dark">Shipment Dispatch</h4>
                <p className="text-xs text-gray-500 leading-normal">
                  Your energized Rakshai and Astro Cards are packed securely and dispatched via express shipping. Tracking code will be emailed immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="bg-white rounded-2xl border border-gold-accent/15 p-6 sm:p-8 shadow-md space-y-6 mb-8">
          <h3 className="font-serif-cinzel font-bold text-lg text-deep-maroon border-b border-gold-accent/15 pb-2">
            Delivery Address & Summary
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-gray-600">
            {/* Delivery address */}
            <div className="space-y-2 border-r border-gray-100 pr-4">
              <h4 className="font-bold text-charcoal-dark uppercase text-xs tracking-wider flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gold-accent" /> Shipping Address
              </h4>
              <div className="space-y-0.5 font-light">
                <p className="font-bold">{customerDetails.full_name}</p>
                <p>{customerDetails.address}</p>
                <p>{customerDetails.city}, {customerDetails.state} - {customerDetails.pincode}</p>
                <p>Phone: {customerDetails.phone}</p>
                <p>Email: {customerDetails.email}</p>
              </div>
            </div>

            {/* Astro Cards list */}
            <div className="space-y-2">
              <h4 className="font-bold text-charcoal-dark uppercase text-xs tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-gold-accent" /> Astro Cards List
              </h4>
              <div className="space-y-2 font-light">
                {astroCardsDetails.map((card, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-sand-bg p-2 rounded">
                    <div>
                      <p className="font-semibold text-charcoal-dark text-xs">{card.full_name}</p>
                      <p className="text-[10px] text-gray-400">Star: {card.birth_star} | Rashi: {card.zodiac_sign}</p>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-deep-maroon border border-gold-accent/20">
                      {card.is_free ? 'FREE' : '₹500'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount details */}
            <div className="sm:col-span-2 bg-sand-bg p-4 rounded-xl border border-gold-accent/10 flex justify-between items-center">
              <div>
                <p className="font-bold text-deep-maroon text-sm font-serif-cinzel">Total Paid Amount</p>
                <p className="text-[10px] text-gray-400">Paid securely via Razorpay</p>
              </div>
              <span className="text-xl font-bold font-serif-cinzel text-deep-maroon">₹{orderDetails.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Back Home / My Orders buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/my-orders"
            className="inline-block px-8 py-3.5 w-full sm:w-auto bg-deep-maroon hover:bg-maroon-light text-white font-bold font-serif-cinzel tracking-wider rounded border border-maroon-dark shadow-md transition-all text-sm text-center"
          >
            View My Orders
          </Link>
          <Link
            href="/"
            className="inline-block px-8 py-3.5 w-full sm:w-auto bg-transparent hover:bg-sand-bg text-deep-maroon font-bold font-serif-cinzel tracking-wider rounded border border-deep-maroon shadow-sm transition-all text-sm text-center"
          >
            Return to Storefront
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
