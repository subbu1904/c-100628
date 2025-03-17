
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/types/message';
import { fetchConversations } from '@/services/messageService';
import ConversationList from '@/components/messaging/ConversationList';
import ChatContainer from '@/components/messaging/ChatContainer';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus } from 'lucide-react';
import AuthDialog from '@/components/auth/AuthDialog';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  useEffect(() => {
    const loadConversations = async () => {
      if (!user.isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const fetchedConversations = await fetchConversations(user.id);
        setConversations(fetchedConversations);
        
        // Select the first conversation if available and none is selected
        if (fetchedConversations.length > 0 && !selectedConversationId) {
          setSelectedConversationId(fetchedConversations[0].id);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversations();
  }, [user.isAuthenticated, user.id]);
  
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };
  
  const handleNewConversation = () => {
    if (!user.isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    
    // This would open a modal to select a user to chat with
    console.log('Create new conversation');
  };
  
  // Find the selected conversation and recipient
  const selectedConversation = conversations.find(
    conv => conv.id === selectedConversationId
  );
  const recipientId = selectedConversation?.participantIds.find(
    id => id !== user.id
  );
  
  // Handle mobile view with tabs
  const mobileView = (
    <Tabs defaultValue="conversations" className="sm:hidden">
      <TabsList className="w-full">
        <TabsTrigger value="conversations" className="flex-1">Conversations</TabsTrigger>
        <TabsTrigger value="chat" className="flex-1" disabled={!selectedConversationId}>
          Chat
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="conversations" className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Your Messages</h2>
          <Button size="sm" onClick={handleNewConversation}>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
        
        <ConversationList
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversationId || undefined}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="chat" className="mt-0 h-[calc(100vh-200px)]">
        {selectedConversationId && recipientId ? (
          <ChatContainer
            conversationId={selectedConversationId}
            recipientId={recipientId}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Conversation Selected</h3>
            <p className="text-muted-foreground">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
  
  // Desktop view with side-by-side layout
  const desktopView = (
    <div className="hidden sm:grid grid-cols-3 gap-4 h-[calc(100vh-150px)]">
      <div className="col-span-1 border-r pr-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Your Messages</h2>
          <Button size="sm" onClick={handleNewConversation}>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
        
        <ConversationList
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversationId || undefined}
          isLoading={isLoading}
        />
      </div>
      
      <div className="col-span-2 h-full">
        {selectedConversationId && recipientId ? (
          <ChatContainer
            conversationId={selectedConversationId}
            recipientId={recipientId}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Conversation Selected</h3>
            <p className="text-muted-foreground">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
  
  // Different content based on authentication status
  const content = !user.isAuthenticated ? (
    <div className="text-center py-16">
      <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Sign In to Access Messages</h2>
      <p className="text-muted-foreground mb-6">
        You need to be signed in to view and send messages.
      </p>
      <Button onClick={() => setShowAuthDialog(true)}>
        Sign In
      </Button>
    </div>
  ) : (
    <>
      {mobileView}
      {desktopView}
    </>
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container animate-slide-up">
        <div className="mb-6">
          <h1 className="page-header">Messages</h1>
          <p className="text-muted-foreground">
            Chat with other users about cryptocurrency trends and insights.
          </p>
        </div>
        
        {content}
      </main>
      
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
      />
    </div>
  );
};

export default Messages;
