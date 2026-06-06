"use client";
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import FooterSection from '../../components/FooterSection';
import { useLanguage } from '../../context/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending email/message
    const message = `Halo, nama saya ${formData.name}.\n\nTopik: ${formData.subject}\n\nPesan:\n${formData.message}\n\nKontak:\nPhone: ${formData.phone}\nEmail: ${formData.email}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/6281318141050?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section with Background Image */}
      <div className="relative w-full overflow-hidden h-[80vh] md:h-screen min-h-[500px]">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/contact-hero.jpg" 
            alt="SENARA Contact Hero" 
            className="w-full h-full object-cover"
            style={{ backgroundColor: '#c3c8c0' }}
          />
        </div>
        {/* Gradient Overlay: 
            Atas: Putih pekat memudar ke transparan di area bawah teks.
            Bawah: Transparan memudar ke putih pekat di ujung bawah gambar.
        */}
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 40%, rgba(255,255,255,0) 70%, rgba(255,255,255,0) 90%, #ffffff 100%)' }} />
        
        {/* Hero Content */}
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-start text-center pt-32 md:pt-40 px-6 max-w-[1000px] mx-auto">
          <h1 className="font-['Playfair_Display'] text-[40px] md:text-[64px] text-[#18281a] mb-4 max-w-4xl mx-auto leading-tight relative z-10">
            {t('contactPage.title')}
          </h1>
          <p className="font-['Manrope'] text-[16px] md:text-[18px] text-[#434842] leading-relaxed max-w-[700px] relative z-10">
            {t('contactPage.subtitle')}
          </p>
        </div>
      </div>

      {/* Kontainer ditarik drastis ke atas agar dekat dengan hero text */}
      <div className="flex-grow max-w-[1200px] mx-auto px-6 md:px-8 pb-20 w-full relative z-10 -mt-40 md:-mt-[40vh]">

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left Column: Form */}
          <div className="bg-[#f6f3ef] rounded-2xl p-8 md:p-10 shadow-sm border border-[#c3c8c0]/30 h-full">
            <h2 className="font-['Manrope'] text-[18px] md:text-[20px] font-bold text-[#18281a] mb-8 uppercase tracking-widest">
              {t('contactPage.getInTouch')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-['Manrope'] text-[12px] font-bold text-[#18281a] uppercase tracking-wider mb-2">
                    {t('contactPage.form.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contactPage.form.namePlaceholder')}
                    className="w-full bg-white border border-[#c3c8c0]/50 rounded-lg px-4 py-3 font-['Manrope'] text-[14px] text-[#18281a] focus:outline-none focus:border-[#815513] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block font-['Manrope'] text-[12px] font-bold text-[#18281a] uppercase tracking-wider mb-2">
                    {t('contactPage.form.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('contactPage.form.phonePlaceholder')}
                    className="w-full bg-white border border-[#c3c8c0]/50 rounded-lg px-4 py-3 font-['Manrope'] text-[14px] text-[#18281a] focus:outline-none focus:border-[#815513] transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-['Manrope'] text-[12px] font-bold text-[#18281a] uppercase tracking-wider mb-2">
                  {t('contactPage.form.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contactPage.form.emailPlaceholder')}
                  className="w-full bg-white border border-[#c3c8c0]/50 rounded-lg px-4 py-3 font-['Manrope'] text-[14px] text-[#18281a] focus:outline-none focus:border-[#815513] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block font-['Manrope'] text-[12px] font-bold text-[#18281a] uppercase tracking-wider mb-2">
                  {t('contactPage.form.subject')}
                </label>
                <div className="relative">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#c3c8c0]/50 rounded-lg px-4 py-3 font-['Manrope'] text-[14px] text-[#18281a] focus:outline-none focus:border-[#815513] transition-colors cursor-pointer"
                    required
                  >
                    <option value="" disabled>{t('contactPage.form.subjectPlaceholder')}</option>
                    <option value={t('contactPage.form.topics.general')}>{t('contactPage.form.topics.general')}</option>
                    <option value={t('contactPage.form.topics.partnership')}>{t('contactPage.form.topics.partnership')}</option>
                    <option value={t('contactPage.form.topics.product')}>{t('contactPage.form.topics.product')}</option>
                    <option value={t('contactPage.form.topics.career')}>{t('contactPage.form.topics.career')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-['Manrope'] text-[12px] font-bold text-[#18281a] uppercase tracking-wider mb-2">
                  {t('contactPage.form.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder=""
                  rows={4}
                  className="w-full bg-white border border-[#c3c8c0]/50 rounded-lg px-4 py-3 font-['Manrope'] text-[14px] text-[#18281a] focus:outline-none focus:border-[#815513] transition-colors resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#18281a] hover:bg-[#815513] text-white font-['Manrope'] text-[14px] font-bold py-4 px-8 rounded-lg uppercase tracking-widest transition-colors duration-300 mt-2"
              >
                {t('contactPage.form.send')}
              </button>
            </form>
          </div>

          {/* Right Column: Info & Hours */}
          <div className="flex flex-col gap-8 h-full">
            {/* Contact Info */}
            <div className="bg-[#f6f3ef] rounded-2xl p-8 md:p-10 shadow-sm border border-[#c3c8c0]/30 flex-1">
              <h2 className="font-['Manrope'] text-[18px] md:text-[20px] font-bold text-[#18281a] mb-8 uppercase tracking-widest">
                {t('contactPage.contactInfo')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Phone */}
                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[#815513] mt-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>call</span>
                  <div>
                    <h3 className="font-['Manrope'] text-[12px] font-bold text-[#18281a] uppercase tracking-widest mb-1">{t('contactPage.info.phone')}</h3>
                    <p className="font-['Manrope'] text-[15px] text-[#434842]">{t('contactPage.info.phoneValue')}</p>
                  </div>
                </div>
                {/* Address */}
                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[#815513] mt-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>location_on</span>
                  <div>
                    <h3 className="font-['Manrope'] text-[12px] font-bold text-[#18281a] uppercase tracking-widest mb-1">{t('contactPage.info.address')}</h3>
                    <p className="font-['Manrope'] text-[15px] text-[#434842] leading-relaxed max-w-[200px]">{t('contactPage.info.addressValue')}</p>
                  </div>
                </div>
                {/* Email */}
                <div className="flex gap-4 items-start md:col-span-2">
                  <span className="material-symbols-outlined text-[#815513] mt-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>mail</span>
                  <div>
                    <h3 className="font-['Manrope'] text-[12px] font-bold text-[#18281a] uppercase tracking-widest mb-1">{t('contactPage.info.email')}</h3>
                    <p className="font-['Manrope'] text-[15px] text-[#434842]">{t('contactPage.info.emailValue')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-[#f6f3ef] rounded-2xl p-8 md:p-10 shadow-sm border border-[#c3c8c0]/30 flex-1">
              <h2 className="font-['Manrope'] text-[18px] md:text-[20px] font-bold text-[#18281a] mb-8 uppercase tracking-widest">
                {t('contactPage.businessHours')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                <div>
                  <h3 className="font-['Manrope'] text-[12px] font-bold text-[#18281a] uppercase tracking-widest mb-1">{t('contactPage.hours.weekdays')}</h3>
                  <p className="font-['Manrope'] text-[15px] text-[#434842]">{t('contactPage.hours.weekdaysValue')}</p>
                </div>
                <div>
                  <h3 className="font-['Manrope'] text-[12px] font-bold text-[#18281a] uppercase tracking-widest mb-1">{t('contactPage.hours.saturday')}</h3>
                  <p className="font-['Manrope'] text-[15px] text-[#434842]">{t('contactPage.hours.saturdayValue')}</p>
                </div>
                <div>
                  <h3 className="font-['Manrope'] text-[12px] font-bold text-[#18281a] uppercase tracking-widest mb-1">{t('contactPage.hours.sunday')}</h3>
                  <p className="font-['Manrope'] text-[15px] text-[#434842]">{t('contactPage.hours.sundayValue')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-[#c3c8c0]/30 bg-[#f6f3ef]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.72960058577686!2d107.78090499415417!3d-6.562819108584698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e693b6e03bd8faf%3A0x3ade05d01e638453!2sCQPJ%2BV9C%2C%20Jl.%20Kapten%20Hanafiah%2C%20Karanganyar%2C%20Kec.%20Subang%2C%20Kabupaten%20Subang%2C%20Jawa%20Barat%2041211!5e0!3m2!1sid!2sid!4v1780749743420!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          ></iframe>
        </div>
      </div>

      <FooterSection />
    </div>
  );
}
