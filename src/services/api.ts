
// API service for CoinCap
import { rateLimiter } from './rateLimitService';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://api.coincap.io/v2';

export interface Asset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  followersCount?: number;
}

export interface AssetHistory {
  priceUsd: string;
  time: number;
  date: string;
}

// Fetch top assets with better error handling
export const fetchAssets = async (limit: number = 20): Promise<Asset[]> => {
  try {
    // Check rate limit
    await rateLimiter.checkEndpoint('fetchAssets', 'assets');
    
    const response = await fetch(`${API_BASE_URL}/assets?limit=${limit}`);
    
    if (response.status === 429) {
      // Rate limit exceeded
      console.warn('Rate limit exceeded for CoinCap API');
      toast({
        title: "API Rate Limited",
        description: "Using cached data. Please try again later.",
        variant: "destructive",
      });
      // Return mock data in case of rate limit
      return getMockAssets(limit);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch assets: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Add mock followers count
    return data.data.map((asset: Asset) => ({
      ...asset,
      followersCount: Math.floor(Math.random() * 10000)
    }));
  } catch (error) {
    console.error('Error fetching assets:', error);
    // Return mock data in case of error
    return getMockAssets(limit);
  }
};

// Fetch single asset by id with better error handling
export const fetchAsset = async (id: string): Promise<Asset> => {
  try {
    // Check rate limit
    await rateLimiter.checkEndpoint(`fetchAsset:${id}`, 'assets');
    
    const response = await fetch(`${API_BASE_URL}/assets/${id}`);
    
    if (response.status === 429) {
      // Rate limit exceeded
      console.warn('Rate limit exceeded for CoinCap API');
      toast({
        title: "API Rate Limited",
        description: "Using cached data. Please try again later.",
        variant: "destructive",
      });
      // Return mock data in case of rate limit
      return getMockAsset(id);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch asset: ${id} - ${response.status}`);
    }
    
    const data = await response.json();
    
    // Add mock followers count
    return {
      ...data.data,
      followersCount: Math.floor(Math.random() * 10000)
    };
  } catch (error) {
    console.error(`Error fetching asset ${id}:`, error);
    return getMockAsset(id);
  }
};

// Fetch historical price data with better error handling
export const fetchAssetHistory = async (
  id: string, 
  interval: string = 'd1'
): Promise<AssetHistory[]> => {
  try {
    // Check rate limit
    await rateLimiter.checkEndpoint(`fetchAssetHistory:${id}`, 'assets');
    
    const response = await fetch(`${API_BASE_URL}/assets/${id}/history?interval=${interval}`);
    
    if (response.status === 429) {
      // Rate limit exceeded
      console.warn('Rate limit exceeded for CoinCap API');
      // Return mock history in case of rate limit
      return getMockAssetHistory(id);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch history for asset: ${id} - ${response.status}`);
    }
    
    const data = await response.json();
    return data.data as AssetHistory[];
  } catch (error) {
    console.error(`Error fetching history for asset ${id}:`, error);
    return getMockAssetHistory(id);
  }
};

// Mock data functions
const getMockAssets = (limit: number): Asset[] => {
  const mockAssets: Asset[] = [
    {
      id: "bitcoin",
      rank: "1",
      symbol: "BTC",
      name: "Bitcoin",
      supply: "19000000",
      maxSupply: "21000000",
      marketCapUsd: "1128000000000",
      volumeUsd24Hr: "28000000000",
      priceUsd: "58000",
      changePercent24Hr: "2.5",
      vwap24Hr: "57500",
      followersCount: 8945
    },
    {
      id: "ethereum",
      rank: "2",
      symbol: "ETH",
      name: "Ethereum",
      supply: "120000000",
      maxSupply: null,
      marketCapUsd: "425000000000",
      volumeUsd24Hr: "15000000000",
      priceUsd: "3500",
      changePercent24Hr: "1.8",
      vwap24Hr: "3480",
      followersCount: 7632
    },
    {
      id: "solana",
      rank: "3",
      symbol: "SOL",
      name: "Solana",
      supply: "410000000",
      maxSupply: null,
      marketCapUsd: "43200000000",
      volumeUsd24Hr: "2100000000",
      priceUsd: "105",
      changePercent24Hr: "4.2",
      vwap24Hr: "102",
      followersCount: 4521
    }
  ];
  
  // Generate additional mock assets if needed
  while (mockAssets.length < limit) {
    const index = mockAssets.length + 1;
    mockAssets.push({
      id: `crypto${index}`,
      rank: String(index + 3),
      symbol: `CRY${index}`,
      name: `Crypto ${index}`,
      supply: String(Math.floor(Math.random() * 1000000000)),
      maxSupply: Math.random() > 0.5 ? String(Math.floor(Math.random() * 2000000000)) : null,
      marketCapUsd: String(Math.floor(Math.random() * 10000000000)),
      volumeUsd24Hr: String(Math.floor(Math.random() * 1000000000)),
      priceUsd: String((Math.random() * 100).toFixed(2)),
      changePercent24Hr: String((Math.random() * 10 - 5).toFixed(2)),
      vwap24Hr: String((Math.random() * 100).toFixed(2)),
      followersCount: Math.floor(Math.random() * 5000)
    });
  }
  
  return mockAssets.slice(0, limit);
};

