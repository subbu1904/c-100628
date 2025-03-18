
// Service for detecting user's country and language based on geolocation

interface GeoLocation {
  country: string;
  countryCode: string;
  suggestedLanguage: string;
}

// Map of country codes to languages
const countryToLanguageMap: Record<string, string> = {
  // Spanish-speaking countries
  'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es',
  'VE': 'es', 'EC': 'es', 'GT': 'es', 'CU': 'es', 'BO': 'es', 'DO': 'es',
  'HN': 'es', 'SV': 'es', 'NI': 'es', 'CR': 'es', 'PR': 'es', 'PA': 'es',
  'UY': 'es', 'PY': 'es',
  
  // French-speaking countries
  'FR': 'fr', 'CA': 'fr', 'BE': 'fr', 'CH': 'fr', 'LU': 'fr', 'MC': 'fr',
  'SN': 'fr', 'CI': 'fr', 'ML': 'fr', 'CM': 'fr', 'NE': 'fr', 'BF': 'fr',
  'TG': 'fr', 'GA': 'fr', 'BJ': 'fr', 'TD': 'fr', 'CG': 'fr', 'MG': 'fr',
  
  // Hindi-speaking countries
  'IN': 'hi', 'NP': 'hi', 'FJ': 'hi',
  
  // Default to English for others
  'US': 'en', 'GB': 'en', 'AU': 'en'
};

// Countries for demo display purposes
const countryNames: Record<string, string> = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'ES': 'Spain',
  'MX': 'Mexico',
  'FR': 'France',
  'IN': 'India',
  'CA': 'Canada',
  'AU': 'Australia',
  'DE': 'Germany',
  'JP': 'Japan'
};

export const detectUserLocation = async (): Promise<GeoLocation> => {
  try {
    // In a real app, we would use a geolocation service API like:
    // const response = await fetch('https://ipapi.co/json/');
    // const data = await response.json();
    
    // For demo purposes, we'll simulate a random country
    const demoCountries = ['US', 'GB', 'ES', 'MX', 'FR', 'IN', 'CA'];
    const randomCountryCode = demoCountries[Math.floor(Math.random() * demoCountries.length)];
    
    const suggestedLanguage = countryToLanguageMap[randomCountryCode] || 'en';
    const country = countryNames[randomCountryCode] || 'Unknown';
    
    return {
      country,
      countryCode: randomCountryCode,
      suggestedLanguage
    };
  } catch (error) {
    console.error('Error detecting location:', error);
    return {
      country: 'Unknown',
      countryCode: 'US',
      suggestedLanguage: 'en'
    };
  }
};

export const getCountryName = (countryCode: string): string => {
  return countryNames[countryCode] || countryCode;
};

export const getLanguageFromCountry = (countryCode: string): string => {
  return countryToLanguageMap[countryCode] || 'en';
};
