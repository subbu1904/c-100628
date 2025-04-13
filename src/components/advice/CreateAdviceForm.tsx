
import React, { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '../auth/AuthDialog';

interface CreateAdviceFormProps {
  assetId: string;
  assetName: string;
  onAdviceCreated: () => void;
}

const CreateAdviceForm: React.FC<CreateAdviceFormProps> = ({ 
  assetId, 
  assetName,
  onAdviceCreated 
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [recommendation, setRecommendation] = useState<'buy' | 'sell' | 'hold'>('buy');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user.isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Empty advice",
        description: "Please enter some advice content",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For now we're mocking this, but in a real app this would be an API call
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful response
      toast({
        title: "Advice posted",
        description: `Your ${recommendation} advice for ${assetName} has been posted!`,
      });
      
      // Reset form
      setContent('');
      setRecommendation('buy');
      
      // Notify parent component
      onAdviceCreated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post advice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Share Your Advice</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              What's your recommendation?
            </label>
            <div className="flex space-x-2">
              <Button 
                type="button"
                variant={recommendation === 'buy' ? 'default' : 'outline'}
                onClick={() => setRecommendation('buy')}
                className={recommendation === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Buy
              </Button>
              <Button 
                type="button"
                variant={recommendation === 'hold' ? 'default' : 'outline'}
                onClick={() => setRecommendation('hold')}
                className={recommendation === 'hold' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Hold
              </Button>
              <Button 
                type="button"
                variant={recommendation === 'sell' ? 'default' : 'outline'}
                onClick={() => setRecommendation('sell')}
                className={recommendation === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Sell
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="advice-content" className="text-sm text-muted-foreground">
              Your advice
            </label>
            <Textarea
              id="advice-content"
              placeholder={`Why do you recommend to ${recommendation} ${assetName}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Posting...' : 'Post Advice'}
          </Button>
        </form>
      </Card>
      
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
      />
    </>
  );
};

export default CreateAdviceForm;
