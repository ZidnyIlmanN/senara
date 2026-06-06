"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon, Logo } from './ui'
import { useCart } from './CartContext'
import { useLanguage } from '../context/LanguageContext'
import SearchModal from './SearchModal'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { totalItems, openCart } = useCart()
  const { language, setLanguage, t } = useLanguage()

  const pathname = usePathname()

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.shop'), href: '/shop' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.ingredients'), href: '#' },
    { name: t('nav.contact'), href: '/contact' }
  ]

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
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 bg-[#f0ede9] rounded-full p-[3px] border border-[#c3c8c0]/30">
              <button
                onClick={() => setLanguage('id')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-['Manrope'] font-bold tracking-wider transition-all duration-300 ${language === 'id' ? 'bg-[#18281a] text-white shadow-sm' : 'text-[#434842] hover:text-[#18281a]'}`}
              >
                ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-['Manrope'] font-bold tracking-wider transition-all duration-300 ${language === 'en' ? 'bg-[#18281a] text-white shadow-sm' : 'text-[#434842] hover:text-[#18281a]'}`}
              >
                EN
              </button>
            </div>
            <span className="cursor-pointer" onClick={() => setIsSearchOpen(true)}><Icon name="search"/></span>
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
        {/* Mobile Language Switcher */}
        <div className="flex items-center gap-1 bg-[#f0ede9] rounded-full p-[3px] border border-[#c3c8c0]/30 mb-4">
          <button
            onClick={() => setLanguage('id')}
            className={`px-4 py-2 rounded-full text-[13px] font-['Manrope'] font-bold tracking-wider transition-all duration-300 ${language === 'id' ? 'bg-[#18281a] text-white shadow-sm' : 'text-[#434842] hover:text-[#18281a]'}`}
          >
            ID
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-full text-[13px] font-['Manrope'] font-bold tracking-wider transition-all duration-300 ${language === 'en' ? 'bg-[#18281a] text-white shadow-sm' : 'text-[#434842] hover:text-[#18281a]'}`}
          >
            EN
          </button>
        </div>
        {navLinks.map(link => (
          <Link 
            key={link.name} 
            href={link.href}
            className={`font-['Playfair_Display'] text-[32px] hover:text-[#bd8033] transition-colors ${pathname === link.href ? 'text-[#bd8033]' : 'text-[#18281a]'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export default Navbar
