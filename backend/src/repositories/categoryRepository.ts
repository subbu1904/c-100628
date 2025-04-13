
import db from '../config/db';
import { Category, CategoryAsset } from '../types/category';
import { v4 as uuidv4 } from 'uuid';

export class CategoryRepository {
  // Get all categories
  async getAll(): Promise<Category[]> {
    try {
      const result = await db.query('SELECT * FROM categories ORDER BY name');
      return result.rows;
    } catch (error) {
      console.error('Error getting all categories:', error);
      return [];
    }
  }

  // Get category by ID
  async getById(id: string): Promise<Category | null> {
    try {
      const result = await db.query(
        'SELECT * FROM categories WHERE id = $1',
        [id]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting category by ID:', error);
      return null;
    }
  }

  // Create category
  async create(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      const result = await db.query(
        `INSERT INTO categories (id, name, description, slug, super_category_id, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [
          id,
          category.name,
          category.description || null,
          category.slug,
          category.super_category_id || null,
          now,
          now
        ]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }

  // Update category
  async update(id: string, category: Partial<Category>): Promise<Category | null> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      Object.entries(category).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'created_at') {
          updates.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });
      
      // Add updated_at
      updates.push(`updated_at = $${paramIndex}`);
      values.push(new Date().toISOString());
      paramIndex++;
      
      // Add id
      values.push(id);
      
      const result = await db.query(
        `UPDATE categories 
         SET ${updates.join(', ')} 
         WHERE id = $${paramIndex} 
         RETURNING *`,
        values
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  }

  // Delete category
  async delete(id: string): Promise<boolean> {
    try {
      const result = await db.query(
        'DELETE FROM categories WHERE id = $1 RETURNING id',
        [id]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  // Get assets by category ID
  async getAssets(categoryId: string): Promise<CategoryAsset[]> {
    try {
      const result = await db.query(
        'SELECT * FROM category_assets WHERE category_id = $1',
        [categoryId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting assets by category ID:', error);
      return [];
    }
  }

  // Add asset to category
  async addAsset(categoryId: string, assetId: string): Promise<boolean> {
    try {
      await db.query(
        'INSERT INTO category_assets (category_id, asset_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING',
        [categoryId, assetId]
      );
      
      return true;
    } catch (error) {
      console.error('Error adding asset to category:', error);
      return false;
    }
  }

  // Remove asset from category
  async removeAsset(categoryId: string, assetId: string): Promise<boolean> {
    try {
      const result = await db.query(
        'DELETE FROM category_assets WHERE category_id = $1 AND asset_id = $2 RETURNING category_id',
        [categoryId, assetId]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error removing asset from category:', error);
      return false;
    }
  }
}
