'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, RefreshCw, Layers } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminAstroCards() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCards = async () => {
    setLoading(true);
    const token = localStorage.getItem('smr_admin_token') || '';
    try {
      const res = await fetch(`/api/admin/astro-cards?status=${statusFilter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCards(data.astroCards || []);
      }
    } catch (err) {
      console.error('Failed to fetch cards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [statusFilter]);

  const handleUpdateStatus = async (cardId: string, newStatus: string) => {
    setUpdatingId(cardId);
    const token = localStorage.getItem('smr_admin_token') || '';
    try {
      const res = await fetch(`/api/admin/astro-cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Refresh local details
        fetchCards();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to update card status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-cinzel text-deep-maroon">Astro Card Board</h1>
            <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">Review birth coordinates, calculate Nakshatras, and track Astro Card preparation workflows.</p>
          </div>
          <button 
            onClick={fetchCards}
            className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-500 hover:text-deep-maroon transition-colors"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex gap-4 bg-white p-4 rounded-xl border border-gold-accent/15 shadow-sm">
          <div className="flex gap-2 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-gold-accent font-semibold"
            >
              <option value="">All Workflow States</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="prepared">Prepared</option>
              <option value="sent">Sent</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Cards Table */}
        <div className="bg-white rounded-xl border border-gold-accent/15 shadow-sm overflow-hidden">
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-deep-maroon"></div>
            </div>
          ) : cards.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-light text-sm">
              No card requests found in this workflow state.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-sand-bg border-b border-gold-accent/15 text-deep-maroon font-serif-cinzel font-bold">
                    <th className="p-4">Recipient Name</th>
                    <th className="p-4">Order Ref</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Birth Coordinates</th>
                    <th className="p-4">Zodiac & Star</th>
                    <th className="p-4">Status / Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-light">
                  {cards.map((card) => (
                    <tr key={card.id} className="hover:bg-sand-bg/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-charcoal-dark">{card.full_name}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-serif-cinzel font-semibold text-deep-maroon">{card.orders?.order_number || 'Mock Order'}</div>
                        <div className="text-[10px] text-gray-400">Payment: {card.orders?.payment_status}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          card.is_free ? 'bg-green-50 text-green-700' : 'bg-gold-accent/15 text-gold-dark border border-gold-accent/30'
                        }`}>
                          {card.is_free ? 'FREE (Included)' : 'PAID (Add-on)'}
                        </span>
                      </td>
                      <td className="p-4 space-y-0.5 text-gray-600">
                        <p><span className="font-semibold text-charcoal-dark">DOB:</span> {card.dob}</p>
                        <p><span className="font-semibold text-charcoal-dark">Time:</span> {card.birth_time}</p>
                        <p><span className="font-semibold text-charcoal-dark">Place:</span> {card.birth_place}</p>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <p className="font-bold text-deep-maroon">{card.birth_star}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">{card.zodiac_sign}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <select
                            disabled={updatingId === card.id}
                            value={card.status}
                            onChange={(e) => handleUpdateStatus(card.id, e.target.value)}
                            className={`px-2.5 py-1.5 border rounded text-xs focus:outline-none bg-white font-bold uppercase ${
                              card.status === 'completed' ? 'text-green-700 border-green-200' :
                              card.status === 'sent' ? 'text-blue-700 border-blue-200' :
                              card.status === 'prepared' ? 'text-indigo-700 border-indigo-200' :
                              card.status === 'in_progress' ? 'text-gold-dark border-gold-accent/40' :
                              'text-red-750 border-red-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="prepared">Prepared</option>
                            <option value="sent">Sent</option>
                            <option value="completed">Completed</option>
                          </select>
                          {updatingId === card.id && (
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-deep-maroon shrink-0"></div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
