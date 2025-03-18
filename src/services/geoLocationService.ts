
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

// Full list of countries for the country selector
export const countries: { code: string; name: string }[] = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IN', name: 'India' },
  { code: 'ES', name: 'Spain' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'FR', name: 'France' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CN', name: 'China' },
  { code: 'RU', name: 'Russia' },
  { code: 'ZA', name: 'South Africa' }
];

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

// Save user's country preference
export const saveUserCountry = (countryCode: string): void => {
  localStorage.setItem('userCountry', countryCode);
};

// Get user's saved country preference
export const getUserCountry = (): string | null => {
  return localStorage.getItem('userCountry');
};
