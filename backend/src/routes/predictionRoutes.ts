
import express from 'express';
import { PredictionController } from '../controllers/predictionController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();
const predictionController = new PredictionController();

// Public routes
router.get('/asset/:assetId', predictionController.getByAssetId);

// Protected routes
router.get('/', authenticateJWT, predictionController.getAll);
router.get('/:id', authenticateJWT, predictionController.getById);
router.post('/', authenticateJWT, predictionController.create);
router.put('/:id', authenticateJWT, predictionController.update);
router.delete('/:id', authenticateJWT, predictionController.delete);
router.post('/:id/vote', authenticateJWT, predictionController.vote);

export { router as predictionRoutes };
