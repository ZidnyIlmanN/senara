"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon, Logo } from './ui'
import { useCart } from './CartContext'

const navLinks = [
  { name: 'Shop', href: '/shop' },
  { name: 'Our Story', href: '#' },
  { name: 'Ingredients', href: '#' },
  { name: 'Science', href: '#' },
  { name: 'Contact', href: '#' }
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems, openCart } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`navbar-fixed ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
        <div className="container navbar-inner">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}><Logo /></Link>
          <div className="nav-links">
            {navLinks.map(link => <Link key={link.name} href={link.href}>{link.name}</Link>)}
          </div>
          <div className="nav-actions">
            <Icon name="search"/>
            <Icon name="user"/>
            <span className="cart cursor-pointer" onClick={openCart}><Icon name="bag"/><i>{totalItems}</i></span>
            <span className="hamb cursor-pointer z-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <span className="material-symbols-outlined" style={{fontSize: '24px'}}>close</span> : <Icon name="menu"/>}
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#fffdf7] z-[45] transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-center items-center gap-8 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        {navLinks.map(link => (
          <Link 
            key={link.name} 
            href={link.href}
            className="font-['Playfair_Display'] text-[32px] text-[#18281a] hover:text-[#bd8033] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </>
  )
}

export default Navbar
