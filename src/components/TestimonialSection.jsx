"use client";

import React from 'react'
import { useLanguage } from '../context/LanguageContext'

function TestimonialSection() {
  const { t } = useLanguage()

  return <section className="testimonial container">
    <img className="portrait" src="/images/Testimonial/senara-testimonial1-baru.png" alt="Testimonial"/>
    <div className="quote">
      <div className="quote-mark">{'\u201c'}</div>
      <blockquote>
        {t('testimonial.quote').split('\n')[0]}<br/>
        {t('testimonial.quote').split('\n')[1]}<br/>
        {t('testimonial.quote').split('\n')[2]}
      </blockquote>
      <cite>{'\u2014'} {t('testimonial.author')}</cite>
      <div className="proof-row">
        <div className="avatars"><span>O</span><span>S</span><span>M</span></div>
        <p><b>{t('testimonial.happyCustomers')}</b><br/>{t('testimonial.andCounting')}</p>
      </div>
      <div className="slider-nav"><button>{'\u2190'}</button><button>{'\u2192'}</button></div>
    </div>
  </section>
}

export default TestimonialSection
