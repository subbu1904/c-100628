
import db from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { Message, Conversation, ConversationParticipant, ConversationWithDetails } from '../types/message';

export class MessageRepository {
  // Get conversations for user
  async getUserConversations(userId: string): Promise<ConversationWithDetails[]> {
    try {
      const client = await db.getClient();
      
      try {
        // Start transaction
        await client.query('BEGIN');
        
        // Get all conversations where user is a participant
        const conversationsResult = await client.query(
          `SELECT c.*, cp.unread_count
           FROM conversations c
           JOIN conversation_participants cp ON c.id = cp.conversation_id
           WHERE cp.user_id = $1
           ORDER BY c.last_message_at DESC`,
          [userId]
        );
        
        const conversations: ConversationWithDetails[] = [];
        
        // For each conversation, get participants and last message
        for (const conv of conversationsResult.rows) {
          // Get participants
          const participantsResult = await client.query(
            `SELECT user_id FROM conversation_participants WHERE conversation_id = $1`,
            [conv.id]
          );
          
          const participants = participantsResult.rows.map(p => p.user_id);
          
          // Get last message
          const lastMessageResult = await client.query(
            `SELECT * FROM messages 
             WHERE conversation_id = $1 
             ORDER BY created_at DESC 
             LIMIT 1`,
            [conv.id]
          );
          
          const lastMessage = lastMessageResult.rows.length > 0 ? lastMessageResult.rows[0] : undefined;
          
          conversations.push({
            id: conv.id,
            last_message_at: conv.last_message_at,
            created_at: conv.created_at,
            participants,
            lastMessage,
            unreadCount: conv.unread_count
          });
        }
        
        // Commit transaction
        await client.query('COMMIT');
        
        return conversations;
      } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error getting user conversations:', error);
      return [];
    }
  }

  // Get conversation by ID
  async getConversationById(conversationId: string, userId: string): Promise<ConversationWithDetails | null> {
    try {
      const client = await db.getClient();
      
      try {
        // Start transaction
        await client.query('BEGIN');
        
        // Check if user is participant
        const participantResult = await client.query(
          `SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
          [conversationId, userId]
        );
        
        if (participantResult.rows.length === 0) {
          return null;
        }
        
        // Get conversation
        const conversationResult = await client.query(
          `SELECT * FROM conversations WHERE id = $1`,
          [conversationId]
        );
        
        if (conversationResult.rows.length === 0) {
          return null;
        }
        
        const conversation = conversationResult.rows[0];
        
        // Get participants
        const participantsResult = await client.query(
          `SELECT user_id FROM conversation_participants WHERE conversation_id = $1`,
          [conversationId]
        );
        
        const participants = participantsResult.rows.map(p => p.user_id);
        
        // Get last message
        const lastMessageResult = await client.query(
          `SELECT * FROM messages 
           WHERE conversation_id = $1 
           ORDER BY created_at DESC 
           LIMIT 1`,
          [conversationId]
        );
        
        const lastMessage = lastMessageResult.rows.length > 0 ? lastMessageResult.rows[0] : undefined;
        
        // Commit transaction
        await client.query('COMMIT');
        
        return {
          id: conversation.id,
          last_message_at: conversation.last_message_at,
          created_at: conversation.created_at,
          participants,
          lastMessage,
          unreadCount: participantResult.rows[0].unread_count
        };
      } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error getting conversation by ID:', error);
      return null;
    }
  }

  // Get messages for conversation
  async getMessages(conversationId: string, userId: string): Promise<Message[]> {
    try {
      // Check if user is participant
      const participantResult = await db.query(
        `SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
        [conversationId, userId]
      );
      
      if (participantResult.rows.length === 0) {
        return [];
      }
      
      // Get messages
      const result = await db.query(
        `SELECT * FROM messages 
         WHERE conversation_id = $1 
         ORDER BY created_at`,
        [conversationId]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  // Create new message
  async createMessage(senderId: string, conversationId: string, content: string): Promise<Message | null> {
    try {
      const client = await db.getClient();
      
      try {
        // Start transaction
        await client.query('BEGIN');
        
        // Check if user is participant
        const participantResult = await client.query(
          `SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
          [conversationId, senderId]
        );
        
        if (participantResult.rows.length === 0) {
          return null;
        }
        
        // Create message
        const messageId = uuidv4();
        const now = new Date().toISOString();
        
        const messageResult = await client.query(
          `INSERT INTO messages (id, conversation_id, sender_id, content, is_read, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [messageId, conversationId, senderId, content, false, now]
        );
        
        // Update conversation last_message_at
        await client.query(
          `UPDATE conversations 
           SET last_message_at = $1 
           WHERE id = $2`,
          [now, conversationId]
        );
        
        // Increment unread_count for all participants except sender
        await client.query(
          `UPDATE conversation_participants 
           SET unread_count = unread_count + 1 
           WHERE conversation_id = $1 AND user_id != $2`,
          [conversationId, senderId]
        );
        
        // Commit transaction
        await client.query('COMMIT');
        
        return messageResult.rows[0];
      } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error creating message:', error);
      return null;
    }
  }

  // Mark messages as read
  async markAsRead(userId: string, conversationId: string): Promise<boolean> {
    try {
      const client = await db.getClient();
      
      try {
        // Start transaction
        await client.query('BEGIN');
        
        // Check if user is participant
        const participantResult = await client.query(
          `SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2`,
          [conversationId, userId]
        );
        
        if (participantResult.rows.length === 0) {
          return false;
        }
        
        // Mark messages as read where user is not sender
        await client.query(
          `UPDATE messages 
           SET is_read = true 
           WHERE conversation_id = $1 AND sender_id != $2`,
          [conversationId, userId]
        );
        
        // Reset unread_count for user
        await client.query(
          `UPDATE conversation_participants 
           SET unread_count = 0 
           WHERE conversation_id = $1 AND user_id = $2`,
          [conversationId, userId]
        );
        
        // Commit transaction
        await client.query('COMMIT');
        
        return true;
      } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }

  // Create new conversation
  async createConversation(userId: string, participantIds: string[]): Promise<Conversation | null> {
    try {
      // Ensure participantIds includes the creator (userId)
      if (!participantIds.includes(userId)) {
        participantIds.push(userId);
      }
      
      const client = await db.getClient();
      
      try {
        // Start transaction
        await client.query('BEGIN');
        
        // Create conversation
        const conversationId = uuidv4();
        const now = new Date().toISOString();
        
        const conversationResult = await client.query(
          `INSERT INTO conversations (id, last_message_at, created_at)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [conversationId, now, now]
        );
        
        // Add participants
        for (const participantId of participantIds) {
          await client.query(
            `INSERT INTO conversation_participants (conversation_id, user_id, unread_count, created_at)
             VALUES ($1, $2, 0, $3)`,
            [conversationId, participantId, now]
          );
        }
        
        // Commit transaction
        await client.query('COMMIT');
        
        return conversationResult.rows[0];
      } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }
}
