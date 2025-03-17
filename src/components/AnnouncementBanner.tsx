
import React, { useEffect, useState } from 'react';
import { fetchAnnouncementBanner } from '@/services/announcementService';
import { useIsMobile } from '@/hooks/use-mobile';

const AnnouncementBanner: React.FC = () => {
  const [banner, setBanner] = useState<{text: string, isEnabled: boolean} | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const loadBanner = async () => {
      try {
        const data = await fetchAnnouncementBanner();
        setBanner(data);
      } catch (error) {
        console.error('Failed to load announcement banner:', error);
      }
    };
    
    loadBanner();
    
    // Refresh the banner every 5 minutes
    const intervalId = setInterval(loadBanner, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  if (!banner?.isEnabled) {
    return null;
  }
  
  return (
    <div className="bg-primary text-primary-foreground w-full py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <span className="mx-4">{banner.text}</span>
        <span className="mx-4">•</span>
        <span className="mx-4">{banner.text}</span>
        <span className="mx-4">•</span>
        <span className="mx-4">{banner.text}</span>
        <span className="mx-4">•</span>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
