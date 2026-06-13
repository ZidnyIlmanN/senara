"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { allProducts } from '../../data/products';
import idTranslations from '../../translations/id';
import enTranslations from '../../translations/en';
import { useUI } from '../../components/admin/UIProvider';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminDashboard() {
  const { toast } = useUI();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ products: 0, events: 0 });
  const [loading, setLoading] = useState(true);
  const [migrationState, setMigrationState] = useState('idle'); // idle, confirming, migrating, success, error
  const [migrationError, setMigrationError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const { count: eventCount } = await supabase.from('timeline_events').select('*', { count: 'exact', head: true });
        
        setStats({
          products: productCount || 0,
          events: eventCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const triggerMigration = () => {
    setMigrationState('confirming');
  };

  const executeMigration = async () => {
    setMigrationState('migrating');
    setMigrationError(null);
    
    try {
      // 1. Migrate Products
      for (const product of allProducts) {
        const { error } = await supabase.from('products').upsert({
          id: product.id,
          name: product.name,
          short_desc: product.shortDesc,
          desc: product.desc,
          price: product.price,
          image: product.image,
          badge: product.badge,
          badge_style: product.badgeStyle,
          type: product.type,
          conditions: product.conditions,
          ingredients: product.ingredients,
          volume: product.volume,
          benefits: product.benefits,
          how_to_use: product.howToUse,
          full_ingredients: product.fullIngredients,
          rating: product.rating,
          reviews_count: product.reviewsCount,
          stock: 100
        });
        if (error) throw new Error(`Product migration error: ${error.message}`);
      }

      // 2. Migrate About Sections
      const aboutContentData = [
        {
          id: 'roots', title: idTranslations.aboutPage.roots.title, desc: idTranslations.aboutPage.roots.desc,
          content: {
            feature1_title: idTranslations.aboutPage.roots.feature1_title, feature1_desc: idTranslations.aboutPage.roots.feature1_desc,
            feature2_title: idTranslations.aboutPage.roots.feature2_title, feature2_desc: idTranslations.aboutPage.roots.feature2_desc,
            quote: idTranslations.aboutPage.roots.quote
          }
        },
        {
          id: 'process', title: idTranslations.aboutPage.process.title, desc: idTranslations.aboutPage.process.desc,
          content: {
            step1_title: idTranslations.aboutPage.process.step1_title, step1_desc: idTranslations.aboutPage.process.step1_desc,
            step2_title: idTranslations.aboutPage.process.step2_title, step2_desc: idTranslations.aboutPage.process.step2_desc,
            step3_title: idTranslations.aboutPage.process.step3_title, step3_desc: idTranslations.aboutPage.process.step3_desc,
          }
        },
        {
          id: 'sustainability', title: idTranslations.aboutPage.sustainability.title, desc: idTranslations.aboutPage.sustainability.desc,
          content: {
            feature1_title: idTranslations.aboutPage.sustainability.feature1_title, feature1_desc: idTranslations.aboutPage.sustainability.feature1_desc,
            feature2_title: idTranslations.aboutPage.sustainability.feature2_title, feature2_desc: idTranslations.aboutPage.sustainability.feature2_desc,
          }
        },
        {
          id: 'founder', title: idTranslations.aboutPage.founder.title, desc: idTranslations.aboutPage.founder.desc,
          content: { name: idTranslations.aboutPage.founder.name, quote: idTranslations.aboutPage.founder.quote }
        }
      ];

      for (const section of aboutContentData) {
        const { error } = await supabase.from('about_content').upsert(section);
        if (error) throw new Error(`About section migration error: ${error.message}`);
      }

      // 3. Migrate Timeline Events (with full media content)
      // First, verify that the 'content' column exists by doing a lightweight test query
      const { error: schemaTestError } = await supabase
        .from('timeline_events')
        .select('content')
        .limit(1);
      
      if (schemaTestError && schemaTestError.message.includes('content')) {
        throw new Error(
          'The "content" column does not exist on the timeline_events table. ' +
          'Please run this SQL in the Supabase Dashboard SQL Editor first:\n\n' +
          'ALTER TABLE timeline_events ADD COLUMN content JSONB;'
        );
      }

      const timelineMediaMap = {
        'p1': {
          media: [
            { type: 'image', src: '/images/About/activities/produksi-awal/produksi-awal-1.webp', caption: '' },
          ]
        },
        'p2': {
          media: [
            { type: 'image', src: '/images/About/activities/wisuda/wisuda-1.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/wisuda/wisuda-2.webp', caption: '' },
          ]
        },
        'p3': {
          media: [
            { type: 'image', src: '/images/About/activities/penghargaan-kemenkumham/penghargaan-kemenkumham-1.webp', caption: '' },
          ]
        },
        'p4': {
          media: [
            { type: 'video', src: '/images/About/activities/wawancara-tv/wawancara-tv-1.mp4', caption: '' },
          ]
        },
        'p5': {
          media: [
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-1.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-2.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-3.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-4.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-5.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-6.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-7.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-8.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-9.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-10.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-11.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-12.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/aksi-palestina/aksi-palestina-13.webp', caption: '' },
            { type: 'video', src: '/images/About/activities/aksi-palestina/aksi-palestina-1.mp4', caption: 'Sekretaris APDESI dukung produk dalam negeri SKINCARE SENARA' },
            { type: 'video', src: '/images/About/activities/aksi-palestina/aksi-palestina-2.mp4', caption: '' },
            { type: 'video', src: '/images/About/activities/aksi-palestina/aksi-palestina-3.mp4', caption: '' },
          ]
        },
        'p6': {
          media: [
            { type: 'image', src: '/images/About/activities/ivan-gunawan-kompas/ivan-gunawan-kompas-1.webp', caption: '' },
          ]
        },
        'p7': {
          media: [
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-1.webp', caption: 'Mendapatkan kehormatan dan apresiasi dari Mantan Hakim MK Prof. Dr. Hamdan Zulfa' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-2.webp', caption: 'Mendapatkan kehormatan dan apresiasi dari Bpk. Rachmat Gobel Anggota DPR RI, Wakil Ketua KADIN' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-3.webp', caption: 'Mendapatkan kunjungan dari Duta Rusia untuk Indonesia' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-4.webp', caption: 'Menjadi sponsor dalam Internasional expo di JCC' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-5.webp', caption: 'Menteri KOMDIGI Mutia Hafidz berkunjung ke stand SENARA' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-6.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-7.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-8.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-9.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-10.webp', caption: '' },
            { type: 'image', src: '/images/About/activities/jcc-expo/jcc-expo-11.webp', caption: '' },
          ]
        },
      };

      for (let i = 0; i < idTranslations.aboutPage.storyPoints.length; i++) {
        const point = idTranslations.aboutPage.storyPoints[i];
        const mediaContent = timelineMediaMap[point.id] || { media: [] };
        
        // Build image_captions from media content and override with translations if present
        const imageCaptions = {};
        mediaContent.media.forEach((m, idx) => {
          const transCaption = point[`caption${idx + 1}`];
          m.caption = transCaption || m.caption || '';
          imageCaptions[`caption${idx + 1}`] = m.caption;
        });

        const { error } = await supabase.from('timeline_events').upsert({
          id: point.id, 
          year: point.year, 
          month: point.month, 
          date: point.date, 
          title: point.title, 
          desc: point.desc,
          content: mediaContent,
          image_captions: imageCaptions,
          order_index: i
        });
        if (error) throw new Error(`Timeline event migration error: ${error.message}`);
      }

      // Migrate about_content
      const aboutSections = ['roots', 'process', 'sustainability', 'founder'];
      for (const section of aboutSections) {
        const idData = idTranslations.aboutPage[section];
        const enData = enTranslations.aboutPage[section];
        
        let contentPayload = {
          en_title: enData.title || '',
          en_desc: enData.desc || '',
        };

        // For process section
        if (section === 'process') {
          contentPayload = {
            ...contentPayload,
            headline: idData.title,
            en_headline: enData.title,
            step1_title: idData.step1_title,
            en_step1_title: enData.step1_title,
            step1_desc: idData.step1_desc,
            en_step1_desc: enData.step1_desc,
            step2_title: idData.step2_title,
            en_step2_title: enData.step2_title,
            step2_desc: idData.step2_desc,
            en_step2_desc: enData.step2_desc,
            step3_title: idData.step3_title,
            en_step3_title: enData.step3_title,
            step3_desc: idData.step3_desc,
            en_step3_desc: enData.step3_desc,
          };
        } else if (section === 'roots') {
          contentPayload = {
            ...contentPayload,
            feature1_title: idData.feature1_title,
            en_feature1_title: enData.feature1_title,
            feature1_desc: idData.feature1_desc,
            en_feature1_desc: enData.feature1_desc,
            feature2_title: idData.feature2_title,
            en_feature2_title: enData.feature2_title,
            feature2_desc: idData.feature2_desc,
            en_feature2_desc: enData.feature2_desc,
          };
        } else if (section === 'sustainability') {
          contentPayload = {
            ...contentPayload,
            feature1_title: idData.feature1_title,
            en_feature1_title: enData.feature1_title,
            feature1_desc: idData.feature1_desc,
            en_feature1_desc: enData.feature1_desc,
            feature2_title: idData.feature2_title,
            en_feature2_title: enData.feature2_title,
            feature2_desc: idData.feature2_desc,
            en_feature2_desc: enData.feature2_desc,
          };
        } else if (section === 'founder') {
           contentPayload = {
            ...contentPayload,
            image: '/images/About/senara-owner.webp',
            role: idData.title || '',
            en_role: enData.title || ''
           };
        }

        const { error: aboutError } = await supabase.from('about_content').upsert({
          id: section,
          title: idData.name || idData.title || '',
          desc: idData.desc || '',
          content: contentPayload
        });

        if (aboutError) throw new Error(`About content migration error: ${aboutError.message}`);
      }

      toast.success('Migration completed successfully.');
      setMigrationState('success');
    } catch (err) {
      toast.error('Migration failed: ' + err.message);
      setMigrationError(err.message);
      setMigrationState('error');
    }
  };

  if (loading) return (
    <div className="max-w-5xl space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-start h-[166px]">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-16 h-8 bg-gray-200 rounded mt-1"></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 h-64">
        <div className="w-48 h-6 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 h-32 bg-gray-50"></div>
          <div className="border border-gray-200 rounded-lg p-6 h-32 bg-gray-50"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-start">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mb-4">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">{t('admin.dashboard.totalProducts')}</h3>
          <p className="text-3xl font-bold text-[#18281a] mt-1">{stats.products}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-start">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg mb-4">
            <span className="material-symbols-outlined">history</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">{t('admin.dashboard.timelineEvents')}</h3>
          <p className="text-3xl font-bold text-[#18281a] mt-1">{stats.events}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-start">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg mb-4">
            <span className="material-symbols-outlined">database</span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">{t('admin.dashboard.dataTools')}</h3>
          <button 
            onClick={triggerMigration}
            className="mt-2 text-sm text-orange-600 hover:text-orange-700 underline font-medium focus:outline-none"
          >
            {t('admin.dashboard.migrateStaticData')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-semibold text-[#18281a] mb-6">{t('admin.dashboard.welcome')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin.senara/products" className="group border border-gray-200 rounded-lg p-6 hover:border-[#56b4a2] transition-colors block">
            <h3 className="font-semibold text-[#18281a] group-hover:text-[#56b4a2] flex items-center justify-between">
              {t('admin.dashboard.manageProducts')}
              <span className="material-symbols-outlined text-gray-400 group-hover:text-[#56b4a2]">arrow_forward</span>
            </h3>
            <p className="text-sm text-gray-500 mt-2">{t('admin.dashboard.manageProductsDesc')}</p>
          </Link>
          <Link href="/admin.senara/about" className="group border border-gray-200 rounded-lg p-6 hover:border-[#56b4a2] transition-colors block">
            <h3 className="font-semibold text-[#18281a] group-hover:text-[#56b4a2] flex items-center justify-between">
              {t('admin.dashboard.manageAbout')}
              <span className="material-symbols-outlined text-gray-400 group-hover:text-[#56b4a2]">arrow_forward</span>
            </h3>
            <p className="text-sm text-gray-500 mt-2">{t('admin.dashboard.manageAboutDesc')}</p>
          </Link>
        </div>
      </div>

      {/* Migration Modal */}
      {migrationState !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18281a]/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            {migrationState === 'confirming' && (
              <>
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl">warning</span>
                </div>
                <h3 className="text-xl font-bold text-[#18281a] mb-2">{t('admin.dashboard.migrateTitle')}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {t('admin.dashboard.migrateDesc')} <strong className="text-orange-600">{t('admin.dashboard.migrateOverwrite')}</strong> {t('admin.dashboard.migrateDescSuffix')}
                </p>
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setMigrationState('idle')}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {t('admin.dashboard.cancel')}
                  </button>
                  <button 
                    onClick={executeMigration}
                    className="px-4 py-2 text-sm font-semibold bg-[#18281a] text-white hover:bg-[#2c4730] rounded-lg transition-colors"
                  >
                    {t('admin.dashboard.yesMigrate')}
                  </button>
                </div>
              </>
            )}

            {migrationState === 'migrating' && (
              <div className="text-center py-6">
                <div className="inline-block w-12 h-12 border-4 border-[#56b4a2]/30 border-t-[#56b4a2] rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-[#18281a] mb-2">{t('admin.dashboard.migrating')}</h3>
                <p className="text-gray-500 text-sm">{t('admin.dashboard.migratingWait')}</p>
              </div>
            )}

            {migrationState === 'success' && (
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h3 className="text-xl font-bold text-[#18281a] mb-2">{t('admin.dashboard.migrationSuccess')}</h3>
                <p className="text-gray-600 text-sm mb-6">{t('admin.dashboard.migrationSuccessDesc')}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-3 text-sm font-semibold bg-[#18281a] text-white hover:bg-[#2c4730] rounded-lg transition-colors"
                >
                  {t('admin.dashboard.reloadDashboard')}
                </button>
              </div>
            )}

            {migrationState === 'error' && (
              <>
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl">error</span>
                </div>
                <h3 className="text-xl font-bold text-[#18281a] mb-2">{t('admin.dashboard.migrationFailed')}</h3>
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6 break-words font-mono">
                  {migrationError}
                </div>
                <button 
                  onClick={() => setMigrationState('idle')}
                  className="w-full px-4 py-3 text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {t('admin.dashboard.close')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
