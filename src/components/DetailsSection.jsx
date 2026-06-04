"use client";

import React from 'react'
import { useLanguage } from '../context/LanguageContext'

function DetailsSection() {
  const { t } = useLanguage()

  return (
    <section className="py-[80px] md:py-[120px] container">
      <div className="text-center mb-12">
        <h2 className="font-['Playfair_Display'] text-[36px] md:text-[42px] text-[#18281a] font-normal leading-[1.3] mb-4">
          {t('details.title')} <span className="italic text-[#815513]">{t('details.titleHighlight')}</span> {t('details.titleSuffix')}
        </h2>
        <p className="font-['Manrope'] text-[14px] text-[#434842] max-w-2xl mx-auto">
          {t('details.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Prices */}
        <div className="space-y-8">
          {/* Promo Bundling Card */}
          <div className="bg-[#fcf9f5] border border-[#e7dcc6] rounded-[20px] p-8 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-['Playfair_Display'] text-[24px] text-[#18281a] mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#bd8033]">sell</span>
              {t('details.promo.title')}
            </h3>
            <ul className="space-y-4 font-['Manrope'] text-[14px] text-[#434842]">
              <li className="flex justify-between items-center border-b border-[#e7dcc6]/50 pb-3">
                <span>{t('details.promo.retail')}</span>
                <strong className="text-[#18281a] font-semibold text-[15px]">Rp 495.000,-</strong>
              </li>
              <li className="flex justify-between items-center border-b border-[#e7dcc6]/50 pb-3">
                <span>{t('details.promo.distributor')}</span>
                <strong className="text-[#18281a] font-semibold text-[15px]">Rp 322.000,-</strong>
              </li>
              <li className="flex justify-between items-center border-b border-[#e7dcc6]/50 pb-3">
                <span>{t('details.promo.agent')}</span>
                <strong className="text-[#18281a] font-semibold text-[15px]">Rp 396.000,-</strong>
              </li>
              <li className="flex justify-between items-center pb-1">
                <span>{t('details.promo.reseller')}</span>
                <strong className="text-[#18281a] font-semibold text-[15px]">Rp 445.500,-</strong>
              </li>
            </ul>
          </div>

          {/* Harga Satuan Card */}
          <div className="bg-[#fcf9f5] border border-[#e7dcc6] rounded-[20px] p-8 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-['Playfair_Display'] text-[24px] text-[#18281a] mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#bd8033]">shopping_bag</span>
              {t('details.unit.title')}
            </h3>
            <ul className="space-y-4 font-['Manrope'] text-[14px] text-[#434842]">
              <li className="flex justify-between items-center border-b border-[#e7dcc6]/50 pb-3">
                <span>Ananas Glow Whitening Serum</span>
                <strong className="text-[#18281a] font-semibold text-[15px]">Rp 127.000,-</strong>
              </li>
              <li className="flex justify-between items-center border-b border-[#e7dcc6]/50 pb-3">
                <span>Lightening Day Cream</span>
                <strong className="text-[#18281a] font-semibold text-[15px]">Rp 109.000,-</strong>
              </li>
              <li className="flex justify-between items-center border-b border-[#e7dcc6]/50 pb-3">
                <span>Luminous Night Cream</span>
                <strong className="text-[#18281a] font-semibold text-[15px]">Rp 119.000,-</strong>
              </li>
              <li className="flex justify-between items-center border-b border-[#e7dcc6]/50 pb-3">
                <span>Brightening Face Wash</span>
                <strong className="text-[#18281a] font-semibold text-[15px]">Rp 87.000,-</strong>
              </li>
              <li className="flex justify-between items-center pb-1">
                <span>Glow Toner</span>
                <strong className="text-[#18281a] font-semibold text-[15px]">Rp 87.000,-</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Partnership */}
        <div className="bg-[#18281a] rounded-[20px] p-8 md:p-10 text-white shadow-xl relative overflow-hidden flex flex-col h-full">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#bd8033] rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
          
          <h3 className="font-['Playfair_Display'] text-[28px] md:text-[32px] mb-3 relative z-10">
            {t('details.partnership.title')} <br className="hidden md:block"/><span className="italic text-[#d7a357]">{t('details.partnership.titleHighlight')}</span>
          </h3>
          <p className="font-['Manrope'] text-[14px] text-gray-300 mb-10 relative z-10 max-w-[90%] leading-[1.6]">
            {t('details.partnership.subtitle')}
          </p>

          <div className="flex-1 flex flex-col justify-center space-y-5 relative z-10">
            {/* Reseller */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors flex items-center justify-between group">
              <div>
                <div className="text-[#d7a357] font-['Playfair_Display'] text-[20px] mb-1">RESELLER</div>
                <div className="font-['Manrope'] text-[12px] text-gray-400 tracking-wide">3 PAKET <span className="opacity-50 mx-2">|</span> (3 x 445.000)</div>
              </div>
              <div className="text-right">
                <div className="font-['Manrope'] text-[18px] md:text-[22px] font-semibold">Rp 1.336.500</div>
              </div>
            </div>

            {/* Agen */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors flex items-center justify-between group">
              <div>
                <div className="text-[#d7a357] font-['Playfair_Display'] text-[20px] mb-1">AGEN</div>
                <div className="font-['Manrope'] text-[12px] text-gray-400 tracking-wide">20 PAKET <span className="opacity-50 mx-2">|</span> (20 x 396.000)</div>
              </div>
              <div className="text-right">
                <div className="font-['Manrope'] text-[18px] md:text-[22px] font-semibold">Rp 7.920.000</div>
              </div>
            </div>

            {/* Distributor */}
            <div className="bg-gradient-to-r from-[#d7a357]/20 to-white/5 border border-[#d7a357]/40 rounded-xl p-5 hover:border-[#d7a357]/60 transition-colors flex items-center justify-between group relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-[#d7a357] font-['Playfair_Display'] text-[20px] mb-1">DISTRIBUTOR</div>
                <div className="font-['Manrope'] text-[12px] text-gray-300 tracking-wide">300 PAKET <span className="opacity-50 mx-2">|</span> (300 x 322.000)</div>
              </div>
              <div className="text-right relative z-10">
                <div className="font-['Manrope'] text-[18px] md:text-[22px] font-semibold text-[#d7a357]">Rp 96.600.000</div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div className="font-['Manrope'] text-[12px] text-gray-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              {t('details.partnership.contactAdmin')}
            </div>
            <a href="https://wa.me/6281318141050" target="_blank" rel="noreferrer" className="bg-[#bd8033] hover:bg-[#a66c28] text-white px-6 py-3 rounded-full font-['Manrope'] text-[13px] font-semibold tracking-wide transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
              {t('details.partnership.register')}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DetailsSection
