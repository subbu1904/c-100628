
import db from '../config/db';
import { User, UserMembership, UserPoints } from '../types/user';

export class UserRepository {
  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  // Create new user
  async createUser(user: User): Promise<User> {
    try {
      const result = await db.query(
        `INSERT INTO users (id, email, name, password_hash, role, avatar_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          user.id,
          user.email,
          user.name,
          user.password_hash,
          user.role,
          user.avatar_url || null,
          user.created_at,
          user.updated_at
        ]
      );
      
      // Initialize user_points
      await db.query(
        `INSERT INTO user_points (user_id, points, level, title)
         VALUES ($1, 0, 1, 'Novice')`,
        [user.id]
      );
      
      // Initialize free membership
      await db.query(
        `INSERT INTO user_memberships (user_id, type)
         VALUES ($1, 'free')`,
        [user.id]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(id: string, update: Partial<User>): Promise<User | null> {
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
        return await this.getUserById(id);
      }
      
      values.push(id);
      
      const result = await db.query(
        `UPDATE users 
         SET ${updates.join(', ')} 
         WHERE id = $${paramIndex} 
         RETURNING *`,
        values
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  // Update last login
  async updateLastLogin(id: string): Promise<boolean> {
    try {
      await db.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );
      
      return true;
    } catch (error) {
      console.error('Error updating last login:', error);
      return false;
    }
  }

  // Get user membership
  async getUserMembership(userId: string): Promise<UserMembership | null> {
    try {
      const result = await db.query(
        `SELECT * FROM user_memberships WHERE user_id = $1`,
        [userId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const membership = result.rows[0];
      
      return {
        type: membership.type,
        startDate: membership.start_date,
        endDate: membership.end_date,
        autoRenew: membership.auto_renew
      };
    } catch (error) {
      console.error('Error getting user membership:', error);
      return null;
    }
  }

  // Create or update membership
  async createOrUpdateMembership(userId: string, membership: Partial<UserMembership>): Promise<boolean> {
    try {
      const existingMembership = await this.getUserMembership(userId);
      
      if (existingMembership) {
        // Update existing membership
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;
        
        if (membership.type !== undefined) {
          updates.push(`type = $${paramIndex}`);
          values.push(membership.type);
          paramIndex++;
        }
        
        if (membership.startDate !== undefined) {
          updates.push(`start_date = $${paramIndex}`);
          values.push(membership.startDate);
          paramIndex++;
        }
        
        if (membership.endDate !== undefined) {
          updates.push(`end_date = $${paramIndex}`);
          values.push(membership.endDate);
          paramIndex++;
        }
        
        if (membership.autoRenew !== undefined) {
          updates.push(`auto_renew = $${paramIndex}`);
          values.push(membership.autoRenew);
          paramIndex++;
        }
        
        if (updates.length === 0) {
          return true;
        }
        
        values.push(userId);
        
        await db.query(
          `UPDATE user_memberships 
           SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $${paramIndex}`,
          values
        );
      } else {
        // Insert new membership
        await db.query(
          `INSERT INTO user_memberships (user_id, type, start_date, end_date, auto_renew)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            membership.type || 'free',
            membership.startDate || null,
            membership.endDate || null,
            membership.autoRenew || false
          ]
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error creating or updating membership:', error);
      return false;
    }
  }

  // Get user points
  async getUserPoints(userId: string): Promise<UserPoints | null> {
    try {
      const result = await db.query(
        `SELECT * FROM user_points WHERE user_id = $1`,
        [userId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const points = result.rows[0];
      
      return {
        points: points.points,
        level: points.level,
        title: points.title
      };
    } catch (error) {
      console.error('Error getting user points:', error);
      return null;
    }
  }

  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
}
