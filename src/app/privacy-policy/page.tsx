import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-charcoal-dark font-sans-outfit">
      <Navbar />

      <section className="bg-sand-bg py-12 border-b border-gold-accent/20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-serif-cinzel text-deep-maroon">Privacy Policy</h1>
          <p className="text-xs text-gray-500 mt-1">Last updated: June 18, 2026</p>
        </div>
      </section>

      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm leading-relaxed text-gray-600 font-light space-y-6">
        <p>
          At <strong>Sarvamanghala Rakshai</strong>, we respect your privacy and are committed to protecting your personal data. This Privacy Policy details how we collect, handle, store, and process your information when you purchase our blessed products and personalized Astro Cards.
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">1. Collection of Sensitive Personal Data (DPDP Act 2023 Compliance)</h3>
        <p>
          Under India's **Digital Personal Data Protection (DPDP) Act 2023**, specific details you provide for calculating astrological charts constitute sensitive personal data. We collect:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Personal Details:</strong> Full Name, Email Address, Phone Number, Delivery Address, Pincode, City, State, and Country.</li>
          <li><strong>Birth Details:</strong> Date of Birth, Time of Birth, and Place/Coordinates of Birth.</li>
          <li><strong>Consent:</strong> When you check the consent box in our checkout, you give us explicit, free, specific, and informed permission to use your birth details to generate your customized Astro Card.</li>
        </ul>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">2. How We Use Your Data</h3>
        <p>
          Your details are strictly used for:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Calculating and preparing your custom Astro Card using traditional Vedic Panchanga math.</li>
          <li>Processing payments via our authorized payment processor, Razorpay.</li>
          <li>Fulfilling product deliveries and sending transactional email updates (order confirmation, status updates).</li>
          <li>Providing user support via email or WhatsApp.</li>
        </ul>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">3. Data Retention & Erasure</h3>
        <p>
          We do not store your birth details indefinitely. Once your Astro Card is printed and dispatched, we retain record logs of your order details for auditing and legal obligations. You hold the right to request the erasure or correction of your details from our records by email at <strong>sarvamanghalarakshai@gmail.com</strong>.
        </p>

        <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon">4. Data Sharing & Security</h3>
        <p>
          We never sell or distribute your data to third-party advertisers. Your birth details are shared only with server systems conducting our internal computations and are not made public. Security logs are restricted to the store admin role.
        </p>
      </section>

      <Footer />
    </div>
  );
}
