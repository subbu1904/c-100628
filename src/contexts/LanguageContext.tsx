
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { detectUserLocation, getLanguageFromCountry, getUserCountry } from '@/services/geoLocationService';

// Import all translation resources
import enTranslation from '@/locales/en.json';
import esTranslation from '@/locales/es.json';
import frTranslation from '@/locales/fr.json';
import hiTranslation from '@/locales/hi.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      fr: { translation: frTranslation },
      hi: { translation: hiTranslation }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

// Define types for the context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  detectedCountry: string;
  countryCode: string;
  setCountry: (countryCode: string) => void;
  t: (key: string, options?: any) => string; // Translation function
  loadLanguage: () => Promise<void>; // Add the missing loadLanguage property
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Make sure React is properly used for hooks
  const [language, setLanguageState] = React.useState('en');
  const [detectedCountry, setDetectedCountry] = React.useState('');
  const [countryCode, setCountryCode] = React.useState('');
  const { t } = useTranslation();

  // Set country and potentially update language
  const setCountry = (code: string) => {
    setCountryCode(code);
    
    // Optionally update language based on country
    const suggestedLanguage = getLanguageFromCountry(code);
    if (suggestedLanguage) {
      setLanguage(suggestedLanguage);
    }
  };

  const loadLanguage = useCallback(async () => {
    try {
      // Check if user has a saved country preference
      const savedCountry = getUserCountry();
      
      if (savedCountry) {
        setCountryCode(savedCountry);
        const suggestedLanguage = getLanguageFromCountry(savedCountry);
        if (suggestedLanguage) {
          setLanguage(suggestedLanguage);
        }
      } else {
        // If no saved preference, detect location
        const location = await detectUserLocation();
        setDetectedCountry(location.country);
        setCountryCode(location.countryCode);
        
        // Auto-set language based on country if we have a good match
        if (location.suggestedLanguage) {
          setLanguage(location.suggestedLanguage);
        }
      }
    } catch (error) {
      console.error('Failed to detect location:', error);
    }
  }, []);

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    
    // Store language preference
    localStorage.setItem('userLanguage', lang);
  };

  // Load saved language preference
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('userLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      detectedCountry, 
      countryCode, 
      setCountry,
      t,
      loadLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
