
import pool from '@/lib/db';
import { SuperCategory } from '@/services/superCategoryService';

export const superCategoryRepository = {
  // Fetch all super categories
  async fetchSuperCategories(includeDisabled = false): Promise<SuperCategory[]> {
    try {
      let query = `
        SELECT id, name, slug, color, description, is_enabled, created_at
        FROM super_categories
      `;
      
      if (!includeDisabled) {
        query += ` WHERE is_enabled = true`;
      }
      
      query += ` ORDER BY name ASC`;
      
      const result = await pool.query(query);
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        color: row.color,
        description: row.description,
        isEnabled: row.is_enabled,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('Error fetching super categories:', error);
      return [];
    }
  },
  
  // Fetch super category by ID
  async fetchSuperCategoryById(id: string): Promise<SuperCategory | null> {
    try {
      const result = await pool.query(
        `SELECT id, name, slug, color, description, is_enabled, created_at
         FROM super_categories
         WHERE id = $1`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        color: row.color,
        description: row.description,
        isEnabled: row.is_enabled,
        createdAt: row.created_at
      };
    } catch (error) {
      console.error('Error fetching super category by ID:', error);
      return null;
    }
  },
  
  // Create a new super category
  async createSuperCategory(data: Omit<SuperCategory, 'id' | 'createdAt'>): Promise<SuperCategory | null> {
    try {
      const result = await pool.query(
        `INSERT INTO super_categories (id, name, slug, color, description, is_enabled)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, name, slug, color, description, is_enabled, created_at`,
        [data.slug, data.name, data.slug, data.color, data.description, data.isEnabled]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        color: row.color,
        description: row.description,
        isEnabled: row.is_enabled,
        createdAt: row.created_at
      };
    } catch (error) {
      console.error('Error creating super category:', error);
      return null;
    }
  },
  
  // Update a super category
  async updateSuperCategory(id: string, data: Partial<Omit<SuperCategory, 'id' | 'createdAt'>>): Promise<SuperCategory | null> {
    try {
      // Build update query dynamically based on provided fields
      const updateFields = [];
      const values = [];
      let paramIndex = 1;
      
      if (data.name !== undefined) {
        updateFields.push(`name = $${paramIndex}`);
        values.push(data.name);
        paramIndex++;
      }
      
      if (data.slug !== undefined) {
        updateFields.push(`slug = $${paramIndex}`);
        values.push(data.slug);
        paramIndex++;
      }
      
      if (data.color !== undefined) {
        updateFields.push(`color = $${paramIndex}`);
        values.push(data.color);
        paramIndex++;
      }
      
      if (data.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        values.push(data.description);
        paramIndex++;
      }
      
      if (data.isEnabled !== undefined) {
        updateFields.push(`is_enabled = $${paramIndex}`);
        values.push(data.isEnabled);
        paramIndex++;
      }
      
      if (updateFields.length === 0) {
        return await this.fetchSuperCategoryById(id);
      }
      
      values.push(id);
      const updateQuery = `
        UPDATE super_categories
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, name, slug, color, description, is_enabled, created_at
      `;
      
      const result = await pool.query(updateQuery, values);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        color: row.color,
        description: row.description,
        isEnabled: row.is_enabled,
        createdAt: row.created_at
      };
    } catch (error) {
      console.error('Error updating super category:', error);
      return null;
    }
  },
  
  // Delete a super category
  async deleteSuperCategory(id: string): Promise<boolean> {
    try {
      const result = await pool.query(
        `DELETE FROM super_categories WHERE id = $1 RETURNING id`,
        [id]
      );
      
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting super category:', error);
      return false;
    }
  },
  
  // Toggle super category visibility
  async toggleSuperCategoryVisibility(id: string): Promise<SuperCategory | null> {
    try {
      const result = await pool.query(
        `UPDATE super_categories
         SET is_enabled = NOT is_enabled
         WHERE id = $1
         RETURNING id, name, slug, color, description, is_enabled, created_at`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        color: row.color,
        description: row.description,
        isEnabled: row.is_enabled,
        createdAt: row.created_at
      };
    } catch (error) {
      console.error('Error toggling super category visibility:', error);
      return null;
    }
  }
};
