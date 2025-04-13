
import { Request, Response } from 'express';
import { SuperCategoryRepository } from '../repositories/superCategoryRepository';

export class SuperCategoryController {
  private superCategoryRepository: SuperCategoryRepository;

  constructor() {
    this.superCategoryRepository = new SuperCategoryRepository();
  }

  // Get all super categories
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const superCategories = await this.superCategoryRepository.getAll();
      res.json(superCategories);
    } catch (error) {
      console.error('Error getting all super categories:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get super category by ID
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const superCategory = await this.superCategoryRepository.getById(id);
      
      if (!superCategory) {
        res.status(404).json({ error: 'Super category not found' });
        return;
      }
      
      res.json(superCategory);
    } catch (error) {
      console.error('Error getting super category by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Create super category
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, name, slug, color, description, isEnabled } = req.body;
      
      if (!id || !name || !slug) {
        res.status(400).json({ error: 'ID, name, and slug are required' });
        return;
      }
      
      const superCategory = await this.superCategoryRepository.create({
        id,
        name,
        slug,
        color,
        description,
        is_enabled: isEnabled !== false
      });
      
      if (!superCategory) {
        res.status(500).json({ error: 'Failed to create super category' });
        return;
      }
      
      res.status(201).json(superCategory);
    } catch (error) {
      console.error('Error creating super category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Update super category
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, slug, color, description, isEnabled } = req.body;
      
      const updates: any = {};
      
      if (name !== undefined) updates.name = name;
      if (slug !== undefined) updates.slug = slug;
      if (color !== undefined) updates.color = color;
      if (description !== undefined) updates.description = description;
      if (isEnabled !== undefined) updates.is_enabled = isEnabled;
      
      const superCategory = await this.superCategoryRepository.update(id, updates);
      
      if (!superCategory) {
        res.status(404).json({ error: 'Super category not found' });
        return;
      }
      
      res.json(superCategory);
    } catch (error) {
      console.error('Error updating super category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Delete super category
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.superCategoryRepository.delete(id);
      
      if (!success) {
        res.status(404).json({ error: 'Super category not found' });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting super category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Toggle super category enabled status
  toggleEnabled = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const superCategory = await this.superCategoryRepository.toggleEnabled(id);
      
      if (!superCategory) {
        res.status(404).json({ error: 'Super category not found' });
        return;
      }
      
      res.json(superCategory);
    } catch (error) {
      console.error('Error toggling super category enabled status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
