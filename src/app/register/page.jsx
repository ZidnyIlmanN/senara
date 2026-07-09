"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import FooterSection from '../../components/FooterSection';

const PROVINCES = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi', 'Sumatera Selatan',
  'Bengkulu', 'Lampung', 'Kep. Bangka Belitung', 'Kep. Riau', 'DKI Jakarta',
  'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Banten',
  'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
  'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara', 'Papua Barat', 'Papua'
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  // Form fields
  const [role, setRole] = useState('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  // State
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // UI State
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [provinceQuery, setProvinceQuery] = useState('');
  const roleRef = useRef(null);
  const provinceRef = useRef(null);

  const { t } = useLanguage();
  const router = useRouter();

  const isBusiness = role !== 'customer';

  const ROLES = [
    { value: 'customer', label: 'Akun Biasa (Customer)', icon: 'person' },
    { value: 'reseller', label: 'Reseller (Min. 3 Paket)', icon: 'local_mall' },
    { value: 'agent', label: 'Agen (Min. 20 Paket)', icon: 'store' },
    { value: 'distributor', label: 'Distributor (Min. 300 Paket)', icon: 'factory' },
  ];

  const filteredProvinces = provinceQuery === ''
    ? PROVINCES
    : PROVINCES.filter((p) => p.toLowerCase().includes(provinceQuery.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(event) {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setIsRoleOpen(false);
      }
      if (provinceRef.current && !provinceRef.current.contains(event.target)) {
        setIsProvinceOpen(false);
        // Reset query to selected value if closed without picking
        if (!PROVINCES.includes(provinceQuery)) {
           setProvinceQuery(province || '');
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [province, provinceQuery]);

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Validate Step 1
  const validateStep1 = () => {
    if (!fullName.trim()) return 'Nama lengkap wajib diisi.';
    if (!email.trim()) return 'Email wajib diisi.';
    if (!phone.trim()) return 'Nomor WhatsApp wajib diisi.';
    if (!/^08\d{8,13}$/.test(phone.replace(/\D/g, ''))) return 'Format nomor WhatsApp tidak valid (contoh: 081234567890).';
    if (password.length < 6) return 'Password minimal 6 karakter.';
    if (password !== confirmPassword) return 'Konfirmasi password tidak cocok.';
    if (isBusiness) {
      if (!storeName.trim()) return 'Nama toko/usaha wajib diisi.';
      if (!address.trim()) return 'Alamat wajib diisi.';
      if (!city.trim()) return 'Kota wajib diisi.';
      if (!province) return 'Provinsi wajib dipilih.';
    }
    return null;
  };

  // Step 1 → Send OTP
  const handleSendOtp = async () => {
    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal mengirim kode OTP.');
        setLoading(false);
        return;
      }

      setStep(2);
      setOtpCountdown(300); // 5 minutes
      setResendCooldown(60); // 60 second cooldown before resend
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError('Gagal mengirim kode OTP. Coba lagi.');
    }
    setLoading(false);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal mengirim ulang kode OTP.');
        setLoading(false);
        return;
      }

      setOtpCountdown(300);
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      setError(null);
    } catch (err) {
      setError('Gagal mengirim ulang kode OTP.');
    }
    setLoading(false);
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  // Step 2 → Verify OTP & Register
  const handleVerifyAndRegister = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Masukkan 6 digit kode OTP.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verify OTP
      const verifyRes = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otpCode }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setError(verifyData.error || 'Kode OTP tidak valid.');
        setLoading(false);
        return;
      }

      // OTP verified! Now register with Supabase
      const userData = {
        full_name: fullName,
        phone,
        role,
        wa_verified: true,
      };

      if (isBusiness) {
        userData.store_name = storeName;
        userData.address = address;
        userData.city = city;
        userData.province = province;
        userData.postal_code = postalCode;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: userData,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      setStep(3);
      setSuccess(true);
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) setError(error.message);
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#bd8033] focus:ring-1 focus:ring-[#bd8033]/30 font-['Manrope'] bg-white transition-all";
  const labelClass = "block text-xs font-semibold text-[#434842] mb-1.5 font-['Manrope'] uppercase tracking-wider";

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdf7]">
      <Navbar />
      <div style={{ height: '96px' }} />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <h1 className="text-center font-['Playfair_Display'] text-4xl mb-2 text-[#18281a]">{t('auth.register')}</h1>
          <p className="text-center text-sm mb-8 text-[#434842] font-['Manrope']">{t('auth.registerSubtitle')}</p>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-['Manrope'] transition-all duration-300 ${
                  step >= s 
                    ? 'bg-[#18281a] text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > s ? (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  ) : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-[2px] transition-all duration-300 ${step > s ? 'bg-[#18281a]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* ===================== STEP 1: Data Profil ===================== */}
          {step === 1 && (
            <>
              <div className="space-y-4">
                {/* Tipe Akun */}
                <div ref={roleRef} className="relative z-20">
                  <label className={labelClass}>Tipe Akun</label>
                  <div
                    className={`${inputClass} flex justify-between items-center cursor-pointer select-none`}
                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                  >
                    <span className="flex items-center gap-2 text-gray-700">
                      <span className="material-symbols-outlined text-[18px] text-[#bd8033]">
                        {ROLES.find(r => r.value === role)?.icon}
                      </span>
                      {ROLES.find(r => r.value === role)?.label}
                    </span>
                    <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${isRoleOpen ? 'rotate-180' : ''}`}>expand_more</span>
                  </div>
                  
                  {isRoleOpen && (
                    <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-30">
                      {ROLES.map((r) => (
                        <div
                          key={r.value}
                          className={`px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors font-['Manrope'] text-sm ${role === r.value ? 'bg-[#bd8033]/5 text-[#bd8033] font-semibold' : 'text-gray-700'}`}
                          onClick={() => {
                            setRole(r.value);
                            setIsRoleOpen(false);
                          }}
                        >
                          <span className="material-symbols-outlined text-[18px] opacity-70">{r.icon}</span>
                          {r.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className={labelClass}>Nama Lengkap</label>
                  <input type="text" placeholder="Masukkan nama lengkap" className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>

                {/* Email */}
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" placeholder="nama@email.com" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                {/* No. WhatsApp */}
                <div>
                  <label className={labelClass}>No. WhatsApp</label>
                  <input type="tel" placeholder="081234567890" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Password</label>
                    <input type="password" placeholder="Min. 6 karakter" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelClass}>Konfirmasi Password</label>
                    <input type="password" placeholder="Ulangi password" className={inputClass} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  </div>
                </div>

                {/* Business Fields — Dynamic */}
                {isBusiness && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-[#bd8033] mb-4 font-['Manrope'] uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">storefront</span>
                      Data Usaha
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Nama Toko / Usaha</label>
                        <input type="text" placeholder="Nama toko atau usaha Anda" className={inputClass} value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
                      </div>
                      <div>
                        <label className={labelClass}>Alamat Lengkap</label>
                        <textarea placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan" className={inputClass + ' resize-none'} rows={3} value={address} onChange={(e) => setAddress(e.target.value)} required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Kota / Kabupaten</label>
                          <input type="text" placeholder="Kota" className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} required />
                        </div>
                        <div ref={provinceRef} className="relative z-10">
                          <label className={labelClass}>Provinsi</label>
                          <div className="relative">
                            <input
                              type="text"
                              className={`${inputClass} pr-10`}
                              placeholder="Cari provinsi..."
                              value={provinceQuery}
                              onChange={(e) => {
                                setProvinceQuery(e.target.value);
                                setIsProvinceOpen(true);
                                setProvince(''); // clear actual selection until clicked
                              }}
                              onFocus={() => setIsProvinceOpen(true)}
                              required
                            />
                            <div 
                              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center w-6 h-6"
                              onClick={() => setIsProvinceOpen(!isProvinceOpen)}
                            >
                              <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${isProvinceOpen ? 'rotate-180' : ''}`}>
                                expand_more
                              </span>
                            </div>
                          </div>
                          
                          {isProvinceOpen && (
                            <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-30">
                              {filteredProvinces.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 font-['Manrope'] text-center">Tidak ditemukan</div>
                              ) : (
                                filteredProvinces.map((p) => (
                                  <div
                                    key={p}
                                    className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors font-['Manrope'] text-sm ${province === p ? 'bg-[#bd8033]/5 text-[#bd8033] font-semibold' : 'text-gray-700'}`}
                                    onClick={() => {
                                      setProvince(p);
                                      setProvinceQuery(p);
                                      setIsProvinceOpen(false);
                                    }}
                                  >
                                    {p}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-1/2">
                        <label className={labelClass}>Kode Pos (Opsional)</label>
                        <input type="text" placeholder="12345" className={inputClass} value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {error && <p className="text-red-500 text-sm text-center font-['Manrope'] bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}

                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-[#18281a] text-white rounded-lg py-3.5 font-semibold text-sm tracking-wider hover:bg-[#2c4730] transition-colors font-['Manrope'] mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Kirim Kode OTP
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="mt-6 flex items-center justify-between">
                <span className="border-b w-1/5 lg:w-1/4 border-gray-300"></span>
                <span className="text-xs text-center text-gray-500 uppercase font-['Manrope']">Atau</span>
                <span className="border-b w-1/5 lg:w-1/4 border-gray-300"></span>
              </div>

              {/* Google Register */}
              <button
                onClick={handleGoogleRegister}
                className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg py-3 font-semibold text-sm hover:bg-gray-50 transition-colors font-['Manrope'] mt-6 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {t('auth.loginWithGoogle')}
              </button>
            </>
          )}

          {/* ===================== STEP 2: Verifikasi OTP ===================== */}
          {step === 2 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#18281a]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-[#18281a] text-[32px]">smartphone</span>
              </div>
              <h2 className="font-['Playfair_Display'] text-2xl text-[#18281a] mb-2">Verifikasi WhatsApp</h2>
              <p className="text-sm text-[#434842] font-['Manrope'] mb-1">Masukkan kode 6 digit yang dikirim ke</p>
              <p className="text-sm font-bold text-[#18281a] font-['Manrope'] mb-6">{phone}</p>

              {/* OTP Input */}
              <div className="flex justify-center gap-2 sm:gap-3 mb-4" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-11 h-14 sm:w-13 sm:h-16 border-2 border-gray-300 rounded-xl text-center text-xl font-bold font-['Manrope'] focus:border-[#bd8033] focus:ring-2 focus:ring-[#bd8033]/20 outline-none transition-all bg-white"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {/* Countdown */}
              {otpCountdown > 0 && (
                <p className="text-xs text-[#434842] font-['Manrope'] mb-4">
                  Kode berlaku selama <span className="font-bold text-[#18281a]">{formatCountdown(otpCountdown)}</span>
                </p>
              )}
              {otpCountdown <= 0 && (
                <p className="text-xs text-red-500 font-['Manrope'] mb-4 font-semibold">Kode OTP sudah kedaluwarsa.</p>
              )}

              {error && <p className="text-red-500 text-sm text-center font-['Manrope'] bg-red-50 border border-red-100 rounded-lg p-3 mb-4">{error}</p>}

              <button
                onClick={handleVerifyAndRegister}
                disabled={loading || otpCountdown <= 0}
                className="w-full bg-[#18281a] text-white rounded-lg py-3.5 font-semibold text-sm tracking-wider hover:bg-[#2c4730] transition-colors font-['Manrope'] disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verifikasi & Daftar
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </>
                )}
              </button>

              {/* Resend */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className={`text-sm font-['Manrope'] transition-colors ${
                    resendCooldown > 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-[#bd8033] hover:underline cursor-pointer font-semibold'
                  }`}
                >
                  {resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim Ulang Kode'}
                </button>
              </div>

              {/* Back */}
              <button
                onClick={() => { setStep(1); setError(null); }}
                className="mt-4 text-sm text-[#434842] hover:text-[#18281a] font-['Manrope'] transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Kembali ke form
              </button>
            </div>
          )}

          {/* ===================== STEP 3: Sukses ===================== */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-green-600 text-[40px]">check_circle</span>
              </div>
              <h2 className="font-['Playfair_Display'] text-2xl text-[#18281a] mb-3">Pendaftaran Berhasil!</h2>
              <p className="text-sm text-[#434842] font-['Manrope'] mb-2">Kami telah mengirimkan link verifikasi ke email:</p>
              <p className="text-sm font-bold text-[#18281a] font-['Manrope'] mb-6">{email}</p>
              <p className="text-xs text-[#434842] font-['Manrope'] mb-8">Silakan cek inbox (atau folder spam) dan klik link verifikasi untuk mengaktifkan akun Anda.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-[#18281a] text-white rounded-lg px-8 py-3 font-semibold text-sm tracking-wider hover:bg-[#2c4730] transition-colors font-['Manrope']"
              >
                Masuk ke Akun
                <span className="material-symbols-outlined text-[18px]">login</span>
              </Link>
            </div>
          )}

          {/* Footer link */}
          {step !== 3 && (
            <p className="text-center mt-8 text-sm text-gray-600 font-['Manrope']">
              {t('auth.alreadyHaveAccount')} <Link href="/login" className="text-[#bd8033] hover:underline">{t('auth.login')}</Link>
            </p>
          )}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
