"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';

export default function CartModal() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

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
            <h2 className="font-serif text-2xl text-[#18281a]">Your Ritual Bag</h2>
            <p className="text-xs font-sans text-[#434842] uppercase tracking-tighter mt-1">{cartItems.length} Items Selected</p>
          </div>
          <button onClick={closeCart} aria-label="Close cart" className="p-2 hover:bg-[#ebe8e4] transition-colors rounded-full">
            <span className="material-symbols-outlined text-[#434842]">close</span>
          </button>
        </div>
        
        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {cartItems.length === 0 ? (
            <p className="text-center text-[#434842] mt-10">Your ritual bag is empty.</p>
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
                      <p className="text-xs text-[#434842] font-sans">{item.desc || 'Standard Size'}</p>
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
                    <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-[#434842] hover:text-[#ba1a1a] transition-colors uppercase tracking-widest border-b border-transparent hover:border-[#ba1a1a]">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Suggested Addition (Micro-Interaction) */}
          <div className="mt-12 bg-[#f0ede9] p-6 border border-[#18281a]/5 rounded-lg">
            <p className="text-xs text-[#815513] uppercase tracking-widest mb-3 font-semibold">Complete the Ritual</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex-shrink-0 flex items-center justify-center border border-[#c3c8c0]/20">
                <img alt="Mini Mist" className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc0HOC06NVd2ZgM-Y-PPHfzf-owyI9CbAFuAidjFB_0r0AYnv9GUAteHjp3NRFn9_TUICxKg2TF-VQhwY0r3wVLi2FEdzyxmItDsDrjz1qUKTYebZszo9ZHcFHP-Bxa7JltTiA9gZCtDJEIif-_MO8_EvYitYRpuHhLOTTD9Y_dqp300Cj02pOOrpipN_XSulkhdPgX7Ga605NLEBvTpYutXswXY0PakATI_ikrfgQdh3IAKfe96adJm-GwcDwzX-jXpOl8i-kkVY"/>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#18281a]">Sample: Mineral Suncreen</p>
                <p className="text-xs text-[#434842]">+Rp 0 (Gift)</p>
              </div>
              <button className="text-sm font-semibold text-[#18281a] underline underline-offset-4 hover:text-[#815513] transition-colors">Add</button>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-[#ebe8e4] px-8 py-10 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-semibold text-[#434842]">
              <span>Subtotal</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#434842]">
              <span>Shipping</span>
              <span className="italic text-[#a5a49f]">Calculated at checkout</span>
            </div>
            <div className="pt-4 border-t border-[#c3c8c0]/30 flex justify-between items-center">
              <span className="font-serif text-2xl text-[#18281a]">Total</span>
              <span className="font-serif text-2xl text-[#18281a]">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <div className="space-y-4">
            <button className="w-full bg-[#18281a] text-white text-sm font-semibold py-5 tracking-widest uppercase hover:bg-[#18281a]/90 transition-all active:scale-[0.98] shadow-sm">
                Proceed to Checkout
            </button>
            <button onClick={closeCart} className="w-full text-center py-2 group">
              <span className="text-sm font-semibold text-[#434842] group-hover:text-[#815513] transition-colors inline-flex items-center gap-2 cursor-pointer">
                  Continue Shopping
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
