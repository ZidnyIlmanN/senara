"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import ImageUploader from '../../../components/admin/ImageUploader';
import { useUI } from '../../../components/admin/UIProvider';
import { useLanguage } from '../../../context/LanguageContext';

export default function TimelineAdmin() {
  const { toast, confirm } = useUI();
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [activeEventId, setActiveEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
      if (data && data.length > 0 && !activeEventId) {
        setActiveEventId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScrollTo = (id) => {
    setActiveEventId(id);
    const el = document.getElementById(`event-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUpdate = async (id, updatedData) => {
    setSaving(id);
    try {
      const { error } = await supabase.from('timeline_events').upsert({ id, ...updatedData });
      if (error) throw error;
      toast.success(t('admin.common.updateSuccess'));
      fetchEvents();
    } catch (err) {
      toast.error(t('admin.common.updateFailed') + ': ' + err.message);
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id) => {
    if (!await confirm(t('admin.common.confirmDelete'))) return;
    try {
      const { error } = await supabase.from('timeline_events').delete().eq('id', id);
      if (error) throw error;
      setEvents(events.filter(e => e.id !== id));
      toast.success(t('admin.common.deleteSuccess'));
    } catch (err) {
      toast.error(t('admin.common.deleteFailed') + ': ' + err.message);
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto pb-12 animate-pulse">
      <div className="flex justify-between items-center mb-8 h-16">
        <div>
          <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
          <div className="w-64 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-72 h-64 bg-white rounded-xl border border-gray-200 shadow-sm"></div>
        <div className="flex-grow space-y-6 w-full">
           {[1, 2, 3].map(i => <div key={i} className="w-full h-20 bg-white rounded-xl border border-gray-200 shadow-sm"></div>)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#18281a]">{t('admin.timeline.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('admin.timeline.subtitle')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start relative">
        {/* Floating TOC */}
        <div className="w-full md:w-72 shrink-0 md:sticky md:top-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm hidden md:block">
          <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">{t('admin.timeline.toc')}</h3>
          <div className="flex flex-col space-y-1">
            {events.map(event => (
              <button
                key={`toc-${event.id}`}
                onClick={() => handleScrollTo(event.id)}
                className={`text-left text-sm px-3 py-2 rounded-md transition-colors truncate ${activeEventId === event.id ? 'bg-[#56b4a2] text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
                title={event.title}
              >
                <span className="font-mono text-xs opacity-70 mr-2">{event.order_index}</span> {event.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow space-y-6 w-full">
          {events.length === 0 && (
            <div className="bg-orange-50 text-orange-700 p-4 rounded-xl border border-orange-100">
              {t('admin.timeline.noEvents')}
            </div>
          )}
          {events.map(event => (
            <EventEditor 
              key={event.id} 
              data={event} 
              onSave={(data) => handleUpdate(event.id, data)} 
              onDelete={() => handleDelete(event.id)}
              isSaving={saving === event.id} 
              isOpen={activeEventId === event.id}
              onToggle={() => setActiveEventId(activeEventId === event.id ? null : event.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EventEditor({ data, onSave, onDelete, isSaving, isOpen, onToggle }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: data.title || '',
    desc: data.desc || '',
    en_title: data.en_title || '',
    en_desc: data.en_desc || '',
    date: data.date || '',
    year: data.year || '',
    month: data.month || '',
    order_index: data.order_index || 0,
  });

  const [mediaList, setMediaList] = useState(() => {
    const defaultMedia = data.content?.media || [];
    return defaultMedia.map((m, idx) => ({
      ...m,
      caption: data.image_captions?.[`caption${idx + 1}`] || m.caption || ''
    }));
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMediaChange = (index, field, value) => {
    const newList = [...mediaList];
    newList[index][field] = value;
    setMediaList(newList);
  };

  const handleAddMedia = () => {
    setMediaList([...mediaList, { type: 'image', src: '', caption: '' }]);
  };

  const handleRemoveMedia = (index) => {
    setMediaList(mediaList.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const newCaptions = {};
    const cleanMediaList = mediaList.map((m, idx) => {
        newCaptions[`caption${idx + 1}`] = m.caption || '';
        return { type: m.type, src: m.src, caption: m.caption };
    });
    
    onSave({
        ...formData,
        content: { ...data.content, media: cleanMediaList },
        image_captions: newCaptions
    });
  };

  return (
    <div id={`event-${data.id}`} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden scroll-mt-24 transition-all">
      <div 
        className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={onToggle}
      >
        <h2 className="font-semibold text-[#18281a] flex items-start md:items-center gap-3 w-full md:w-auto">
          <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 mt-0.5 md:mt-0 ${isOpen ? 'rotate-90' : ''} shrink-0`}>
            chevron_right
          </span>
          <span className="bg-[#18281a] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs leading-none shrink-0 mt-0.5 md:mt-0">
            {formData.order_index}
          </span>
          <span className="leading-snug pr-2">{formData.title}</span>
        </h2>
        <div className="flex gap-2 shrink-0 self-end md:self-center ml-0 md:ml-4" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={onDelete}
            className="px-3 py-1.5 text-red-600 bg-red-50 text-sm font-semibold rounded hover:bg-red-100 transition-colors"
          >
            {t('admin.common.delete')}
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 bg-[#18281a] text-white text-sm font-semibold rounded hover:bg-[#2c4730] transition-colors disabled:bg-gray-400"
          >
            {isSaving ? t('admin.common.saving') : t('admin.common.save')}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-[#815513] border-b pb-2">{t('admin.timeline.idLabel')}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.timeline.eventTitle')}</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#56b4a2] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.timeline.eventDesc')}</label>
              <textarea name="desc" rows="3" value={formData.desc} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#56b4a2] outline-none font-mono text-sm"></textarea>
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-[#815513] border-b pb-2">{t('admin.timeline.enLabel')}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.timeline.eventTitle')}</label>
              <input type="text" name="en_title" value={formData.en_title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#56b4a2] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.timeline.eventDesc')}</label>
              <textarea name="en_desc" rows="3" value={formData.en_desc} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#56b4a2] outline-none font-mono text-sm"></textarea>
            </div>
          </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.timeline.dateString')}</label>
          <input type="text" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#56b4a2] outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.timeline.year')}</label>
            <input type="text" name="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#56b4a2] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.timeline.month')}</label>
            <input type="text" name="month" value={formData.month} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#56b4a2] outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.timeline.orderIndex')}</label>
          <input type="number" name="order_index" value={formData.order_index} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#56b4a2] outline-none" />
        </div>
        
        {/* Media Manager Section */}
        <div className="md:col-span-2 mt-4 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#18281a]">{t('admin.timeline.mediaTitle')}</h3>
            <button 
              onClick={handleAddMedia}
              className="px-3 py-1.5 bg-gray-100 text-[#18281a] text-sm font-semibold rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> {t('admin.timeline.addMedia')}
            </button>
          </div>
          <div className="space-y-4">
            {mediaList.length === 0 && <p className="text-gray-500 text-sm">{t('admin.timeline.noMedia')}</p>}
            {mediaList.map((media, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative group">
                <button 
                  onClick={() => handleRemoveMedia(idx)}
                  className="absolute top-3 right-3 md:top-2 md:right-2 text-red-500 hover:text-white bg-white hover:bg-red-500 border border-red-100 md:border-none rounded-full w-8 h-8 md:w-6 md:h-6 flex items-center justify-center shadow-md md:shadow-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-all z-10"
                  title="Remove Media"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
                <div className="w-full md:w-32 h-32 shrink-0 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center relative">
                  {media.src ? (
                    media.type === 'video' ? (
                        <div className="w-full h-full bg-black/80 flex items-center justify-center text-white text-xs">Video</div>
                    ) : (
                        <img src={media.src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <span className="text-gray-400 text-xs">No Image</span>
                  )}
                </div>
                <div className="flex-grow space-y-3">
                  <div className="flex flex-col md:flex-row gap-2">
                    <select 
                      value={media.type} 
                      onChange={(e) => handleMediaChange(idx, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#56b4a2] outline-none text-sm bg-white md:w-32 shrink-0"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <ImageUploader 
                      value={media.src} 
                      onChange={(url) => handleMediaChange(idx, 'src', url)}
                      placeholder="Media URL (or upload)"
                      className="flex-grow"
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="Caption for this specific media (optional)" 
                      rows="2" 
                      value={media.caption} 
                      onChange={(e) => handleMediaChange(idx, 'caption', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#56b4a2] outline-none text-sm resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
