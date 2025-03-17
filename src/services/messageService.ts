
import { Message, Conversation } from '@/types/message';
import { v4 as uuidv4 } from 'uuid';

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participantIds: ['user1', 'user2'],
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 1,
  },
  {
    id: 'conv2',
    participantIds: ['user1', 'user3'],
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 0,
  },
];

// Mock data for messages
const mockMessages: Record<string, Message[]> = {
  'conv1': [
    {
      id: 'msg1',
      senderId: 'user2',
      recipientId: 'user1',
      content: 'Have you seen the latest market movements?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: 'msg2',
      senderId: 'user1',
      recipientId: 'user2',
      content: 'Yes, the volatility is quite high!',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      read: true,
    },
  ],
  'conv2': [
    {
      id: 'msg3',
      senderId: 'user3',
      recipientId: 'user1',
      content: "I'm thinking of investing in Bitcoin, what do you think?",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
    {
      id: 'msg4',
      senderId: 'user1',
      recipientId: 'user3',
      content: 'It depends on your risk tolerance, but it might be a good time to buy.',
      timestamp: new Date(Date.now() - 7100000).toISOString(),
      read: true,
    },
  ],
};

export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  // In a real app, this would make an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const userConversations = mockConversations.filter(conv => 
    conv.participantIds.includes(userId)
  );
  
  // Add last message for each conversation
  return userConversations.map(conv => {
    const messages = mockMessages[conv.id] || [];
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
    
    return {
      ...conv,
      lastMessage,
    };
  });
};

export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  // In a real app, this would make an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockMessages[conversationId] || [];
};

export const sendMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<Message> => {
  // In a real app, this would make an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newMessage: Message = {
    ...message,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    read: false,
  };
  
  return newMessage;
};

export const markAsRead = async (messageIds: string[]): Promise<void> => {
  // In a real app, this would make an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Would update the messages in the backend
  console.log('Marked messages as read:', messageIds);
};

export const createConversation = async (participantIds: string[]): Promise<Conversation> => {
  // In a real app, this would make an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newConversation: Conversation = {
    id: uuidv4(),
    participantIds,
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
  };
  
  return newConversation;
};
