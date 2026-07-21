import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsAndConditions() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-charcoal-dark font-sans-outfit">
      <Navbar />

      <section className="bg-sand-bg py-12 border-b border-gold-accent/20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-serif-cinzel text-deep-maroon">Terms & Conditions</h1>
          <p className="text-xs text-gray-500 mt-1">Last updated: June 18, 2026</p>
        </div>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm leading-relaxed text-gray-600 font-light space-y-6">
        <p>
          Welcome to <strong>Sarvamanghala Rakshai</strong>. By accessing our website, placing an order, or utilizing our services, you agree to comply with and be bound by the following Terms and Conditions.
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">1. Order Placement & Accuracy</h3>
        <p>
          You agree to provide true, accurate, and current information, specifically birth details and delivery addresses. We cannot be held responsible for incorrect Astro Card calculations or package misdelivery resulting from customer typos or incorrect details submitted during checkout.
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">2. Spiritual Claims & Disclaimer</h3>
        <p>
          The Sarvamanghala Rakshai is a sacred black herbal paste energized through traditional Homam prayers and stotrams. Our products and the accompanying Astro Cards are intended to support spiritual and mental well-being.
        </p>
        <p>
          Astrological analysis and spiritual guidance do not constitute professional legal, medical, psychiatric, or financial advice. We make no scientific claims regarding the guarantees of physical changes, financial prosperity, or cures to illnesses. Results are subjective and depend on individual faith and practice.
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">3. Payment & Pricing</h3>
        <p>
          All pricing is listed in Indian Rupees (INR) and includes applicable GST. Payments must be fully cleared through our integration with Razorpay before order fulfillment starts. We reserve the right to cancel orders or adjust prices under error conditions.
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">4. Governing Law</h3>
        <p>
          These Terms and Conditions are governed by and construed in accordance with the laws of India. Any legal disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu, India.
        </p>
      </section>

      <Footer />
    </div>
  );
}
