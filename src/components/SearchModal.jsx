"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

const allProducts = [
  {
    id: 'brightening-face-wash',
    name: 'Brightening Face Wash',
    subtitle: 'Pineapple Extract + AHA',
    price: 87000,
    image: '/images/Product/senara-facewash.webp',
    badge: 'Best Seller',
    badgeType: 'bestseller',
    category: 'cleanser',
    keywords: ['face wash', 'cleanser', 'brightening', 'enzyme', 'nanas', 'cuci muka', 'pembersih'],
  },
  {
    id: 'ananas-glow-whitening-serum',
    name: 'Ananas Glow Whitening Serum',
    subtitle: 'Vitamin C + Bromelain',
    price: 127000,
    image: '/images/Product/senara-serum.webp',
    badge: 'Best Seller',
    badgeType: 'bestseller',
    category: 'serum',
    keywords: ['serum', 'whitening', 'brightening', 'glow', 'vitamin c', 'pencerah'],
  },
  {
    id: 'glow-toner',
    name: 'Glow Toner',
    subtitle: 'AHA + Pineapple Extract',
    price: 87000,
    image: '/images/Product/senara-toner.webp',
    badge: 'New',
    badgeType: 'new',
    category: 'toner',
    keywords: ['toner', 'glow', 'aha', 'exfoliating', 'pori', 'pores'],
  },
  {
    id: 'lightening-day-cream',
    name: 'Lightening Day Cream',
    subtitle: 'SPF Protection + Niacinamide',
    price: 109000,
    image: '/images/Product/senara-daycream.webp',
    badge: null,
    badgeType: null,
    category: 'moisturizer',
    keywords: ['day cream', 'krim siang', 'spf', 'moisturizer', 'pelembab', 'lightening'],
  },
  {
    id: 'luminous-night-cream',
    name: 'Luminous Night Cream',
    subtitle: 'Botanical Repair Complex',
    price: 119000,
    image: '/images/Product/senara-nightcream.webp',
    badge: 'New',
    badgeType: 'new',
    category: 'moisturizer',
    keywords: ['night cream', 'krim malam', 'repair', 'regenerate', 'moisturizer', 'pelembab'],
  },
  {
    id: 'scamona',
    name: 'Scamona',
    subtitle: 'Moringa + Nigella Sativa',
    price: 65000,
    image: '/images/senara-scamona.webp',
    badge: 'Special',
    badgeType: 'special',
    category: 'treatment',
    keywords: ['scamona', 'salep', 'ointment', 'scabies', 'alergi', 'ruam', 'kulit sensitif'],
  },
];

function formatPrice(price) {
  return `Rp ${price.toLocaleString('id-ID')}`;
}

