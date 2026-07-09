"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import FooterSection from '../../components/FooterSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faAward, faGift } from '@fortawesome/free-solid-svg-icons';

const byPrefixAndName = {
  fas: {
    'user': faUser,
    'award': faAward,
    'gift': faGift
  }
};

export default function ProfilePage() {
  const { user, userProfile, role, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Real sales state
  const [currentSales, setCurrentSales] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setPhone(userProfile.phone || '');
      setStoreName(userProfile.store_name || '');
      setAddress(userProfile.address || '');
      setCity(userProfile.city || '');
      setProvince(userProfile.province || '');
      setAvatarUrl(userProfile.avatar_url || '');
    }
  }, [userProfile]);

  // Fetch current sales for business roles
  useEffect(() => {
    if (user && role && role !== 'customer') {
      const fetchSales = async () => {
        try {
          // Get start and end of current month
          const date = new Date();
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
          const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();

          const { data, error } = await supabase
            .from('orders')
            .select('package_amount')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .gte('created_at', startOfMonth)
            .lte('created_at', endOfMonth);

          if (error) throw error;
          
          const total = data.reduce((sum, order) => sum + (order.package_amount || 0), 0);
          setCurrentSales(total);
        } catch (err) {
          console.error("Error fetching sales:", err);
        }
      };
      fetchSales();
    }
  }, [user, role]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18281a]"></div>
      </div>
    );
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setMessage({ type: 'success', text: 'Foto profil berhasil diperbarui.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal mengupload foto: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const updates = {
        full_name: fullName,
        phone,
        store_name: storeName,
        address,
        city,
        province,
      };

      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal memperbarui profil: ' + error.message });
    } finally {
      setSaving(false);
    }
  };

  const isBusiness = role !== 'customer';

  // Reward Config
  const rewardsConfig = {
    distributor: {
      target: 1000,
      rewardText: 'Trip to Malaysia 3 hari atau uang senilai Rp. 10.000.000,-',
      asterisk: '*',
    },
    agent: {
      target: 100,
      rewardText: '1 unit kulkas atau TV atau uang Rp. 2.000.000,-',
      asterisk: '**',
    },
    reseller: {
      target: 25,
      rewardText: '1 unit ipad atau uang Rp. 625.000,-',
      asterisk: '**',
    }
  };

  const currentReward = rewardsConfig[role] || null;
  const progressPercent = currentReward ? Math.min((currentSales / currentReward.target) * 100, 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdf7]">
      <Navbar />
      <div style={{ height: '96px' }} />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="font-['Playfair_Display'] text-4xl text-[#18281a] mb-8">Akun Saya</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center mb-6">
              <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#18281a]/5 text-[#18281a]">
                      <span className="material-symbols-outlined text-[40px]">person</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white">photo_camera</span>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </div>
              <h2 className="font-['Manrope'] font-bold text-lg text-center text-[#18281a]">{userProfile?.full_name}</h2>
              <p className="text-sm text-gray-500 mb-2 font-['Manrope']">{user.email}</p>
              <span className="inline-block px-3 py-1 bg-[#bd8033]/10 text-[#bd8033] text-[10px] font-bold uppercase tracking-wider rounded-sm font-['Manrope']">
                {role === 'customer' ? 'Customer' : role.toUpperCase()}
              </span>
            </div>

            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-shrink-0 text-left px-5 py-3 rounded-lg font-['Manrope'] text-sm font-semibold transition-colors flex items-center gap-3 ${activeTab === 'profile' ? 'bg-[#18281a] text-white' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <div className="w-[18px] text-center">
                  <FontAwesomeIcon icon={byPrefixAndName.fas['user']} className="text-[16px]" />
                </div>
                Data Diri
              </button>
              {isBusiness && (
                <button 
                  onClick={() => setActiveTab('rewards')}
                  className={`flex-shrink-0 text-left px-5 py-3 rounded-lg font-['Manrope'] text-sm font-semibold transition-colors flex items-center gap-3 ${activeTab === 'rewards' ? 'bg-[#bd8033] text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <div className="w-[18px] text-center">
                    <FontAwesomeIcon icon={byPrefixAndName.fas['award']} className="text-[16px]" />
                  </div>
                  Reward & Bonus
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {message && (
              <div className={`p-4 rounded-lg mb-6 text-sm font-['Manrope'] flex items-start gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                <span className="material-symbols-outlined text-[18px]">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                {message.text}
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#18281a]">Data Diri</h3>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="text-sm font-['Manrope'] font-semibold text-[#bd8033] hover:underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">edit</span> Edit Profil
                    </button>
                  ) : (
                    <button onClick={() => {setIsEditing(false); setMessage(null);}} className="text-sm font-['Manrope'] font-semibold text-gray-500 hover:underline">
                      Batal
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#434842] mb-1.5 font-['Manrope'] uppercase tracking-wider">Nama Lengkap</label>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!isEditing} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#bd8033] outline-none disabled:bg-gray-50 transition-colors font-['Manrope']" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#434842] mb-1.5 font-['Manrope'] uppercase tracking-wider">No. WhatsApp</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditing} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#bd8033] outline-none disabled:bg-gray-50 transition-colors font-['Manrope']" required />
                    </div>
                  </div>

                  {isBusiness && (
                    <>
                      <div className="pt-4 border-t border-gray-100 mt-4">
                        <label className="block text-xs font-semibold text-[#434842] mb-1.5 font-['Manrope'] uppercase tracking-wider">Nama Toko/Usaha</label>
                        <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} disabled={!isEditing} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#bd8033] outline-none disabled:bg-gray-50 transition-colors font-['Manrope']" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#434842] mb-1.5 font-['Manrope'] uppercase tracking-wider">Alamat Lengkap</label>
                        <textarea value={address} onChange={(e) => setAddress(e.target.value)} disabled={!isEditing} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#bd8033] outline-none disabled:bg-gray-50 transition-colors font-['Manrope'] resize-none" required />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-[#434842] mb-1.5 font-['Manrope'] uppercase tracking-wider">Kota / Kabupaten</label>
                          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} disabled={!isEditing} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#bd8033] outline-none disabled:bg-gray-50 transition-colors font-['Manrope']" required />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#434842] mb-1.5 font-['Manrope'] uppercase tracking-wider">Provinsi</label>
                          <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} disabled={!isEditing} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-[#bd8033] outline-none disabled:bg-gray-50 transition-colors font-['Manrope']" required />
                        </div>
                      </div>
                    </>
                  )}

                  {isEditing && (
                    <div className="pt-4 flex justify-end">
                      <button type="submit" disabled={saving} className="bg-[#18281a] text-white rounded-lg px-8 py-3 font-semibold text-sm tracking-wider hover:bg-[#2c4730] transition-colors font-['Manrope'] flex items-center gap-2">
                        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* TAB: REWARDS */}
            {activeTab === 'rewards' && isBusiness && currentReward && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#bd8033] text-white p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <span className="material-symbols-outlined text-[200px]">redeem</span>
                  </div>
                  <h3 className="font-['Playfair_Display'] text-3xl mb-2 relative z-10">Rewards & Bonus</h3>
                  <p className="font-['Manrope'] text-white/90 max-w-md relative z-10">Tingkatkan penjualan Anda bulan ini dan raih hadiah eksklusif dari SENARA.</p>
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-['Manrope'] font-bold text-xl text-[#18281a] uppercase tracking-wider flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#bd8033]">star</span>
                        {role} {currentReward.asterisk}
                      </h4>
                      <p className="text-sm text-gray-500 font-['Manrope'] mt-1">Target bulanan: <strong className="text-[#18281a]">{currentReward.target} paket</strong></p>
                    </div>
                    <div className="text-right">
                      <p className="font-['Playfair_Display'] text-3xl text-[#bd8033] font-bold">{currentSales}</p>
                      <p className="text-xs text-gray-500 font-['Manrope'] uppercase tracking-wider">Terjual</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-4 mb-3 overflow-hidden border border-gray-200">
                    <div 
                      className="bg-[#bd8033] h-4 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right text-gray-500 font-['Manrope'] mb-8">
                    {currentReward.target - currentSales > 0 
                      ? `Kurang ${currentReward.target - currentSales} paket lagi untuk mencapai target!` 
                      : 'Target tercapai! Hebat!'}
                  </p>

                  <div className="bg-[#fcfaf7] border border-[#bd8033]/20 rounded-xl p-6 mb-8 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#bd8033]/10 flex items-center justify-center flex-shrink-0 text-[#bd8033]">
                      <FontAwesomeIcon icon={byPrefixAndName.fas['gift']} className="text-[20px]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#bd8033] font-bold uppercase tracking-widest font-['Manrope'] mb-1">Hadiah Anda</p>
                      <p className="font-['Manrope'] text-[#18281a] font-medium leading-relaxed">{currentReward.rewardText}</p>
                    </div>
                  </div>

                  {/* Syarat dan Ketentuan */}
                  <div className="border-t border-gray-100 pt-6">
                    <h5 className="font-['Manrope'] font-bold text-sm text-[#18281a] mb-3">Syarat & Ketentuan:</h5>
                    <ul className="space-y-2 text-xs text-gray-500 font-['Manrope']">
                      <li className="flex gap-2">
                        <span className="font-bold">*</span>
                        <span>Reward/Bonus hanya untuk Distributor dalam satu wilayah.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">**</span>
                        <span>Agen dan Reseller bisa mendapatkan Reward/Bonus jika dalam satu wilayah belum ada Distributor.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold">**</span>
                        <span>Reward/Bonus Agen dan Reseller dalam satu wilayah bersama Distributor menjadi tanggung jawab Distributor.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
