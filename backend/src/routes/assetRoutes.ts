
import express from 'express';
import { AssetController } from '../controllers/assetController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();
const assetController = new AssetController();

// Public routes
router.get('/', assetController.getAll);
router.get('/:id', assetController.getById);

// Protected routes
router.post('/favorite', authenticateJWT, assetController.addToFavorites);
router.delete('/favorite/:id', authenticateJWT, assetController.removeFromFavorites);
router.get('/user/favorites', authenticateJWT, assetController.getUserFavorites);

export { router as assetRoutes };
