
import express from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authenticateJWT, requireAdmin } from '../middleware/auth';

const router = express.Router();
const categoryController = new CategoryController();

// Public routes
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.get('/:id/assets', categoryController.getAssets);

// Admin routes
router.post('/', authenticateJWT, requireAdmin, categoryController.create);
router.put('/:id', authenticateJWT, requireAdmin, categoryController.update);
router.delete('/:id', authenticateJWT, requireAdmin, categoryController.delete);
router.post('/:id/assets', authenticateJWT, requireAdmin, categoryController.addAsset);
router.delete('/:id/assets/:assetId', authenticateJWT, requireAdmin, categoryController.removeAsset);

export { router as categoryRoutes };
