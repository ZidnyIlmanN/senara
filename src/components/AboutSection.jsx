"use client";

import React from 'react'
import { useLanguage } from '../context/LanguageContext'

function AboutSection() {
  const { t } = useLanguage()

  return (
    <section className="relative bg-[#F4EFEB] py-24 overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="relative z-10 container max-w-4xl mx-auto px-6 flex flex-col items-center">
        <span className="text-sm font-medium mb-6 tracking-wide">{t('about.label')}</span>
        
        <h2 className="text-3xl md:text-5xl lg:text-[54px] leading-tight md:leading-[1.1] font-serif mb-16 text-charcoal max-w-4xl">
          <em className="italic font-light">{t('about.headline_em')}</em>{t('about.headline')}
        </h2>

        {/* Image + overlapping SENARA text */}
        <div className="relative mt-8 w-full flex items-center justify-center">
          <img 
            src="/images/senara-detailed1.png" 
            alt="Senara Skincare"
            className="relative z-10"
          />
          {/* SENARA text behind the image */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <span className="text-[18vw] leading-none font-sans font-semibold tracking-[0.15em] text-[#ddd0c7] uppercase">
              SENARA
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
