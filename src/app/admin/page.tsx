'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { IndianRupee, ShoppingBag, Sparkles, TrendingUp, Calendar, ArrowUpRight, AlertTriangle, X } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

const COLORS = ['#800020', '#D4AF37', '#FF9933', '#4A5568', '#E53E3E'];

export default function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);
  const [dismissedAlert, setDismissedAlert] = useState(false);

  // Set mounted on client to prevent Recharts server side rendering mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem('smr_admin_token') || '';
      try {
        const res = await fetch('/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        
        if (!res.ok) {
          throw new Error(json.message || 'Failed to fetch analytics.');
        }

        setData(json);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Failed to retrieve analytics summaries.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-maroon"></div>
        </div>
      </AdminLayout>
    );
  }

  if (errorMsg) {
    return (
      <AdminLayout>
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200">
          <h3 className="font-bold text-lg font-serif-cinzel">Error</h3>
          <p className="text-sm font-light mt-1">{errorMsg}</p>
        </div>
      </AdminLayout>
    );
  }

  const { stats, statusDistribution, revenueTrend } = data;

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-cinzel text-deep-maroon">Overview Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">Real-time revenue, order conversions, and Astro Card tracking metrics.</p>
        </div>

        {/* Today's Pending Orders Alert */}
        {stats.todayPendingCount > 0 && !dismissedAlert && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-amber-800 font-semibold text-sm">
                  ⚠️ You have {stats.todayPendingCount} pending order(s) from today that need attention.
                </p>
                <Link href="/admin/orders?status=pending" className="text-xs text-amber-700 underline font-bold mt-0.5 inline-block hover:text-amber-900">
                  View Orders
                </Link>
              </div>
            </div>
            <button 
              onClick={() => setDismissedAlert(true)}
              className="p-1.5 text-amber-500 hover:text-amber-800 hover:bg-amber-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gold-accent/15 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Total Revenue</span>
              <p className="text-xl sm:text-2xl font-bold text-deep-maroon font-serif-cinzel">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-50 text-green-700 rounded-xl">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gold-accent/15 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Captured Orders</span>
              <p className="text-xl sm:text-2xl font-bold text-deep-maroon font-serif-cinzel">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-red-50 text-deep-maroon rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gold-accent/15 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Pending Astro Cards</span>
              <p className="text-xl sm:text-2xl font-bold text-deep-maroon font-serif-cinzel">{stats.pendingAstroCards}</p>
            </div>
            <div className="p-3 bg-yellow-50 text-gold-dark rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gold-accent/15 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Today's Revenue</span>
              <p className="text-xl sm:text-2xl font-bold text-deep-maroon font-serif-cinzel">₹{stats.todayRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Charts Section */}
        {mounted && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Revenue Trend Area Chart */}
            <div className="bg-white p-6 rounded-2xl border border-gold-accent/15 shadow-sm lg:col-span-2 space-y-4">
              <h3 className="font-serif-cinzel font-bold text-base text-deep-maroon flex items-center gap-1.5">
                <Calendar className="w-5 h-5 text-gold-accent" /> 7-Day Revenue Trend (₹ INR)
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#800020" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#800020" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#800020" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Order Status Distribution Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-gold-accent/15 shadow-sm space-y-4 flex flex-col justify-between">
              <h3 className="font-serif-cinzel font-bold text-base text-deep-maroon">
                Order Status Distribution
              </h3>
              <div className="h-56 w-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center text-xs text-gray-500 font-semibold border-t border-gray-50 pt-3">
                {statusDistribution.map((entry: any, index: number) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span>{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Quick Links / Shortcuts */}
        <div className="bg-white p-6 rounded-2xl border border-gold-accent/15 shadow-sm space-y-4">
          <h3 className="font-serif-cinzel font-bold text-base text-deep-maroon">Quick Admin Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/admin/orders" className="flex items-center justify-between p-4 rounded-xl bg-sand-bg hover:bg-gold-accent/5 border border-gold-accent/10 transition-colors group">
              <div>
                <h4 className="font-bold text-sm text-deep-maroon">Manage Orders</h4>
                <p className="text-[10px] text-gray-400">Process shipping & status updates</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-deep-maroon transition-colors" />
            </Link>

            <Link href="/admin/customers" className="flex items-center justify-between p-4 rounded-xl bg-sand-bg hover:bg-gold-accent/5 border border-gold-accent/10 transition-colors group">
              <div>
                <h4 className="font-bold text-sm text-deep-maroon">Customer Database</h4>
                <p className="text-[10px] text-gray-400">Export lists & birth details</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-deep-maroon transition-colors" />
            </Link>

            <Link href="/admin/astro-cards" className="flex items-center justify-between p-4 rounded-xl bg-sand-bg hover:bg-gold-accent/5 border border-gold-accent/10 transition-colors group">
              <div>
                <h4 className="font-bold text-sm text-deep-maroon">Astro Card Board</h4>
                <p className="text-[10px] text-gray-400">Prepare family chart lists</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-deep-maroon transition-colors" />
            </Link>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
