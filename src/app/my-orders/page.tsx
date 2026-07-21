'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, Search, Package, ChevronRight, AlertCircle } from 'lucide-react';

export default function MyOrdersPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedPhone = localStorage.getItem('smr_customer_phone');
    if (savedPhone) {
      setPhone(savedPhone);
      fetchOrders(savedPhone);
    }
  }, []);

  const fetchOrders = async (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/my-orders?phone=${phoneNumber}`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError('Could not fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(phone);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-sand-bg text-charcoal-dark font-sans-outfit">
      <Navbar />
      <main className="flex-grow py-12 px-4 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-gold-accent/15 p-6 sm:p-8 shadow-md mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-cinzel text-deep-maroon mb-2">My Orders</h1>
          <p className="text-sm text-gray-600 mb-6">Enter your 10-digit registered mobile number to track your orders.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="flex-grow px-4 py-2.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent"
              maxLength={10}
            />
            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="px-6 py-2.5 bg-deep-maroon hover:bg-maroon-light text-white font-bold font-serif-cinzel tracking-wider rounded border border-maroon-dark shadow-sm transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track
            </button>
          </form>
          {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
        </div>

        {searched && !loading && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gold-accent/15 p-8 shadow-sm text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-serif-cinzel font-bold text-lg text-deep-maroon mb-2">No Orders Found</h3>
                <p className="text-sm text-gray-500 mb-6">We couldn't find any orders linked to this number.</p>
                <Link
                  href="/checkout"
                  className="inline-block px-6 py-2.5 bg-gold-accent hover:bg-gold-light text-deep-maroon font-bold font-serif-cinzel text-sm rounded shadow-sm border border-gold-dark transition-all"
                >
                  Order Now
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-gold-accent/15 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Order Number</span>
                      <h3 className="font-serif-cinzel font-bold text-deep-maroon text-lg">{order.order_number}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">Product</p>
                      <p className="text-sm font-medium text-charcoal-dark">{order.product_name} x{order.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">Total Amount</p>
                      <p className="text-sm font-bold text-charcoal-dark">₹{order.total_amount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">Payment</p>
                      <p className="text-sm text-charcoal-dark">
                        {order.payment_status === 'paid' ? 'Paid ✓' : order.payment_status === 'failed' ? 'Failed ✗' : 'Pending ⏳'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Link
                      href={`/order-confirmation/${order.order_number}`}
                      className="text-xs font-bold text-deep-maroon hover:text-gold-accent transition-colors flex items-center gap-1 uppercase tracking-wider"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
