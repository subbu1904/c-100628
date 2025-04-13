
import db from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { Prediction, PredictionOutcome, PredictionVote, PredictionWithDetails } from '../types/prediction';

export class PredictionRepository {
  // Get all predictions
  async getAll(limit: number = 50, offset: number = 0): Promise<Prediction[]> {
    try {
      const result = await db.query(
        `SELECT * FROM predictions 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting all predictions:', error);
      return [];
    }
  }

  // Get prediction by ID
  async getById(id: string): Promise<PredictionWithDetails | null> {
    try {
      const client = await db.getClient();
      
      try {
        // Start transaction
        await client.query('BEGIN');
        
        // Get prediction
        const predictionResult = await client.query(
          'SELECT * FROM predictions WHERE id = $1',
          [id]
        );
        
        if (predictionResult.rows.length === 0) {
          return null;
        }
        
        const prediction = predictionResult.rows[0];
        
        // Get outcome
        const outcomeResult = await client.query(
          'SELECT * FROM prediction_outcomes WHERE prediction_id = $1',
          [id]
        );
        
        const outcome = outcomeResult.rows.length > 0 ? outcomeResult.rows[0] : undefined;
        
        // Get vote counts
        const votesResult = await client.query(
          `SELECT vote, COUNT(*) 
           FROM prediction_votes 
           WHERE prediction_id = $1 
           GROUP BY vote`,
          [id]
        );
        
        let upvotes = 0;
        let downvotes = 0;
        
        votesResult.rows.forEach(row => {
          if (row.vote === 'up') {
            upvotes = parseInt(row.count);
          } else if (row.vote === 'down') {
            downvotes = parseInt(row.count);
          }
        });
        
        // Commit transaction
        await client.query('COMMIT');
        
        return {
          ...prediction,
          outcome,
          upvotes,
          downvotes
        };
      } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error getting prediction by ID:', error);
      return null;
    }
  }

  // Get predictions for asset
  async getByAssetId(assetId: string, limit: number = 50, offset: number = 0): Promise<Prediction[]> {
    try {
      const result = await db.query(
        `SELECT * FROM predictions 
         WHERE asset_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [assetId, limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting predictions by asset ID:', error);
      return [];
    }
  }

  // Get predictions by user
  async getByUserId(userId: string, limit: number = 50, offset: number = 0): Promise<Prediction[]> {
    try {
      const result = await db.query(
        `SELECT * FROM predictions 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting predictions by user ID:', error);
      return [];
    }
  }

  // Create prediction
  async create(prediction: Omit<Prediction, 'id' | 'created_at' | 'updated_at'>): Promise<Prediction | null> {
    try {
      const client = await db.getClient();
      
      try {
        // Start transaction
        await client.query('BEGIN');
        
        // Create prediction
        const id = uuidv4();
        const now = new Date().toISOString();
        
        const predictionResult = await client.query(
          `INSERT INTO predictions (id, user_id, asset_id, prediction, content, expected_direction, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [
            id,
            prediction.user_id,
            prediction.asset_id,
            prediction.prediction,
            prediction.content || null,
            prediction.expected_direction,
            now,
            now
          ]
        );
        
        // Create initial outcome (pending)
        const outcomeId = uuidv4();
        
        await client.query(
          `INSERT INTO prediction_outcomes (id, prediction_id, result, created_at, updated_at)
           VALUES ($1, $2, 'pending', $3, $4)`,
          [outcomeId, id, now, now]
        );
        
        // Commit transaction
        await client.query('COMMIT');
        
        return predictionResult.rows[0];
      } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error creating prediction:', error);
      return null;
    }
  }

  // Update prediction
  async update(id: string, update: Partial<Prediction>): Promise<Prediction | null> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      Object.entries(update).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'user_id' && key !== 'created_at') {
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
        `UPDATE predictions 
         SET ${updates.join(', ')} 
         WHERE id = $${paramIndex} 
         RETURNING *`,
        values
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error updating prediction:', error);
      return null;
    }
  }

  // Delete prediction
  async delete(id: string, userId: string): Promise<boolean> {
    try {
      const result = await db.query(
        'DELETE FROM predictions WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting prediction:', error);
      return false;
    }
  }

  // Vote on prediction
  async vote(predictionId: string, userId: string, vote: 'up' | 'down'): Promise<boolean> {
    try {
      const client = await db.getClient();
      
      try {
        // Start transaction
        await client.query('BEGIN');
        
        // Check if user already voted
        const existingVote = await client.query(
          'SELECT * FROM prediction_votes WHERE prediction_id = $1 AND user_id = $2',
          [predictionId, userId]
        );
        
        const now = new Date().toISOString();
        
        if (existingVote.rows.length > 0) {
          // Update existing vote
          await client.query(
            `UPDATE prediction_votes 
             SET vote = $1, updated_at = $2 
             WHERE prediction_id = $3 AND user_id = $4`,
            [vote, now, predictionId, userId]
          );
        } else {
          // Create new vote
          await client.query(
            `INSERT INTO prediction_votes (prediction_id, user_id, vote, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5)`,
            [predictionId, userId, vote, now, now]
          );
        }
        
        // Commit transaction
        await client.query('COMMIT');
        
        return true;
      } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error voting on prediction:', error);
      return false;
    }
  }

  // Get user vote for prediction
  async getUserVote(predictionId: string, userId: string): Promise<'up' | 'down' | null> {
    try {
      const result = await db.query(
        'SELECT vote FROM prediction_votes WHERE prediction_id = $1 AND user_id = $2',
        [predictionId, userId]
      );
      
      return result.rows.length > 0 ? result.rows[0].vote : null;
    } catch (error) {
      console.error('Error getting user vote:', error);
      return null;
    }
  }
}
