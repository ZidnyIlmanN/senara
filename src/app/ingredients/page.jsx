"use client";

import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import FooterSection from '../../components/FooterSection';
import { useLanguage } from '../../context/LanguageContext';
import Link from 'next/link';

export default function IngredientsPage() {
    const { t } = useLanguage();

    useEffect(() => {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            revealObserver.observe(el);
        });

        return () => revealObserver.disconnect();
    }, []);

    return (
        <div className="bg-[#fcf9f5] text-[#1c1c19] selection:bg-[#ffddb7] selection:text-[#2a1700] min-h-screen">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="pt-24 pb-12 lg:pt-32">
                    <div className="container">
                        <div className="relative w-full h-[600px] lg:h-[700px] rounded-[32px] overflow-hidden reveal-on-scroll">
                            {/* Background Image */}
                            <img 
                                src="/images/Bahan/Hero-Bahan.png" 
                                alt="Natural Beauty" 
                                className="absolute inset-0 w-full h-full object-cover" 
                            />
                            {/* Subtle dark overlay for text readability */}
                            <div className="absolute inset-0 bg-black/20"></div>

                            {/* Top Left Title */}
                            <div className="absolute top-12 left-8 md:left-12 max-w-lg z-10">
                                <h1 className="font-['Playfair_Display'] text-[46px] md:text-[64px] text-white leading-[1.05]">
                                    {t('ingredientsPage.hero.headline')} <br /> 
                                    <span className="italic">{t('ingredientsPage.hero.headlineBr')}</span>
                                </h1>
                            </div>

                            {/* Bottom Left Glass Card (e.g. Star Ingredient intro) */}
                            <a href="#star-ingredient" className="hidden md:flex absolute bottom-12 left-12 w-[480px] z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex-row gap-5 items-center group cursor-pointer hover:bg-white/20 transition-colors">
                                <img 
                                    src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=400" 
                                    alt="Pineapple Extract" 
                                    className="w-full sm:w-24 h-32 sm:h-28 object-cover rounded-2xl shrink-0" 
                                />
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-white font-bold font-['Manrope'] text-[15px]">
                                            {t('ingredientsPage.star.title')}
                                        </h3>
                                        <span className="material-symbols-outlined text-white text-[18px] bg-white/20 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                                            east
                                        </span>
                                    </div>
                                    <p className="text-white/90 font-['Manrope'] text-[12px] leading-relaxed line-clamp-3">
                                        {t('ingredientsPage.star.desc2')}
                                    </p>
                                </div>
                            </a>

                            {/* Bottom Right Glass Card (e.g. Subtitle/Intro) */}
                            <a href="#botanicals" className="hidden lg:flex absolute bottom-12 right-12 w-[320px] z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex-col gap-4 group cursor-pointer hover:bg-white/20 transition-colors">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-white font-bold font-['Manrope'] text-[15px]">
                                            {t('ingredientsPage.hero.badge')}
                                        </h3>
                                        <span className="material-symbols-outlined text-white text-[18px] bg-white/20 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                                            east
                                        </span>
                                    </div>
                                    <p className="text-white/90 font-['Manrope'] text-[12px] leading-relaxed">
                                        {t('ingredientsPage.hero.subtitle')}
                                    </p>
                                </div>
                                <img 
                                    src="/images/Bahan/Daun Kelor-Bahan.png" 
                                    alt="Botanical Wonders" 
                                    className="w-full h-32 object-cover rounded-2xl" 
                                />
                            </a>
                            
                        </div>
                    </div>
                </section>

                {/* Star Ingredient: Bromelain */}
                <section id="star-ingredient" className="py-20 lg:py-32 bg-white scroll-mt-24">
                    <div className="container">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 reveal-on-scroll">
                                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                                    <img 
                                        src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=800" 
                                        alt="Pineapple Extract Bromelain" 
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 right-8 text-white">
                                        <p className="font-['Playfair_Display'] italic text-2xl">"Eksfoliator Alam Paling Sempurna"</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="order-1 lg:order-2 reveal-on-scroll">
                                <span className="font-['Manrope'] text-[14px] font-bold text-[#815513] block mb-4 tracking-widest uppercase">
                                    {t('ingredientsPage.star.label')}
                                </span>
                                <h2 className="font-['Playfair_Display'] text-[40px] lg:text-[48px] text-[#18281a] mb-8 leading-tight">
                                    {t('ingredientsPage.star.title')}
                                </h2>
                                
                                <div className="space-y-6 font-['Manrope'] text-[16px] text-[#434842] leading-relaxed">
                                    <p>{t('ingredientsPage.star.desc1')}</p>
                                    <p>{t('ingredientsPage.star.desc2')}</p>
                                </div>

                                <ul className="mt-10 space-y-4">
                                    {Array.isArray(t('ingredientsPage.star.benefits')) && t('ingredientsPage.star.benefits').map((benefit, idx) => (
                                        <li key={idx} className="flex items-center gap-4 text-[#18281a] font-['Manrope'] font-medium">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f8e8d5] text-[#815513] flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[18px]">check</span>
                                            </span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Supporting Botanicals Bento Grid */}
                <section id="botanicals" className="py-24 bg-[#f6f3ef] scroll-mt-24">
                    <div className="container">
                        {/* Header Section mimicking the reference */}
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal-on-scroll gap-6">
                            <div className="max-w-2xl">
                                <span className="font-['Manrope'] text-[14px] font-bold text-[#815513] block mb-3 tracking-widest uppercase">
                                    {t('ingredientsPage.grid.label')}
                                </span>
                                <h2 className="font-['Playfair_Display'] text-[36px] lg:text-[46px] text-[#18281a] leading-tight">
                                    {t('ingredientsPage.grid.title')}
                                </h2>
                            </div>
                            {/* Reviews/Trust snippet from reference */}
                            <div className="flex flex-col items-end">
                                <div className="flex text-[#815513] text-[18px] mb-1">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-['Manrope'] text-[13px] font-medium text-[#434842]">4.9 (2,300+ ulasan)</span>
                                    <div className="flex -space-x-2">
                                        <img className="w-6 h-6 rounded-full border-2 border-[#f6f3ef]" src="https://i.pravatar.cc/100?img=1" alt="User" />
                                        <img className="w-6 h-6 rounded-full border-2 border-[#f6f3ef]" src="https://i.pravatar.cc/100?img=5" alt="User" />
                                        <img className="w-6 h-6 rounded-full border-2 border-[#f6f3ef]" src="https://i.pravatar.cc/100?img=9" alt="User" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            {/* Left Large Card (Moringa) */}
                            <div className="lg:col-span-7 relative rounded-[32px] overflow-hidden reveal-on-scroll group min-h-[500px] lg:min-h-full">
                                <img 
                                    src="/images/Bahan/Daun Kelor-Bahan.png" 
                                    alt="Moringa" 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/0"></div>
                                
                                {/* Floating White Box at bottom left */}
                                <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-[380px] bg-white rounded-[24px] p-6 shadow-xl">
                                    <div className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-[#815513] mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                        <div>
                                            <h3 className="font-['Playfair_Display'] font-bold text-[18px] text-[#18281a] mb-1">
                                                {t('ingredientsPage.grid.moringa.title')}
                                            </h3>
                                            <p className="font-['Manrope'] text-[13px] text-[#747872] leading-relaxed">
                                                {t('ingredientsPage.grid.moringa.desc')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column Cards */}
                            <div className="lg:col-span-5 flex flex-col gap-6">
                                
                                {/* Top Light Card (Olive) */}
                                <div className="bg-[#ebe6dc] rounded-[32px] p-8 reveal-on-scroll relative overflow-hidden flex-1 min-h-[280px]">
                                    <div className="relative z-10 w-2/3">
                                        <span className="material-symbols-outlined text-[#434842] text-[24px] mb-4 block">recycling</span>
                                        <h3 className="font-['Playfair_Display'] text-[24px] text-[#18281a] leading-tight mb-3">
                                            {t('ingredientsPage.grid.olive.title').split('(')[0]} <br/>
                                            <span className="italic text-[#815513]">({t('ingredientsPage.grid.olive.title').split('(')[1]}</span>
                                        </h3>
                                        <p className="font-['Manrope'] text-[13px] text-[#747872] leading-relaxed">
                                            {t('ingredientsPage.grid.olive.desc')}
                                        </p>
                                    </div>
                                    <img 
                                        src="/images/Bahan/Minyak Zaitun-Bahan.png" 
                                        alt="Olive" 
                                        className="absolute -right-12 -bottom-12 w-64 h-64 object-cover rounded-full mix-blend-multiply opacity-90"
                                    />
                                </div>

                                {/* Bottom Dark Card (Habbatussauda & Bidara combined or stacked) */}
                                <div className="bg-[#3e4a3d] rounded-[32px] p-8 reveal-on-scroll relative overflow-hidden flex-1 min-h-[280px] text-white flex items-center">
                                    <img 
                                        src="/images/Bahan/Daun Bidara-Bahan.png" 
                                        alt="Daun Bidara" 
                                        className="absolute left-0 top-0 bottom-0 w-1/3 h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#3e4a3d]/30 to-[#3e4a3d]/80"></div>
                                    
                                    <div className="relative z-10 pl-[30%]">
                                        <h3 className="font-['Playfair_Display'] text-[24px] mb-4 leading-tight">
                                            100% Natural <br/>
                                            <span className="italic text-[#d4cdb3]">100% You</span>
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-[#d4cdb3] text-[16px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
                                                <div>
                                                    <span className="font-['Manrope'] font-bold text-[13px] block">{t('ingredientsPage.grid.habbat.title').split('(')[0]}</span>
                                                    <span className="font-['Manrope'] text-[12px] text-[#d4cdb3] line-clamp-1">{t('ingredientsPage.grid.habbat.desc')}</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-[#d4cdb3] text-[16px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>local_florist</span>
                                                <div>
                                                    <span className="font-['Manrope'] font-bold text-[13px] block">{t('ingredientsPage.grid.bidara.title').split('(')[0]}</span>
                                                    <span className="font-['Manrope'] text-[12px] text-[#d4cdb3] line-clamp-1">{t('ingredientsPage.grid.bidara.desc')}</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* Philosophy & CTA */}
                <section className="py-24 pb-32">
                    <div className="container">
                        <div className="bg-[#ebe6dc] rounded-[32px] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10 reveal-on-scroll">
                            
                            {/* Left: Title */}
                            <div className="md:w-1/4 text-center md:text-left">
                                <h2 className="font-['Playfair_Display'] text-[32px] lg:text-[40px] text-[#18281a] leading-tight">
                                    {t('ingredientsPage.philosophy.title')}
                                </h2>
                            </div>

                            {/* Center: Image & Button */}
                            <div className="md:w-2/4 flex flex-col items-center justify-center">
                                {/* Menggunakan mix-blend-multiply agar background gambar menyatu dengan warna card */}
                                <img 
                                    src="/images/Bahan/Foto Produk-Bahan.png" 
                                    alt="Product Formulation" 
                                    className="w-full max-w-[400px] h-[160px] lg:h-[200px] object-contain mix-blend-multiply mb-8 hover:scale-105 transition-transform duration-700"
                                />
                                <Link href="/shop" className="inline-flex items-center justify-center gap-3 bg-[#18281a] text-white px-8 py-3.5 rounded-full font-['Manrope'] text-[13px] font-bold tracking-widest uppercase hover:bg-[#815513] transition-colors duration-300 group shadow-lg">
                                    {t('ingredientsPage.philosophy.cta')}
                                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </Link>
                            </div>

                            {/* Right: Description */}
                            <div className="md:w-1/4 text-center md:text-left">
                                <p className="font-['Manrope'] text-[14px] lg:text-[15px] text-[#434842] leading-relaxed">
                                    {t('ingredientsPage.philosophy.desc')}
                                </p>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            <FooterSection />
        </div>
    );
}
