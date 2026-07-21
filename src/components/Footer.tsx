import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  const policyLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Refund Policy', href: '/refund-policy' },
    { name: 'Shipping & Delivery', href: '/shipping-policy' },
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Personalized Astro Card', href: '/astro-card' },
    { name: 'Frequently Asked Questions', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className="bg-maroon-dark text-white border-t-2 border-gold-accent font-sans-outfit mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Spiritual Summary */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <svg 
                className="w-8 h-8 text-gold-accent filter drop-shadow-[0_0_4px_rgba(212,175,55,0.4)]"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M12 2v20M8 7c0-2.5 4-5 4-5s4 2.5 4 5M8 7c0 4 2 6 4 6s4-2 4-6M10 13c0 2 1 3 2 3s2-1 2-3" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col">
                <span className="font-serif-cinzel font-bold text-base leading-tight tracking-wider text-gold-accent">
                  SARVAMANGHALA
                </span>
                <span className="font-serif-cinzel font-semibold text-xs tracking-[0.18em] text-white opacity-95">
                  RAKSHAI
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed pt-2">
               முருகப்பெருமான் அர்ப்பணிக்கப்பட்ட சிறப்பு பிரார்த்தனைகள் மற்றும் சடங்குகளால் ஆசீர்வதிக்கப்பட்ட புனித ரக்ஷை — தெய்வீக பாதுகாப்பு, நேர்மறை சக்தி மற்றும் ஆன்மீக வழிகாட்டுதல் வழங்குகிறது.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-accent font-serif-cinzel font-semibold text-sm uppercase tracking-wider mb-4 border-b border-gold-accent/20 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-gold-light transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-gold-accent font-serif-cinzel font-semibold text-sm uppercase tracking-wider mb-4 border-b border-gold-accent/20 pb-2">
              Our Policies
            </h3>
            <ul className="space-y-2 text-sm">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-gold-light transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="text-gold-accent font-serif-cinzel font-semibold text-sm uppercase tracking-wider mb-4 border-b border-gold-accent/20 pb-2">
              Contact Us
            </h3>
            <div className="text-sm text-gray-300 space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gold-accent mt-0.5 shrink-0" />
                <div>
                  <a href="tel:+919962167666" className="hover:text-gold-light transition-colors font-medium">
                    +91 99621 67666
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gold-accent mt-0.5 shrink-0" />
                <div>
                  <a href="mailto:sarvamanghalarakshai@gmail.com" className="hover:text-gold-light transition-colors">
                    sarvamanghalarakshai@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-accent mt-0.5 shrink-0" />
                <p className="text-gray-400 leading-relaxed">
                  United India Colony, Kodambakkam,<br />
                  Chennai - 600024, Tamil Nadu, India
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gold-accent/20 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Sarvamanghala Rakshai. All rights reserved.</p>
          <div className="flex gap-4">
            <p>Made with devotion for seekers of Murugan blessings.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
