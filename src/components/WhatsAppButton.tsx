'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  // Use env variable or default placeholder
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9962167666';

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent("Hello Sarvamanghala Rakshai Team, I have a query about my order/blessed Rakshai.");
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppRedirect}
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(37,211,102,0.4)] group"
      aria-label="Contact support on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="ml-2 text-sm font-semibold whitespace-nowrap">
        Chat with Us
      </span>
    </button>
  );
}
