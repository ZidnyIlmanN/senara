"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const REWARDS_CONFIG = {
  distributor: { target: 1000, reward: 'Trip to Malaysia 3 hari / Rp 10.000.000,-' },
  agent:       { target: 100,  reward: '1 unit kulkas/TV / Rp 2.000.000,-' },
  reseller:    { target: 25,   reward: '1 unit iPad / Rp 625.000,-' },
};

const ROLE_COLORS = {
  distributor: { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  agent:       { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700' },
  reseller:    { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700' },
  customer:    { bg: 'bg-gray-50',    text: 'text-gray-600',   border: 'border-gray-200',   badge: 'bg-gray-100 text-gray-600' },
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRole = (user) => user.user_metadata?.role || 'customer';
  const getName = (user) => user.user_metadata?.full_name || user.email?.split('@')[0] || '-';
  const getPhone = (user) => user.user_metadata?.phone || '-';
  const getStore = (user) => user.user_metadata?.store_name || '-';
  const getCity = (user) => user.user_metadata?.city || '-';

  // Filter & Sort
  const filteredUsers = users
    .filter(u => {
      if (filterRole !== 'all' && getRole(u) !== filterRole) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          getName(u).toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          getPhone(u).includes(q) ||
          getStore(u).toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return getName(a).localeCompare(getName(b));
      if (sortBy === 'role') return getRole(a).localeCompare(getRole(b));
      if (sortBy === 'progress') return (b.currentSales || 0) - (a.currentSales || 0);
      return 0;
    });

  // Stats
  const totalUsers = users.length;
  const roleCounts = {
    distributor: users.filter(u => getRole(u) === 'distributor').length,
    agent: users.filter(u => getRole(u) === 'agent').length,
    reseller: users.filter(u => getRole(u) === 'reseller').length,
    customer: users.filter(u => getRole(u) === 'customer').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#18281a]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#18281a]">Manajemen Pengguna</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola semua akun terdaftar beserta progres reward dan histori pesanan.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Pengguna</p>
          <p className="text-3xl font-bold text-[#18281a]">{totalUsers}</p>
        </div>
        {Object.entries(roleCounts).map(([role, count]) => {
          const colors = ROLE_COLORS[role];
          return (
            <div key={role} className={`${colors.bg} rounded-xl border ${colors.border} p-5`}>
              <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${colors.text}`}>{role === 'agent' ? 'Agen' : role.charAt(0).toUpperCase() + role.slice(1)}</p>
              <p className={`text-3xl font-bold ${colors.text}`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, atau toko..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-[#18281a] outline-none transition-colors"
          />
        </div>
        {/* Filter Role */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-[#18281a] outline-none bg-white min-w-[160px]"
        >
          <option value="all">Semua Role</option>
          <option value="distributor">Distributor</option>
          <option value="agent">Agen</option>
          <option value="reseller">Reseller</option>
          <option value="customer">Customer</option>
        </select>
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-[#18281a] outline-none bg-white min-w-[160px]"
        >
          <option value="name">Urutkan: Nama</option>
          <option value="role">Urutkan: Role</option>
          <option value="progress">Urutkan: Progress</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Pengguna</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Role</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs hidden md:table-cell">Kontak</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs hidden lg:table-cell">Toko / Kota</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Progress Reward</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <span className="material-symbols-outlined text-[48px] block mb-2">person_off</span>
                    Tidak ada pengguna yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const role = getRole(user);
                  const colors = ROLE_COLORS[role] || ROLE_COLORS.customer;
                  const reward = REWARDS_CONFIG[role];
                  const sales = user.currentSales || 0;
                  const progress = reward ? Math.min((sales / reward.target) * 100, 100) : null;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#18281a]/5 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {user.user_metadata?.avatar_url ? (
                              <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-[20px] text-[#18281a]/40">person</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#18281a]">{getName(user)}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${colors.badge}`}>
                          {role === 'agent' ? 'Agen' : role}
                        </span>
                      </td>
                      {/* Contact */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-gray-700">{getPhone(user)}</p>
                      </td>
                      {/* Store / City */}
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <p className="text-gray-700">{getStore(user)}</p>
                        <p className="text-xs text-gray-400">{getCity(user)}</p>
                      </td>
                      {/* Progress */}
                      <td className="px-6 py-4">
                        {reward ? (
                          <div className="min-w-[140px]">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">{sales} / {reward.target}</span>
                              <span className={`font-bold ${progress >= 100 ? 'text-green-600' : colors.text}`}>
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${progress >= 100 ? 'bg-green-500' : 'bg-[#bd8033]'}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300 italic">—</span>
                        )}
                      </td>
                      {/* Action */}
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin.senara/users/${user.id}`}
                          className="text-[#bd8033] hover:text-[#18281a] text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          Detail
                          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
