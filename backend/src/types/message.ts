
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  last_message_at: string;
  created_at: string;
}

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
  unread_count: number;
  created_at: string;
}

export interface ConversationWithDetails extends Conversation {
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}
