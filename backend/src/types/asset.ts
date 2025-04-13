
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  user_id: string;
  asset_id: string;
  created_at: string;
}
