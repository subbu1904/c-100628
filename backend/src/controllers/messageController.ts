
import { Request, Response } from 'express';
import { MessageRepository } from '../repositories/messageRepository';

export class MessageController {
  private messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  // Get user conversations
  getUserConversations = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const conversations = await this.messageRepository.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error('Error getting user conversations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get conversation by ID
  getConversationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const conversation = await this.messageRepository.getConversationById(id, userId);
      
      if (!conversation) {
        res.status(404).json({ error: 'Conversation not found' });
        return;
      }
      
      res.json(conversation);
    } catch (error) {
      console.error('Error getting conversation by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get messages for conversation
  getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { conversationId } = req.params;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const messages = await this.messageRepository.getMessages(conversationId, userId);
      res.json(messages);
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Create new message
  createMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { conversationId, content } = req.body;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      if (!conversationId || !content) {
        res.status(400).json({ error: 'Conversation ID and content are required' });
        return;
      }
      
      const message = await this.messageRepository.createMessage(userId, conversationId, content);
      
      if (!message) {
        res.status(404).json({ error: 'Conversation not found or user not a participant' });
        return;
      }
      
      res.status(201).json(message);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Mark messages as read
  markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { conversationId } = req.body;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      if (!conversationId) {
        res.status(400).json({ error: 'Conversation ID is required' });
        return;
      }
      
      const success = await this.messageRepository.markAsRead(userId, conversationId);
      
      if (!success) {
        res.status(404).json({ error: 'Conversation not found or user not a participant' });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Create new conversation
  createConversation = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { participantIds } = req.body;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
        res.status(400).json({ error: 'At least one participant ID is required' });
        return;
      }
      
      const conversation = await this.messageRepository.createConversation(userId, participantIds);
      
      if (!conversation) {
        res.status(500).json({ error: 'Failed to create conversation' });
        return;
      }
      
      res.status(201).json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
