
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdvicePost } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import AuthDialog from '../auth/AuthDialog';
import UserRankBadge from '../gamification/UserRankBadge';
import { Badge } from '@/types/gamification';
import UserBadges from '../gamification/UserBadges';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock badges for demonstration
const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Market Guru',
    description: 'Provided accurate market predictions',
    icon: 'trophy',
    unlocked: true,
    category: 'prediction',
    level: 3
  },
  {
    id: '2',
    name: 'Helpful Advisor',
    description: 'Received many upvotes for advice',
    icon: 'award',
    unlocked: true,
    category: 'contribution',
    level: 2
  }
];

interface AdviceCardProps {
  advice: AdvicePost;
  onVote: (id: string, voteType: 'up' | 'down') => void;
}

const AdviceCard: React.FC<AdviceCardProps> = ({ advice, onVote }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  // Define recommendation color
  const recommendationColors = {
    buy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    sell: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    hold: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };
  
  // Format date
  const formattedDate = new Date(advice.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const handleVote = (voteType: 'up' | 'down') => {
    if (!user.isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    onVote(advice.id, voteType);
  };
  
  const handleComment = () => {
    if (!user.isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    
    if (!comment.trim()) {
      toast({
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }
    
    // This would be an API call in a real app
    toast({
      description: "Comment functionality coming soon!",
    });
    
    setComment('');
  };
  
  return (
    <>
      <Card className="p-4 mb-4 border-2 border-secondary hover:border-primary transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-semibold mr-3">
              {advice.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center">
                <p className="font-medium mr-2">{advice.userName}</p>
                {advice.userRank && (
                  <UserRankBadge 
                    user={{ 
                      id: advice.userId, 
                      name: advice.userName, 
                      email: '', 
                      role: 'free',
                      createdAt: '',
                      membership: { type: 'free' },
                      rank: advice.userRank
                    }}
                    size="sm"
                  />
                )}
              </div>
              <div className="flex items-center">
                <p className="text-xs text-muted-foreground mr-2">{formattedDate}</p>
                {advice.badges && advice.badges.length > 0 && (
                  <UserBadges 
                    badges={mockBadges}
                    maxDisplay={2}
                    showTooltips={true}
                    size="sm"
                  />
                )}
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${recommendationColors[advice.recommendation]}`}>
            {t(`recommendations.${advice.recommendation}`).toUpperCase()}
          </span>
        </div>
        
        <p className="mb-4">{advice.content}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleVote('up')}
              className={advice.userVote === 'up' ? 'text-green-600' : ''}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              {advice.votes.upvotes}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleVote('down')}
              className={advice.userVote === 'down' ? 'text-red-600' : ''}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              {advice.votes.downvotes}
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            {t('gamification.comments')}
          </Button>
        </div>
        
        {showComments && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">{t('gamification.commentsComingSoon')}</p>
            <div className="flex space-x-2">
              <Textarea 
                placeholder={t('gamification.addComment')}
                className="text-sm"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button onClick={handleComment}>{t('gamification.post')}</Button>
            </div>
          </div>
        )}
      </Card>
      
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
      />
    </>
  );
};

export default AdviceCard;
