
import React from 'react';
import { Message } from '@/types/message';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { user } = useAuth();
  const isSender = message.senderId === user.id;
  
  // Format the time
  const messageTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <div className={cn(
      "flex mb-4",
      isSender ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2",
        isSender 
          ? "bg-primary text-primary-foreground rounded-tr-none" 
          : "bg-secondary text-secondary-foreground rounded-tl-none"
      )}>
        <p className="break-words">{message.content}</p>
        <div className="text-xs mt-1 opacity-70 text-right">
          {messageTime}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
