"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from './CartContext'
import { useLanguage } from '../context/LanguageContext'

import { allProducts } from '../data/products'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { t } = useLanguage()

  const badgeLabel = product.badge === 'BESTSELLER' || product.badge === 'Bestseller' 
    ? t('store.title_highlight') 
    : (product.badge === 'NEW ARRIVAL' || product.badge === 'New Arrival' ? 'New' : product.badge);

  return (
    <div className="group cursor-pointer flex flex-col">
      <Link href={`/product/${product.id}`} className="block relative bg-[#f0ede9] aspect-[4/5] overflow-hidden mb-4">
        {product.badge && (
          <span className={`absolute top-4 left-4 z-10 px-3 py-1 font-['Manrope'] text-[12px] uppercase tracking-[0.02em] font-medium ${product.badge === 'BESTSELLER' || product.badge === 'Bestseller' ? 'bg-[#18281a] text-white' : 'bg-[#fcf9f5] text-[#1c1c19]'}`}>
            {badgeLabel}
          </span>
        )}
        <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-[#18281a]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>favorite</span>
        </button>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </Link>
      <div className="flex justify-between items-start flex-1">
        <div className="flex-1">
          <Link href={`/product/${product.id}`} className="block group-hover:text-[#815513] transition-colors">
            <h3 className="font-['Playfair_Display'] text-[20px] text-inherit leading-[1.4]">{product.name}</h3>
          </Link>
          <p className="font-['Manrope'] text-[12px] text-[#434842] leading-[1.2] tracking-[0.02em] font-medium mt-1">{product.shortDesc}</p>
          <p className="mt-2 font-['Manrope'] text-[14px] text-[#18281a] leading-[1.2] tracking-[0.05em] font-semibold">Rp {product.price.toLocaleString('id-ID')}</p>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })}}
          className="bg-[#18281a] text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#815513] transition-colors flex-shrink-0 ml-4"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>add</span>
        </button>
      </div>
    </div>
  )
}

import { supabase } from '../lib/supabaseClient'

function StoreSection() {
  const { t } = useLanguage()
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*')
        if (error) throw error
        setProducts(data && data.length > 0 ? data : allProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setProducts(allProducts) // Fallback on error
      }
    }
    fetchProducts()
  }, [])

  const displayProducts = products.slice(0, 4)

  return (
    <section className="py-[80px] md:py-[120px] container">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-['Playfair_Display'] text-[36px] text-[#18281a] font-normal leading-[1.3]">
            {t('store.title_prefix')} <span className="italic text-[#815513]">{t('store.title_highlight')}</span> {t('store.title_suffix')}
          </h2>
        </div>
        <Link href="/shop" className="font-['Manrope'] text-[14px] font-semibold tracking-[0.05em] text-[#434842] border-b border-transparent hover:border-[#815513] transition-all flex items-center gap-1 group">
          {t('store.viewAll')}
          <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {displayProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default StoreSection
