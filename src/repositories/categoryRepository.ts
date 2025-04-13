
import pool from '@/lib/db';
import { AssetCategory } from '@/types/asset';

export const categoryRepository = {
  // Fetch all categories
  async fetchCategories(): Promise<AssetCategory[]> {
    try {
      const result = await pool.query(
        `SELECT c.id, c.name, c.description, c.slug, c.created_at
         FROM categories c
         ORDER BY c.name ASC`
      );
      
      const categories = await Promise.all(result.rows.map(async (row) => {
        // Get asset IDs for this category
        const assetsResult = await pool.query(
          `SELECT asset_id FROM category_assets WHERE category_id = $1`,
          [row.id]
        );
        
        const assetIds = assetsResult.rows.map(assetRow => assetRow.asset_id);
        
        return {
          id: row.id,
          name: row.name,
          description: row.description,
          slug: row.slug,
          createdAt: row.created_at,
          assetIds: assetIds
        };
      }));
      
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
  
  // Fetch category by ID
  async fetchCategoryById(id: string): Promise<AssetCategory | null> {
    try {
      const result = await pool.query(
        `SELECT c.id, c.name, c.description, c.slug, c.created_at
         FROM categories c
         WHERE c.id = $1`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      
      // Get asset IDs for this category
      const assetsResult = await pool.query(
        `SELECT asset_id FROM category_assets WHERE category_id = $1`,
        [id]
      );
      
      const assetIds = assetsResult.rows.map(assetRow => assetRow.asset_id);
      
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        slug: row.slug,
        createdAt: row.created_at,
        assetIds: assetIds
      };
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      return null;
    }
  },
  
  // Create a new category
  async createCategory(data: { name: string; description: string; slug: string; assetIds?: string[] }): Promise<AssetCategory | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert category
      const result = await client.query(
        `INSERT INTO categories (name, description, slug)
         VALUES ($1, $2, $3)
         RETURNING id, name, description, slug, created_at`,
        [data.name, data.description, data.slug]
      );
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }
      
      const categoryId = result.rows[0].id;
      
      // Insert asset associations if provided
      if (data.assetIds && data.assetIds.length > 0) {
        for (const assetId of data.assetIds) {
          await client.query(
            `INSERT INTO category_assets (category_id, asset_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [categoryId, assetId]
          );
        }
      }
      
      await client.query('COMMIT');
      
      // Return the created category
      return {
        id: categoryId,
        name: result.rows[0].name,
        description: result.rows[0].description,
        slug: result.rows[0].slug,
        createdAt: result.rows[0].created_at,
        assetIds: data.assetIds || []
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating category:', error);
      return null;
    } finally {
      client.release();
    }
  },
  
  // Update a category
  async updateCategory(id: string, data: Partial<{ name: string; description: string; slug: string; assetIds: string[] }>): Promise<AssetCategory | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Build update query dynamically based on provided fields
      const updateFields = [];
      const values = [];
      let paramIndex = 1;
      
      if (data.name !== undefined) {
        updateFields.push(`name = $${paramIndex}`);
        values.push(data.name);
        paramIndex++;
      }
      
      if (data.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        values.push(data.description);
        paramIndex++;
      }
      
      if (data.slug !== undefined) {
        updateFields.push(`slug = $${paramIndex}`);
        values.push(data.slug);
        paramIndex++;
      }
      
      if (updateFields.length > 0) {
        values.push(id);
        const updateQuery = `
          UPDATE categories
          SET ${updateFields.join(', ')}
          WHERE id = $${paramIndex}
          RETURNING id, name, description, slug, created_at
        `;
        
        const result = await client.query(updateQuery, values);
        
        if (result.rows.length === 0) {
          await client.query('ROLLBACK');
          return null;
        }
      }
      
      // Update asset associations if provided
      if (data.assetIds !== undefined) {
        // Remove existing associations
        await client.query(
          `DELETE FROM category_assets WHERE category_id = $1`,
          [id]
        );
        
        // Add new associations
        if (data.assetIds.length > 0) {
          for (const assetId of data.assetIds) {
            await client.query(
              `INSERT INTO category_assets (category_id, asset_id)
               VALUES ($1, $2)
               ON CONFLICT DO NOTHING`,
              [id, assetId]
            );
          }
        }
      }
      
      await client.query('COMMIT');
      
      // Return the updated category
      return await this.fetchCategoryById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating category:', error);
      return null;
    } finally {
      client.release();
    }
  },
  
  // Delete a category
  async deleteCategory(id: string): Promise<boolean> {
    try {
      // This will cascade delete the category_assets entries as well
      const result = await pool.query(
        `DELETE FROM categories WHERE id = $1 RETURNING id`,
        [id]
      );
      
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }
};
