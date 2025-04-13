
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AnnouncementRepository } from '../repositories/announcementRepository';

export class AnnouncementController {
  private announcementRepository: AnnouncementRepository;

  constructor() {
    this.announcementRepository = new AnnouncementRepository();
  }

  // Get announcement banner
  getBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const banner = await this.announcementRepository.getBanner();
      res.json(banner);
    } catch (error) {
      console.error('Error getting banner:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Update announcement banner
  updateBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { text, isEnabled } = req.body;

      if (text === undefined) {
        res.status(400).json({ error: 'Text is required' });
        return;
      }

      const banner = await this.announcementRepository.updateBanner(text, isEnabled !== false);
      res.json(banner);
    } catch (error) {
      console.error('Error updating banner:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get all announcements
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const announcements = await this.announcementRepository.getAll();
      res.json(announcements);
    } catch (error) {
      console.error('Error getting announcements:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Create announcement
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, content, isActive, priority, startDate, endDate } = req.body;

      if (!title || !content) {
        res.status(400).json({ error: 'Title and content are required' });
        return;
      }

      const announcement = await this.announcementRepository.create({
        id: uuidv4(),
        title,
        content,
        is_active: isActive !== false,
        priority: priority || 1,
        start_date: startDate || null,
        end_date: endDate || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      res.status(201).json(announcement);
    } catch (error) {
      console.error('Error creating announcement:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Update announcement
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, content, isActive, priority, startDate, endDate } = req.body;

      const announcement = await this.announcementRepository.update(id, {
        title,
        content,
        is_active: isActive,
        priority,
        start_date: startDate,
        end_date: endDate,
        updated_at: new Date().toISOString()
      });

      if (!announcement) {
        res.status(404).json({ error: 'Announcement not found' });
        return;
      }

      res.json(announcement);
    } catch (error) {
      console.error('Error updating announcement:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Delete announcement
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const success = await this.announcementRepository.delete(id);

      if (!success) {
        res.status(404).json({ error: 'Announcement not found' });
        return;
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
