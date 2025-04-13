
import db from '../config/db';
import { SuperCategory } from '../types/superCategory';

export class SuperCategoryRepository {
  // Get all super categories
  async getAll(): Promise<SuperCategory[]> {
    try {
      const result = await db.query('SELECT * FROM super_categories ORDER BY name');
      return result.rows;
    } catch (error) {
      console.error('Error getting all super categories:', error);
      return [];
    }
  }

  // Get super category by ID
  async getById(id: string): Promise<SuperCategory | null> {
    try {
      const result = await db.query(
        'SELECT * FROM super_categories WHERE id = $1',
        [id]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting super category by ID:', error);
      return null;
    }
  }

  // Create super category
  async create(superCategory: Omit<SuperCategory, 'created_at' | 'updated_at'>): Promise<SuperCategory | null> {
    try {
      const now = new Date().toISOString();
      
      const result = await db.query(
        `INSERT INTO super_categories (id, name, slug, color, description, is_enabled, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [
          superCategory.id,
          superCategory.name,
          superCategory.slug,
          superCategory.color || null,
          superCategory.description || null,
          superCategory.is_enabled,
          now,
          now
        ]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error creating super category:', error);
      return null;
    }
  }

  // Update super category
  async update(id: string, superCategory: Partial<SuperCategory>): Promise<SuperCategory | null> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      Object.entries(superCategory).forEach(([key, value]) => {
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
        `UPDATE super_categories 
         SET ${updates.join(', ')} 
         WHERE id = $${paramIndex} 
         RETURNING *`,
        values
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error updating super category:', error);
      return null;
    }
  }

  // Delete super category
  async delete(id: string): Promise<boolean> {
    try {
      const result = await db.query(
        'DELETE FROM super_categories WHERE id = $1 RETURNING id',
        [id]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting super category:', error);
      return false;
    }
  }

  // Toggle super category enabled status
  async toggleEnabled(id: string): Promise<SuperCategory | null> {
    try {
      const result = await db.query(
        `UPDATE super_categories 
         SET is_enabled = NOT is_enabled, updated_at = $1 
         WHERE id = $2 
         RETURNING *`,
        [new Date().toISOString(), id]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error toggling super category enabled status:', error);
      return null;
    }
  }
}
