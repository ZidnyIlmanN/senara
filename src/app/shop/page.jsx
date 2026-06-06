"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icon } from '../../components/ui';
import { useCart } from '../../components/CartContext';
import { useLanguage } from '../../context/LanguageContext';

const allProducts = [
  {
    id: 'brightening-face-wash',
    name: 'Brightening Face Wash',
    desc: 'Gently removes impurities while brightening and evening out skin tone with pineapple enzyme.',
    price: 87000,
    image: '/images/Product/senara-facewash.webp',
    badge: 'Bestseller',
    badgeStyle: 'bg-secondary text-white',
    type: 'faceWash',
    conditions: ['hyperpigmentation', 'dullness'],
    ingredients: ['pineappleEnzymes', 'niacinamide'],
  },
  {
    id: 'ananas-glow-whitening-serum',
    name: 'Ananas Glow Whitening Serum',
    desc: 'Concentrated pineapple enzymes and Vitamin C to visibly brighten dark spots and uneven skin tone.',
    price: 127000,
    image: '/images/Product/senara-serum.webp',
    badge: 'Bestseller',
    badgeStyle: 'bg-secondary text-white',
    type: 'serums',
    conditions: ['hyperpigmentation', 'dullness'],
    ingredients: ['pineappleEnzymes', 'vitaminC'],
  },
  {
    id: 'glow-toner',
    name: 'Glow Toner',
    desc: 'A refreshing exfoliating toner with AHA and pineapple extract to refine pores and reveal radiance.',
    price: 87000,
    image: '/images/Product/senara-toner.webp',
    badge: 'New Arrival',
    badgeStyle: 'bg-primary-container text-on-primary-container',
    type: 'toners',
    conditions: ['dullness'],
    ingredients: ['pineappleEnzymes'],
  },
  {
    id: 'lightening-day-cream',
    name: 'Lightening Day Cream',
    desc: 'Lightweight day moisturizer with SPF protection that brightens and shields skin from environmental damage.',
    price: 109000,
    image: '/images/Product/senara-daycream.webp',
    badge: null,
    badgeStyle: '',
    type: 'moisturizers',
    conditions: ['hyperpigmentation', 'dullness'],
    ingredients: ['niacinamide', 'pineappleEnzymes'],
  },
  {
    id: 'luminous-night-cream',
    name: 'Luminous Night Cream',
    desc: 'Rich overnight treatment cream that deeply nourishes, repairs, and regenerates skin while you sleep.',
    price: 119000,
    image: '/images/Product/senara-nightcream.webp',
    badge: 'New Arrival',
    badgeStyle: 'bg-primary-container text-on-primary-container',
    type: 'moisturizers',
    conditions: ['dullness', 'sensitivity'],
    ingredients: ['pineappleEnzymes', 'niacinamide'],
  },
  {
    id: 'scamona',
    name: 'Scamona',
    desc: 'Salep untuk mengatasi scabies, ruam atau kemerahan pada kulit, alergi pada kulit dan kulit sensitif.',
    price: 65000,
    image: '/images/senara-scamona.webp',
    badge: 'Special',
    badgeStyle: 'bg-primary-container text-on-primary-container',
    type: 'treatment',
    conditions: ['sensitivity'],
    ingredients: [],
  }
];

