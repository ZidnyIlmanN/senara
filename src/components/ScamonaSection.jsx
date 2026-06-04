"use client";

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function ScamonaSection() {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col lg:flex-row w-full min-h-screen bg-[#fafafa]">
      {/* Left Column - Image */}
      <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto bg-[#fafafa]">
        <img 
          src="/images/senara-scamona.webp" 
          alt="Scamona Cream" 
          className="w-full h-full object-cover lg:object-contain object-center mix-blend-multiply p-0"
        />
        
        {/* Decorative Details (inspired by reference design) */}
        <div className="absolute bottom-12 left-12 right-12 justify-between text-[11px] font-['Manrope'] tracking-widest text-[#18281a] uppercase hidden lg:flex opacity-60">
          <div>
            <span className="block text-gray-400 mb-2">Name /</span>
            <span>Scamona</span>
          </div>
          <div>
            <span className="block text-gray-400 mb-2">Type /</span>
            <span>Ointment</span>
          </div>
          <div>
            <span className="block text-gray-400 mb-2">Used for /</span>
            <span>Sensitive Skin</span>
          </div>
        </div>
      </div>

      {/* Right Column - Typography & Info */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-10 lg:p-24 2xl:p-32 bg-[#fafafa]">
        <div className="max-w-xl">
          <h2 className="font-['Playfair_Display'] text-[54px] lg:text-[72px] leading-[1.1] text-[#c2964b] mb-8">
            SCAMONA
          </h2>
          
          <div className="font-['Manrope'] text-[18px] lg:text-[22px] text-[#18281a] leading-[1.6] font-light mb-10">
            {t('scamona.description')}
          </div>
          
          <div className="mb-12">
            <span className="block font-['Manrope'] text-[13px] uppercase tracking-widest text-[#18281a] font-semibold mb-3">
              {t('scamona.ingredients_title')}
            </span>
            <p className="font-['Manrope'] text-[16px] text-[#434842] leading-[1.8]">
              {t('scamona.ingredients')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 border-t border-[#18281a]/10 pt-10">
            <a 
              href="/shop"
              className="group w-full sm:w-auto flex items-center justify-center gap-4 bg-[#f0f2f5] text-[#18281a] px-7 py-3 rounded-full font-['Manrope'] font-bold text-[13px] transition-all hover:bg-[#c2964b] hover:text-white"
            >
              <span>{t('scamona.cta')}</span>
              <div className="bg-[#5b5d61] text-white rounded-full w-7 h-7 flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#c2964b]">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  chevron_right
                </span>
              </div>
            </a>

            <div className="flex items-center gap-6">
              {/* Halal Badge */}
              <img 
                src="/images/indonesian_halal_logo_2022.jpg" 
                alt="Halal Indonesia" 
                className="h-12 w-auto object-contain mix-blend-multiply" 
              />
              {/* BPOM Badge */}
              <img 
                src="/images/Logo_Badan_POM.png" 
                alt="Badan POM" 
                className="h-8 w-auto object-contain mix-blend-multiply" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScamonaSection;
