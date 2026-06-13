"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';
import ImageUploader from '../../../../components/admin/ImageUploader';
import { useUI } from '../../../../components/admin/UIProvider';
import { useLanguage } from '../../../../context/LanguageContext';

export default function ProductForm({ params }) {
  const { toast } = useUI();
  const { t } = useLanguage();
  const router = useRouter();
  const isNew = params.id === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    short_desc: '',
    desc: '',
    price: '',
    stock: 100,
    image: '',
    badge: '',
    badge_style: '',
    type: '',
    conditions: '', // Stored as comma-separated string in form, array in DB
    ingredients: '', // Stored as comma-separated string in form, array in DB
    volume: '',
    benefits: '',
    how_to_use: '',
    full_ingredients: '',
  });

  useEffect(() => {
    if (!isNew) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();
        
      if (error) throw error;
      
      setFormData({
        ...data,
        conditions: data.conditions ? data.conditions.join(', ') : '',
        ingredients: data.ingredients ? data.ingredients.join(', ') : '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Process arrays
      const payload = {
        ...formData,
        price: parseInt(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        conditions: formData.conditions ? formData.conditions.split(',').map(s => s.trim()).filter(Boolean) : [],
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      if (isNew) {
        // Enforce ID generation if empty (basic slugify)
        if (!payload.id) {
          payload.id = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
      }

      const { error } = await supabase
        .from('products')
        .upsert(payload);

      if (error) throw error;
      
      toast.success('Product saved successfully!');
      router.push('/admin.senara/products');
      
    } catch (err) {
      setError(err.message);
      toast.error('Failed to save product: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-pulse">
      <div className="flex items-center gap-4 h-16">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div>
          <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
          <div className="w-64 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6 h-96">
        <div className="w-48 h-6 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full h-16 bg-gray-100 rounded"></div>
          <div className="w-full h-16 bg-gray-100 rounded"></div>
          <div className="w-full h-16 bg-gray-100 rounded"></div>
          <div className="w-full h-16 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin.senara/products" className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
          <span className="material-symbols-outlined text-[20px] block">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#18281a]">
            {isNew ? t('admin.products.createNew') : `${t('admin.products.editProduct')}: ${formData.name}`}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{t('admin.products.formSubtitle')}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[#18281a] border-b border-gray-100 pb-2">{t('admin.products.basicInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.productNameLabel')}</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.productIdLabel')} {isNew && t('admin.products.autoGenerated')}</label>
              <input type="text" name="id" disabled={!isNew} value={formData.id} onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all ${!isNew && 'bg-gray-100 text-gray-500 cursor-not-allowed'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.priceLabel')}</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange} min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.stockLabel')}</label>
              <input type="number" name="stock" required value={formData.stock} onChange={handleChange} min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.shortDesc')}</label>
            <input type="text" name="short_desc" value={formData.short_desc || ''} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.fullDesc')}</label>
            <textarea name="desc" rows="4" value={formData.desc || ''} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all"></textarea>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[#18281a] border-b border-gray-100 pb-2">{t('admin.products.mediaCat')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.image')}</label>
              <ImageUploader 
                value={formData.image} 
                onChange={(url) => setFormData(prev => ({...prev, image: url}))}
                placeholder="/images/products/example.png or upload a new image"
              />
              {formData.image && (
                 <div className="mt-3 w-32 h-32 bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                 </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.productType')}</label>
              <input type="text" name="type" value={formData.type || ''} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.volume')}</label>
              <input type="text" name="volume" value={formData.volume || ''} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.badgeText')}</label>
              <input type="text" name="badge" value={formData.badge || ''} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.badgeStyle')}</label>
              <input type="text" name="badge_style" value={formData.badge_style || ''} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[#18281a] border-b border-gray-100 pb-2">{t('admin.products.filterData')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.skinConditions')}</label>
              <input type="text" name="conditions" value={formData.conditions || ''} onChange={handleChange} placeholder="dullness, hyperpigmentation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.mainIngredients')}</label>
              <input type="text" name="ingredients" value={formData.ingredients || ''} onChange={handleChange} placeholder="pineappleEnzymes, vitaminC"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[#18281a] border-b border-gray-100 pb-2">{t('admin.products.productDetails')}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.benefits')}</label>
            <textarea name="benefits" rows="3" value={formData.benefits || ''} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all font-mono text-sm"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.howToUse')}</label>
            <textarea name="how_to_use" rows="3" value={formData.how_to_use || ''} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.products.fullIngredients')}</label>
            <textarea name="full_ingredients" rows="3" value={formData.full_ingredients || ''} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all text-sm text-gray-600"></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin.senara/products" className="px-6 py-2.5 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            {t('admin.products.cancelBtn')}
          </Link>
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-2.5 font-semibold bg-[#18281a] text-white hover:bg-[#2c4730] rounded-lg transition-colors disabled:bg-gray-400 flex items-center gap-2"
          >
            {saving && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
            {saving ? t('admin.products.saving') : t('admin.products.saveProduct')}
          </button>
        </div>
      </form>
    </div>
  );
}
