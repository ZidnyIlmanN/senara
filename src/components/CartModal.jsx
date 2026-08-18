"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';

export default function CartModal() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, subtotalPrice, discountAmount, totalPrice, minOrder, role, totalItems } = useCart();
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  const isCheckoutDisabled = cartItems.length === 0 || totalItems < minOrder;

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (isCheckoutDisabled || isProcessing) return;
    setIsProcessing(true);

    try {
      const customerName = userProfile?.full_name || 'Customer';
      const customerRole = role !== 'customer' ? `(${role.toUpperCase()})` : '';
      const customerAddress = userProfile?.address ? `\nAlamat: ${userProfile.address}, ${userProfile.city}, ${userProfile.province}` : '';
      const storeInfo = userProfile?.store_name ? `\nToko: ${userProfile.store_name}` : '';

      // Hitung total paket
      const packageAmount = cartItems.reduce((total, item) => total + item.qty, 0);

      // Simpan ke database jika user sudah login
      if (userProfile?.id) {
        const { error } = await supabase
          .from('orders')
          .insert([
            {
              user_id: userProfile.id,
              package_amount: packageAmount,
              total_price: totalPrice,
              status: 'pending',
              items: cartItems,
            }
          ]);
        
        if (error) {
          console.error("Gagal menyimpan pesanan:", error);
          // Tetap lanjutkan ke WA meskipun gagal simpan DB agar user tidak terblokir
        }
      }

      let message = `Halo SENARA, saya *${customerName}* ${customerRole} ingin melakukan pemesanan untuk produk berikut:\n\n`;
      cartItems.forEach(item => {
        message += `- ${item.name} (x${item.qty})\n`;
      });
      message += `\nTotal Pesanan: *Rp ${totalPrice.toLocaleString('id-ID')}*`;
      message += `\n${storeInfo}${customerAddress}`;
      message += `\n\nMohon informasi selanjutnya untuk proses pembayaran dan pengiriman. Terima kasih.`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/6281318141050?text=${encodedMessage}`, '_blank');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#18281a]/20 backdrop-blur-sm cursor-pointer transition-opacity"
        onClick={closeCart}
      />
      {/* Drawer Container */}
      <aside className={`relative w-full max-w-md h-full bg-[#f6f3ef] shadow-2xl flex flex-col transform transition-transform duration-500 ease-out translate-x-0`}>
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-8 border-b border-[#c3c8c0]/20">
          <div>
            <h2 className="font-serif text-2xl text-[#18281a]">{t('cart.title')}</h2>
            <p className="text-xs font-sans text-[#434842] uppercase tracking-tighter mt-1">{cartItems.length} {t('cart.itemsSelected')}</p>
          </div>
          <button onClick={closeCart} aria-label="Close cart" className="p-2 hover:bg-[#ebe8e4] transition-colors rounded-full">
            <span className="material-symbols-outlined text-[#434842]">close</span>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {cartItems.length === 0 ? (
            <p className="text-center text-[#434842] mt-10">{t('cart.empty')}</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-6 group">
                <div className="w-28 h-36 bg-white overflow-hidden flex-shrink-0 border border-[#c3c8c0]/10">
                  <img alt={item.name} className="w-full h-full object-cover mix-blend-multiply scale-110" src={item.image} />
                </div>
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-[18px] text-[#18281a] mb-1">{item.name}</h3>
                      <p className="text-xs text-[#434842] font-sans">{item.desc || t('cart.standardSize')}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#18281a]">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#c3c8c0]/40 rounded-full h-9 px-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:text-[#815513] transition-colors"><span className="material-symbols-outlined text-[18px]">remove</span></button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:text-[#815513] transition-colors"><span className="material-symbols-outlined text-[18px]">add</span></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-[#434842] hover:text-[#ba1a1a] transition-colors uppercase tracking-widest border-b border-transparent hover:border-[#ba1a1a]">{t('cart.remove')}</button>
                  </div>
                </div>
              </div>
            ))
          )}


        </div>

        {/* Summary Section */}
        <div className="bg-[#ebe8e4] px-8 py-10 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-semibold text-[#434842]">
              <span>{t('cart.subtotal')}</span>
              <span>Rp {subtotalPrice?.toLocaleString('id-ID')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm font-semibold text-[#18281a]">
                <span>Diskon Spesial (10%)</span>
                <span>- Rp {discountAmount?.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold text-[#434842]">
              <span>{t('cart.shipping')}</span>
              <span className="italic text-[#a5a49f]">{t('cart.shippingCalc')}</span>
            </div>
            <div className="pt-4 border-t border-[#c3c8c0]/30 flex justify-between items-center">
              <span className="font-serif text-2xl text-[#18281a]">{t('cart.total')}</span>
              <span className="font-serif text-2xl text-[#18281a]">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          {totalItems > 0 && totalItems < minOrder && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-xs font-semibold text-center">
              Minimum pembelian untuk {role === 'distributor' ? 'Distributor' : role === 'agent' ? 'Agen' : 'Reseller'} adalah {minOrder} paket/produk.
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={handleCheckout} 
              disabled={isCheckoutDisabled || isProcessing}
              className={`w-full text-white text-sm font-semibold py-5 tracking-widest uppercase transition-all shadow-sm ${isCheckoutDisabled || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#18281a] hover:bg-[#18281a]/90 active:scale-[0.98]'}`}
            >
              {isProcessing ? 'Memproses...' : t('cart.checkout')}
            </button>
            <button onClick={closeCart} className="w-full text-center py-2 group">
              <span className="text-sm font-semibold text-[#434842] group-hover:text-[#815513] transition-colors inline-flex items-center gap-2 cursor-pointer">
                {t('cart.continueShopping')}
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            </button>
          </div>
          {/* Payment Trust Symbols */}
          <div className="flex justify-center gap-6 opacity-40 grayscale pt-2">
            <span className="material-symbols-outlined">payments</span>
            <span className="material-symbols-outlined">credit_card</span>
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
