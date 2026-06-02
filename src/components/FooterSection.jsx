import React from 'react'
import { Logo } from './ui'

const quickLinks = ['Home', 'Our Story', 'Products', 'Ingredients', 'Science', 'Contact']
const careLinks = ['Shipping & Delivery', 'Returns & Refunds', 'Track Your Order', 'Privacy Policy', 'Terms & Conditions', 'FAQ']
const socials = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'Email']

import Link from 'next/link'

function FooterList({ title, links }) {
  return <div className="footer-list"><h4>{title}</h4>{links.map(link => <Link key={link} href={link === 'Products' ? '/shop' : '#'}>{link}</Link>)}</div>
}

function FooterSection() {
  return <footer>
    <div className="footer-watermark">SENARA</div>
    <div className="container footer-grid">
      <div className="brand-col">
        <Logo light/>
        <p>Pineapple-powered skincare.<br/>Thoughtful formulas for a<br/>naturally radiant you.</p>
        <div className="social-round"><span>ig</span><span>f</span><span>tk</span><span>yt</span></div>
      </div>
      <FooterList title="Quick Links" links={quickLinks}/>
      <FooterList title="Customer Care" links={careLinks}/>
      <FooterList title="Follow Us" links={socials}/>
      <div className="newsletter">
        <h4>Join Our Community</h4>
        <p>Get exclusive offers, skincare tips,<br/>and early access to new launches.</p>
        <label><input placeholder="Your email address"/><button>{'\u2192'}</button></label>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>{'\u00a9'} 2026 Senara. All rights reserved.</span>
      <span>Terms & Conditions&nbsp;&nbsp;&nbsp;&nbsp;Privacy Policy</span>
    </div>
  </footer>
}

export default FooterSection
