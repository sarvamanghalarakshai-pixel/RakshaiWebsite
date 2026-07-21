'use client';

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Eye, RefreshCw, XCircle, ArrowUpDown, Download, FileText, MessageCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import AdminLayout from '@/components/AdminLayout';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('smr_admin_token') || '';
    try {
      const res = await fetch(`/api/admin/orders?search=${search}&status=${statusFilter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  // Handle Order Status Update
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    const token = localStorage.getItem('smr_admin_token') || '';
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Refresh local details and list
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, order_status: newStatus });
        }
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update order status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating order status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle Order Cancellation
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order? This will mark it as cancelled, send alerts, and trigger a Razorpay refund if the payment is live.')) {
      return;
    }
    
    setCancellingOrder(true);
    const token = localStorage.getItem('smr_admin_token') || '';
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message || 'Order cancelled successfully.');
        fetchOrders();
        setSelectedOrder(null); // Close modal
      } else {
        alert(data.message || 'Failed to cancel order.');
      }
    } catch (err) {
      console.error(err);
      alert('Error cancelling order.');
    } finally {
      setCancellingOrder(false);
    }
  };

  // Export Orders List to Excel File using SheetJS (XLSX)
  const handleExportExcel = () => {
    if (orders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    try {
      const formattedData = orders.map((o, index) => ({
        'S.No': index + 1,
        'Order Number': o.order_number,
        'Customer Name': o.customers?.full_name || 'Mock Buyer',
        'Email Address': o.customers?.email,
        'Phone Number': o.customers?.phone,
        'Quantity': o.quantity,
        'Total Amount': o.total_amount,
        'Payment Status': o.payment_status.toUpperCase(),
        'Order Status': o.order_status.toUpperCase(),
        'Razorpay Order ID': o.razorpay_order_id,
        'Order Date': new Date(o.created_at).toLocaleString('en-IN')
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
      
      const maxColWidth = formattedData.reduce((acc: any, row: any) => {
        Object.keys(row).forEach((key, colIndex) => {
          const cellValue = String(row[key]);
          const cellLength = cellValue.length;
          acc[colIndex] = Math.max(acc[colIndex] || 10, cellLength + 2);
        });
        return acc;
      }, []);
      worksheet['!cols'] = maxColWidth.map((width: number) => ({ wch: width }));

      XLSX.writeFile(workbook, 'sarvamanghala_orders.xlsx');
    } catch (err: any) {
      console.error('Excel export error:', err);
      alert('Error occurred while generating Excel sheet.');
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return alert('No orders available to export.');
    const headers = ['Order Number', 'Customer Name', 'Phone', 'Email', 'Product', 'Quantity', 'Astro Cards', 'Product Amount', 'Astro Card Amount', 'Total Amount', 'Payment Status', 'Order Status', 'Date'];
    const rows = orders.map(o => [
      o.order_number,
      o.customers?.full_name ? `"${o.customers.full_name}"` : 'Mock Buyer',
      o.customers?.phone || '',
      o.customers?.email || '',
      `"${o.product_name}"`,
      o.quantity,
      o.additional_astro_cards,
      o.product_amount,
      o.astro_card_amount,
      o.total_amount,
      o.payment_status.toUpperCase(),
      o.order_status.toUpperCase(),
      new Date(o.created_at).toLocaleString('en-IN')
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sarvamanghala_orders.csv'; a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-cinzel text-deep-maroon">Manage Orders</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">Review transaction history, update shipping codes, or trigger refunds.</p>
          </div>
          <div className="flex gap-2">
            {/*
            Run in Supabase SQL Editor:
            ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_status_check;
            ALTER TABLE orders ADD CONSTRAINT orders_order_status_check 
              CHECK (order_status IN ('pending','confirmed','processing','shipped','delivered','cancelled'));
            */}
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-deep-maroon font-bold font-serif-cinzel text-xs rounded shadow flex items-center gap-1.5 border border-gray-200 transition-all"
            >
              <FileText className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-gold-accent hover:bg-gold-light text-deep-maroon font-bold font-serif-cinzel text-xs rounded shadow flex items-center gap-1.5 border border-gold-dark transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Export Excel
            </button>
            <button 
              onClick={fetchOrders}
              className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-500 hover:text-deep-maroon transition-colors"
              title="Refresh List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gold-accent/15 shadow-sm">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, name, or payment ID..."
              className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold-accent"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-gold-accent"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gold-accent/15 shadow-sm overflow-hidden">
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-deep-maroon"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-light text-sm">
              No orders found matching the filter coordinates.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-sand-bg border-b border-gold-accent/15 text-deep-maroon font-serif-cinzel font-bold">
                    <th className="p-4">Order No</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Qty</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-light">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-sand-bg/30 transition-colors">
                      <td className="p-4 font-serif-cinzel font-bold text-deep-maroon">{order.order_number}</td>
                      <td className="p-4">
                        <div className="font-semibold text-charcoal-dark">{order.customers?.full_name || 'Mock Buyer'}</div>
                        <div className="text-[10px] text-gray-400">{order.customers?.email}</div>
                      </td>
                      <td className="p-4">{order.quantity}</td>
                      <td className="p-4 font-bold">₹{order.total_amount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.payment_status === 'paid' ? 'bg-green-50 text-green-700' :
                          order.payment_status === 'refunded' ? 'bg-blue-50 text-blue-700' :
                          'bg-yellow-50 text-gold-dark'
                        }`}>
                          {order.payment_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.order_status === 'delivered' ? 'bg-green-50 text-green-700' :
                          order.order_status === 'cancelled' ? 'bg-red-50 text-red-700' :
                          order.order_status === 'shipped' ? 'bg-indigo-50 text-indigo-700' :
                          order.order_status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                          order.order_status === 'processing' ? 'bg-purple-50 text-purple-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {order.order_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 px-3 py-1 bg-deep-maroon hover:bg-maroon-light text-white rounded font-serif-cinzel font-bold text-xs shadow transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full rounded-2xl border-2 border-gold-accent max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-charcoal-dark focus:outline-none"
              >
                ✕
              </button>

              <div className="border-b border-gold-accent/15 pb-4">
                <span className="text-xs uppercase font-bold text-gold-accent">Order Details Panel</span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif-cinzel text-deep-maroon">
                  {selectedOrder.order_number}
                </h2>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                
                {/* Contact and address details */}
                <div className="space-y-2">
                  <h4 className="font-bold text-deep-maroon uppercase text-xs tracking-wider">Contact & Address</h4>
                  <div className="space-y-1 text-gray-600 font-light">
                    <p><span className="font-semibold text-charcoal-dark">Customer Name:</span> {selectedOrder.customers?.full_name}</p>
                    <p><span className="font-semibold text-charcoal-dark">Phone:</span> {selectedOrder.customers?.phone}</p>
                    <p><span className="font-semibold text-charcoal-dark">Email:</span> {selectedOrder.customers?.email}</p>
                    <p><span className="font-semibold text-charcoal-dark">Address:</span> {selectedOrder.customers?.address}</p>
                    <p><span className="font-semibold text-charcoal-dark">Location:</span> {selectedOrder.customers?.city}, {selectedOrder.customers?.state} - {selectedOrder.customers?.pincode}</p>
                  </div>
                </div>

                {/* Primary astro details */}
                <div className="space-y-2">
                  <h4 className="font-bold text-deep-maroon uppercase text-xs tracking-wider">Astro Details (Primary)</h4>
                  <div className="space-y-1 text-gray-600 font-light">
                    <p><span className="font-semibold text-charcoal-dark">DOB:</span> {selectedOrder.customers?.dob}</p>
                    <p><span className="font-semibold text-charcoal-dark">Birth Time:</span> {selectedOrder.customers?.birth_time}</p>
                    <p><span className="font-semibold text-charcoal-dark">Birth Place:</span> {selectedOrder.customers?.birth_place}</p>
                    <p><span className="font-semibold text-charcoal-dark">Zodiac:</span> {selectedOrder.customers?.zodiac_sign}</p>
                    <p><span className="font-semibold text-charcoal-dark">Nakshatra:</span> {selectedOrder.customers?.birth_star}</p>
                  </div>
                </div>

                {/* Additional Astro Cards */}
                {selectedOrder.astro_cards && selectedOrder.astro_cards.length > 0 && (
                  <div className="space-y-2 sm:col-span-2">
                    <h4 className="font-bold text-deep-maroon uppercase text-xs tracking-wider">Astro Cards</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedOrder.astro_cards.map((card: any, idx: number) => (
                        <div key={card.id || idx} className="bg-sand-bg p-3 rounded-lg border border-gold-accent/15 text-gray-600 font-light text-xs">
                          <p className="font-bold text-charcoal-dark mb-1">{card.is_free ? 'Primary Card' : `Additional Card ${idx + 1}`}</p>
                          <p><span className="font-semibold text-charcoal-dark">Name:</span> {card.full_name}</p>
                          <p><span className="font-semibold text-charcoal-dark">DOB:</span> {card.dob || 'N/A'}</p>
                          <p><span className="font-semibold text-charcoal-dark">Time:</span> {card.birth_time || 'N/A'}</p>
                          <p><span className="font-semibold text-charcoal-dark">Place:</span> {card.birth_place || 'N/A'}</p>
                          <p><span className="font-semibold text-charcoal-dark">Zodiac:</span> {card.zodiac_sign || 'N/A'}</p>
                          <p><span className="font-semibold text-charcoal-dark">Star:</span> {card.birth_star || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing & items */}
                <div className="space-y-2 sm:col-span-2 bg-sand-bg p-4 rounded-xl border border-gold-accent/10">
                  <h4 className="font-bold text-deep-maroon uppercase text-xs tracking-wider">Purchase Breakdown</h4>
                  <div className="text-gray-600 font-light space-y-1">
                    <p>Product: Consecrated Sarvamanghala Rakshai Sacred Herbal Paste (Qty: {selectedOrder.quantity}) — ₹{selectedOrder.product_amount}</p>
                    <p>Add-on Cards: {selectedOrder.additional_astro_cards} compiled family charts — ₹{selectedOrder.astro_card_amount}</p>
                    <p className="font-bold text-deep-maroon text-sm border-t border-gold-accent/15 pt-1.5 mt-1.5 flex justify-between">
                      <span>Grand Total:</span>
                      <span>₹{selectedOrder.total_amount}</span>
                    </p>
                  </div>
                </div>

                {/* Status Update section */}
                <div className="space-y-3 sm:col-span-2 border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-charcoal-dark uppercase text-xs">Update Status:</span>
                    <select
                      disabled={updatingStatus || selectedOrder.order_status === 'cancelled'}
                      value={selectedOrder.order_status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-gold-accent bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled" disabled>Cancelled (Use Cancel Button)</option>
                    </select>
                  </div>

                  {selectedOrder.order_status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      disabled={cancellingOrder}
                      className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold font-serif-cinzel text-xs rounded shadow transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel Order & Refund
                    </button>
                  )}
                  {selectedOrder.customers?.phone && (
                    <button
                      onClick={() => {
                        const msg = encodeURIComponent(`Vanakkam ${selectedOrder.customers.full_name}! Your Sarvamanghala Rakshai order #${selectedOrder.order_number} status has been updated to ${selectedOrder.order_status}. For queries: sarvamanghalarakshai@gmail.com 🙏`);
                        window.open(`https://wa.me/91${selectedOrder.customers.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${msg}`, '_blank');
                      }}
                      className="px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold font-serif-cinzel text-xs rounded shadow transition-colors flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Customer
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
