'use client';

import React, { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, ShoppingBag, Users, Sparkles, LogOut, Loader2, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newOrderToast, setNewOrderToast] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('smr_admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [router]);

  // Real-time order notification subscription
  useEffect(() => {
    if (!authorized) return;
    const channel = supabaseBrowser
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const order = payload.new;
        setNewOrderToast(`New Order Received - Order #${order.order_number}`);
        // Auto-dismiss after 5 seconds
        setTimeout(() => setNewOrderToast(null), 5000);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') console.log('Subscribed to orders realtime channel');
      });
    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [authorized]);

  const handleLogout = () => {
    localStorage.removeItem('smr_admin_token');
    localStorage.removeItem('smr_admin_email');
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Orders', href: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Customers', href: '/admin/customers', icon: <Users className="w-4 h-4" /> },
    { name: 'Astro Cards', href: '/admin/astro-cards', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const isActive = (href: string) => pathname === href;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-bg">
        <Loader2 className="w-10 h-10 text-deep-maroon animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <>
      {newOrderToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gold-accent text-deep-maroon font-serif-cinzel font-bold py-2 px-4 rounded shadow-md z-50 animate-bounce">
          {newOrderToast}
        </div>
      )}
      <div className="min-h-screen flex flex-col md:flex-row bg-sand-bg font-sans-outfit">



      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-maroon-dark text-white border-r-2 border-gold-accent shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-gold-accent/20 bg-deep-maroon">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Sarvamanghala Rakshai"
              width={140}
              height={56}
              className="h-10 w-auto object-contain"
              unoptimized
            />
            <span className="font-serif-cinzel font-bold text-sm tracking-wider text-gold-accent">Admin Console</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors ${isActive(item.href)
                  ? 'bg-deep-maroon text-gold-accent border-l-4 border-gold-accent shadow-md'
                  : 'text-white/80 hover:bg-deep-maroon hover:text-gold-accent'
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gold-accent/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white/75 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors focus:outline-none"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Navbar */}
      <header className="md:hidden bg-maroon-dark text-white h-16 flex items-center justify-between px-4 border-b border-gold-accent sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Sarvamanghala Rakshai"
            width={120}
            height={48}
            className="h-8 w-auto object-contain"
            unoptimized
          />
          <span className="font-serif-cinzel font-bold text-sm text-gold-accent">Admin Console</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gold-accent p-1 focus:outline-none"
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-maroon-dark text-white border-b border-gold-accent absolute top-16 left-0 right-0 z-20 shadow-lg px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase ${isActive(item.href) ? 'bg-deep-maroon text-gold-accent' : 'text-white/80'
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white/70 hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}

      {/* Dashboard Viewport Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
</>
  );
}
