
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PredictionRepository } from '../repositories/predictionRepository';

export class PredictionController {
  private predictionRepository: PredictionRepository;

  constructor() {
    this.predictionRepository = new PredictionRepository();
  }

  // Get all predictions
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const predictions = await this.predictionRepository.getAll(limit, offset);
      res.json(predictions);
    } catch (error) {
      console.error('Error getting all predictions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get prediction by ID
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const prediction = await this.predictionRepository.getById(id);
      
      if (!prediction) {
        res.status(404).json({ error: 'Prediction not found' });
        return;
      }
      
      // Add user's vote if any
      const userVote = await this.predictionRepository.getUserVote(id, userId);
      
      res.json({
        ...prediction,
        userVote
      });
    } catch (error) {
      console.error('Error getting prediction by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get predictions for asset
  getByAssetId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { assetId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const predictions = await this.predictionRepository.getByAssetId(assetId, limit, offset);
      res.json(predictions);
    } catch (error) {
      console.error('Error getting predictions by asset ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Create prediction
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const { assetId, predictionType, content, expectedDirection } = req.body;
      
      if (!assetId || !predictionType || !expectedDirection) {
        res.status(400).json({ error: 'Asset ID, prediction type, and expected direction are required' });
        return;
      }
      
      if (!['buy', 'sell', 'hold'].includes(predictionType)) {
        res.status(400).json({ error: 'Prediction type must be buy, sell, or hold' });
        return;
      }
      
      if (!['up', 'down', 'stable'].includes(expectedDirection)) {
        res.status(400).json({ error: 'Expected direction must be up, down, or stable' });
        return;
      }
      
      const prediction = await this.predictionRepository.create({
        user_id: userId,
        asset_id: assetId,
        prediction: predictionType,
        content,
        expected_direction: expectedDirection
      });
      
      if (!prediction) {
        res.status(500).json({ error: 'Failed to create prediction' });
        return;
      }
      
      res.status(201).json(prediction);
    } catch (error) {
      console.error('Error creating prediction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Update prediction
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const { predictionType, content, expectedDirection } = req.body;
      
      // Validate inputs if provided
      if (predictionType && !['buy', 'sell', 'hold'].includes(predictionType)) {
        res.status(400).json({ error: 'Prediction type must be buy, sell, or hold' });
        return;
      }
      
      if (expectedDirection && !['up', 'down', 'stable'].includes(expectedDirection)) {
        res.status(400).json({ error: 'Expected direction must be up, down, or stable' });
        return;
      }
      
      // Build update object
      const updateData: any = {};
      
      if (predictionType) updateData.prediction = predictionType;
      if (content !== undefined) updateData.content = content;
      if (expectedDirection) updateData.expected_direction = expectedDirection;
      
      const prediction = await this.predictionRepository.update(id, updateData);
      
      if (!prediction) {
        res.status(404).json({ error: 'Prediction not found' });
        return;
      }
      
      res.json(prediction);
    } catch (error) {
      console.error('Error updating prediction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Delete prediction
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const success = await this.predictionRepository.delete(id, userId);
      
      if (!success) {
        res.status(404).json({ error: 'Prediction not found or not owned by user' });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting prediction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Vote on prediction
  vote = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { vote } = req.body;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      if (!vote || !['up', 'down'].includes(vote)) {
        res.status(400).json({ error: 'Vote must be up or down' });
        return;
      }
      
      const success = await this.predictionRepository.vote(id, userId, vote);
      
      if (!success) {
        res.status(500).json({ error: 'Failed to vote on prediction' });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error voting on prediction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
