
// API service for CoinCap
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
}

export interface AssetHistory {
  priceUsd: string;
  time: number;
  date: string;
}

// Fetch top assets
export const fetchAssets = async (limit: number = 20): Promise<Asset[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assets?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }
    
    const data = await response.json();
    return data.data as Asset[];
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

// Fetch single asset by id
export const fetchAsset = async (id: string): Promise<Asset> => {
  try {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch asset: ${id}`);
    }
    
    const data = await response.json();
    return data.data as Asset;
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
