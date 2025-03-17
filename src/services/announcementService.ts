
// Mock announcement banner data
let mockAnnouncementBanner = {
  text: "Welcome to CryptoView! New assets added daily. Check out our latest market analysis.",
  isEnabled: true,
  lastUpdated: new Date().toISOString()
};

export const fetchAnnouncementBanner = async () => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return { ...mockAnnouncementBanner };
};

export const updateAnnouncementBanner = async (text: string, isEnabled: boolean) => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  mockAnnouncementBanner = {
    text,
    isEnabled,
    lastUpdated: new Date().toISOString()
  };
  
  return { ...mockAnnouncementBanner };
};
