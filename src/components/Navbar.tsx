'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Astro Card', href: '/astro-card' },
    { name: 'My Orders', href: '/my-orders' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-deep-maroon text-white border-b border-gold-accent sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Branding */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="Sarvamanghala Rakshai"
                width={220}
                height={88}
                className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                priority
                unoptimized
              />
              <div className="flex flex-col">
                <span className="font-serif-cinzel font-bold text-lg leading-tight tracking-wider text-gold-accent group-hover:text-gold-light transition-colors">
                  SARVAMANGHALA
                </span>
                <span className="font-serif-cinzel font-semibold text-xs tracking-[0.18em] text-white opacity-90">
                  RAKSHAI
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium tracking-wide uppercase transition-colors font-sans-outfit ${
                  isActive(link.href)
                    ? 'text-gold-accent'
                    : 'text-white/95 hover:text-gold-light'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            
            <Link
              href="/checkout"
              className="ml-4 px-6 py-2.5 bg-gold-accent hover:bg-gold-light text-deep-maroon font-bold font-serif-cinzel text-sm rounded shadow-[0_4px_14px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.6)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-1.5 border border-gold-dark"
            >
              <ShieldCheck className="w-4 h-4" />
              Order Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gold-accent hover:text-gold-light focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 h-6" /> : <Menu className="h-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-maroon-dark border-t border-gold-accent/30"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium font-sans-outfit tracking-wide uppercase transition-colors ${
                    isActive(link.href)
                      ? 'bg-deep-maroon text-gold-accent font-semibold border-l-2 border-gold-accent'
                      : 'text-white/90 hover:bg-deep-maroon hover:text-gold-accent'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-3">
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex justify-center items-center gap-2 py-3 bg-gold-accent hover:bg-gold-light text-deep-maroon font-bold font-serif-cinzel text-sm rounded shadow-lg border border-gold-dark"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Order Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
