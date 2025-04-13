
import { Request, Response } from 'express';
import { CategoryRepository } from '../repositories/categoryRepository';

export class CategoryController {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  // Get all categories
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryRepository.getAll();
      res.json(categories);
    } catch (error) {
      console.error('Error getting all categories:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get category by ID
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.categoryRepository.getById(id);
      
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      res.json(category);
    } catch (error) {
      console.error('Error getting category by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Create category
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, slug, superCategoryId } = req.body;
      
      if (!name || !slug) {
        res.status(400).json({ error: 'Name and slug are required' });
        return;
      }
      
      const category = await this.categoryRepository.create({
        name,
        description,
        slug,
        super_category_id: superCategoryId
      });
      
      if (!category) {
        res.status(500).json({ error: 'Failed to create category' });
        return;
      }
      
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Update category
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, slug, superCategoryId } = req.body;
      
      const updates: any = {};
      
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (slug !== undefined) updates.slug = slug;
      if (superCategoryId !== undefined) updates.super_category_id = superCategoryId;
      
      const category = await this.categoryRepository.update(id, updates);
      
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Delete category
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.categoryRepository.delete(id);
      
      if (!success) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get assets by category ID
  getAssets = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const assets = await this.categoryRepository.getAssets(id);
      res.json(assets);
    } catch (error) {
      console.error('Error getting assets by category ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Add asset to category
  addAsset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { assetId } = req.body;
      
      if (!assetId) {
        res.status(400).json({ error: 'Asset ID is required' });
        return;
      }
      
      const success = await this.categoryRepository.addAsset(id, assetId);
      
      if (!success) {
        res.status(500).json({ error: 'Failed to add asset to category' });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error adding asset to category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Remove asset from category
  removeAsset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, assetId } = req.params;
      const success = await this.categoryRepository.removeAsset(id, assetId);
      
      if (!success) {
        res.status(404).json({ error: 'Asset not found in category' });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing asset from category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
