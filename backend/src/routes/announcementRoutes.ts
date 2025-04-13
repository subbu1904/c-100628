
import express from 'express';
import { AnnouncementController } from '../controllers/announcementController';
import { authenticateJWT, requireAdmin } from '../middleware/auth';

const router = express.Router();
const announcementController = new AnnouncementController();

// Public routes
router.get('/banner', announcementController.getBanner);

// Admin routes
router.get('/', authenticateJWT, requireAdmin, announcementController.getAll);
router.post('/', authenticateJWT, requireAdmin, announcementController.create);
router.put('/:id', authenticateJWT, requireAdmin, announcementController.update);
router.delete('/:id', authenticateJWT, requireAdmin, announcementController.delete);
router.put('/banner', authenticateJWT, requireAdmin, announcementController.updateBanner);

export { router as announcementRoutes };
