"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../translations/en';
import id from '../translations/id';

const translations = { en, id };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('id');

  useEffect(() => {
    const saved = localStorage.getItem('senara-lang');
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem('senara-lang', lang);
  }, []);

  // Translation function supporting nested keys like "hero.title"
  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English, then return the key itself
        let fallback = translations['en'];
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        return fallback;
      }
    }
    return value;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