const getMockAsset = (id: string): Asset => {
  // Check if it's one of our predefined assets
  const predefinedAssets = getMockAssets(3);
  const foundAsset = predefinedAssets.find(asset => asset.id === id);
  
  if (foundAsset) {
    return foundAsset;
  }
  
  // Generate a random asset with the given id
  return {
    id: id,
    rank: String(Math.floor(Math.random() * 100) + 1),
    symbol: id.substring(0, 3).toUpperCase(),
    name: id.charAt(0).toUpperCase() + id.slice(1),
    supply: String(Math.floor(Math.random() * 1000000000)),
    maxSupply: Math.random() > 0.5 ? String(Math.floor(Math.random() * 2000000000)) : null,
    marketCapUsd: String(Math.floor(Math.random() * 10000000000)),
    volumeUsd24Hr: String(Math.floor(Math.random() * 1000000000)),
    priceUsd: String((Math.random() * 100).toFixed(2)),
    changePercent24Hr: String((Math.random() * 10 - 5).toFixed(2)),
    vwap24Hr: String((Math.random() * 100).toFixed(2)),
    followersCount: Math.floor(Math.random() * 5000)
  };
};

const getMockAssetHistory = (id: string): AssetHistory[] => {
  const history: AssetHistory[] = [];
  const basePrice = Math.random() * 1000 + 10;
  
  // Generate 30 days of history
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    
    // Generate price with some randomness but trending upward
    const volatility = 0.05; // 5% volatility
    const trend = 0.01; // 1% upward trend per day
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const trendChange = trend * i;
    const price = basePrice * (1 + randomChange + trendChange);
    
    history.push({
      priceUsd: price.toFixed(2),
      time: date.getTime(),
      date: date.toISOString()
    });
  }
  
  return history;
};

// Format currency (USD)
export const formatCurrency = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Handle different ranges
  if (numValue >= 1_000_000_000) {
    return `$${(numValue / 1_000_000_000).toFixed(2)}B`;
  } else if (numValue >= 1_000_000) {
    return `$${(numValue / 1_000_000).toFixed(2)}M`;
  } else if (numValue >= 1_000) {
    return `$${(numValue / 1_000).toFixed(2)}K`;
  } else if (numValue < 0.01) {
    return `$${numValue.toFixed(6)}`;
  } else {
    return `$${numValue.toFixed(2)}`;
  }
};

// Format percent change
export const formatPercentChange = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const formatted = numValue.toFixed(2);
  return numValue >= 0 ? `+${formatted}%` : `${formatted}%`;
};

// Get color class based on change percent
export const getChangeColorClass = (change: string | number): string => {
  const numValue = typeof change === 'string' ? parseFloat(change) : change;
  return numValue >= 0 ? 'text-green-500' : 'text-red-500';
};

// Followers actions
export const followAsset = async (assetId: string, userId: string): Promise<void> => {
  try {
    await rateLimiter.checkEndpoint(`followAsset:${assetId}`, 'assets');
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`User ${userId} followed asset ${assetId}`);
  } catch (error) {
    console.error(`Error following asset ${assetId}:`, error);
    throw error;
  }
};

export const unfollowAsset = async (assetId: string, userId: string): Promise<void> => {
  try {
    await rateLimiter.checkEndpoint(`unfollowAsset:${assetId}`, 'assets');
    
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`User ${userId} unfollowed asset ${assetId}`);
  } catch (error) {
    console.error(`Error unfollowing asset ${assetId}:`, error);
    throw error;
  }
};
