
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Globe, Check, MapPin, Languages } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { countries, saveUserCountry } from '@/services/geoLocationService';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, detectedCountry, countryCode, setCountry, t } = useLanguage();
  const [search, setSearch] = useState('');

  const languages = [
    { code: 'en', name: t('languages.en') },
    { code: 'es', name: t('languages.es') },
    { code: 'fr', name: t('languages.fr') },
    { code: 'hi', name: t('languages.hi') }
  ];

  const filteredCountries = search
    ? countries.filter(country => 
        country.name.toLowerCase().includes(search.toLowerCase()))
    : countries;

  const handleCountryChange = (code: string) => {
    setCountry(code);
    saveUserCountry(code);
  };

  return (
    <div className="flex items-center">
      {detectedCountry && (
        <Badge variant="outline" className="mr-2 hidden sm:flex">
          {t('geo.usingLocation', { country: detectedCountry })}
        </Badge>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{t('geo.preferences')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t('geo.preferences')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
              <Languages className="h-4 w-4" />
              {t('geo.language')}
            </DropdownMenuLabel>
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className="flex justify-between"
              >
                {lang.name}
                {language === lang.code && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {t('geo.country')}
            </DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {t('geo.selectCountry')}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="max-h-80 overflow-y-auto">
                  <div className="px-2 py-1.5">
                    <input
                      className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('geo.searchCountry')}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <DropdownMenuSeparator />
                  {filteredCountries.map((country) => (
                    <DropdownMenuItem
                      key={country.code}
                      onClick={() => handleCountryChange(country.code)}
                      className="flex justify-between"
                    >
                      {country.name}
                      {countryCode === country.code && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
