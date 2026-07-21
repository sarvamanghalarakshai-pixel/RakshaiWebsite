import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RefundPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-charcoal-dark font-sans-outfit">
      <Navbar />

      <section className="bg-sand-bg py-12 border-b border-gold-accent/20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-serif-cinzel text-deep-maroon">Refund & Cancellation Policy</h1>
          <p className="text-xs text-gray-500 mt-1">Last updated: June 18, 2026</p>
        </div>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm leading-relaxed text-gray-600 font-light space-y-6">
        <p>
          At <strong>Sarvamanghala Rakshai</strong>, we strive to ensure that each item is energized and printed with absolute devotion. Since our products are customized (using your personal birth coordinates) and spiritually energized, please review our refund and cancellation terms:
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">1. Custom and Personalized Items Disclaimer</h3>
        <p>
          Each package contains a personalized Astro Card computed explicitly from your date, time, and location coordinates, and the Rakshai sacred herbal paste itself is consecrated individually. Consequently, **we do not offer returns, replacements, or refunds for items once they enter the processing/energization phase.**
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">2. Cancellations</h3>
        <p>
          If you need to cancel an order, you must email us at <strong>sarvamanghalarakshai@gmail.com</strong> within **2 hours** of placing the order. Once the order details have been passed to our astrologers and priests, the order cannot be cancelled or refunded.
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">3. Damaged or Defective Items</h3>
        <p>
          If the blessed sacred paste or the printed card is damaged during shipping, we are happy to send a replacement.
        </p>
        <p>
          To request a replacement for shipping damages:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Email us at <strong>sarvamanghalarakshai@gmail.com</strong> within **48 hours** of package receipt.</li>
          <li>Attach clear photographs or an unboxing video showing the damaged package and contents.</li>
          <li>Our support team will review and ship out a replacement package (re-energized and re-printed) free of charge if verified.</li>
        </ul>
      </section>

      <Footer />
    </div>
  );
}
