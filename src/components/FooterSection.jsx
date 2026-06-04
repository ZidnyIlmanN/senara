"use client";

import React from 'react'
import { Logo } from './ui'
import Link from 'next/link'
import { useLanguage } from '../context/LanguageContext'

function FooterList({ title, links }) {
  return <div className="footer-list"><h4>{title}</h4>{links.map(link => <Link key={link} href={link === 'Products' ? '/shop' : '#'}>{link}</Link>)}</div>
}

function FooterSection() {
  const { t } = useLanguage()

  const socials = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'Email']

  return <footer>
    <div className="footer-watermark">SENARA</div>
    <div className="container footer-grid">
      <div className="brand-col">
        <Logo light/>
        <p>{t('footer.tagline').split('\n')[0]}<br/>{t('footer.tagline').split('\n')[1]}<br/>{t('footer.tagline').split('\n')[2]}</p>
        <div className="social-round"><span>ig</span><span>f</span><span>tk</span><span>yt</span></div>
      </div>
      <FooterList title={t('footer.quickLinks')} links={t('footer.quickLinksItems')}/>
      <FooterList title={t('footer.customerCare')} links={t('footer.customerCareItems')}/>
      <FooterList title={t('footer.followUs')} links={socials}/>
      <div className="newsletter">
        <h4>{t('footer.newsletter')}</h4>
        <p>{t('footer.newsletterDesc').split('\n')[0]}<br/>{t('footer.newsletterDesc').split('\n')[1]}</p>
        <label><input placeholder={t('footer.emailPlaceholder')}/><button>{'\u2192'}</button></label>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>{t('footer.copyright')}</span>
      <span>{t('footer.terms')}&nbsp;&nbsp;&nbsp;&nbsp;{t('footer.privacy')}</span>
    </div>
  </footer>
}

export default FooterSection
