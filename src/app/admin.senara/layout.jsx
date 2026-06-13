"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { UIProvider } from '../../components/admin/UIProvider';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session && !pathname.includes('/auth/login')) {
        router.push('/admin.senara/auth/login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && !pathname.includes('/auth/login')) {
        router.push('/admin.senara/auth/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin.senara/auth/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fcf9f5]">Loading...</div>;
  }

  // If it's the login page, don't show the sidebar
  if (pathname.includes('/auth/login')) {
    return <div className="min-h-screen bg-[#fcf9f5] font-['Manrope']">{children}</div>;
  }

  if (!session) return null; // Wait for redirect

  const navItems = [
    { name: t('admin.nav.dashboard'), href: '/admin.senara', icon: 'dashboard' },
    { name: t('admin.nav.products'), href: '/admin.senara/products', icon: 'inventory_2' },
    { name: t('admin.nav.aboutContent'), href: '/admin.senara/about', icon: 'description' },
    { name: t('admin.nav.timeline'), href: '/admin.senara/timeline', icon: 'history' },
  ];

  return (
    <UIProvider>
      <div className="min-h-screen bg-[#fcf9f5] font-['Manrope'] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center h-[76px]">
          <Link href="/admin.senara" className="flex-1 flex justify-center md:justify-center">
            <img src="/images/senara-logo.png" alt="Senara Logo" className="h-8 w-auto object-contain" />
          </Link>
          <button className="md:hidden text-gray-500 hover:bg-gray-100 p-1 rounded-md transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin.senara' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm
                  ${isActive ? 'bg-[#18281a] text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-[#18281a]'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            {t('admin.header.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex justify-between items-center shrink-0 h-[76px]">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-600 hover:bg-gray-100 p-1.5 rounded-md transition-colors flex items-center justify-center"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="font-semibold text-lg text-[#18281a] hidden sm:block">
              {navItems.find(i => pathname === i.href || (i.href !== '/admin.senara' && pathname.startsWith(i.href)))?.name || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center">
            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 bg-[#f0ede9] rounded-full p-[3px] border border-[#c3c8c0]/30 mr-4">
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
            
            {/* Profile Dropdown */}
            <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#18281a] transition-colors focus:outline-none bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
              <span className="hidden sm:block truncate max-w-[150px] font-medium">{session.user.email}</span>
              <span className="material-symbols-outlined text-[16px] hidden sm:block">expand_more</span>
            </button>
            
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 animate-scale-in origin-top-right">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('admin.header.signedInAs')}</p>
                    <p className="text-sm font-semibold text-[#18281a] truncate" title={session.user.email}>{session.user.email}</p>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      {t('admin.header.logout')}
                    </button>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
    </UIProvider>
  );
}
