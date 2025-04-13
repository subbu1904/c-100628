
import express from 'express';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// Protected routes (all message routes require authentication)
router.get('/conversations', authenticateJWT, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/conversations/:id', authenticateJWT, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/', authenticateJWT, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.put('/read', authenticateJWT, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/conversations', authenticateJWT, (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

export { router as messageRoutes };
