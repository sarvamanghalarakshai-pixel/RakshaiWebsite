'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock, Mail, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect to admin panel
  useEffect(() => {
    const token = localStorage.getItem('smr_admin_token');
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed.');
      }

      localStorage.setItem('smr_admin_token', data.token);
      localStorage.setItem('smr_admin_email', email);
      router.push('/admin');

    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-sand-bg text-charcoal-dark font-sans-outfit">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="bg-white max-w-md w-full rounded-2xl border-2 border-gold-accent p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="p-3 bg-deep-maroon text-gold-accent rounded-full w-fit mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-serif-cinzel text-deep-maroon">Admin Portal Login</h2>
            <p className="text-xs text-gray-400">Authorized personnel only. Access is logs-monitored.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-charcoal-dark uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-deep-maroon" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sarvamanghalarakshai.com"
                className="px-3 py-2.5 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-charcoal-dark uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-deep-maroon" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-3 py-2.5 rounded bg-white border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-50 text-red-600 text-xs font-semibold rounded border border-red-200">
                {errorMsg}
              </div>
            )}



            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-deep-maroon hover:bg-maroon-light text-white font-bold font-serif-cinzel tracking-wider rounded border border-maroon-dark shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
