"use client";

import React from 'react'
import Link from 'next/link'
import { useCart } from './CartContext'

const products = [
  {
    id: 'brightening-face-wash',
    badge: 'NEW ARRIVAL',
    name: 'Brightening Face Wash',
    desc: 'Pineapple Enzyme Cleanser',
    price: 87000,
    image: '/images/Product/senara-facewash.png'
  },
  {
    id: 'ananas-glow-whitening-serum',
    badge: 'BESTSELLER',
    name: 'Ananas Glow Serum',
    desc: 'Whitening + Vitamin C Booster',
    price: 127000,
    image: '/images/Product/senara-serum.png'
  },
  {
    id: 'glow-toner',
    badge: 'NEW ARRIVAL',
    name: 'Glow Toner',
    desc: 'AHA + Pineapple Exfoliant',
    price: 87000,
    image: '/images/Product/senara-toner.png'
  },
  {
    id: 'lightening-day-cream',
    badge: 'BESTSELLER',
    name: 'Lightening Day Cream',
    desc: 'SPF Brightening Moisturizer',
    price: 109000,
    image: '/images/Product/senara-daycream.png'
  }
]

function ProductCard({ product }) {
  const { addToCart } = useCart()
  return (
    <div className="group cursor-pointer">
      <div className="relative bg-[#f0ede9] aspect-[4/5] overflow-hidden mb-4">
        {product.badge && (
          <span className={`absolute top-4 left-4 z-10 px-3 py-1 font-['Manrope'] text-[12px] uppercase tracking-[0.02em] font-medium ${product.badge === 'BESTSELLER' ? 'bg-[#18281a] text-white' : 'bg-[#fcf9f5] text-[#1c1c19]'}`}>
            {product.badge}
          </span>
        )}
        <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-[#18281a]" style={{fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24"}}>favorite</span>
        </button>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-['Playfair_Display'] text-[20px] text-[#18281a] leading-[1.4]">{product.name}</h3>
          <p className="font-['Manrope'] text-[12px] text-[#434842] leading-[1.2] tracking-[0.02em] font-medium">{product.desc}</p>
          <p className="mt-2 font-['Manrope'] text-[14px] text-[#18281a] leading-[1.2] tracking-[0.05em] font-semibold">Rp {product.price.toLocaleString('id-ID')}</p>
        </div>
        <button 
          onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })}
          className="bg-[#18281a] text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#815513] transition-colors flex-shrink-0"
        >
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24"}}>add</span>
        </button>
      </div>
    </div>
  )
}

function StoreSection() {
  return (
    <section className="py-[80px] md:py-[120px] container">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-['Playfair_Display'] text-[36px] text-[#18281a] font-normal leading-[1.3]">
            Our <span className="italic text-[#815513]">Best</span> Sellers
          </h2>
        </div>
        <Link href="/shop" className="font-['Manrope'] text-[14px] font-semibold tracking-[0.05em] text-[#434842] border-b border-transparent hover:border-[#815513] transition-all flex items-center gap-1 group">
          View All Products
          <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default StoreSection
