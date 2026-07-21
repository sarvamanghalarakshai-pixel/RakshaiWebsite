'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const categories = [
    {
      title: "Energization & Significance",
      items: [
        {
          q: "What makes Sarvamanghala Rakshai different from generic products?",
          a: "Generic products are manufactured and sold without spiritual intent. A Rakshai is a sacred black herbal paste that undergoes traditional 'Prana Pratishta'—a consecration ritual. It is offered prayers at the altar of Lord Murugan, and chanted over with powerful protection verses (Kavacham) by Vedic scholars."
        },
        {
          q: "Who conducts the prayers?",
          a: "The rituals are performed by experienced temple priests in Tamil Nadu who strictly follow Agamic guidelines to ensure proper spiritual vibratory levels."
        }
      ]
    },
    {
      title: "Application & Maintenance",
      items: [
        {
          q: "How should I apply the Rakshai?",
          a: "The sacred paste should be applied on the forehead—similar to Vibhuti or Thiruneeru—for protection and blessings. You can also keep the container in your pooja room or clean cash box."
        },
        {
          q: "What if the paste container breaks or the paste finishes?",
          a: "If the paste is finished, do not worry. It means it has completed its protective cycle. Simply clean the container and you can order a new energized Rakshai."
        },
        {
          q: "Are there any dietary or behavior restrictions while applying it?",
          a: "No strict lifestyle changes are mandatory, but maintaining general personal cleanliness and removing it before visiting cemeteries or impure places is recommended. If removed, keep it in a clean box in your pooja room."
        }
      ]
    },
    {
      title: "Orders, Astro Cards & Shipping",
      items: [
        {
          q: "How do you calculate birth star details for the Astro Card?",
          a: "We use standard Panchanga and Vedic calculations based on your Date of Birth, Time of Birth, and Place of Birth to identify your Janma Nakshatra (Birth Star) and Rashi (Moon Sign)."
        },
        {
          q: "What if I do not know my exact birth time?",
          a: "If birth time is unknown, put '12:00 PM' as a default, and our team will perform calculations based on the solar day coordinates. We recommend asking family members to get as close to the actual time as possible for optimal precision."
        },
        {
          q: "How is shipping handled?",
          a: "We ship all items via registered domestic courier partners across India. Delivery takes 5-7 business days. Shipping is completely free."
        }
      ]
    }
  ];

  // Flattened list index tracker for state simplicity
  let itemCounter = 0;

  return (
    <div className="flex flex-col min-h-screen bg-white text-charcoal-dark font-sans-outfit">
      <Navbar />

      {/* Banner */}
      <section className="bg-maroon-dark text-white py-16 text-center border-b border-gold-accent/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--maroon-light)_0%,_transparent_75%)] opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-cinzel tracking-wider text-gold-accent">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-light max-w-2xl mx-auto">
            Find answers to commonly asked questions regarding spiritual rituals, application rules, and order processing.
          </p>
        </div>
      </section>

      {/* Main FAQ list */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <h3 className="text-lg font-serif-cinzel font-bold text-deep-maroon border-b border-gold-accent/25 pb-2">
              {cat.title}
            </h3>
            
            <div className="space-y-3">
              {cat.items.map((item) => {
                const currentIdx = itemCounter++;
                const isOpen = openIndex === currentIdx;

                return (
                  <div 
                    key={currentIdx} 
                    className="bg-white rounded-lg border border-gold-accent/15 overflow-hidden shadow-sm hover:shadow transition-shadow"
                  >
                    <button
                      onClick={() => toggleFaq(currentIdx)}
                      className="w-full px-5 py-4 flex justify-between items-center text-left font-serif-cinzel font-bold text-sm sm:text-base text-deep-maroon hover:bg-gold-accent/5 transition-colors focus:outline-none"
                    >
                      <span>{item.q}</span>
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-light border-t border-gray-100">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
