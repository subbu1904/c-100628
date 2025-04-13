
import express from 'express';
import { authenticateJWT, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Admin routes
router.post('/', authenticateJWT, requireAdmin, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.put('/:id', authenticateJWT, requireAdmin, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.delete('/:id', authenticateJWT, requireAdmin, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export { router as categoryRoutes };
