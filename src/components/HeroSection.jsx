import React from 'react'
import Link from 'next/link'
import { Button, Icon, Logo } from './ui'
import Navbar from './Navbar'

function HeroSection() {
  return <section className="hero">
    <Navbar />
    <div className="container hero-grid pt-[96px] pb-[64px]">
      <div className="hero-copy">
        <h1>Glow Gently With<br/>Pineapple-Powered<br/>Care</h1>
        <div className="gold-line" />
        <p>Nature's radiance meets clinical science<br/>for visibly healthy, glowing skin.</p>
        <Button>Discover Our Collection</Button>
        <div className="benefits">
          <span><b>{'\u2727'}</b>Pineapple<br/>Enzyme</span>
          <span><Icon name="flask"/>Clinically<br/>Tested</span>
          <span><Icon name="leaf"/>Gentle for<br/>All Skin Types</span>
        </div>
      </div>
      <div className="hero-visual">
        <img src="/images/senara-hero.png" alt="SENARA pineapple-powered skincare collection"/>
      </div>
    </div>
  </section>
}

export default HeroSection
