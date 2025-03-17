
import { AssetCategory } from '@/types/asset';
import { v4 as uuidv4 } from 'uuid';

// Mock categories data
let mockCategories: AssetCategory[] = [
  {
    id: 'cat1',
    name: 'DeFi',
    description: 'Decentralized Finance tokens and protocols',
    slug: 'defi',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    assetIds: ['ethereum', 'chainlink', 'uniswap', 'aave'],
  },
  {
    id: 'cat2',
    name: 'Layer 1',
    description: 'Base blockchain protocols',
    slug: 'layer-1',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    assetIds: ['bitcoin', 'ethereum', 'solana', 'cardano', 'avalanche'],
  },
  {
    id: 'cat3',
    name: 'Privacy Coins',
    description: 'Cryptocurrencies focused on privacy and anonymity',
    slug: 'privacy-coins',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    assetIds: ['monero', 'zcash', 'dash'],
  },
];

export const fetchCategories = async (): Promise<AssetCategory[]> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockCategories];
};

export const fetchCategoryById = async (id: string): Promise<AssetCategory | null> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCategories.find(cat => cat.id === id) || null;
};

export const createCategory = async (data: Omit<AssetCategory, 'id' | 'createdAt'>): Promise<AssetCategory> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newCategory: AssetCategory = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  
  mockCategories.push(newCategory);
  return newCategory;
};

export const updateCategory = async (id: string, data: Partial<Omit<AssetCategory, 'id' | 'createdAt'>>): Promise<AssetCategory> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error('Category not found');
  }
  
  mockCategories[categoryIndex] = {
    ...mockCategories[categoryIndex],
    ...data,
  };
  
  return mockCategories[categoryIndex];
};

export const deleteCategory = async (id: string): Promise<void> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  mockCategories = mockCategories.filter(cat => cat.id !== id);
};
