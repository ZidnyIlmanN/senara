"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon, Logo } from './ui'
import { useCart } from './CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import SearchModal from './SearchModal'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { totalItems, openCart } = useCart()
  const { language, setLanguage, t } = useLanguage()
  const { user, userProfile, role, signOut } = useAuth()
  const pathname = usePathname()

  const getRoleDisplayName = (r) => {
    switch (r) {
      case 'distributor': return 'Distributor';
      case 'agent': return 'Agen';
      case 'reseller': return 'Reseller';
      default: return 'Customer';
    }
  }

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
            <span className="cursor-pointer flex items-center group relative h-full">
              <Icon name="user"/>
              {user ? (
                <div className="absolute right-0 top-full w-48 pt-2 hidden group-hover:block z-50">
                  <div className="bg-white shadow-lg rounded-md overflow-hidden border border-gray-100 flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-800 font-['Manrope'] truncate">
                        {userProfile?.full_name || user.email?.split('@')[0]}
                      </p>
                      {role !== 'customer' && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#bd8033]/10 text-[#bd8033] text-[10px] font-bold uppercase tracking-wider rounded-sm font-['Manrope']">
                          {getRoleDisplayName(role)}
                        </span>
                      )}
                    </div>
                    <Link href="/profile" className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-['Manrope'] transition-colors border-b border-gray-50">
                      Lihat Profil
                    </Link>
                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 font-['Manrope'] transition-colors">Logout</button>
                  </div>
                </div>
              ) : (
                <div className="absolute right-0 top-full w-40 pt-2 hidden group-hover:block z-50">
                  <div className="bg-white shadow-lg rounded-md overflow-hidden border border-gray-100 flex flex-col">
                    <Link href="/login" className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-['Manrope'] border-b border-gray-50">{t('auth.login')}</Link>
                    <Link href="/register" className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-['Manrope']">{t('auth.register')}</Link>
                  </div>
                </div>
              )}
            </span>
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
        <div className="mt-4 flex flex-col items-center gap-4">
          {user ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="font-['Manrope'] font-bold text-[#18281a] text-lg">
                  {userProfile?.full_name || user.email?.split('@')[0]}
                </p>
                {role !== 'customer' && (
                  <span className="inline-block mt-1 px-3 py-1 bg-[#bd8033]/10 text-[#bd8033] text-[10px] font-bold uppercase tracking-wider rounded-sm font-['Manrope']">
                    {getRoleDisplayName(role)}
                  </span>
                )}
              </div>
              <Link 
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="font-['Manrope'] text-sm tracking-widest text-[#18281a] border border-[#18281a] rounded-full px-6 py-2 hover:bg-[#18281a] hover:text-white transition-colors"
              >
                LIHAT PROFIL
              </Link>
              <button 
                onClick={() => { signOut(); setMobileMenuOpen(false); }}
                className="font-['Manrope'] text-sm tracking-widest text-red-600 border border-red-600 rounded-full px-6 py-2 hover:bg-red-600 hover:text-white transition-colors"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <>
              <Link 
                href="/login" 
                className="font-['Manrope'] text-sm tracking-widest text-[#18281a] border border-[#18281a] rounded-full px-8 py-2 hover:bg-[#18281a] hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('auth.loginBtn')}
              </Link>
              <Link 
                href="/register" 
                className="font-['Manrope'] text-sm tracking-widest text-gray-500 hover:text-[#bd8033] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('auth.register')}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export default Navbar
