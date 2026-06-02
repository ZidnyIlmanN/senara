"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '../../components/ui';
import { useCart } from '../../components/CartContext';

const allProducts = [
  {
    id: 'brightening-face-wash',
    name: 'Brightening Face Wash',
    desc: 'Gently removes impurities while brightening and evening out skin tone with pineapple enzyme.',
    price: 87000,
    image: '/images/Product/senara-facewash.png',
    badge: 'Bestseller',
    badgeStyle: 'bg-secondary text-white'
  },
  {
    id: 'ananas-glow-whitening-serum',
    name: 'Ananas Glow Whitening Serum',
    desc: 'Concentrated pineapple enzymes and Vitamin C to visibly brighten dark spots and uneven skin tone.',
    price: 127000,
    image: '/images/Product/senara-serum.png',
    badge: 'Bestseller',
    badgeStyle: 'bg-secondary text-white'
  },
  {
    id: 'glow-toner',
    name: 'Glow Toner',
    desc: 'A refreshing exfoliating toner with AHA and pineapple extract to refine pores and reveal radiance.',
    price: 87000,
    image: '/images/Product/senara-toner.png',
    badge: 'New Arrival',
    badgeStyle: 'bg-primary-container text-on-primary-container'
  },
  {
    id: 'lightening-day-cream',
    name: 'Lightening Day Cream',
    desc: 'Lightweight day moisturizer with SPF protection that brightens and shields skin from environmental damage.',
    price: 109000,
    image: '/images/Product/senara-daycream.png',
    badge: null,
    badgeStyle: ''
  },
  {
    id: 'luminous-night-cream',
    name: 'Luminous Night Cream',
    desc: 'Rich overnight treatment cream that deeply nourishes, repairs, and regenerates skin while you sleep.',
    price: 119000,
    image: '/images/Product/senara-nightcream.png',
    badge: 'New Arrival',
    badgeStyle: 'bg-primary-container text-on-primary-container'
  }
];

