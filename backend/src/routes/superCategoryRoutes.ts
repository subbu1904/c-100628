
import express from 'express';
import { SuperCategoryController } from '../controllers/superCategoryController';
import { authenticateJWT, requireAdmin } from '../middleware/auth';

const router = express.Router();
const superCategoryController = new SuperCategoryController();

// Public routes
router.get('/', superCategoryController.getAll);
router.get('/:id', superCategoryController.getById);

// Admin routes
router.post('/', authenticateJWT, requireAdmin, superCategoryController.create);
router.put('/:id', authenticateJWT, requireAdmin, superCategoryController.update);
router.delete('/:id', authenticateJWT, requireAdmin, superCategoryController.delete);
router.put('/:id/toggle', authenticateJWT, requireAdmin, superCategoryController.toggleEnabled);

export { router as superCategoryRoutes };
