
import express from 'express';
import { MessageController } from '../controllers/messageController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();
const messageController = new MessageController();

// Protected routes (all message routes require authentication)
router.get('/conversations', authenticateJWT, messageController.getUserConversations);
router.get('/conversations/:id', authenticateJWT, messageController.getConversationById);
router.get('/conversations/:conversationId/messages', authenticateJWT, messageController.getMessages);
router.post('/', authenticateJWT, messageController.createMessage);
router.put('/read', authenticateJWT, messageController.markAsRead);
router.post('/conversations', authenticateJWT, messageController.createConversation);

export { router as messageRoutes };
