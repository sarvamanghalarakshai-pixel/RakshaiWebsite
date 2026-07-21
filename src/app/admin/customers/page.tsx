'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, RefreshCw, Eye, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import AdminLayout from '@/components/AdminLayout';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Details drawer/modal
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerOrders(selectedCustomer.id);
    } else {
      setCustomerOrders([]);
    }
  }, [selectedCustomer]);

  const fetchCustomerOrders = async (id: string) => {
    setLoadingOrders(true);
    const token = localStorage.getItem('smr_admin_token') || '';
    try {
      const res = await fetch(`/api/admin/customers/${id}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCustomerOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    const token = localStorage.getItem('smr_admin_token') || '';
    try {
      const res = await fetch(`/api/admin/customers?search=${search}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  // Export Customer List to Excel File using SheetJS (XLSX)
  const handleExportExcel = () => {
    if (customers.length === 0) {
      alert('No customer details available to export.');
      return;
    }

    try {
      // Map customer payload objects to clean columns
      const formattedData = customers.map((c, index) => ({
        'S.No': index + 1,
        'Full Name': c.full_name,
        'Email Address': c.email,
        'Phone Number': c.phone,
        'Date of Birth': c.dob,
        'Time of Birth': c.birth_time,
        'Place of Birth': c.birth_place,
        'Zodiac Sign (Rashi)': c.zodiac_sign,
        'Birth Star (Nakshatra)': c.birth_star,
        'Address': c.address,
        'City': c.city,
        'State': c.state,
        'Pincode': c.pincode,
        'Country': c.country,
        'Registered Date': new Date(c.created_at).toLocaleDateString('en-IN')
      }));

      // Generate worksheet & workbook
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
      
      // Auto-fit column widths (basic adjustment)
      const maxColWidth = formattedData.reduce((acc: any, row: any) => {
        Object.keys(row).forEach((key, colIndex) => {
          const cellValue = String(row[key]);
          const cellLength = cellValue.length;
          acc[colIndex] = Math.max(acc[colIndex] || 10, cellLength + 2);
        });
        return acc;
      }, []);
      worksheet['!cols'] = maxColWidth.map((width: number) => ({ wch: width }));

      // Trigger file download
      XLSX.writeFile(workbook, 'sarvamanghala_customers_database.xlsx');
    } catch (err: any) {
      console.error('Excel export error:', err);
      alert('Error occurred while generating Excel sheet.');
    }
  };

  const handleExportCSV = () => {
    if (customers.length === 0) return alert('No customers available to export.');
    const headers = ['Name', 'Phone', 'Email', 'City', 'State', 'Pincode', 'DOB', 'Birth Star', 'Zodiac Sign', 'Created Date'];
    const rows = customers.map(c => [
      `"${c.full_name}"`,
      c.phone || '',
      c.email || '',
      `"${c.city || ''}"`,
      `"${c.state || ''}"`,
      c.pincode || '',
      c.dob || '',
      `"${c.birth_star || ''}"`,
      `"${c.zodiac_sign || ''}"`,
      new Date(c.created_at).toLocaleDateString('en-IN')
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sarvamanghala_customers.csv'; a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-cinzel text-deep-maroon">Customer Database</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">Access buyer identities, contact details, and spiritual birth constellations.</p>
          </div>
          
          <div className="flex gap-2">
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
              onClick={fetchCustomers}
              className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-500 hover:text-deep-maroon transition-colors"
              title="Refresh List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Control */}
        <div className="bg-white p-4 rounded-xl border border-gold-accent/15 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone number..."
              className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold-accent"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl border border-gold-accent/15 shadow-sm overflow-hidden">
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-deep-maroon"></div>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-light text-sm">
              No customers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-sand-bg border-b border-gold-accent/15 text-deep-maroon font-serif-cinzel font-bold">
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Phone / Email</th>
                    <th className="p-4">Birth Star (Nakshatra)</th>
                    <th className="p-4">Zodiac Sign</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-light">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-sand-bg/30 transition-colors">
                      <td className="p-4 font-bold text-charcoal-dark">{c.full_name}</td>
                      <td className="p-4 font-mono">
                        <div>{c.phone}</div>
                        <div className="text-[10px] text-gray-400 font-sans">{c.email}</div>
                      </td>
                      <td className="p-4"><span className="bg-sand-bg border border-gold-accent/15 px-2 py-0.5 rounded text-deep-maroon font-semibold">{c.birth_star}</span></td>
                      <td className="p-4">{c.zodiac_sign}</td>
                      <td className="p-4 text-gray-500">{c.city}, {c.state}</td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="flex items-center gap-1 px-3 py-1 bg-deep-maroon hover:bg-maroon-light text-white rounded font-serif-cinzel font-bold text-xs shadow transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl border-2 border-gold-accent p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-charcoal-dark focus:outline-none"
              >
                ✕
              </button>

              <div className="border-b border-gold-accent/15 pb-4">
                <span className="text-xs uppercase font-bold text-gold-accent">Devotee Coordinates</span>
                <h2 className="text-xl font-bold font-serif-cinzel text-deep-maroon">
                  {selectedCustomer.full_name}
                </h2>
              </div>

              <div className="text-xs sm:text-sm space-y-4 text-gray-600 font-light">
                <div className="space-y-1">
                  <h4 className="font-bold text-charcoal-dark uppercase text-[10px] tracking-wider text-deep-maroon border-b border-gray-100 pb-1">Contact Details</h4>
                  <p><span className="font-semibold text-charcoal-dark">Email:</span> {selectedCustomer.email}</p>
                  <p><span className="font-semibold text-charcoal-dark">Phone:</span> {selectedCustomer.phone}</p>
                  <p><span className="font-semibold text-charcoal-dark">Address:</span> {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} - {selectedCustomer.pincode}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-charcoal-dark uppercase text-[10px] tracking-wider text-deep-maroon border-b border-gray-100 pb-1">Vedic Coordinate Details</h4>
                  <p><span className="font-semibold text-charcoal-dark">Birth Date:</span> {selectedCustomer.dob}</p>
                  <p><span className="font-semibold text-charcoal-dark">Birth Time:</span> {selectedCustomer.birth_time}</p>
                  <p><span className="font-semibold text-charcoal-dark">Birth Place:</span> {selectedCustomer.birth_place}</p>
                  <p><span className="font-semibold text-charcoal-dark">Zodiac Sign:</span> {selectedCustomer.zodiac_sign}</p>
                  <p><span className="font-semibold text-charcoal-dark">Birth Star:</span> {selectedCustomer.birth_star}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <h4 className="font-bold text-charcoal-dark uppercase text-[10px] tracking-wider text-deep-maroon">Order History</h4>
                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-deep-maroon"></div>
                    </div>
                  ) : customerOrders.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No orders found for this customer.</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {customerOrders.map(order => (
                        <div key={order.id} className="bg-sand-bg border border-gold-accent/15 p-3 rounded-lg flex flex-col gap-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-deep-maroon font-serif-cinzel">{order.order_number}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              order.order_status === 'delivered' ? 'bg-green-50 text-green-700' :
                              order.order_status === 'cancelled' ? 'bg-red-50 text-red-700' :
                              order.order_status === 'shipped' ? 'bg-indigo-50 text-indigo-700' :
                              order.order_status === 'confirmed' ? 'bg-blue-50 text-blue-700' :
                              order.order_status === 'processing' ? 'bg-purple-50 text-purple-700' :
                              'bg-amber-50 text-amber-700'
                            }`}>{order.order_status}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                            <span className="font-bold text-charcoal-dark">₹{order.total_amount}</span>
                          </div>
                          <span className={`text-[10px] self-start font-bold ${order.payment_status === 'paid' ? 'text-green-600' : order.payment_status === 'failed' ? 'text-red-600' : 'text-amber-600'}`}>
                            {order.payment_status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
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
