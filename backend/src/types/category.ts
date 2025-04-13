
export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  super_category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryAsset {
  category_id: string;
  asset_id: string;
  created_at: string;
}
