
import React from 'react';
import { Conversation } from '@/types/message';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId?: string;
  isLoading: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
  isLoading,
}) => {
  const { user } = useAuth();
  
  // Mock function to get user details
  const getUserDetails = (userId: string): { name: string; initial: string } => {
    // In a real app, this would come from a users service
    const mockUsers: Record<string, { name: string }> = {
      'user1': { name: 'John Doe' },
      'user2': { name: 'Jane Smith' },
      'user3': { name: 'Robert Johnson' },
    };
    
    const name = mockUsers[userId]?.name || 'Unknown User';
    return {
      name,
      initial: name.charAt(0).toUpperCase(),
    };
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No conversations yet</p>
        <p className="text-sm">Start chatting with other users!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {conversations.map((conversation) => {
        // Find the other participant (not the current user)
        const otherParticipantId = conversation.participantIds.find(
          id => id !== (user.profile?.id || '')
        );
        const otherUser = otherParticipantId ? getUserDetails(otherParticipantId) : { name: 'Unknown', initial: '?' };
        
        // Format the last message time
        const lastMessageTime = conversation.lastMessageAt 
          ? format(new Date(conversation.lastMessageAt), 'h:mm a')
          : '';
        
        return (
          <div
            key={conversation.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedConversationId === conversation.id 
                ? 'bg-primary/10' 
                : 'hover:bg-secondary'
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary-foreground font-semibold">
                {otherUser.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{otherUser.name}</h3>
                  <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                    {lastMessageTime}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage?.content || 'No messages yet'}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-medium">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
