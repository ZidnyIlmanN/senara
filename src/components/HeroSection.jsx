"use client";

import React from 'react'
import Link from 'next/link'
import { Button, Icon, Logo } from './ui'
import Navbar from './Navbar'
import { useLanguage } from '../context/LanguageContext'

function HeroSection() {
  const { t } = useLanguage()

  return <section className="hero">
    <Navbar />
    <div className="container hero-grid pt-[96px] pb-[64px]">
      <div className="hero-copy">
        <h1>{t('hero.headline1')}<br />{t('hero.headline2')}</h1>
        <div className="gold-line" />
        <p>{t('hero.subtitle').split('\n')[0]}<br />{t('hero.subtitle').split('\n')[1]}</p>
        <Link href="/shop"><Button>{t('hero.cta')}</Button></Link>
        <div className="benefits">
          <span><b>{'\u2727'}</b>{t('hero.benefit1_label').split('\n')[0]}<br />{t('hero.benefit1_label').split('\n')[1]}</span>
          <span><Icon name="flask" />{t('hero.benefit2_label').split('\n')[0]}<br />{t('hero.benefit2_label').split('\n')[1]}</span>
          <span><Icon name="leaf" />{t('hero.benefit3_label').split('\n')[0]}<br />{t('hero.benefit3_label').split('\n')[1]}</span>
        </div>
      </div>
      <div className="hero-visual">
        <img src="/images/senara-hero.webp" alt="SENARA pineapple-powered skincare collection" />
      </div>
    </div>
  </section>
}

export default HeroSection