export default function ShopPage() {
  const { totalItems, openCart, addToCart } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [openFilters, setOpenFilters] = useState({
    'filter-type': true,
    'filter-condition': true,
    'filter-ingredients': true
  });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');

  const toggleFilter = (id) => {
    setOpenFilters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCheckbox = (value, selected, setSelected) => {
    setSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (selectedTypes.length > 0) {
      result = result.filter(p => selectedTypes.includes(p.type));
    }
    if (selectedConditions.length > 0) {
      result = result.filter(p => p.conditions.some(c => selectedConditions.includes(c)));
    }
    if (selectedIngredients.length > 0) {
      result = result.filter(p => p.ingredients.some(i => selectedIngredients.includes(i)));
    }
    // Sorting
    if (sortBy === 'priceLow') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceHigh') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest') result.sort((a, b) => (b.badge === 'New Arrival' ? 1 : 0) - (a.badge === 'New Arrival' ? 1 : 0));
    return result;
  }, [selectedTypes, selectedConditions, selectedIngredients, sortBy]);

  const typeOptions = [
    { value: 'faceWash', label: t('shop.filters.faceWash') },
    { value: 'serums', label: t('shop.filters.serums') },
    { value: 'toners', label: t('shop.filters.toners') },
    { value: 'moisturizers', label: t('shop.filters.moisturizers') },
  ];
  const conditionOptions = [
    { value: 'hyperpigmentation', label: t('shop.filters.hyperpigmentation') },
    { value: 'dullness', label: t('shop.filters.dullness') },
    { value: 'sensitivity', label: t('shop.filters.sensitivity') },
  ];
  const ingredientOptions = [
    { value: 'pineappleEnzymes', label: t('shop.filters.pineappleEnzymes') },
    { value: 'niacinamide', label: 'Niacinamide' },
    { value: 'vitaminC', label: 'Vitamin C' },
  ];

  const hasActiveFilters = selectedTypes.length > 0 || selectedConditions.length > 0 || selectedIngredients.length > 0;

  return (
    <div className="bg-background text-on-background font-body-md antialiased">
      <header className="bg-background/90 sticky top-0 z-50 backdrop-blur-sm border-b border-outline-variant/30">
        <div className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-container-max mx-auto">
          <div className="flex items-center gap-10">
            <Link href="/">
              <img src="/images/senara-logo.png" alt="SENARA Logo" className="h-8 md:h-10 w-auto object-contain mix-blend-multiply" />
            </Link>
            <nav className="hidden md:flex gap-8 items-center">
              <Link className="font-label-md text-label-md text-secondary border-b-2 border-secondary font-bold" href="#">{t('shop.navShop')}</Link>
              <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">{t('shop.navPhilosophy')}</Link>
              <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">{t('shop.navScience')}</Link>
              <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="#">{t('shop.navStockists')}</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-0.5 bg-surface-container-low rounded-full p-[3px] border border-outline-variant/30">
              <button onClick={() => setLanguage('id')} className={`px-2.5 py-1 rounded-full text-[11px] font-['Manrope'] font-bold tracking-wider transition-all duration-300 ${language === 'id' ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface-variant hover:text-secondary'}`}>ID</button>
              <button onClick={() => setLanguage('en')} className={`px-2.5 py-1 rounded-full text-[11px] font-['Manrope'] font-bold tracking-wider transition-all duration-300 ${language === 'en' ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface-variant hover:text-secondary'}`}>EN</button>
            </div>
            <button className="hover:text-secondary transition-all active:scale-95 duration-150 ease-in-out"><Icon name="user" size={24} /></button>
            <button className="relative hover:text-secondary transition-all active:scale-95 duration-150 ease-in-out" onClick={openCart}>
              <Icon name="bag" size={24} />
              {totalItems > 0 && (<span className="absolute -top-1 -right-2 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{totalItems}</span>)}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg min-h-screen">
        <nav className="mb-10">
          <ul className="flex items-center gap-2 font-label-sm text-label-sm text-outline">
            <li><Link className="hover:text-primary" href="/">{t('shop.breadcrumbHome')}</Link></li>
            <li className="flex items-center"><span className="material-symbols-outlined text-[14px]">chevron_right</span></li>
            <li className="text-primary font-bold">{t('shop.breadcrumbShop')}</li>
          </ul>
          <h1 className="font-headline-md text-headline-md mt-4">{t('shop.headline')}</h1>
        </nav>
        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Reset Filters */}
              {hasActiveFilters && (
                <button onClick={() => { setSelectedTypes([]); setSelectedConditions([]); setSelectedIngredients([]); }} className="text-secondary font-label-sm text-label-sm underline mb-2">
                  {language === 'id' ? 'Reset Filter' : 'Reset Filters'}
                </button>
              )}
              {/* Product Type */}
              <div className="border-b border-outline-variant pb-6">
                <button className="flex justify-between items-center w-full group" onClick={() => toggleFilter('filter-type')}>
                  <span className="font-label-md text-label-md text-primary">{t('shop.filters.productType')}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${openFilters['filter-type'] ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                <div className={`mt-4 space-y-3 filter-transition overflow-hidden ${openFilters['filter-type'] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {typeOptions.map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                      <input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox" checked={selectedTypes.includes(opt.value)} onChange={() => toggleCheckbox(opt.value, selectedTypes, setSelectedTypes)} />
                      <span className={`font-body-md text-body-md group-hover:text-primary ${selectedTypes.includes(opt.value) ? 'text-primary' : 'text-on-surface-variant'}`}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Skin Condition */}
              <div className="border-b border-outline-variant pb-6">
                <button className="flex justify-between items-center w-full group" onClick={() => toggleFilter('filter-condition')}>
                  <span className="font-label-md text-label-md text-primary">{t('shop.filters.skinCondition')}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${openFilters['filter-condition'] ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                <div className={`mt-4 space-y-3 filter-transition overflow-hidden ${openFilters['filter-condition'] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {conditionOptions.map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                      <input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox" checked={selectedConditions.includes(opt.value)} onChange={() => toggleCheckbox(opt.value, selectedConditions, setSelectedConditions)} />
                      <span className={`font-body-md text-body-md group-hover:text-primary ${selectedConditions.includes(opt.value) ? 'text-primary' : 'text-on-surface-variant'}`}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Main Ingredients */}
              <div className="border-b border-outline-variant pb-6">
                <button className="flex justify-between items-center w-full group" onClick={() => toggleFilter('filter-ingredients')}>
                  <span className="font-label-md text-label-md text-primary">{t('shop.filters.mainIngredients')}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${openFilters['filter-ingredients'] ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                <div className={`mt-4 space-y-3 filter-transition overflow-hidden ${openFilters['filter-ingredients'] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {ingredientOptions.map(opt => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                      <input className="rounded-sm border-outline text-primary focus:ring-primary h-4 w-4" type="checkbox" checked={selectedIngredients.includes(opt.value)} onChange={() => toggleCheckbox(opt.value, selectedIngredients, setSelectedIngredients)} />
                      <span className={`font-body-md text-body-md group-hover:text-primary ${selectedIngredients.includes(opt.value) ? 'text-primary' : 'text-on-surface-variant'}`}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          {/* Product Canvas */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <p className="font-label-sm text-label-sm text-outline">{t('shop.showing')} {filteredProducts.length} {t('shop.products')}</p>
              <div className="flex items-center gap-4">
                <select className="bg-transparent border-none font-label-md text-label-md text-primary focus:ring-0 cursor-pointer" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="popularity">{t('shop.sortPopularity')}</option>
                  <option value="priceLow">{t('shop.sortPriceLow')}</option>
                  <option value="priceHigh">{t('shop.sortPriceHigh')}</option>
                  <option value="newest">{t('shop.sortNewest')}</option>
                </select>
                <div className="h-4 w-[1px] bg-outline-variant"></div>
                <div className="flex gap-2">
                  <button className="text-primary"><span className="material-symbols-outlined">grid_view</span></button>
                  <button className="text-outline hover:text-primary"><span className="material-symbols-outlined">view_agenda</span></button>
                </div>
              </div>
            </div>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <span className="material-symbols-outlined text-[56px] text-outline/40 block mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>filter_alt_off</span>
                  <p className="font-body-lg text-body-lg text-outline">{language === 'id' ? 'Tidak ada produk yang cocok dengan filter' : 'No products match your filters'}</p>
                  <button onClick={() => { setSelectedTypes([]); setSelectedConditions([]); setSelectedIngredients([]); }} className="mt-4 font-label-md text-label-md text-secondary underline">{language === 'id' ? 'Reset Filter' : 'Reset Filters'}</button>
                </div>
              ) : (
                filteredProducts.map(product => {
                  const badgeLabel = product.badge === 'Bestseller' ? t('store.title_highlight') : (product.badge === 'New Arrival' ? 'New' : product.badge);
                  return (
                    <article key={product.id} className="group relative bg-surface-container-low border border-outline-variant/30 overflow-hidden">
                      {product.badge && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className={`${product.badgeStyle} font-label-sm text-label-sm px-3 py-1 rounded-full uppercase`}>{badgeLabel}</span>
                        </div>
                      )}
                      <div className="aspect-[4/5] bg-white overflow-hidden p-8 flex items-center justify-center">
                        <img alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out" src={product.image} />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-headline-sm text-headline-sm text-primary">{product.name}</h3>
                          <button className="text-outline hover:text-error transition-colors"><span className="material-symbols-outlined">favorite</span></button>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2">{t(`featured.products.${product.id}.description`) || product.desc}</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/20">
                          <span className="font-label-md text-label-md text-primary font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
                          <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })} className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 hover:bg-secondary transition-all active:scale-95 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                            {t('shop.addBtn')}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-secondary text-on-secondary mt-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-stack-lg max-w-container-max mx-auto">
          <div className="space-y-6">
            <span className="font-headline-sm text-headline-sm text-on-secondary">SENARA</span>
            <p className="font-body-md text-body-md text-on-secondary/80">{t('shop.footer.tagline')}</p>
            <div className="flex gap-4">
              <Link className="hover:text-secondary-container transition-colors" href="#"><span className="material-symbols-outlined">public</span></Link>
              <Link className="hover:text-secondary-container transition-colors" href="#"><span className="material-symbols-outlined">share</span></Link>
              <Link className="hover:text-secondary-container transition-colors" href="#"><span className="material-symbols-outlined">mail</span></Link>
            </div>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold mb-6">{t('shop.footer.collections')}</h4>
            <ul className="space-y-4 font-body-md text-body-md text-on-secondary/80">
              <li><Link className="hover:text-secondary-container transition-colors" href="#">{t('shop.filters.faceWash')}</Link></li>
              <li><Link className="hover:text-secondary-container transition-colors" href="#">{t('shop.filters.serums')}</Link></li>
              <li><Link className="hover:text-secondary-container transition-colors" href="#">{t('shop.filters.toners')}</Link></li>
              <li><Link className="hover:text-secondary-container transition-colors" href="#">{t('shop.filters.moisturizers')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold mb-6">{t('shop.footer.support')}</h4>
            <ul className="space-y-4 font-body-md text-body-md text-on-secondary/80">
              <li><Link className="hover:text-secondary-container transition-colors" href="#">{t('shop.footer.shippingReturns')}</Link></li>
              <li><Link className="hover:text-secondary-container transition-colors" href="#">{t('shop.footer.contactUs')}</Link></li>
              <li><Link className="hover:text-secondary-container transition-colors" href="#">{t('shop.footer.skinConcierge')}</Link></li>
              <li><Link className="hover:text-secondary-container transition-colors" href="#">{t('shop.footer.sustainability')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold mb-6">{t('shop.footer.newsletter')}</h4>
            <p className="font-body-md text-body-md text-on-secondary/80 mb-6">{t('shop.footer.newsletterDesc')}</p>
            <div className="relative">
              <input className="w-full bg-on-secondary/10 border-b border-on-secondary/30 text-on-secondary placeholder:text-on-secondary/50 focus:border-on-secondary focus:ring-0 py-2" placeholder={t('shop.footer.emailPlaceholder')} type="email" />
              <button className="absolute right-0 bottom-2 text-on-secondary hover:text-secondary-container"><span className="material-symbols-outlined">arrow_forward</span></button>
            </div>
          </div>
        </div>
        <div className="border-t border-on-secondary/10 px-margin-desktop py-8 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label-sm text-label-sm text-on-secondary/60">{t('shop.footer.copyright')}</p>
          <div className="flex gap-8 font-label-sm text-label-sm text-on-secondary/60">
            <Link className="hover:text-on-secondary transition-colors" href="#">{t('shop.footer.privacyPolicy')}</Link>
            <Link className="hover:text-on-secondary transition-colors" href="#">{t('shop.footer.termsOfService')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
