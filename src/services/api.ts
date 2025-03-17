// API service for CoinCap
import { rateLimiter } from './rateLimitService';

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

// Fetch top assets
export const fetchAssets = async (limit: number = 20): Promise<Asset[]> => {
  try {
    // Check rate limit
    await rateLimiter.checkEndpoint('fetchAssets', 'assets');
    
    const response = await fetch(`${API_BASE_URL}/assets?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }
    
    const data = await response.json();
    
    // Add mock followers count
    return data.data.map((asset: Asset) => ({
      ...asset,
      followersCount: Math.floor(Math.random() * 10000)
    }));
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

// Fetch single asset by id
export const fetchAsset = async (id: string): Promise<Asset> => {
  try {
    // Check rate limit
    await rateLimiter.checkEndpoint(`fetchAsset:${id}`, 'assets');
    
    const response = await fetch(`${API_BASE_URL}/assets/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch asset: ${id}`);
    }
    
    const data = await response.json();
    
    // Add mock followers count
    return {
      ...data.data,
      followersCount: Math.floor(Math.random() * 10000)
    };
  } catch (error) {
    console.error(`Error fetching asset ${id}:`, error);
    throw error;
  }
};

// Fetch historical price data
export const fetchAssetHistory = async (
  id: string, 
  interval: string = 'd1'
): Promise<AssetHistory[]> => {
  try {
    // Check rate limit
    await rateLimiter.checkEndpoint(`fetchAssetHistory:${id}`, 'assets');
    
    const response = await fetch(`${API_BASE_URL}/assets/${id}/history?interval=${interval}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch history for asset: ${id}`);
    }
    
    const data = await response.json();
    return data.data as AssetHistory[];
  } catch (error) {
    console.error(`Error fetching history for asset ${id}:`, error);
    throw error;
  }
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
