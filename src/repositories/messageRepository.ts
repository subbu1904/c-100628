
import pool from '@/lib/db';
import { Message, Conversation } from '@/types/message';

export const messageRepository = {
  // Fetch conversations for a user
  async fetchConversations(userId: string): Promise<Conversation[]> {
    try {
      // Get all conversations that the user is part of
      const result = await pool.query(
        `SELECT c.id, c.last_message_at, cp.unread_count
         FROM conversations c
         INNER JOIN conversation_participants cp ON c.id = cp.conversation_id
         WHERE cp.user_id = $1
         ORDER BY c.last_message_at DESC`,
        [userId]
      );
      
      // Build conversations with participants and last message
      const conversations = await Promise.all(result.rows.map(async (row) => {
        // Get participants
        const participantsResult = await pool.query(
          `SELECT user_id FROM conversation_participants WHERE conversation_id = $1`,
          [row.id]
        );
        
        const participantIds = participantsResult.rows.map(p => p.user_id);
        
        // Get last message
        const lastMessageResult = await pool.query(
          `SELECT id, sender_id, content, is_read, created_at
           FROM messages
           WHERE conversation_id = $1
           ORDER BY created_at DESC
           LIMIT 1`,
          [row.id]
        );
        
        let lastMessage: Message | undefined = undefined;
        
        if (lastMessageResult.rows.length > 0) {
          const msgRow = lastMessageResult.rows[0];
          
          // Get recipient ID (first participant that isn't the sender)
          const recipientId = participantIds.find(id => id !== msgRow.sender_id) || '';
          
          lastMessage = {
            id: msgRow.id,
            senderId: msgRow.sender_id,
            recipientId,
            content: msgRow.content,
            timestamp: msgRow.created_at,
            read: msgRow.is_read
          };
        }
        
        return {
          id: row.id,
          participantIds,
          lastMessageAt: row.last_message_at,
          unreadCount: row.unread_count,
          lastMessage
        };
      }));
      
      return conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },
  
  // Fetch messages for a conversation
  async fetchMessages(conversationId: string): Promise<Message[]> {
    try {
      // Get conversation participants for recipient mapping
      const participantsResult = await pool.query(
        `SELECT user_id FROM conversation_participants WHERE conversation_id = $1`,
        [conversationId]
      );
      
      const participantIds = participantsResult.rows.map(p => p.user_id);
      
      // Get messages
      const result = await pool.query(
        `SELECT id, sender_id, content, is_read, created_at
         FROM messages
         WHERE conversation_id = $1
         ORDER BY created_at ASC`,
        [conversationId]
      );
      
      // Map messages with recipient IDs
      return result.rows.map(row => {
        // Get recipient ID (first participant that isn't the sender)
        const recipientId = participantIds.find(id => id !== row.sender_id) || '';
        
        return {
          id: row.id,
          senderId: row.sender_id,
          recipientId,
          content: row.content,
          timestamp: row.created_at,
          read: row.is_read
        };
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },
  
  // Send a message
  async sendMessage(message: { senderId: string; recipientId: string; content: string }): Promise<Message | null> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get or create conversation between these users
      let conversationId = null;
      
      // Check if conversation exists
      const conversationResult = await client.query(
        `SELECT c.id
         FROM conversations c
         INNER JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
         INNER JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
         WHERE cp1.user_id = $1 AND cp2.user_id = $2`,
        [message.senderId, message.recipientId]
      );
      
      if (conversationResult.rows.length > 0) {
        conversationId = conversationResult.rows[0].id;
        
        // Update last_message_at
        await client.query(
          `UPDATE conversations
           SET last_message_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [conversationId]
        );
      } else {
        // Create new conversation
        const newConversationResult = await client.query(
          `INSERT INTO conversations (last_message_at)
           VALUES (CURRENT_TIMESTAMP)
           RETURNING id`,
        );
        
        conversationId = newConversationResult.rows[0].id;
        
        // Add participants
        await client.query(
          `INSERT INTO conversation_participants (conversation_id, user_id)
           VALUES ($1, $2), ($1, $3)`,
          [conversationId, message.senderId, message.recipientId]
        );
      }
      
      // Insert message
      const messageResult = await client.query(
        `INSERT INTO messages (conversation_id, sender_id, content)
         VALUES ($1, $2, $3)
         RETURNING id, content, is_read, created_at`,
        [conversationId, message.senderId, message.content]
      );
      
      // Increment unread count for recipient
      await client.query(
        `UPDATE conversation_participants
         SET unread_count = unread_count + 1
         WHERE conversation_id = $1 AND user_id = $2`,
        [conversationId, message.recipientId]
      );
      
      await client.query('COMMIT');
      
      // Return the created message
      return {
        id: messageResult.rows[0].id,
        senderId: message.senderId,
        recipientId: message.recipientId,
        content: messageResult.rows[0].content,
        timestamp: messageResult.rows[0].created_at,
        read: messageResult.rows[0].is_read
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error sending message:', error);
      return null;
    } finally {
      client.release();
    }
  },
  
  // Mark messages as read
  async markAsRead(messageIds: string[]): Promise<boolean> {
    if (messageIds.length === 0) return true;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update messages
      await client.query(
        `UPDATE messages
         SET is_read = true
         WHERE id = ANY($1)`,
        [messageIds]
      );
      
      // Get conversation IDs and recipient ID for these messages
      const messagesResult = await client.query(
        `SELECT DISTINCT conversation_id, sender_id
         FROM messages
         WHERE id = ANY($1)`,
        [messageIds]
      );
      
      // Update unread counts for affected conversations
      for (const row of messagesResult.rows) {
        // Reset unread count for this user in this conversation
        // (this assumes the user reading the messages is the recipient)
        await client.query(
          `UPDATE conversation_participants
           SET unread_count = 0
           WHERE conversation_id = $1 AND user_id != $2`,
          [row.conversation_id, row.sender_id]
        );
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error marking messages as read:', error);
      return false;
    } finally {
      client.release();
    }
  },
  
  // Create a new conversation
  async createConversation(participantIds: string[]): Promise<Conversation | null> {
    if (participantIds.length < 2) {
      console.error('At least two participants are required to create a conversation');
      return null;
    }
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create conversation
      const conversationResult = await client.query(
        `INSERT INTO conversations (last_message_at)
         VALUES (CURRENT_TIMESTAMP)
         RETURNING id, last_message_at`,
      );
      
      const conversationId = conversationResult.rows[0].id;
      
      // Add participants
      for (const userId of participantIds) {
        await client.query(
          `INSERT INTO conversation_participants (conversation_id, user_id)
           VALUES ($1, $2)`,
          [conversationId, userId]
        );
      }
      
      await client.query('COMMIT');
      
      // Return the new conversation
      return {
        id: conversationId,
        participantIds,
        lastMessageAt: conversationResult.rows[0].last_message_at,
        unreadCount: 0
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating conversation:', error);
      return null;
    } finally {
      client.release();
    }
  }
};
