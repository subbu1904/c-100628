
import pool from "@/lib/db";
import { UserProfile } from "@/types/user";

// Ensure all DB calls handle the mock implementation
export const userRepository = {
  // Authenticate user
  authenticateUser: async (email: string, password: string): Promise<UserProfile | null> => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
      
      if (result.rows && result.rows.length > 0) {
        return result.rows[0] as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  },

  // Get user by email
  getUserByEmail: async (email: string): Promise<UserProfile | null> => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (result.rows && result.rows.length > 0) {
        return result.rows[0] as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  },

  // Create user
  createUser: async (email: string, password: string, name: string): Promise<UserProfile | null> => {
    try {
      const result = await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
        [email, password, name]
      );
      
      if (result.rows && result.rows.length > 0) {
        return result.rows[0] as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },

  // Upgrade user to premium
  upgradeUserToPremium: async (userId: string): Promise<UserProfile | null> => {
    try {
      const result = await pool.query(
        'UPDATE users SET isPremium = TRUE WHERE id = $1 RETURNING *',
        [userId]
      );
      
      if (result.rows && result.rows.length > 0) {
        return result.rows[0] as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error upgrading user to premium:', error);
      return null;
    }
  },

  // Downgrade user to free
  downgradeUserToFree: async (userId: string): Promise<UserProfile | null> => {
    try {
      const result = await pool.query(
        'UPDATE users SET isPremium = FALSE WHERE id = $1 RETURNING *',
        [userId]
      );
      
      if (result.rows && result.rows.length > 0) {
        return result.rows[0] as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error downgrading user to free:', error);
      return null;
    }
  }
};
