"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';

const byPrefixAndName = {
  fas: {
    'gift': faGift
  }
};

const REWARDS_CONFIG = {
  distributor: { target: 1000, reward: 'Trip to Malaysia 3 hari atau uang senilai Rp. 10.000.000,-', asterisk: '*' },
  agent:       { target: 100,  reward: '1 unit kulkas atau TV atau uang Rp. 2.000.000,-', asterisk: '**' },
  reseller:    { target: 25,   reward: '1 unit iPad atau uang Rp. 625.000,-', asterisk: '**' },
};

const ROLE_COLORS = {
  distributor: { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', bar: 'bg-purple-500' },
  agent:       { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',     bar: 'bg-blue-500' },
  reseller:    { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700',   bar: 'bg-amber-500' },
  customer:    { bg: 'bg-gray-50',    text: 'text-gray-600',   border: 'border-gray-200',   badge: 'bg-gray-100 text-gray-600',     bar: 'bg-gray-400' },
};

const STATUS_STYLES = {
  pending:   { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Pending' },
  completed: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  label: 'Completed' },
  cancelled: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    label: 'Cancelled' },
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id;

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchOrders();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        const found = data.users.find(u => u.id === userId);
        setUser(found || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/admin/orders?userId=${userId}`);
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        // Re-fetch user to update sales count
        fetchUser();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#18281a]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-400">
        <span className="material-symbols-outlined text-[48px] block mb-2">person_off</span>
        <p>Pengguna tidak ditemukan.</p>
        <Link href="/admin.senara/users" className="text-[#bd8033] hover:underline text-sm mt-4 inline-block">← Kembali</Link>
      </div>
    );
  }

  const role = user.user_metadata?.role || 'customer';
  const meta = user.user_metadata || {};
  const colors = ROLE_COLORS[role] || ROLE_COLORS.customer;
  const reward = REWARDS_CONFIG[role];
  const sales = user.currentSales || 0;
  const progress = reward ? Math.min((sales / reward.target) * 100, 100) : null;

  // Order stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + Number(o.total_price || 0), 0);

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link href="/admin.senara/users" className="text-sm text-gray-500 hover:text-[#18281a] flex items-center gap-1 transition-colors">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Kembali ke Daftar Pengguna
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#18281a] to-[#2c4730] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-5">
            <span className="material-symbols-outlined text-[200px]">person</span>
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white/20">
              {meta.avatar_url ? (
                <img src={meta.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[36px] text-white/60">person</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{meta.full_name || user.email?.split('@')[0]}</h1>
              <p className="text-white/70 text-sm mt-0.5">{user.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${colors.badge}`}>
                {role === 'agent' ? 'Agen' : role}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
          <div className="p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Telepon</p>
            <p className="text-sm font-semibold text-[#18281a]">{meta.phone || '-'}</p>
          </div>
          <div className="p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Toko / Usaha</p>
            <p className="text-sm font-semibold text-[#18281a]">{meta.store_name || '-'}</p>
          </div>
          <div className="p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Kota</p>
            <p className="text-sm font-semibold text-[#18281a]">{meta.city || '-'}</p>
          </div>
          <div className="p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Provinsi</p>
            <p className="text-sm font-semibold text-[#18281a]">{meta.province || '-'}</p>
          </div>
        </div>
        {meta.address && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Alamat Lengkap</p>
            <p className="text-sm text-gray-700">{meta.address}</p>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Total Pesanan</p>
          <p className="text-2xl font-bold text-[#18281a]">{totalOrders}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-5">
          <p className="text-xs text-green-600 uppercase tracking-wider font-semibold mb-1">Selesai</p>
          <p className="text-2xl font-bold text-green-700">{completedOrders}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-5">
          <p className="text-xs text-yellow-600 uppercase tracking-wider font-semibold mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{pendingOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Total Pendapatan</p>
          <p className="text-2xl font-bold text-[#18281a]">Rp {totalRevenue.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Reward Progress (Business Roles Only) */}
      {reward && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-[#bd8033] text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <span className="material-symbols-outlined text-[140px]">workspace_premium</span>
            </div>
            <h3 className="text-lg font-bold relative z-10">Progress Reward & Bonus</h3>
            <p className="text-white/80 text-sm relative z-10">Target bulanan: {reward.target} paket</p>
          </div>
          <div className="p-6">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500">Paket terjual bulan ini</p>
                <p className="text-3xl font-bold text-[#18281a]">{sales} <span className="text-base font-normal text-gray-400">/ {reward.target}</span></p>
              </div>
              <p className={`text-2xl font-bold ${progress >= 100 ? 'text-green-600' : 'text-[#bd8033]'}`}>
                {Math.round(progress)}%
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden border border-gray-200">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ease-out ${progress >= 100 ? 'bg-green-500' : 'bg-[#bd8033]'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="bg-[#fcfaf7] border border-[#bd8033]/20 rounded-lg p-4 flex items-start gap-3">
              <FontAwesomeIcon icon={byPrefixAndName.fas['gift']} className="text-[#bd8033] text-[24px]" />
              <div>
                <p className="text-xs text-[#bd8033] font-bold uppercase tracking-widest mb-0.5">Hadiah Target {reward.asterisk}</p>
                <p className="text-sm text-[#18281a] font-medium">{reward.reward}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-[#18281a] text-lg">Histori Pesanan</h3>
          <span className="text-xs text-gray-400">{totalOrders} pesanan</span>
        </div>

        {loadingOrders ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18281a]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="material-symbols-outlined text-[48px] block mb-2">receipt_long</span>
            <p>Belum ada pesanan.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => {
              const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
              const items = order.items || [];
              const date = new Date(order.created_at);
              const formattedDate = date.toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric',
              });
              const formattedTime = date.toLocaleTimeString('id-ID', {
                hour: '2-digit', minute: '2-digit',
              });

              return (
                <div key={order.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-xs text-gray-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                          {statusStyle.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{formattedDate} • {formattedTime}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{order.package_amount} paket</p>
                        <p className="text-lg font-bold text-[#18281a]">Rp {Number(order.total_price).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  {items.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Produk</p>
                      <div className="space-y-2">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.name} <span className="text-gray-400">× {item.qty}</span></span>
                            <span className="text-gray-700 font-medium">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Actions */}
                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(order.id, 'completed')}
                        disabled={updatingOrderId === order.id}
                        className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        {updatingOrderId === order.id ? 'Memproses...' : 'Tandai Selesai'}
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        disabled={updatingOrderId === order.id}
                        className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">cancel</span>
                        Batalkan
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