export default function SearchModal({ isOpen, onClose }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Filter products based on search query
  const filteredProducts = query.trim()
    ? allProducts.filter(p => {
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.keywords.some(k => k.includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    })
    : allProducts;

  // Open animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setQuery('');
      setActiveTab('products');
    }, 300);
  }, [onClose]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  // Collections and ingredients data for tab counts
  const collectionsData = [
    { id: 'skincare', name: language === 'id' ? 'Perawatan Kulit' : 'Skincare' },
    { id: 'brightening', name: language === 'id' ? 'Pencerah Kulit' : 'Brightening' },
    { id: 'treatment', name: language === 'id' ? 'Perawatan Khusus' : 'Special Treatment' },
  ];
  const ingredientsData = [
    { id: 'bromelain', name: 'Bromelain', desc: language === 'id' ? 'Ekstrak nanas alami' : 'Natural pineapple extract' },
    { id: 'niacinamide', name: 'Niacinamide', desc: language === 'id' ? 'Vitamin B3' : 'Vitamin B3' },
    { id: 'vitaminc', name: 'Vitamin C', desc: 'Vitamin C' },
    { id: 'aha', name: 'AHA', desc: 'AHA' },
    { id: 'centella', name: 'Centella Asiatica', desc: 'Centella' },
    { id: 'moringa', name: 'Moringa Oleifera', desc: 'Moringa' },
    { id: 'nigella', name: 'Nigella Sativa', desc: 'Nigella' },
    { id: 'glycyrrhiza', name: 'Glycyrrhiza Glabra', desc: 'Glycyrrhiza' },
  ];
  const filteredCollCount = query.trim() ? collectionsData.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).length : collectionsData.length;
  const filteredIngCount = query.trim() ? ingredientsData.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.desc.toLowerCase().includes(query.toLowerCase())).length : ingredientsData.length;

  const tabs = [
    { id: 'products', label: language === 'id' ? `Produk (${filteredProducts.length})` : `Products (${filteredProducts.length})` },
    { id: 'collections', label: language === 'id' ? `Koleksi (${filteredCollCount})` : `Collections (${filteredCollCount})` },
    { id: 'ingredients', label: language === 'id' ? `Bahan (${filteredIngCount})` : `Ingredients (${filteredIngCount})` },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 md:px-0">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-400 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(28, 28, 25, 0.4)' }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-[640px] bg-[#f6f3ef] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] md:max-h-[75vh] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-[0.98]'}`}
        style={{ borderRadius: '12px' }}
      >
        {/* Search Header */}
        <div className="p-6 md:p-8 border-b border-[#c3c8c0]/30">
          {/* Input Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 flex items-center gap-4">
              <span className="material-symbols-outlined text-[#747872]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>search</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === 'id' ? 'Cari produk, bahan...' : 'Search products, ingredients...'}
                className="w-full bg-transparent border-none outline-none font-['Playfair_Display'] text-[22px] md:text-[24px] text-[#18281a] placeholder:text-[#747872]/50 p-0 focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-3 ml-4">
              {query && (
                <button
                  onClick={handleClear}
                  className="font-['Manrope'] text-[14px] font-semibold text-[#747872] hover:text-[#18281a] transition-colors"
                >
                  {language === 'id' ? 'Hapus' : 'Clear'}
                </button>
              )}
              <button
                onClick={handleClose}
                className="material-symbols-outlined text-[#18281a] p-1 hover:bg-[#e5e2de] rounded-full transition-colors"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
              >
                close
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-['Manrope'] text-[14px] font-semibold pb-2 transition-colors duration-300 ${activeTab === tab.id
                    ? 'text-[#18281a] border-b-2 border-[#18281a]'
                    : 'text-[#747872] hover:text-[#18281a]'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.search-results::-webkit-scrollbar { display: none; }`}</style>

          {activeTab === 'products' && (
            <>
              <h3 className="font-['Manrope'] text-[12px] font-medium text-[#747872] uppercase tracking-[0.12em] mb-6">
                {query ? (language === 'id' ? 'Hasil Pencarian' : 'Top Matches') : (language === 'id' ? 'Semua Produk' : 'All Products')}
              </h3>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-[48px] text-[#c3c8c0] mb-4 block" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>search_off</span>
                  <p className="font-['Manrope'] text-[16px] text-[#747872]">
                    {language === 'id' ? 'Tidak ada produk yang ditemukan' : 'No products found'}
                  </p>
                  <p className="font-['Manrope'] text-[14px] text-[#747872]/60 mt-2">
                    {language === 'id' ? 'Coba kata kunci lain' : 'Try a different keyword'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product, idx) => (
                    <React.Fragment key={product.id}>
                      <Link
                        href={`/shop`}
                        onClick={handleClose}
                        className="flex items-center gap-5 group cursor-pointer"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg flex items-center justify-center p-2 group-hover:scale-[1.02] transition-transform duration-300 shrink-0 overflow-hidden">
                          <img
                            className="w-full h-full object-cover rounded"
                            alt={product.name}
                            src={product.image}
                          />
                        </div>
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-['Playfair_Display'] text-[18px] md:text-[20px] text-[#18281a] group-hover:text-[#815513] transition-colors truncate">
                            {product.name}
                          </h4>
                          <p className="font-['Manrope'] text-[14px] md:text-[16px] text-[#434842] mt-0.5">
                            {product.subtitle}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="font-['Manrope'] text-[14px] font-semibold text-[#18281a]">
                              {formatPrice(product.price)}
                            </span>
                            {product.badge && (
                              <span className={`px-2 py-0.5 text-[11px] font-['Manrope'] font-semibold rounded-full ${product.badgeType === 'bestseller'
                                  ? 'bg-[#fdc175] text-[#653e00]'
                                  : product.badgeType === 'new'
                                    ? 'bg-[#d4e8d3] text-[#3a4b3b]'
                                    : 'bg-[#e5e2dd] text-[#474743]'
                                }`}>
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Arrow */}
                        <span className="material-symbols-outlined text-[#747872] group-hover:translate-x-1 transition-transform shrink-0" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
                          arrow_forward
                        </span>
                      </Link>
                      {idx < filteredProducts.length - 1 && (
                        <hr className="border-[#c3c8c0]/20" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Footer Link */}
              {filteredProducts.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#c3c8c0]/20 text-center">
                  <Link
                    href="/shop"
                    onClick={handleClose}
                    className="font-['Manrope'] text-[14px] font-semibold text-[#815513] border-b border-[#815513]/30 pb-0.5 hover:border-[#815513] transition-all"
                  >
                    {language === 'id' ? `Lihat Semua ${filteredProducts.length} Produk` : `View All ${filteredProducts.length} Results`}
                  </Link>
                </div>
              )}
            </>
          )}

          {activeTab === 'collections' && (() => {
            const collections = [
              { id: 'skincare', name: language === 'id' ? 'Perawatan Kulit' : 'Skincare', icon: 'spa', count: 5, desc: language === 'id' ? 'Rangkaian lengkap kosmetik bahan alam berbasis ekstrak nanas' : 'Complete natural cosmetics pineapple extract-based facial care range' },
              { id: 'brightening', name: language === 'id' ? 'Pencerah Kulit' : 'Brightening', icon: 'light_mode', count: 3, desc: language === 'id' ? 'Koleksi untuk mencerahkan dan meratakan warna kulit' : 'Collection to brighten and even out skin tone' },
              { id: 'treatment', name: language === 'id' ? 'Perawatan Khusus' : 'Special Treatment', icon: 'healing', count: 1, desc: language === 'id' ? 'Produk obat dan perawatan intensif' : 'Medicinal products and intensive care' },
            ];
            const filtered = query.trim() ? collections.filter(c => c.name.toLowerCase().includes(query.toLowerCase())) : collections;
            return (
              <>
                <h3 className="font-['Manrope'] text-[12px] font-medium text-[#747872] uppercase tracking-[0.12em] mb-6">
                  {language === 'id' ? 'Koleksi Produk' : 'Product Collections'}
                </h3>
                {filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-[48px] text-[#c3c8c0] mb-4 block" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>search_off</span>
                    <p className="font-['Manrope'] text-[16px] text-[#747872]">{language === 'id' ? 'Koleksi tidak ditemukan' : 'No collections found'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map(col => (
                      <Link key={col.id} href="/shop" onClick={handleClose} className="flex items-center gap-5 group cursor-pointer p-3 rounded-lg hover:bg-white/60 transition-colors">
                        <div className="w-14 h-14 bg-[#d4e8d3] rounded-lg flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[#3a4b3b] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>{col.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-['Playfair_Display'] text-[18px] text-[#18281a] group-hover:text-[#815513] transition-colors">{col.name}</h4>
                          <p className="font-['Manrope'] text-[13px] text-[#747872] mt-0.5">{col.desc}</p>
                          <span className="font-['Manrope'] text-[12px] font-semibold text-[#815513] mt-1 inline-block">{col.count} {language === 'id' ? 'produk' : 'products'}</span>
                        </div>
                        <span className="material-symbols-outlined text-[#747872] group-hover:translate-x-1 transition-transform shrink-0" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>arrow_forward</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            );
          })()}

          {activeTab === 'ingredients' && (() => {
            const ingredientsList = [
              { id: 'bromelain', name: 'Bromelain', desc: language === 'id' ? 'Ekstrak nanas alami untuk eksfoliasi lembut' : 'Natural pineapple extract for gentle exfoliation', products: 5 },
              { id: 'niacinamide', name: 'Niacinamide', desc: language === 'id' ? 'Vitamin B3 untuk mencerahkan dan memperkuat skin barrier' : 'Vitamin B3 to brighten and strengthen skin barrier', products: 4 },
              { id: 'vitaminc', name: 'Vitamin C', desc: language === 'id' ? 'Antioksidan kuat untuk melawan radikal bebas dan mencerahkan' : 'Powerful antioxidant to fight free radicals and brighten skin', products: 2 },
              { id: 'aha', name: 'AHA (Alpha Hydroxy Acid)', desc: language === 'id' ? 'Eksfolian kimia untuk mengangkat sel kulit mati' : 'Chemical exfoliant to remove dead skin cells', products: 2 },
              { id: 'centella', name: 'Centella Asiatica', desc: language === 'id' ? 'Ekstrak herbal untuk menenangkan dan memperbaiki kulit' : 'Herbal extract to soothe and repair skin', products: 3 },
              { id: 'moringa', name: 'Moringa Oleifera', desc: language === 'id' ? 'Superfood kaya antioksidan untuk nutrisi kulit' : 'Antioxidant-rich superfood for skin nutrition', products: 1 },
              { id: 'nigella', name: 'Nigella Sativa', desc: language === 'id' ? 'Minyak jintan hitam untuk anti-inflamasi alami' : 'Black seed oil for natural anti-inflammatory', products: 1 },
              { id: 'glycyrrhiza', name: 'Glycyrrhiza Glabra', desc: language === 'id' ? 'Ekstrak akar manis untuk mencerahkan dan anti-inflamasi' : 'Licorice root extract for brightening and anti-inflammation', products: 5 },
            ];
            const filtered = query.trim() ? ingredientsList.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.desc.toLowerCase().includes(query.toLowerCase())) : ingredientsList;
            return (
              <>
                <h3 className="font-['Manrope'] text-[12px] font-medium text-[#747872] uppercase tracking-[0.12em] mb-6">
                  {language === 'id' ? 'Bahan Aktif Utama' : 'Key Active Ingredients'}
                </h3>
                {filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-[48px] text-[#c3c8c0] mb-4 block" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>search_off</span>
                    <p className="font-['Manrope'] text-[16px] text-[#747872]">{language === 'id' ? 'Bahan tidak ditemukan' : 'No ingredients found'}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filtered.map((ing, idx) => (
                      <React.Fragment key={ing.id}>
                        <Link href="/shop" onClick={handleClose} className="flex items-center gap-4 group cursor-pointer p-3 rounded-lg hover:bg-white/60 transition-colors">
                          <div className="w-10 h-10 bg-[#f8e8d5] rounded-full flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#815513] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-['Manrope'] text-[15px] font-semibold text-[#18281a] group-hover:text-[#815513] transition-colors">{ing.name}</h4>
                            <p className="font-['Manrope'] text-[13px] text-[#747872] mt-0.5 line-clamp-1">{ing.desc}</p>
                          </div>
                          <span className="font-['Manrope'] text-[11px] font-semibold text-[#747872] bg-[#e5e2de] px-2 py-0.5 rounded-full shrink-0">{ing.products} {language === 'id' ? 'produk' : 'items'}</span>
                        </Link>
                        {idx < filtered.length - 1 && <hr className="border-[#c3c8c0]/15" />}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
