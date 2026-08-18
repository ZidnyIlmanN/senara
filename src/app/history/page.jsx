"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import FooterSection from '../../components/FooterSection';
import Link from 'next/link';

export default function HistoryPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#fffdf7] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-[#bd8033] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <FooterSection />
      </div>
    );
  }

  if (!user) return null;

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'selesai':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
      case 'diproses':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
      case 'dibatalkan':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status) => {
    const key = status?.toLowerCase() || 'pending';
    const translated = t(`historyPage.status.${key}`);
    return translated && translated !== `historyPage.status.${key}` ? translated : status;
  };

  return (
    <div className="min-h-screen bg-[#fffdf7] flex flex-col font-sans">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-[#f7f2ea] py-16 md:py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="container mx-auto relative z-10 max-w-4xl text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-[#18281a] mb-4">
            {t('historyPage.title') || 'Riwayat Transaksi'}
          </h1>
          <p className="text-[#434842] max-w-lg mx-auto font-sans">
            {t('historyPage.subtitle') || 'Pantau pesanan dan pengiriman produk SENARA Anda.'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-6 md:px-12 py-12 max-w-5xl">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#c3c8c0]/30 rounded-3xl shadow-sm">
            <span className="material-symbols-outlined text-6xl text-[#bd8033]/50 mb-4 block">receipt_long</span>
            <h2 className="text-2xl font-serif text-[#18281a] mb-2">{t('historyPage.emptyState') || 'Belum ada transaksi'}</h2>
            <p className="text-[#434842] mb-8 max-w-md mx-auto">{t('historyPage.emptyDesc') || 'Anda belum melakukan pemesanan apa pun. Mulai jelajahi produk kami sekarang.'}</p>
            <Link href="/shop" className="inline-flex items-center gap-3 bg-[#bd8033] hover:bg-[#a66c28] text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-colors">
              {t('historyPage.startShopping') || 'Mulai Belanja'}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-[#c3c8c0]/30 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-[#c3c8c0]/20">
                  <div>
                    <p className="text-xs text-[#a5a49f] font-semibold uppercase tracking-wider mb-1">
                      {t('historyPage.columns.orderId') || 'ID Pesanan'}
                    </p>
                    <p className="text-[#18281a] font-mono font-medium">{order.id.split('-').pop().toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-[#a5a49f] font-semibold uppercase tracking-wider mb-1">
                        {t('historyPage.columns.date') || 'Tanggal'}
                      </p>
                      <p className="text-[#434842]">
                        {new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#f7f2ea] rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="material-symbols-outlined">image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-[#18281a] text-lg">{item.name}</h4>
                        <p className="text-sm text-[#434842]">{item.qty} x Rp {(item.price || 0).toLocaleString('id-ID')}</p>
                      </div>
                      <div className="text-right font-semibold text-[#18281a]">
                        Rp {((item.price || 0) * (item.qty || 1)).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-[#c3c8c0]/20 flex justify-between items-center">
                  <p className="text-sm text-[#434842] uppercase tracking-wider font-semibold">
                    {t('historyPage.columns.total') || 'Total Harga'}
                  </p>
                  <p className="font-serif text-2xl text-[#18281a]">
                    Rp {(order.total_price || 0).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <FooterSection />
    </div>
  );
}
