"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, role } = useAuth();
  const router = useRouter();

  const toggleCart = () => setIsCartOpen(prev => !prev);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      const qtyToAdd = product.quantity || 1;
      
      if (existing) {
        return prev.map(item => {
          if (item.id === product.id) {
            const newQty = item.qty + qtyToAdd;
            return { ...item, qty: product.stock ? Math.min(newQty, product.stock) : newQty };
          }
          return item;
        });
      }
      return [...prev, { ...product, qty: product.stock ? Math.min(qtyToAdd, product.stock) : qtyToAdd }];
    });
    openCart(); // Automatically open cart per user request
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: item.stock ? Math.min(newQty, item.stock) : newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = useMemo(() => cartItems.reduce((acc, item) => acc + item.qty, 0), [cartItems]);
  const subtotalPrice = useMemo(() => cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0), [cartItems]);
  
  const minOrder = useMemo(() => {
    switch (role) {
      case 'distributor': return 300;
      case 'agent': return 20;
      case 'reseller': return 3;
      default: return 1;
    }
  }, [role]);

  // Apply 10% discount if total items >= 10
  const discountPercentage = totalItems >= 10 ? 10 : 0;
  const discountAmount = Math.floor((subtotalPrice * discountPercentage) / 100);
  const totalPrice = subtotalPrice - discountAmount;

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      toggleCart,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      totalItems,
      subtotalPrice,
      discountAmount,
      totalPrice,
      minOrder,
      role
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
