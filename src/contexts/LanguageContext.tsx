
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { detectUserLocation } from '@/services/geoLocationService';

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
  t: (key: string, options?: any) => string; // Translation function
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [detectedCountry, setDetectedCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const location = await detectUserLocation();
        setDetectedCountry(location.country);
        setCountryCode(location.countryCode);
        
        // Auto-set language based on country if we have a good match
        if (location.suggestedLanguage) {
          setLanguage(location.suggestedLanguage);
        }
      } catch (error) {
        console.error('Failed to detect location:', error);
      }
    };
    
    detectLocation();
  }, []);

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    
    // Store language preference
    localStorage.setItem('userLanguage', lang);
  };

  // Load saved language preference
  useEffect(() => {
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
      t 
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
