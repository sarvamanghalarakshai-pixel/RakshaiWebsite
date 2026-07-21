'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, Sparkles, CreditCard, ChevronRight, ChevronLeft, Edit3, Loader2, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ── Zodiac Signs with Tamil ──
const ZODIAC_SIGNS = [
  'Aries (மேஷம்)', 'Taurus (ரிஷபம்)', 'Gemini (மிதுனம்)', 'Cancer (கடகம்)',
  'Leo (சிம்மம்)', 'Virgo (கன்னி)', 'Libra (துலாம்)', 'Scorpio (விருச்சிகம்)',
  'Sagittarius (தனுசு)', 'Capricorn (மகரம்)', 'Aquarius (கும்பம்)', 'Pisces (மீனம்)'
];

// ── Nakshatras with Tamil ──
const NAKSHATRAS = [
  'Ashwini (அஸ்வினி)', 'Bharani (பரணி)', 'Krittika (கிருத்திகை)', 'Rohini (ரோகிணி)',
  'Mrigashira (மிருகசீரிடம்)', 'Ardra (திருவாதிரை)', 'Punarvasu (புனர்பூசம்)', 'Pushya (பூசம்)',
  'Ashlesha (ஆயில்யம்)', 'Magha (மகம்)', 'Purva Phalguni (பூரம்)', 'Uttara Phalguni (உத்திரம்)',
  'Hasta (அஸ்தம்)', 'Chitra (சித்திரை)', 'Swati (சுவாதி)', 'Vishakha (விசாகம்)',
  'Anuradha (அனுஷம்)', 'Jyeshtha (கேட்டை)', 'Mula (மூலம்)', 'Purva Ashadha (பூராடம்)',
  'Uttara Ashadha (உத்திராடம்)', 'Shravana (திருவோணம்)', 'Dhanishta (அவிட்டம்)',
  'Shatabhisha (சதயம்)', 'Purva Bhadrapada (பூரட்டாதி)', 'Uttara Bhadrapada (உத்திரட்டாதி)', 'Revati (ரேவதி)'
];

interface CustomerDetails {
  full_name: string;
  dob: string;
  birth_time: string;
  birth_place: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  zodiac_sign: string;
  birth_star: string;
  consent: boolean;
}

interface AstroDetails {
  full_name: string;
  dob: string;
  birth_time: string;
  birth_place: string;
  zodiac_sign: string;
  birth_star: string;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Base quantity from query params or default to 1
  const initialQty = parseInt(searchParams.get('qty') || '1', 10);
  const [quantity, setQuantity] = useState(isNaN(initialQty) ? 1 : initialQty);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Payment mode state
  const [paymentMode, setPaymentMode] = useState<'online' | 'cod'>('online');
  const [codAdvancePaid, setCodAdvancePaid] = useState(false);
  const [codAdvancePaymentId, setCodAdvancePaymentId] = useState('');

  // Step 1 State: Customer Information
  const [customer, setCustomer] = useState<CustomerDetails>({
    full_name: '',
    dob: '',
    birth_time: '',
    birth_place: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    zodiac_sign: '',
    birth_star: '',
    consent: true,
  });

  // Step 2 State: Astro Cards count & details
  const [additionalCardsCount, setAdditionalCardsCount] = useState(0);
  const [additionalCards, setAdditionalCards] = useState<AstroDetails[]>([]);

  // Initialize additional cards state based on count selector
  useEffect(() => {
    setAdditionalCards((prev) => {
      const cards = [...prev];
      if (additionalCardsCount > cards.length) {
        for (let i = cards.length; i < additionalCardsCount; i++) {
          cards.push({
            full_name: '',
            dob: '',
            birth_time: '',
            birth_place: '',
            zodiac_sign: '',
            birth_star: '',
          });
        }
      } else if (additionalCardsCount < cards.length) {
        cards.length = additionalCardsCount;
      }
      return cards;
    });
  }, [additionalCardsCount]);

  // Pricing calculations
  const productPrice = 999;
  const cardPrice = 500;
  const codCharge = 300;
  
  const productTotal = productPrice * quantity;
  const astroTotal = cardPrice * additionalCardsCount;
  const onlineTotal = productTotal + astroTotal;
  const codTotal = productTotal + codCharge + astroTotal;
  const codRemainingOnDelivery = codTotal - codCharge; // Remaining = product + astro cards
  const grandTotal = paymentMode === 'online' ? onlineTotal : codTotal;

