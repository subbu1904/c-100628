
import pool from '@/lib/db';
import { UserProfile, UserRole } from '@/types/user';
import * as bcrypt from 'bcryptjs';

export const userRepository = {
  // Create a new user
  async createUser(email: string, password: string, name: string, role: UserRole = 'free'): Promise<UserProfile | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, name, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, name, role, created_at, avatar_url`,
        [email, name, passwordHash, role]
      );
      
      if (userResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }
      
      const userId = userResult.rows[0].id;
      
      // Create membership
      await client.query(
        `INSERT INTO user_memberships (user_id, type)
         VALUES ($1, $2)`,
        [userId, 'free']
      );
      
      // Create user points entry
      await client.query(
        `INSERT INTO user_points (user_id)
         VALUES ($1)`,
        [userId]
      );
      
      await client.query('COMMIT');
      
      // Return user profile
      return {
        id: userId,
        email: userResult.rows[0].email,
        name: userResult.rows[0].name,
        role: userResult.rows[0].role,
        avatarUrl: userResult.rows[0].avatar_url,
        createdAt: userResult.rows[0].created_at,
        membership: {
          type: 'free'
        }
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating user:', error);
      return null;
    } finally {
      client.release();
    }
  },
  
  // Get user by email
  async getUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      const userResult = await pool.query(
        `SELECT u.id, u.email, u.name, u.role, u.avatar_url, u.created_at,
               m.type as membership_type, m.start_date, m.end_date, m.auto_renew,
               p.points, p.level, p.title
         FROM users u
         LEFT JOIN user_memberships m ON u.id = m.user_id
         LEFT JOIN user_points p ON u.id = p.user_id
         WHERE u.email = $1`,
        [email]
      );
      
      if (userResult.rows.length === 0) {
        return null;
      }
      
      const user = userResult.rows[0];
      
      // Get follower counts
      const followersResult = await pool.query(
        `SELECT COUNT(*) as count FROM followers WHERE following_id = $1`,
        [user.id]
      );
      
      const followingResult = await pool.query(
        `SELECT COUNT(*) as count FROM followers WHERE follower_id = $1`,
        [user.id]
      );
      
      // Get expert status if applicable
      let expertStatus = undefined;
      if (user.role === 'expert') {
        const expertResult = await pool.query(
          `SELECT is_verified, verified_at FROM expert_verifications WHERE user_id = $1`,
          [user.id]
        );
        
        if (expertResult.rows.length > 0) {
          const specialtiesResult = await pool.query(
            `SELECT specialty FROM expert_specialties WHERE user_id = $1`,
            [user.id]
          );
          
          const credentialsResult = await pool.query(
            `SELECT credential FROM expert_credentials WHERE user_id = $1`,
            [user.id]
          );
          
          expertStatus = {
            isVerified: expertResult.rows[0].is_verified,
            verifiedAt: expertResult.rows[0].verified_at,
            specialties: specialtiesResult.rows.map(row => row.specialty),
            credentials: credentialsResult.rows.map(row => row.credential)
          };
        }
      }
      
      // Build and return user profile
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        membership: {
          type: user.membership_type,
          startDate: user.start_date,
          endDate: user.end_date,
          autoRenew: user.auto_renew
        },
        followers: parseInt(followersResult.rows[0].count),
        following: parseInt(followingResult.rows[0].count),
        points: user.points,
        rank: {
          level: user.level,
          title: user.title
        },
        expertStatus
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },
  
  // Authenticate user
  async authenticateUser(email: string, password: string): Promise<UserProfile | null> {
    try {
      const userResult = await pool.query(
        `SELECT id, password_hash FROM users WHERE email = $1`,
        [email]
      );
      
      if (userResult.rows.length === 0) {
        return null;
      }
      
      const user = userResult.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!passwordMatch) {
        return null;
      }
      
      // Update last login timestamp
      await pool.query(
        `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
        [user.id]
      );
      
      // Get full user profile
      return await this.getUserById(user.id);
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  },
  
  // Get user by ID
  async getUserById(id: string): Promise<UserProfile | null> {
    try {
      const userResult = await pool.query(
        `SELECT u.id, u.email, u.name, u.role, u.avatar_url, u.created_at,
                m.type as membership_type, m.start_date, m.end_date, m.auto_renew,
                p.points, p.level, p.title
         FROM users u
         LEFT JOIN user_memberships m ON u.id = m.user_id
         LEFT JOIN user_points p ON u.id = p.user_id
         WHERE u.id = $1`,
        [id]
      );
      
      if (userResult.rows.length === 0) {
        return null;
      }
      
      const user = userResult.rows[0];
      
      // Get follower counts
      const followersResult = await pool.query(
        `SELECT COUNT(*) as count FROM followers WHERE following_id = $1`,
        [id]
      );
      
      const followingResult = await pool.query(
        `SELECT COUNT(*) as count FROM followers WHERE follower_id = $1`,
        [id]
      );
      
      // Get badge count
      const badgesResult = await pool.query(
        `SELECT COUNT(*) as count FROM user_badges WHERE user_id = $1`,
        [id]
      );
      
      // Get expert status if applicable
      let expertStatus = undefined;
      if (user.role === 'expert') {
        const expertResult = await pool.query(
          `SELECT is_verified, verified_at FROM expert_verifications WHERE user_id = $1`,
          [id]
        );
        
        if (expertResult.rows.length > 0) {
          const specialtiesResult = await pool.query(
            `SELECT specialty FROM expert_specialties WHERE user_id = $1`,
            [id]
          );
          
          const credentialsResult = await pool.query(
            `SELECT credential FROM expert_credentials WHERE user_id = $1`,
            [id]
          );
          
          expertStatus = {
            isVerified: expertResult.rows[0].is_verified,
            verifiedAt: expertResult.rows[0].verified_at,
            specialties: specialtiesResult.rows.map(row => row.specialty),
            credentials: credentialsResult.rows.map(row => row.credential)
          };
        }
      }
      
      // Return user profile
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        membership: {
          type: user.membership_type,
          startDate: user.start_date,
          endDate: user.end_date,
          autoRenew: user.auto_renew
        },
        followers: parseInt(followersResult.rows[0].count),
        following: parseInt(followingResult.rows[0].count),
        points: user.points,
        badgeCount: parseInt(badgesResult.rows[0].count),
        rank: {
          level: user.level,
          title: user.title
        },
        expertStatus
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },
  
  // Upgrade user to premium
  async upgradeUserToPremium(userId: string, months: number = 1): Promise<UserProfile | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update user role
      await client.query(
        `UPDATE users SET role = 'premium' WHERE id = $1`,
        [userId]
      );
      
      // Calculate end date
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);
      
      // Update or insert membership
      await client.query(
        `INSERT INTO user_memberships (user_id, type, start_date, end_date, auto_renew)
         VALUES ($1, 'premium', CURRENT_TIMESTAMP, $2, true)
         ON CONFLICT (user_id) DO UPDATE
         SET type = 'premium', start_date = CURRENT_TIMESTAMP, end_date = $2, auto_renew = true`,
        [userId, endDate.toISOString()]
      );
      
      await client.query('COMMIT');
      
      // Return updated user profile
      return await this.getUserById(userId);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error upgrading user to premium:', error);
      return null;
    } finally {
      client.release();
    }
  },
  
  // Downgrade user to free
  async downgradeUserToFree(userId: string): Promise<UserProfile | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update user role
      await client.query(
        `UPDATE users SET role = 'free' WHERE id = $1`,
        [userId]
      );
      
      // Update membership
      await client.query(
        `UPDATE user_memberships 
         SET type = 'free', start_date = NULL, end_date = NULL, auto_renew = false
         WHERE user_id = $1`,
        [userId]
      );
      
      await client.query('COMMIT');
      
      // Return updated user profile
      return await this.getUserById(userId);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error downgrading user to free:', error);
      return null;
    } finally {
      client.release();
    }
  }
};
