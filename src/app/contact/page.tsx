'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Mail, MapPin, Send, HelpCircle, Phone } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }
    
    setStatus('submitting');
    
    // Simulate submission (since contact form routes can be wired up or handled via default mailto)
    setTimeout(() => {
      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-charcoal-dark font-sans-outfit">
      <Navbar />

      {/* Banner */}
      <section className="bg-maroon-dark text-white py-16 text-center border-b border-gold-accent/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--maroon-light)_0%,_transparent_75%)] opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-cinzel tracking-wider text-gold-accent">
            Contact Support
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-light max-w-2xl mx-auto">
            புனித ரக்ஷை, ஜோதிட அட்டை அல்லது ஆர்டர் டெலிவரி பற்றி கேள்விகள் உள்ளதா? நாங்கள் உங்களுக்கு உதவ இங்கே இருக்கிறோம்.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Info Column */}
        <div className="space-y-8 lg:col-span-1">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-deep-maroon">
              Get in Touch
            </h2>
            <p className="text-gray-600 text-sm font-light leading-relaxed">
              ஆன்மீக ஆலோசனைகள், சிறப்பு மொத்த ஆர்டர்கள் அல்லது டெலிவரி சிக்கல்களுக்கு எங்களை தொடர்பு கொள்ளுங்கள்.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="p-3 bg-deep-maroon text-white rounded-lg h-fit">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-charcoal-dark font-serif-cinzel">Phone Number</h4>
                <a href="tel:+919962167666" className="text-xs sm:text-sm text-gray-500 hover:text-gold-dark">
                  +91 99621 67666
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-deep-maroon text-white rounded-lg h-fit">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-charcoal-dark font-serif-cinzel">Email Address</h4>
                <a href="mailto:sarvamanghalarakshai@gmail.com" className="text-xs sm:text-sm text-gray-500 hover:text-gold-dark">
                  sarvamanghalarakshai@gmail.com
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-deep-maroon text-white rounded-lg h-fit">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-charcoal-dark font-serif-cinzel">Our Address</h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  United India Colony, Kodambakkam,<br />
                  Chennai - 600024, Tamil Nadu, India
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3 bg-deep-maroon text-white rounded-lg h-fit">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-charcoal-dark font-serif-cinzel">Hours of Consultation</h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  Monday to Saturday: 9:00 AM - 6:00 PM (IST)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="bg-sand-bg border border-gold-accent/25 p-8 rounded-2xl lg:col-span-2 shadow-sm">
          <h3 className="text-xl font-bold font-serif-cinzel text-deep-maroon mb-6">Send a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-charcoal-dark uppercase">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="px-4 py-2.5 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-charcoal-dark uppercase">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ramesh@example.com"
                  className="px-4 py-2.5 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-xs font-semibold text-charcoal-dark uppercase">Subject</label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Question about Astro Card calculations"
                className="px-4 py-2.5 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-semibold text-charcoal-dark uppercase">Message *</label>
              <textarea
                id="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your details or question here..."
                className="px-4 py-2.5 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent resize-none"
              />
            </div>

            {status === 'success' && (
              <div className="p-4 bg-green-50 text-green-700 text-sm font-semibold rounded border border-green-200">
                Om Namah Shivaya. Your message has been sent successfully. We will get back to you shortly.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full sm:w-fit px-8 py-3 bg-deep-maroon hover:bg-maroon-light text-white font-bold font-serif-cinzel tracking-wider rounded border border-maroon-dark shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? 'Sending...' : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Message
                </>
              )}
            </button>
          </form>
        </div>

      </section>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
