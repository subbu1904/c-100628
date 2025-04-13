
import { Request, Response } from 'express';
import { AssetRepository } from '../repositories/assetRepository';

export class AssetController {
  private assetRepository: AssetRepository;

  constructor() {
    this.assetRepository = new AssetRepository();
  }

  // Get all assets
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const assets = await this.assetRepository.getAll();
      res.json(assets);
    } catch (error) {
      console.error('Error getting all assets:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get asset by ID
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const asset = await this.assetRepository.getById(id);
      
      if (!asset) {
        res.status(404).json({ error: 'Asset not found' });
        return;
      }
      
      res.json(asset);
    } catch (error) {
      console.error('Error getting asset by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Add asset to favorites
  addToFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { assetId } = req.body;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      if (!assetId) {
        res.status(400).json({ error: 'Asset ID is required' });
        return;
      }
      
      const success = await this.assetRepository.addToFavorites(userId, assetId);
      
      if (!success) {
        res.status(500).json({ error: 'Failed to add asset to favorites' });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error adding asset to favorites:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Remove asset from favorites
  removeFromFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const success = await this.assetRepository.removeFromFavorites(userId, id);
      
      if (!success) {
        res.status(404).json({ error: 'Asset not found in favorites' });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing asset from favorites:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get user favorites
  getUserFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const favorites = await this.assetRepository.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error('Error getting user favorites:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
