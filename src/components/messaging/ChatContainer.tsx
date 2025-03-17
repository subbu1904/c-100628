
import React, { useState, useEffect } from 'react';
import { Message } from '@/types/message';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { fetchMessages, sendMessage, markAsRead } from '@/services/messageService';
import { useAuth } from '@/contexts/AuthContext';

interface ChatContainerProps {
  conversationId: string;
  recipientId: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ conversationId, recipientId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  
  // Fetch messages when conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const fetchedMessages = await fetchMessages(conversationId);
        setMessages(fetchedMessages);
        
        // Mark unread messages as read
        const unreadMessageIds = fetchedMessages
          .filter(msg => !msg.read && msg.recipientId === (user.profile?.id || ''))
          .map(msg => msg.id);
          
        if (unreadMessageIds.length > 0) {
          await markAsRead(unreadMessageIds);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId, user.profile?.id]);
  
  const handleSendMessage = async (content: string) => {
    if (!user.profile) return;
    
    setIsSending(true);
    try {
      const newMessage = await sendMessage({
        senderId: user.profile.id,
        recipientId,
        content,
      });
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
      />
      <MessageInput 
        onSendMessage={handleSendMessage} 
        isLoading={isSending} 
      />
    </div>
  );
};

export default ChatContainer;
