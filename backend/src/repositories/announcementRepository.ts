
import db from '../config/db';
import { Announcement, AnnouncementBanner } from '../types/announcement';

// Mock announcement banner data
let mockAnnouncementBanner: AnnouncementBanner = {
  text: "Welcome to CryptoView! New assets added daily. Check out our latest market analysis.",
  isEnabled: true,
  lastUpdated: new Date().toISOString()
};

export class AnnouncementRepository {
  // Get announcement banner
  async getBanner(): Promise<AnnouncementBanner> {
    try {
      // In a real implementation, this would get the active banner from the database
      // For now, return mock data
      return { ...mockAnnouncementBanner };
    } catch (error) {
      console.error('Error getting banner:', error);
      throw error;
    }
  }

  // Update announcement banner
  async updateBanner(text: string, isEnabled: boolean): Promise<AnnouncementBanner> {
    try {
      // In a real implementation, this would update the banner in the database
      // For now, update mock data
      mockAnnouncementBanner = {
        text,
        isEnabled,
        lastUpdated: new Date().toISOString()
      };
      
      return { ...mockAnnouncementBanner };
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  }

  // Get all announcements
  async getAll(): Promise<Announcement[]> {
    try {
      const result = await db.query(
        `SELECT * FROM announcements ORDER BY created_at DESC`
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting announcements:', error);
      return [];
    }
  }

  // Create announcement
  async create(announcement: Announcement): Promise<Announcement> {
    try {
      const result = await db.query(
        `INSERT INTO announcements (id, title, content, is_active, priority, start_date, end_date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          announcement.id,
          announcement.title,
          announcement.content,
          announcement.is_active,
          announcement.priority,
          announcement.start_date,
          announcement.end_date,
          announcement.created_at,
          announcement.updated_at
        ]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }

  // Update announcement
  async update(id: string, update: Partial<Announcement>): Promise<Announcement | null> {
    try {
      // Build update query dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      Object.entries(update).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });
      
      if (updates.length === 0) {
        const result = await db.query(
          `SELECT * FROM announcements WHERE id = $1`,
          [id]
        );
        
        return result.rows.length > 0 ? result.rows[0] : null;
      }
      
      values.push(id);
      
      const result = await db.query(
        `UPDATE announcements 
         SET ${updates.join(', ')} 
         WHERE id = $${paramIndex} 
         RETURNING *`,
        values
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error updating announcement:', error);
      return null;
    }
  }

  // Delete announcement
  async delete(id: string): Promise<boolean> {
    try {
      const result = await db.query(
        `DELETE FROM announcements WHERE id = $1 RETURNING id`,
        [id]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return false;
    }
  }
}
