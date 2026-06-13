"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import ImageUploader from '../../../components/admin/ImageUploader';
import { useUI } from '../../../components/admin/UIProvider';
import { useLanguage } from '../../../context/LanguageContext';

export default function AboutContentAdmin() {
  const { toast } = useUI();
  const { t } = useLanguage();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase.from('about_content').select('*').order('id');
      if (error) throw error;
      setSections(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, title, desc, content) => {
    setSaving(id);
    try {
      const { error } = await supabase.from('about_content').upsert({
        id, title, desc, content
      });
      if (error) throw error;
      toast.success(`Section ${id} updated successfully.`);
    } catch (err) {
      toast.error(`Failed to update ${id}: ` + err.message);
    } finally {
      setSaving(null);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto pb-12 animate-pulse">
      <div className="flex justify-between items-center mb-8 h-16">
        <div>
          <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
          <div className="w-64 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-96">
         <div className="bg-gray-50 p-4 border-b flex gap-2">
           {[1, 2, 3, 4].map(i => <div key={i} className="w-24 h-10 bg-gray-200 rounded-lg"></div>)}
         </div>
         <div className="p-6">
            <div className="w-full h-64 bg-gray-100 rounded-lg"></div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-2xl font-bold text-[#18281a]">{t('admin.about.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('admin.about.subtitle')}</p>
        </div>

        {sections.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {t('admin.about.noContent')}
          </div>
        )}

      {sections.map(section => (
        <SectionEditor 
          key={section.id} 
          data={section} 
          onSave={handleUpdate} 
          isSaving={saving === section.id} 
        />
      ))}
    </div>
  );
}

function SectionEditor({ data, onSave, isSaving }) {
  const { toast } = useUI();
  const { t } = useLanguage();
  const [title, setTitle] = useState(data.title || '');
  const [desc, setDesc] = useState(data.desc || '');
  const [enTitle, setEnTitle] = useState(data.content?.en_title || '');
  const [enDesc, setEnDesc] = useState(data.content?.en_desc || '');
  const [content, setContent] = useState(JSON.stringify(data.content, null, 2));

  const handleSave = () => {
    try {
      const parsedContent = JSON.parse(content);
      parsedContent.en_title = enTitle;
      parsedContent.en_desc = enDesc;
      onSave(data.id, title, desc, parsedContent);
    } catch (e) {
      toast.error('Invalid JSON in content fields. Please fix the JSON format before saving.');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-[#18281a] flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-400">segment</span>
            {t('admin.about.section')}: <span className="uppercase text-[#56b4a2] ml-1">{data.id}</span>
          </h2>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-[#18281a] text-white text-sm font-semibold rounded-lg hover:bg-[#2c4730] transition-colors disabled:bg-gray-400 flex items-center gap-2"
          >
            {isSaving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {isSaving ? t('admin.products.saving') : t('admin.about.saveChanges')}
          </button>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-[#815513] border-b pb-2">{t('admin.about.idLabel')}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.about.sectionTitle')}</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.about.sectionDesc')}</label>
              <textarea 
                rows="4" 
                value={desc} 
                onChange={e => setDesc(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] outline-none" 
              ></textarea>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-[#815513] border-b pb-2">{t('admin.about.enLabel')}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.about.sectionTitle')}</label>
              <input 
                type="text" 
                value={enTitle} 
                onChange={e => setEnTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.about.sectionDesc')}</label>
              <textarea 
                rows="4" 
                value={enDesc} 
                onChange={e => setEnDesc(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] outline-none" 
              ></textarea>
            </div>
          </div>
        </div>

        {data.id === 'founder' && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.about.founderImage')}</label>
            <ImageUploader 
              value={(() => {
                try {
                  const c = JSON.parse(content);
                  return c.image || '';
                } catch { return ''; }
              })()}
              onChange={(url) => {
                try {
                  const c = JSON.parse(content);
                  c.image = url;
                  setContent(JSON.stringify(c, null, 2));
                } catch (e) {
                  toast.error('Content JSON is invalid, cannot update image.');
                }
              }}
              placeholder="/images/About/senara-owner.webp or upload a new image"
            />
            {(() => {
                try {
                  const c = JSON.parse(content);
                  if (c.image) return (
                    <div className="mt-3 w-32 h-32 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center">
                      <img src={c.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  );
                } catch {}
                return null;
            })()}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
            {t('admin.about.contentDetails')}
            <span className="text-xs text-orange-600 font-normal bg-orange-50 px-2 py-0.5 rounded">{t('admin.about.jsonWarning')}</span>
          </label>
          <textarea 
            rows="6" 
            value={content} 
            onChange={e => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] outline-none font-mono text-sm bg-gray-50 text-gray-800" 
          ></textarea>
        </div>
      </div>
    </div>
  );
}
