"use client";

import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ImageUploader({ value, onChange, placeholder = "Image URL (paste or upload)", className = "", accept = "image/*,video/*" }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Create a unique file name to prevent overwrites
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        if (uploadError.message.includes('row-level security')) {
            throw new Error('Upload blocked by security policy. Did you run the SQL to create the bucket and policies?');
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <input 
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        className="flex-grow px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#56b4a2] focus:border-transparent outline-none transition-all text-sm w-full" 
      />
      
      <input 
        type="file" 
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="shrink-0 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold border border-gray-300 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
            Uploading
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            Upload
          </>
        )}
      </button>
    </div>
  );
}
