"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { useCart } from '../../../components/CartContext';
import { useLanguage } from '../../../context/LanguageContext';
import Navbar from '../../../components/Navbar';

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: prodData, error: prodErr } = await supabase.from('products').select('*').eq('id', id).single();
        if (prodErr || !prodData) {
          router.push('/404');
          return;
        }
        setProduct(prodData);

        const { data: relData } = await supabase.from('products').select('*').neq('id', id).limit(4);
        setRelatedProducts(relData || []);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQty = Math.max(1, prev + change);
      return product?.stock ? Math.min(newQty, product.stock) : newQty;
    });
  };

  const handleAddToCart = () => {
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.image,
      quantity: quantity,
      stock: product.stock
    });
  };

  // Ensure hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) return (
    <div className="bg-[#fcf9f5] min-h-screen text-[#1c1c19] flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-[40px] text-[#56b4a2]">progress_activity</span>
    </div>
  );

  if (!product) return null;

  return (
    <div className="bg-[#fcf9f5] min-h-screen text-[#1c1c19] font-['Manrope']">
      <Navbar />
      <div style={{ height: '96px' }} /> {/* Spacer for Navbar */}

      <main className="max-w-7xl mx-auto pb-20">
        {/* Back Button */}
        <div className="px-6 md:px-0 pt-6 pb-4 w-full">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-500 hover:text-[#18281a] transition-colors text-sm font-medium uppercase tracking-wider"
          >
            <span className="material-symbols-outlined mr-2 text-[18px]">arrow_back</span>
            Back
          </button>
        </div>

        {/* Top Split Section */}
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Left: Image Container */}
          <div className="w-full md:w-1/2 bg-[#f0ede9] p-10 flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full max-w-md object-contain mix-blend-multiply"
            />
          </div>

          {/* Right: Details Container */}
          <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-10 md:p-16 lg:p-24 relative">
            {/* Category / Badge */}
            {product.badge && (
              <p className="text-[12px] uppercase tracking-[0.1em] text-gray-500 mb-2">
                {product.badge === 'Bestseller' ? t('store.title_highlight') : (product.badge === 'New Arrival' ? 'NEW PRODUCT' : product.badge)}
              </p>
            )}

            {/* Product Title & Volume */}
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#18281a] leading-tight mb-2">
              {product.name.toUpperCase()} {product.volume}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <p className="text-xl font-semibold text-[#bd8033]">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
              <p className="text-[14px] text-gray-400 line-through">
                Rp {(product.price + Math.floor(product.price * 0.35 / 1000) * 1000).toLocaleString('id-ID')}
              </p>
            </div>

            {/* Logos: BPOM and Halal */}
            <div className="flex items-center gap-4 mb-10">
              <img src="/images/Logo_Badan_POM.png" alt="BPOM Logo" className="h-8 object-contain" />
              <img src="/images/indonesian_halal_logo_2022.jpg" alt="Halal Logo" className="h-8 object-contain" />
            </div>

            {/* Action Area: Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] text-gray-500 uppercase tracking-wider">{t('pdp.quantity')}</span>
                <div className="inline-flex items-center border border-gray-200 w-fit">
                  <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors">-</button>
                  <span className="px-4 py-2 min-w-[40px] text-center">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-[#56b4a2] hover:bg-gray-50 transition-colors">+</button>
                </div>
              </div>

              <div className="flex flex-col gap-2 justify-end flex-1">
                {product.stock > 0 ? (
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-[#56b4a2] text-white py-3 px-6 hover:bg-[#489989] transition-colors font-medium tracking-wide"
                  >
                    {t('pdp.addToCart')}
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-6 font-medium tracking-wide cursor-not-allowed uppercase"
                  >
                    {language === 'id' ? 'STOK HABIS' : 'OUT OF STOCK'}
                  </button>
                )}
              </div>
            </div>

            {/* Bottom details label */}
            <div className="mt-auto border-t border-gray-100 pt-6 text-center">
              <span className="text-[12px] uppercase tracking-widest text-gray-400">
                {t('pdp.details')}
              </span>
              <div className="h-8 w-[1px] bg-gray-200 mx-auto mt-4"></div>
            </div>
          </div>
        </div>

        {/* Middle Tabs Section */}
        <div className="max-w-4xl mx-auto px-6 mt-16 text-center">
          <div className="flex justify-center gap-8 md:gap-16 border-b border-gray-200 mb-10">
            <button 
              onClick={() => setActiveTab('about')}
              className={`pb-4 text-[13px] font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'about' ? 'text-[#56b4a2]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t('pdp.about')}
              {activeTab === 'about' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#56b4a2]"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('howToUse')}
              className={`pb-4 text-[13px] font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'howToUse' ? 'text-[#56b4a2]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t('pdp.howToUse')}
              {activeTab === 'howToUse' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#56b4a2]"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('ingredients')}
              className={`pb-4 text-[13px] font-bold tracking-widest uppercase transition-colors relative ${activeTab === 'ingredients' ? 'text-[#56b4a2]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t('pdp.ingredients')}
              {activeTab === 'ingredients' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#56b4a2]"></span>}
            </button>
          </div>

          <div className="min-h-[150px]">
            {activeTab === 'about' && (
              <div className="animate-fade-in space-y-4">
                <h3 className="font-['Playfair_Display'] text-xl text-[#18281a]">{product.name}</h3>
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  {product.benefits}
                </p>
              </div>
            )}
            {activeTab === 'howToUse' && (
              <div className="animate-fade-in space-y-4">
                <h3 className="font-['Playfair_Display'] text-xl text-[#18281a]">{t('pdp.howToUse')}</h3>
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                  {product.how_to_use}
                </p>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div className="animate-fade-in space-y-4">
                <h3 className="font-['Playfair_Display'] text-xl text-[#18281a]">{t('pdp.ingredients')}</h3>
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                  {product.full_ingredients}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Large Display Image */}
        <div className="w-full flex justify-center mt-12 mb-16 overflow-hidden">
          <img 
            src={product.image} 
            alt="Large Display" 
            className="w-full max-w-[800px] object-contain mix-blend-multiply scale-110"
            style={{ maxHeight: '800px' }}
          />
        </div>

        {/* Reviews Section */}
        <div className="flex flex-col items-center mb-24 border-b border-gray-200 pb-16 max-w-2xl mx-auto">
          <p className="text-sm text-[#bd8033] mb-2">{t('pdp.shopNow')}</p>
          <div className="flex items-center gap-4">
            <span className="text-[#56b4a2] text-4xl font-bold">{product.rating.toFixed(1)}</span>
            <span className="text-2xl text-gray-300">/ 5</span>
            <div className="flex flex-col ml-4">
              <div className="flex gap-1 text-[#56b4a2]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {star <= Math.round(product.rating) ? 'star' : 'star_border'}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 mt-1">{product.reviewsCount} {t('pdp.reviews')}</span>
            </div>
          </div>
        </div>

        {/* Complete Your Regimen */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-[14px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-8 border-b border-gray-200 pb-4">
            {t('pdp.completeRegimen')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <div key={rel.id} className="group cursor-pointer">
                <Link href={`/product/${rel.id}`} className="block relative bg-[#f0ede9] aspect-[4/5] overflow-hidden mb-4">
                  <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[#18281a] text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>favorite_border</span>
                  </button>
                  <img src={rel.image} alt={rel.name} className="w-full h-full object-contain mix-blend-multiply p-6 transition-transform duration-700 group-hover:scale-105" />
                </Link>
                <div className="flex flex-col">
                  <Link href={`/product/${rel.id}`}>
                    <h3 className="font-['Playfair_Display'] text-lg text-[#18281a] mb-1 hover:text-[#bd8033] transition-colors">{rel.name}</h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-3">
                    <p className="text-sm font-semibold text-[#18281a]">Rp {rel.price.toLocaleString('id-ID')}</p>
                    <p className="text-[11px] text-gray-400 line-through">Rp {(rel.price + Math.floor(rel.price * 0.35 / 1000) * 1000).toLocaleString('id-ID')}</p>
                  </div>
                  {rel.stock > 0 ? (
                    <button 
                      onClick={(e) => { e.preventDefault(); addToCart({ id: rel.id, name: rel.name, price: rel.price, image: rel.image })}}
                      className="w-full bg-[#18281a] text-white py-2 text-xs font-semibold hover:bg-[#2c4730] transition-colors uppercase tracking-wider"
                    >
                      {t('pdp.addToCart')}
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2 text-xs font-semibold cursor-not-allowed uppercase tracking-wider"
                    >
                      {language === 'id' ? 'STOK HABIS' : 'OUT OF STOCK'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#56b4a2] text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 py-16 max-w-7xl mx-auto">
          <div className="space-y-6">
            <span className="font-['Playfair_Display'] text-2xl tracking-widest font-bold">SENARA</span>
            <p className="text-sm text-white/80 leading-relaxed">
              SENARA is a premium natural cosmetics brand that cares and understands the wish of every woman to always feel calm, confident, and radiant with their look.
            </p>
            <div className="text-xs text-white/70 space-y-1">
              <p>LAYANAN PENGADUAN KONSUMEN</p>
              <p>Kementerian Perdagangan Republik Indonesia</p>
              <p>WhatsApp: 0813-1814-1050</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-6">ABOUT</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li><Link className="hover:text-white transition-colors" href="#">Senara</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Delivery</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Returns & Exchanges</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Payment</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-6">QUICK LINKS</h4>
            <ul className="space-y-4 text-sm text-white/80">
              <li><Link className="hover:text-white transition-colors" href="#">Halal Green Beauty</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Makeup Match</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Inspiring Movement</Link></li>
              <li><Link className="hover:text-white transition-colors" href="#">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-6">SUBSCRIBE NEWSLETTER</h4>
            <div className="flex w-full mb-8">
              <input 
                className="w-full bg-white text-[#18281a] px-4 py-2 text-sm focus:outline-none placeholder:text-gray-400" 
                placeholder="Alamat email Anda" 
                type="email" 
              />
              <button className="bg-[#18281a] text-white px-4 py-2 text-xs font-bold tracking-wider hover:bg-[#2c4730] transition-colors">
                KIRIM
              </button>
            </div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">CONNECT WITH US</h4>
            <div className="flex gap-4">
              <Link className="hover:text-white/80 transition-colors" href="#"><span className="material-symbols-outlined text-[20px]">public</span></Link>
              <Link className="hover:text-white/80 transition-colors" href="#"><span className="material-symbols-outlined text-[20px]">share</span></Link>
              <Link className="hover:text-white/80 transition-colors" href="#"><span className="material-symbols-outlined text-[20px]">mail</span></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
