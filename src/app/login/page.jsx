"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import FooterSection from '../../components/FooterSection';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdf7]">
      <Navbar />
      <div style={{ height: '96px' }} />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-center font-['Playfair_Display'] text-4xl mb-4 text-[#18281a]">{t('auth.login')}</h1>
          <p className="text-center text-sm mb-8 text-[#434842] font-['Manrope']">{t('auth.loginSubtitle')}</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder={t('auth.email')}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#bd8033] font-['Manrope'] bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder={t('auth.password')}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#bd8033] font-['Manrope'] bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-right">
              <Link href="#" className="text-xs text-gray-500 hover:text-[#bd8033] transition-colors font-['Manrope']">
                {t('auth.forgotPassword')}
              </Link>
            </div>

            {error && <p className="text-red-500 text-sm text-center font-['Manrope']">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-md py-3 font-semibold text-sm tracking-wider hover:bg-gray-800 transition-colors font-['Manrope'] mt-4 disabled:opacity-70"
            >
              {loading ? '...' : t('auth.loginBtn')}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4 border-gray-300"></span>
            <span className="text-xs text-center text-gray-500 uppercase font-['Manrope']">Atau</span>
            <span className="border-b w-1/5 lg:w-1/4 border-gray-300"></span>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 rounded-md py-3 font-semibold text-sm hover:bg-gray-50 transition-colors font-['Manrope'] mt-6 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t('auth.loginWithGoogle')}
          </button>

          <p className="text-center mt-8 text-sm text-gray-600 font-['Manrope']">
            {t('auth.newCustomer')} <Link href="/register" className="text-[#bd8033] hover:underline">{t('auth.register')}</Link>
          </p>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
