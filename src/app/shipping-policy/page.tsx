import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ShippingPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-charcoal-dark font-sans-outfit">
      <Navbar />

      <section className="bg-sand-bg py-12 border-b border-gold-accent/20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-serif-cinzel text-deep-maroon">Shipping & Delivery Policy</h1>
          <p className="text-xs text-gray-500 mt-1">Last updated: June 19, 2026</p>
        </div>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm leading-relaxed text-gray-600 font-light space-y-6">
        <p>
          At <strong>Sarvamanghala Rakshai</strong>, we want to deliver your sacred Homam herbal product safely and respectfully. Below are our shipping guidelines:
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">1. Shipping Zones</h3>
        <p>
          We currently ship <strong>exclusively within India</strong>. We do not support international shipments at this time.
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">2. Processing & Delivery Timelines</h3>
        <p>
          Because every product goes through a personalized prayer blessing and the Astro Card requires individual calculations, processing takes time:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Energization & Preparation:</strong> 2 to 3 business days from payment verification.</li>
          <li><strong>Transit Time:</strong> 3 to 5 business days depending on your location. Metro cities are generally faster, while remote areas may take up to 7 business days.</li>
          <li><strong>Total Delivery:</strong> You can expect your package to arrive within <strong>5 to 8 business days</strong> after placing your order.</li>
        </ul>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">3. Shipping Charges</h3>
        <p>
          We are pleased to offer <strong>Free Shipping</strong> on all orders across India. There are no additional delivery costs or hidden fees added to your checkout total.
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">4. Cash on Delivery (COD) Policy</h3>
        <div className="bg-sand-bg border border-gold-accent/20 p-5 rounded-xl space-y-3 not-prose">
          <p className="text-sm text-gray-700 leading-relaxed">
            Cash on Delivery is available with the following conditions:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
            <li>
              <strong className="text-deep-maroon">Advance Payment Required:</strong> COD orders require a mandatory <strong>₹300 advance payment</strong> via our online payment gateway (Razorpay). This advance is non-refundable and is part of your total order cost.
            </li>
            <li>
              <strong className="text-deep-maroon">COD Pricing:</strong> The total price for COD orders is <strong>₹1799</strong> (₹1499 product price + ₹300 COD convenience charge). The ₹300 is paid in advance online, and the remaining <strong>₹1499</strong> is collected at the time of delivery.
            </li>
            <li>
              <strong className="text-deep-maroon">No COD Without Advance:</strong> Orders placed without the ₹300 advance payment cannot avail Cash on Delivery. The advance payment ensures order commitment and reduces fraudulent/return-to-origin shipments.
            </li>
            <li>
              <strong className="text-deep-maroon">Additional Astro Cards:</strong> If you purchase additional Astro Cards (₹500 each), the add-on cost is collected along with the remaining balance at the time of delivery.
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">5. Delivery Conditions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Please ensure someone is available at the delivery address to receive the package and pay the remaining COD balance (if applicable).</li>
          <li>Orders are packed securely with sacred care. Damaged packages should be reported within 24 hours of delivery.</li>
          <li>Delivery times may vary during festival seasons or adverse weather conditions.</li>
        </ul>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">6. Tracking and Support</h3>
        <p>
          Once your package is dispatched, you will receive a tracking link via your registered email address. If you encounter any delays or have questions regarding your transit status, please contact us at <strong>sarvamanghalarakshai@gmail.com</strong> or call <strong>+91 99621 67666</strong>.
        </p>
      </section>

      <Footer />
    </div>
  );
}