export default function ShopPage() {
  const { totalItems, openCart, addToCart } = useCart();
  const [openFilters, setOpenFilters] = useState({
    'filter-type': true,
    'filter-condition': true,
    'filter-ingredients': true
  });

  const toggleFilter = (id) => {
    setOpenFilters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased">
      
{/*  Top Navigation Bar  */}
<header className="bg-background/90 sticky top-0 z-50 backdrop-blur-sm border-b border-outline-variant/30">
<div className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-container-max mx-auto">
<div className="flex items-center gap-10">
<Link href="/">
  <img src="/images/senara-logo.png" alt="SENARA Logo" className="h-8 md:h-10 w-auto object-contain mix-blend-multiply" />
</Link>
<nav className="hidden md:flex gap-8 items-center">
<Link className="font-label-md text-label-md text-secondary border-b-2 border-secondary font-bold" href="#">Shop</Link>
<Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Philosophy</Link>
<Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Science</Link>
<Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">Stockists</Link>
</nav>
</div>
<div className="flex items-center gap-6">
<div className="relative hidden lg:block">
<input className="bg-surface-container-low border-none rounded-full px-6 py-2 text-label-md focus:ring-1 focus:ring-primary w-64" placeholder="Search rituals..." type="text"/>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
</div>
<button className="hover:text-secondary transition-all active:scale-95 duration-150 ease-in-out">
<Icon name="user" size={24} />
</button>
<button className="relative hover:text-secondary transition-all active:scale-95 duration-150 ease-in-out" onClick={openCart}>
<Icon name="bag" size={24} />
                                {totalItems > 0 && (
                                  <span className="absolute -top-1 -right-2 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {totalItems}
                                  </span>
                                )}
</button>
</div>
</div>
</header>
<main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg min-h-screen">
{/*  Breadcrumbs & Header  */}
<nav className="mb-10">
<ul className="flex items-center gap-2 font-label-sm text-label-sm text-outline">
<li><Link className="hover:text-primary" href="/">Home</Link></li>
<li className="flex items-center"><span className="material-symbols-outlined text-[14px]">chevron_right</span></li>
<li className="text-primary font-bold">Shop</li>
</ul>
<h1 className="font-headline-md text-headline-md mt-4">Botanical Collections</h1>
</nav>
<div className="flex flex-col lg:flex-row gap-gutter">
{/*  Sidebar Filters  */}
<aside className="w-full lg:w-64 flex-shrink-0">
<div className="sticky top-24 space-y-8">
{/*  Filter Section: Product Type  */}
<div className="border-b border-outline-variant pb-6">
<button className="flex justify-between items-center w-full group" onClick={() => toggleFilter('filter-type')}>
<span className="font-label-md text-label-md text-primary">Product Type</span>
<span className={`material-symbols-outlined transition-transform duration-300 ${openFilters['filter-type'] ? 'rotate-180' : ''}`}>expand_more</span>
</button>
<div className={`mt-4 space-y-3 filter-transition overflow-hidden ${openFilters['filter-type'] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary">Face Wash</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary">Serums</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary">Toners</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary">Moisturizers</span>
</label>
</div>
</div>
{/*  Filter Section: Skin Condition  */}
<div className="border-b border-outline-variant pb-6">
<button className="flex justify-between items-center w-full group" onClick={() => toggleFilter('filter-condition')}>
<span className="font-label-md text-label-md text-primary">Skin Condition</span>
<span className={`material-symbols-outlined transition-transform duration-300 ${openFilters['filter-condition'] ? 'rotate-180' : ''}`}>expand_more</span>
</button>
<div className={`mt-4 space-y-3 filter-transition overflow-hidden ${openFilters['filter-condition'] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary">Hyperpigmentation</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary">Dullness</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary">Sensitivity</span>
</label>
</div>
</div>
{/*  Filter Section: Main Ingredients  */}
<div className="border-b border-outline-variant pb-6">
<button className="flex justify-between items-center w-full group" onClick={() => toggleFilter('filter-ingredients')}>
<span className="font-label-md text-label-md text-primary">Main Ingredients</span>
<span className={`material-symbols-outlined transition-transform duration-300 ${openFilters['filter-ingredients'] ? 'rotate-180' : ''}`}>expand_more</span>
</button>
<div className={`mt-4 space-y-3 filter-transition overflow-hidden ${openFilters['filter-ingredients'] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
<label className="flex items-center gap-3 cursor-pointer group">
<input defaultChecked className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
<span className="font-body-md text-body-md text-primary">Pineapple Enzymes</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary">Niacinamide</span>
</label>
<label className="flex items-center gap-3 cursor-pointer group">
<input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary">Vitamin C</span>
</label>
</div>
</div>
</div>
</aside>
{/*  Product Canvas  */}
<div className="flex-1">
{/*  Sorting & View Controls  */}
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
<p className="font-label-sm text-label-sm text-outline">Showing {allProducts.length} products</p>
<div className="flex items-center gap-4">
<select className="bg-transparent border-none font-label-md text-label-md text-primary focus:ring-0 cursor-pointer">
<option>Sort by: Popularity</option>
<option>Price: Low to High</option>
<option>Price: High to Low</option>
<option>Newest Rituals</option>
</select>
<div className="h-4 w-[1px] bg-outline-variant"></div>
<div className="flex gap-2">
<button className="text-primary"><span className="material-symbols-outlined">grid_view</span></button>
<button className="text-outline hover:text-primary"><span className="material-symbols-outlined">view_agenda</span></button>
</div>
</div>
</div>
{/*  Product Grid  */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
{allProducts.map(product => (
<article key={product.id} className="group relative bg-surface-container-low border border-outline-variant/30 overflow-hidden">
{product.badge && (
<div className="absolute top-4 left-4 z-10">
<span className={`${product.badgeStyle} font-label-sm text-label-sm px-3 py-1 rounded-full`}>{product.badge}</span>
</div>
)}
<div className="aspect-[4/5] bg-white overflow-hidden p-8 flex items-center justify-center">
<img alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out" src={product.image}/>
</div>
<div className="p-6">
<div className="flex justify-between items-start mb-2">
<h3 className="font-headline-sm text-headline-sm text-primary">{product.name}</h3>
<button className="text-outline hover:text-error transition-colors"><span className="material-symbols-outlined">favorite</span></button>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2">{product.desc}</p>
<div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/20">
<span className="font-label-md text-label-md text-primary font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
<button onClick={() => addToCart({id: product.id, name: product.name, price: product.price, image: product.image})} className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 hover:bg-secondary transition-all active:scale-95 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                    Add
                                </button>
</div>
</div>
</article>
))}
</div>
</div>
</div>
</main>
{/*  Footer  */}
<footer className="bg-secondary text-on-secondary mt-section-gap">
<div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-stack-lg max-w-container-max mx-auto">
<div className="space-y-6">
<span className="font-headline-sm text-headline-sm text-on-secondary">SENARA</span>
<p className="font-body-md text-body-md text-on-secondary/80">Defining the future of luxury skincare through the lens of botanical molecular science.</p>
<div className="flex gap-4">
<Link className="hover:text-secondary-container transition-colors" href="#"><span className="material-symbols-outlined">public</span></Link>
<Link className="hover:text-secondary-container transition-colors" href="#"><span className="material-symbols-outlined">share</span></Link>
<Link className="hover:text-secondary-container transition-colors" href="#"><span className="material-symbols-outlined">mail</span></Link>
</div>
</div>
<div>
<h4 className="font-label-md text-label-md font-bold mb-6">Collections</h4>
<ul className="space-y-4 font-body-md text-body-md text-on-secondary/80">
<li><Link className="hover:text-secondary-container transition-colors" href="#">Face Wash</Link></li>
<li><Link className="hover:text-secondary-container transition-colors" href="#">Serums</Link></li>
<li><Link className="hover:text-secondary-container transition-colors" href="#">Toners</Link></li>
<li><Link className="hover:text-secondary-container transition-colors" href="#">Moisturizers</Link></li>
</ul>
</div>
<div>
<h4 className="font-label-md text-label-md font-bold mb-6">Support</h4>
<ul className="space-y-4 font-body-md text-body-md text-on-secondary/80">
<li><Link className="hover:text-secondary-container transition-colors" href="#">Shipping &amp; Returns</Link></li>
<li><Link className="hover:text-secondary-container transition-colors" href="#">Contact Us</Link></li>
<li><Link className="hover:text-secondary-container transition-colors" href="#">Skin Concierge</Link></li>
<li><Link className="hover:text-secondary-container transition-colors" href="#">Sustainability</Link></li>
</ul>
</div>
<div>
<h4 className="font-label-md text-label-md font-bold mb-6">Newsletter</h4>
<p className="font-body-md text-body-md text-on-secondary/80 mb-6">Join the SENARA circle for exclusive early access to new rituals.</p>
<div className="relative">
<input className="w-full bg-on-secondary/10 border-b border-on-secondary/30 text-on-secondary placeholder:text-on-secondary/50 focus:border-on-secondary focus:ring-0 py-2" placeholder="Your email" type="email"/>
<button className="absolute right-0 bottom-2 text-on-secondary hover:text-secondary-container"><span className="material-symbols-outlined">arrow_forward</span></button>
</div>
</div>
</div>
<div className="border-t border-on-secondary/10 px-margin-desktop py-8 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
<p className="font-label-sm text-label-sm text-on-secondary/60">© 2024 Senara Botanical Science. All rights reserved.</p>
<div className="flex gap-8 font-label-sm text-label-sm text-on-secondary/60">
<Link className="hover:text-on-secondary transition-colors" href="#">Privacy Policy</Link>
<Link className="hover:text-on-secondary transition-colors" href="#">Terms of Service</Link>
</div>
</div>
</footer>


    </div>
  );
}
