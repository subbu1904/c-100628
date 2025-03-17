
import { v4 as uuidv4 } from 'uuid';

export interface SuperCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  isEnabled: boolean;
  createdAt: string;
}

// Mock super categories
let mockSuperCategories: SuperCategory[] = [
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    slug: 'cryptocurrency',
    color: '#8A2BE2',
    description: 'Digital or virtual currencies that use cryptography for security',
    isEnabled: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'metals',
    name: 'Metals',
    slug: 'metals',
    color: '#DAA520',
    description: 'Precious and industrial metals like gold, silver, platinum, etc.',
    isEnabled: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'stocks',
    name: 'Stocks',
    slug: 'stocks',
    color: '#228B22',
    description: 'Equity securities representing ownership in companies',
    isEnabled: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'commodities',
    name: 'Commodities',
    slug: 'commodities',
    color: '#B8860B',
    description: 'Raw materials and primary agricultural products',
    isEnabled: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Fetch all super categories
export const fetchSuperCategories = async (): Promise<SuperCategory[]> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockSuperCategories.filter(cat => cat.isEnabled);
};

// Fetch a specific super category
export const fetchSuperCategoryById = async (id: string): Promise<SuperCategory | null> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockSuperCategories.find(cat => cat.id === id) || null;
};

// Create a new super category
export const createSuperCategory = async (data: Omit<SuperCategory, 'id' | 'createdAt'>): Promise<SuperCategory> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newCategory: SuperCategory = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  
  mockSuperCategories.push(newCategory);
  return newCategory;
};

// Update an existing super category
export const updateSuperCategory = async (id: string, data: Partial<Omit<SuperCategory, 'id' | 'createdAt'>>): Promise<SuperCategory> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const categoryIndex = mockSuperCategories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error('Super category not found');
  }
  
  mockSuperCategories[categoryIndex] = {
    ...mockSuperCategories[categoryIndex],
    ...data,
  };
  
  return mockSuperCategories[categoryIndex];
};

// Delete a super category
export const deleteSuperCategory = async (id: string): Promise<void> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  mockSuperCategories = mockSuperCategories.filter(cat => cat.id !== id);
};

// Toggle super category visibility
export const toggleSuperCategoryVisibility = async (id: string): Promise<SuperCategory> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const categoryIndex = mockSuperCategories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error('Super category not found');
  }
  
  mockSuperCategories[categoryIndex] = {
    ...mockSuperCategories[categoryIndex],
    isEnabled: !mockSuperCategories[categoryIndex].isEnabled,
  };
  
  return mockSuperCategories[categoryIndex];
};
