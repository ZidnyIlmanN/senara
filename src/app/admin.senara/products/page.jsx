"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { useUI } from '../../../components/admin/UIProvider';
import { useLanguage } from '../../../context/LanguageContext';

export default function ProductsList() {
  const { toast, confirm } = useUI();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!await confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      setDeleteLoading(id);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product: ' + error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-24">
        <div>
          <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
          <div className="w-64 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="w-full h-8 bg-gray-200 rounded"></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="w-full h-16 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#18281a]">{t('admin.products.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('admin.products.subtitle')}</p>
        </div>
        <Link 
          href="/admin.senara/products/new"
          className="flex items-center gap-2 bg-[#18281a] text-white px-5 py-2.5 rounded-lg hover:bg-[#2c4730] transition-colors font-medium text-sm shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          {t('admin.products.addNew')}
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">{t('admin.products.productName')}</th>
                <th className="px-6 py-4 whitespace-nowrap">{t('admin.products.price')}</th>
                <th className="px-6 py-4 whitespace-nowrap">{t('admin.products.stock')}</th>
                <th className="px-6 py-4 whitespace-nowrap">{t('admin.products.type')}</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">{t('admin.products.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {t('admin.products.noProducts')}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-gray-400 w-full h-full flex items-center justify-center">image</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[#18281a]">{product.name}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      Rp {product.price?.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 10 ? 'bg-green-100 text-green-700' : 
                        product.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {product.type || '-'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin.senara/products/${product.id}`}
                          className="p-2 text-gray-500 hover:text-[#56b4a2] hover:bg-[#56b4a2]/10 rounded-lg transition-colors"
                          title={t('admin.products.edit')}
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteLoading === product.id}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title={t('admin.products.delete')}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {deleteLoading === product.id ? 'hourglass_empty' : 'delete'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
