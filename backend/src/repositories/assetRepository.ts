
import db from '../config/db';
import { Asset, UserFavorite } from '../types/asset';

export class AssetRepository {
  // Get all assets
  async getAll(): Promise<Asset[]> {
    try {
      const result = await db.query('SELECT * FROM assets ORDER BY name');
      return result.rows;
    } catch (error) {
      console.error('Error getting all assets:', error);
      return [];
    }
  }

  // Get asset by ID
  async getById(id: string): Promise<Asset | null> {
    try {
      const result = await db.query(
        'SELECT * FROM assets WHERE id = $1',
        [id]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting asset by ID:', error);
      return null;
    }
  }

  // Add asset to user favorites
  async addToFavorites(userId: string, assetId: string): Promise<boolean> {
    try {
      await db.query(
        'INSERT INTO user_favorites (user_id, asset_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING',
        [userId, assetId]
      );
      
      return true;
    } catch (error) {
      console.error('Error adding asset to favorites:', error);
      return false;
    }
  }

  // Remove asset from user favorites
  async removeFromFavorites(userId: string, assetId: string): Promise<boolean> {
    try {
      const result = await db.query(
        'DELETE FROM user_favorites WHERE user_id = $1 AND asset_id = $2 RETURNING user_id',
        [userId, assetId]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error removing asset from favorites:', error);
      return false;
    }
  }

  // Get user favorites
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    try {
      const result = await db.query(
        'SELECT * FROM user_favorites WHERE user_id = $1',
        [userId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return [];
    }
  }
}
