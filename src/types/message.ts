
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageAt: string;
  lastMessage?: Message;
  unreadCount: number;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