  // Validation — only required: name, email, phone, address fields, consent
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    
    if (!customer.full_name || customer.full_name.trim().length < 2) {
      errors.full_name = 'Name must be at least 2 characters.';
    }
    if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!customer.phone || !/^(?:\+91|91)?[6-9]\d{9}$/.test(customer.phone)) {
      errors.phone = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (!customer.address || customer.address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters.';
    }
    if (!customer.city || customer.city.trim().length < 2) {
      errors.city = 'City is required.';
    }
    if (!customer.state || customer.state.trim().length < 2) {
      errors.state = 'State is required.';
    }
    if (!customer.pincode || !/^\d{6}$/.test(customer.pincode)) {
      errors.pincode = 'Enter a valid 6-digit PIN code.';
    }
    if (!customer.consent) {
      errors.consent = 'You must consent to store your details.';
    }

    // Astrology fields are NOT validated — they are optional
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 validation — ALL astro card fields are optional
  const validateStep2 = () => {
    // All fields optional — always pass
    setFormErrors({});
    return true;
  };

  // Next/Prev Navigation handlers
  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Razorpay script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ── Full Online Payment ──
  const handleOnlinePayment = async () => {
    setLoading(true);
    
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Failed to load Razorpay payment gateway. Please check your internet connection and try again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          quantity,
          additionalCardsCount,
          additionalCards,
          payment_mode: 'online',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error ? `${data.message} - Details: ${data.error}` : data.message || 'Something went wrong creating the order.';
        throw new Error(errorMessage);
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: 'INR',
        name: 'Sarvamanghala Rakshai',
        description: `Homam Sacred Herbal Product + Astro Card`,
        order_id: data.razorpayOrderId,
        handler: async function (res: any) {
          const cleanPhone = customer.phone.replace(/\D/g, '').slice(-10);
          localStorage.setItem('smr_customer_phone', cleanPhone);
          router.push(`/order-confirmation/${data.orderNumber}?pay_id=${res.razorpay_payment_id}`);
        },
        prefill: {
          name: customer.full_name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: {
          color: '#800020',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      alert(err.message || 'Error occurred while processing checkout.');
      setLoading(false);
    }
  };

  // ── COD Advance Payment (₹300) ──
  const handleCodAdvancePayment = async () => {
    setLoading(true);
    
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Failed to load Razorpay payment gateway. Please check your internet connection and try again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout/create-cod-advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          quantity,
          additionalCardsCount,
          additionalCards,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error ? `${data.message} - Details: ${data.error}` : data.message || 'Something went wrong creating the COD advance order.';
        throw new Error(errorMessage);
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amount, // ₹300 in paise = 30000
        currency: 'INR',
        name: 'Sarvamanghala Rakshai',
        description: 'COD Advance Payment (₹300)',
        order_id: data.razorpayOrderId,
        handler: async function (res: any) {
          // Mark COD advance as paid
          setCodAdvancePaid(true);
          setCodAdvancePaymentId(res.razorpay_payment_id);
          setLoading(false);
          const cleanPhone = customer.phone.replace(/\D/g, '').slice(-10);
          localStorage.setItem('smr_customer_phone', cleanPhone);
          // Redirect to confirmation
          router.push(`/order-confirmation/${data.orderNumber}?pay_id=${res.razorpay_payment_id}&mode=cod`);
        },
        prefill: {
          name: customer.full_name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: {
          color: '#800020',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      alert(err.message || 'Error occurred while processing COD advance payment.');
      setLoading(false);
    }
  };

  // Handle payment based on mode
  const handlePayment = () => {
    if (paymentMode === 'online') {
      handleOnlinePayment();
    } else {
      handleCodAdvancePayment();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-sand-bg text-charcoal-dark font-sans-outfit">
      <Navbar />

      <main className="flex-grow py-12 max-w-4xl w-full mx-auto px-4">
        {/* Step Indicator Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl border border-gold-accent/15 shadow-sm">
          {[
            { id: 1, label: 'Details', icon: <User className="w-4 h-4" /> },
            { id: 2, label: 'Astro Cards', icon: <Sparkles className="w-4 h-4" /> },
            { id: 3, label: 'Review', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 4, label: 'Payment', icon: <CreditCard className="w-4 h-4" /> }
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border transition-all ${
                  step === s.id
                    ? 'bg-deep-maroon border-deep-maroon text-white scale-110 shadow-md'
                    : step > s.id
                    ? 'bg-gold-accent border-gold-accent text-deep-maroon'
                    : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}
              >
                {s.id}
              </div>
              <span
                className={`hidden sm:inline text-xs font-semibold uppercase tracking-wider ${
                  step === s.id ? 'text-deep-maroon font-bold' : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step Form Wrapper */}
        <div className="bg-white rounded-2xl border border-gold-accent/20 p-6 sm:p-8 shadow-md relative min-h-[400px]">
          
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl">
              <Loader2 className="w-10 h-10 text-deep-maroon animate-spin" />
              <p className="font-serif-cinzel font-bold text-deep-maroon text-sm">Preparing transaction details...</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* STEP 1: Customer Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-deep-maroon border-b border-gold-accent/20 pb-2">
                      Customer & Shipping Details
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Provide contact information for delivery. Astrological details are optional — fill them only if you know.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Contact details */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Full Name *</label>
                      <input
                        type="text"
                        value={customer.full_name}
                        onChange={(e) => setCustomer({ ...customer, full_name: e.target.value })}
                        placeholder="e.g. Anand Subramanian"
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      />
                      {formErrors.full_name && <p className="text-red-500 text-xs mt-0.5">{formErrors.full_name}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Email Address *</label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="e.g. anand@gmail.com"
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-0.5">{formErrors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Mobile Number *</label>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-0.5">{formErrors.phone}</p>}
                    </div>

                    {/* Quantity selector */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Product Quantity *</label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      >
                        {[1, 2, 3, 4, 5, 10].map((q) => (
                          <option key={q} value={q}>{q} {q === 1 ? 'Product' : 'Products'}</option>
                        ))}
                      </select>
                    </div>

                    {/* Address details */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Delivery Address *</label>
                      <input
                        type="text"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="House/Flat No, Street Name, Locality"
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      />
                      {formErrors.address && <p className="text-red-500 text-xs mt-0.5">{formErrors.address}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">City *</label>
                      <input
                        type="text"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        placeholder="e.g. Madurai"
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      />
                      {formErrors.city && <p className="text-red-500 text-xs mt-0.5">{formErrors.city}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">State *</label>
                      <input
                        type="text"
                        value={customer.state}
                        onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                        placeholder="e.g. Tamil Nadu"
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      />
                      {formErrors.state && <p className="text-red-500 text-xs mt-0.5">{formErrors.state}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Pincode (6 Digits) *</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={customer.pincode}
                        onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                        placeholder="e.g. 625001"
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      />
                      {formErrors.pincode && <p className="text-red-500 text-xs mt-0.5">{formErrors.pincode}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Country</label>
                      <input
                        type="text"
                        disabled
                        value={customer.country}
                        className="px-3 py-2 rounded bg-gray-100 border border-gray-300 text-sm cursor-not-allowed text-gray-500"
                      />
                    </div>

                    {/* Astrological details — OPTIONAL */}
                    <div className="sm:col-span-2 border-t border-gold-accent/15 pt-4 mt-2">
                      <h3 className="font-serif-cinzel font-bold text-sm text-deep-maroon mb-1">Astrological Details</h3>
                      <p className="text-xs text-gray-400 mb-3">These fields are <span className="font-semibold text-green-600">optional</span>. Fill them only if you know your birth details for the free Astro Card.</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Date of Birth <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input
                        type="date"
                        value={customer.dob}
                        onChange={(e) => setCustomer({ ...customer, dob: e.target.value })}
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Time of Birth <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input
                        type="time"
                        value={customer.birth_time}
                        onChange={(e) => setCustomer({ ...customer, birth_time: e.target.value })}
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      />
                    </div>

                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Place of Birth <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input
                        type="text"
                        value={customer.birth_place}
                        onChange={(e) => setCustomer({ ...customer, birth_place: e.target.value })}
                        placeholder="e.g. Madurai, Tamil Nadu"
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Zodiac Sign (Rashi) <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <select
                        value={customer.zodiac_sign}
                        onChange={(e) => setCustomer({ ...customer, zodiac_sign: e.target.value })}
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      >
                        <option value="">— Select if known —</option>
                        {ZODIAC_SIGNS.map((z) => (
                          <option key={z} value={z}>{z}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-charcoal-dark uppercase">Birth Star (Nakshatra) <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <select
                        value={customer.birth_star}
                        onChange={(e) => setCustomer({ ...customer, birth_star: e.target.value })}
                        className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                      >
                        <option value="">— Select if known —</option>
                        {NAKSHATRAS.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    {/* DPDP Consent */}
                    <div className="sm:col-span-2 pt-4 border-t border-gray-100 flex items-start gap-2.5">
                      <input
                        id="consent-check"
                        type="checkbox"
                        checked={!!customer.consent}
                        onChange={(e) => setCustomer({ ...customer, consent: e.target.checked })}
                        className="mt-1 w-4 h-4 rounded text-deep-maroon border-gray-300 focus:ring-gold-accent"
                      />
                      <label htmlFor="consent-check" className="text-xs text-gray-500 leading-normal">
                        I consent to my details being used to prepare my order and Astro Card, and stored securely per the <a href="/privacy-policy" target="_blank" className="text-deep-maroon font-semibold underline">Privacy Policy</a> (required under India&apos;s DPDP Act 2023).
                      </label>
                    </div>
                    {formErrors.consent && <p className="text-red-500 text-xs sm:col-span-2">{formErrors.consent}</p>}

                  </div>
                </div>
              )}

              {/* STEP 2: Astro Card Options */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-deep-maroon border-b border-gold-accent/20 pb-2">
                      Astro Card Add-ons
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">One card is included free. Select if you would like additional personalized cards for family members at ₹500 each. <span className="font-semibold text-green-600">All fields below are optional.</span></p>
                  </div>

                  {/* Show included card */}
                  <div className="bg-sand-bg border border-gold-accent/15 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-cinzel font-bold text-sm text-deep-maroon">Primary Astro Card (Included)</h4>
                      <p className="text-xs text-gray-500">Prepared for: {customer.full_name || 'You'} {customer.birth_star ? `(${customer.birth_star})` : ''}</p>
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded">FREE</span>
                  </div>

                  {/* Dropdown for additional */}
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <label className="text-xs font-semibold text-charcoal-dark uppercase">Additional Astro Cards</label>
                    <select
                      value={additionalCardsCount}
                      onChange={(e) => setAdditionalCardsCount(parseInt(e.target.value, 10))}
                      className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                    >
                      {[0, 1, 2, 3, 4, 5].map((c) => (
                        <option key={c} value={c}>{c} {c === 1 ? 'Additional Card (+₹500)' : `Additional Cards (+₹${c * 500})`}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400">For more than 5 cards, please reach support at sarvamanghalarakshai@gmail.com.</p>
                  </div>

                  {/* Additional Card Forms — ALL OPTIONAL */}
                  {additionalCards.length > 0 && (
                    <div className="space-y-6 border-t border-gray-100 pt-6">
                      {additionalCards.map((card, idx) => (
                        <div key={idx} className="bg-sand-bg border border-gray-200 p-5 rounded-xl space-y-4">
                          <h4 className="font-serif-cinzel font-bold text-sm text-deep-maroon">
                            Family Astro Card #{idx + 1} details (₹500)
                          </h4>
                          <p className="text-xs text-gray-400 -mt-2">All fields are <span className="font-semibold text-green-600">optional</span>. Fill what you know.</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-semibold text-charcoal-dark uppercase">Name <span className="text-gray-400 font-normal">(Optional)</span></label>
                              <input
                                type="text"
                                value={card.full_name}
                                onChange={(e) => {
                                  const updated = [...additionalCards];
                                  updated[idx].full_name = e.target.value;
                                  setAdditionalCards(updated);
                                }}
                                placeholder="e.g. Meera Subramanian"
                                className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-semibold text-charcoal-dark uppercase">Date of Birth <span className="text-gray-400 font-normal">(Optional)</span></label>
                              <input
                                type="date"
                                value={card.dob}
                                onChange={(e) => {
                                  const updated = [...additionalCards];
                                  updated[idx].dob = e.target.value;
                                  setAdditionalCards(updated);
                                }}
                                className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-semibold text-charcoal-dark uppercase">Time of Birth <span className="text-gray-400 font-normal">(Optional)</span></label>
                              <input
                                type="time"
                                value={card.birth_time}
                                onChange={(e) => {
                                  const updated = [...additionalCards];
                                  updated[idx].birth_time = e.target.value;
                                  setAdditionalCards(updated);
                                }}
                                className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-semibold text-charcoal-dark uppercase">Place of Birth <span className="text-gray-400 font-normal">(Optional)</span></label>
                              <input
                                type="text"
                                value={card.birth_place}
                                onChange={(e) => {
                                  const updated = [...additionalCards];
                                  updated[idx].birth_place = e.target.value;
                                  setAdditionalCards(updated);
                                }}
                                placeholder="e.g. Madurai, Tamil Nadu"
                                className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-semibold text-charcoal-dark uppercase">Zodiac Sign <span className="text-gray-400 font-normal">(Optional)</span></label>
                              <select
                                value={card.zodiac_sign}
                                onChange={(e) => {
                                  const updated = [...additionalCards];
                                  updated[idx].zodiac_sign = e.target.value;
                                  setAdditionalCards(updated);
                                }}
                                className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none"
                              >
                                <option value="">— Select if known —</option>
                                {ZODIAC_SIGNS.map((z) => (
                                  <option key={z} value={z}>{z}</option>
                                ))}
                              </select>
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-semibold text-charcoal-dark uppercase">Birth Star <span className="text-gray-400 font-normal">(Optional)</span></label>
                              <select
                                value={card.birth_star}
                                onChange={(e) => {
                                  const updated = [...additionalCards];
                                  updated[idx].birth_star = e.target.value;
                                  setAdditionalCards(updated);
                                }}
                                className="px-3 py-2 rounded bg-white border border-gray-300 text-sm focus:outline-none"
                              >
                                <option value="">— Select if known —</option>
                                {NAKSHATRAS.map((n) => (
                                  <option key={n} value={n}>{n}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* STEP 3: Order Summary + Payment Mode Selection */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-deep-maroon border-b border-gold-accent/20 pb-2">
                      Review Your Order
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Please double check your shipping details and choose your payment method.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info Card */}
                    <div className="border border-gray-200 p-5 rounded-xl space-y-3 relative">
                      <button
                        onClick={() => setStep(1)}
                        className="absolute top-4 right-4 text-xs font-semibold flex items-center gap-1 text-deep-maroon hover:text-maroon-light"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <h4 className="font-serif-cinzel font-bold text-sm text-deep-maroon">Shipping & Contact Info</h4>
                      <div className="text-xs space-y-1 text-gray-600">
                        <p><span className="font-semibold text-charcoal-dark">Name:</span> {customer.full_name}</p>
                        <p><span className="font-semibold text-charcoal-dark">Email:</span> {customer.email}</p>
                        <p><span className="font-semibold text-charcoal-dark">Phone:</span> {customer.phone}</p>
                        <p><span className="font-semibold text-charcoal-dark">Address:</span> {customer.address}, {customer.city}, {customer.state} - {customer.pincode}</p>
                      </div>
                    </div>

                    {/* Astrological coordinates Card */}
                    <div className="border border-gray-200 p-5 rounded-xl space-y-3 relative">
                      <button
                        onClick={() => setStep(1)}
                        className="absolute top-4 right-4 text-xs font-semibold flex items-center gap-1 text-deep-maroon hover:text-maroon-light"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <h4 className="font-serif-cinzel font-bold text-sm text-deep-maroon">Astro Details (Primary)</h4>
                      <div className="text-xs space-y-1 text-gray-600">
                        <p><span className="font-semibold text-charcoal-dark">DOB:</span> {customer.dob || 'Not provided'}</p>
                        <p><span className="font-semibold text-charcoal-dark">Time:</span> {customer.birth_time || 'Not provided'}</p>
                        <p><span className="font-semibold text-charcoal-dark">Place:</span> {customer.birth_place || 'Not provided'}</p>
                        <p><span className="font-semibold text-charcoal-dark">Zodiac:</span> {customer.zodiac_sign || 'Not provided'}</p>
                        <p><span className="font-semibold text-charcoal-dark">Star:</span> {customer.birth_star || 'Not provided'}</p>
                      </div>
                    </div>

                    {/* Additional Astro Cards list */}
                    {additionalCardsCount > 0 && (
                      <div className="border border-gray-200 p-5 rounded-xl space-y-3 md:col-span-2 relative">
                        <button
                          onClick={() => setStep(2)}
                          className="absolute top-4 right-4 text-xs font-semibold flex items-center gap-1 text-deep-maroon hover:text-maroon-light"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <h4 className="font-serif-cinzel font-bold text-sm text-deep-maroon">Additional Astro Cards ({additionalCardsCount})</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {additionalCards.map((c, i) => (
                            <div key={i} className="text-xs border-l-2 border-gold-accent pl-3 text-gray-600 space-y-0.5">
                              <p className="font-bold text-charcoal-dark">#{i+1}: {c.full_name || 'Name not provided'}</p>
                              <p>DOB: {c.dob || 'N/A'} | Time: {c.birth_time || 'N/A'}</p>
                              <p>Star: {c.birth_star || 'N/A'} | Zodiac: {c.zodiac_sign || 'N/A'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Payment Mode Selection */}
                    <div className="bg-white border-2 border-gold-accent/30 p-5 rounded-xl md:col-span-2 space-y-4">
                      <h4 className="font-serif-cinzel font-bold text-sm text-deep-maroon">Choose Payment Method</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Online Payment Option */}
                        <button
                          type="button"
                          onClick={() => setPaymentMode('online')}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            paymentMode === 'online'
                              ? 'border-green-500 bg-green-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                              paymentMode === 'online' ? 'border-green-500' : 'border-gray-300'
                            }`}>
                              {paymentMode === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-green-600" />
                                <span className="font-bold text-sm text-charcoal-dark">Pay Online</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Full payment via UPI, Cards, Net Banking</p>
                              <p className="text-lg font-bold font-serif-cinzel text-green-700 mt-2">₹{onlineTotal}</p>
                            </div>
                          </div>
                        </button>

                        {/* COD Option */}
                        <button
                          type="button"
                          onClick={() => setPaymentMode('cod')}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            paymentMode === 'cod'
                              ? 'border-orange-500 bg-orange-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                              paymentMode === 'cod' ? 'border-orange-500' : 'border-gray-300'
                            }`}>
                              {paymentMode === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-orange-600" />
                                <span className="font-bold text-sm text-charcoal-dark">Cash on Delivery</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Pay ₹300 advance now, rest on delivery</p>
                              <p className="text-lg font-bold font-serif-cinzel text-orange-700 mt-2">₹{codTotal}</p>
                              <p className="text-xs text-orange-600 mt-0.5">₹300 advance + ₹{codRemainingOnDelivery} on delivery</p>
                            </div>
                          </div>
                        </button>
                      </div>

                      {paymentMode === 'cod' && (
                        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-orange-700 leading-relaxed">
                            <strong>COD Note:</strong> You will be redirected to pay ₹300 advance online via Razorpay. The remaining ₹{codRemainingOnDelivery} will be collected by the delivery partner at the time of delivery. COD orders without advance payment will not be processed.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-sand-bg border border-gold-accent/20 p-5 rounded-xl md:col-span-2 space-y-3">
                      <h4 className="font-serif-cinzel font-bold text-sm text-deep-maroon">Cost Breakdown</h4>
                      <div className="text-xs space-y-2 text-gray-600">
                        <div className="flex justify-between">
                          <span>Homam Sacred Herbal Product ({quantity} Qty)</span>
                          <span className="font-semibold">₹{productTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1 Included Astro Card</span>
                          <span className="text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded">FREE</span>
                        </div>
                        {additionalCardsCount > 0 && (
                          <div className="flex justify-between">
                            <span>{additionalCardsCount} Additional Astro Cards (₹500 each)</span>
                            <span className="font-semibold">₹{astroTotal.toFixed(2)}</span>
                          </div>
                        )}
                        {paymentMode === 'cod' && (
                          <div className="flex justify-between text-orange-700">
                            <span>COD Convenience Charge</span>
                            <span className="font-semibold">₹{codCharge.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Express shipping (India)</span>
                          <span className="text-green-700 font-semibold uppercase">FREE</span>
                        </div>
                        <div className="flex justify-between border-t border-gold-accent/20 pt-2 text-sm text-deep-maroon font-bold">
                          <span>Grand Total</span>
                          <span>₹{grandTotal.toFixed(2)}</span>
                        </div>
                        {paymentMode === 'cod' && (
                          <div className="flex justify-between text-xs text-orange-600 pt-1">
                            <span>→ Pay now (advance)</span>
                            <span className="font-bold">₹{codCharge}</span>
                          </div>
                        )}
                        {paymentMode === 'cod' && (
                          <div className="flex justify-between text-xs text-orange-600">
                            <span>→ Pay on delivery</span>
                            <span className="font-bold">₹{codRemainingOnDelivery}</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 4: Checkout payment button */}
              {step === 4 && (
                <div className="space-y-6 text-center py-6">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="p-4 bg-deep-maroon rounded-full w-fit mx-auto text-white shadow-lg">
                      {paymentMode === 'online' ? (
                        <CreditCard className="w-8 h-8 text-gold-accent" />
                      ) : (
                        <Truck className="w-8 h-8 text-gold-accent" />
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold font-serif-cinzel text-deep-maroon">
                      {paymentMode === 'online' ? 'Secure Online Payment' : 'COD — Pay ₹300 Advance'}
                    </h2>
                    
                    <p className="text-sm text-gray-500 font-light leading-relaxed">
                      {paymentMode === 'online' 
                        ? 'Your details are secured. Click below to pay via Razorpay. We support Credit/Debit cards, UPI (GPay, PhonePe), Net Banking, and Wallet payments.'
                        : `To confirm your Cash on Delivery order, please pay the ₹300 advance online. The remaining ₹${codRemainingOnDelivery} will be collected by the delivery partner.`
                      }
                    </p>

                    <div className="bg-sand-bg p-4 border border-gold-accent/20 rounded-xl space-y-2 text-xs text-gray-700 leading-normal text-left">
                      <p className="font-semibold text-deep-maroon font-serif-cinzel">Important Notice:</p>
                      {paymentMode === 'online' ? (
                        <p>Once your payment is verified, calculations for your Astro Card begin immediately. Check details one final time if needed.</p>
                      ) : (
                        <>
                          <p>After ₹300 advance payment, your COD order will be confirmed and processing will begin.</p>
                          <p>Remaining ₹{codRemainingOnDelivery} payable to delivery partner at the time of delivery.</p>
                        </>
                      )}
                      <p className="font-bold text-center pt-2 text-deep-maroon text-sm border-t border-gold-accent/10">
                        {paymentMode === 'online' 
                          ? `Order Total: ₹${grandTotal.toFixed(2)}`
                          : `Advance Payment: ₹${codCharge} | Total: ₹${grandTotal.toFixed(2)}`
                        }
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <button
                        onClick={handlePayment}
                        className={`w-full py-4 font-bold font-serif-cinzel tracking-wider rounded border shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 ${
                          paymentMode === 'online'
                            ? 'bg-gold-accent hover:bg-gold-light text-deep-maroon border-gold-dark'
                            : 'bg-orange-500 hover:bg-orange-600 text-white border-orange-600'
                        }`}
                      >
                        {paymentMode === 'online' ? (
                          <>
                            <CreditCard className="w-4 h-4" />
                            Pay Online ₹{grandTotal}
                          </>
                        ) : (
                          <>
                            <Truck className="w-4 h-4" />
                            Pay ₹{codCharge} Advance for COD
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handlePrev}
                        className="text-xs text-gray-400 hover:text-deep-maroon underline focus:outline-none"
                      >
                        Go back and edit details
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation Buttons (Step 1-3) */}
              {step < 4 && (
                <div className="flex justify-between border-t border-gray-100 pt-6 mt-8">
                  {step > 1 ? (
                    <button
                      onClick={handlePrev}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded text-sm transition-colors flex items-center gap-1.5 focus:outline-none"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-deep-maroon hover:bg-maroon-light text-white font-bold font-serif-cinzel tracking-wider rounded text-sm transition-colors flex items-center gap-1.5 focus:outline-none shadow-md border border-maroon-dark"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-sand-bg items-center justify-center">
        <Loader2 className="w-10 h-10 text-deep-maroon animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
