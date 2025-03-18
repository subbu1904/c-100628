
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdvicePost } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { ThumbsUp, ThumbsDown, MessageCircle, CheckCircle, AlertCircle, XCircle, Award, BarChart2, Shield } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import AuthDialog from '../auth/AuthDialog';
import UserRankBadge from '../gamification/UserRankBadge';
import { Badge as BadgeType } from '@/types/gamification';
import { Badge } from "@/components/ui/badge";
import UserBadges from '../gamification/UserBadges';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock badges for demonstration
const mockBadges: BadgeType[] = [
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
  },
  {
    id: '3',
    name: 'Verified Expert',
    description: 'Recognized financial expert',
    icon: 'shield',
    unlocked: true,
    category: 'expert',
    level: 3
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
  
  // Get verification status badge
  const getVerificationBadge = () => {
    if (!advice.verificationStatus) return null;
    
    switch (advice.verificationStatus) {
      case 'verified':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
            <CheckCircle className="h-3 w-3" />
            {t('verification.verified')}
          </Badge>
        );
      case 'incorrect':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800">
            <XCircle className="h-3 w-3" />
            {t('verification.incorrect')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800">
            <AlertCircle className="h-3 w-3" />
            {t('verification.pending')}
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <>
      <Card className={`p-4 mb-4 border-2 ${advice.verificationStatus === 'verified' ? 'border-green-300' : advice.verificationStatus === 'incorrect' ? 'border-red-300' : 'border-secondary'} hover:border-primary transition-all`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-semibold mr-3">
              {advice.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center">
                <p className="font-medium mr-2">{advice.userName}</p>
                {advice.userIsExpert && (
                  <Badge variant="secondary" className="mr-2 flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {t('expert.verified')}
                  </Badge>
                )}
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
          <div className="flex items-center gap-2">
            {getVerificationBadge()}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${recommendationColors[advice.recommendation]}`}>
              {t(`recommendations.${advice.recommendation}`).toUpperCase()}
            </span>
          </div>
        </div>
        
        <p className="mb-4">{advice.content}</p>
        
        {advice.predictionOutcome && (
          <div className="mb-4 p-3 rounded-md border bg-secondary/20">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">{t('verification.predictionOutcome')}</h4>
              <Badge 
                variant={advice.predictionOutcome.result === 'correct' ? 'default' : 'destructive'}
                className="flex items-center gap-1"
              >
                {advice.predictionOutcome.result === 'correct' 
                  ? <CheckCircle className="h-3 w-3" /> 
                  : <XCircle className="h-3 w-3" />}
                {t(`verification.${advice.predictionOutcome.result}`)}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">{t('verification.expectedDirection')}:</span>
              <span className={
                advice.predictionOutcome.expectedDirection === 'up' 
                  ? 'text-green-600' 
                  : advice.predictionOutcome.expectedDirection === 'down'
                  ? 'text-red-600'
                  : 'text-blue-600'
              }>
                {t(`verification.direction.${advice.predictionOutcome.expectedDirection}`)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">{t('verification.actualDirection')}:</span>
              <span className={
                advice.predictionOutcome.actualDirection === 'up' 
                  ? 'text-green-600' 
                  : advice.predictionOutcome.actualDirection === 'down'
                  ? 'text-red-600'
                  : 'text-blue-600'
              }>
                {t(`verification.direction.${advice.predictionOutcome.actualDirection}`)}
                {advice.predictionOutcome.actualChange !== undefined && 
                  ` (${advice.predictionOutcome.actualChange > 0 ? '+' : ''}${advice.predictionOutcome.actualChange}%)`}
              </span>
            </div>
          </div>
        )}
        
        {advice.riskAssessment && (
          <div className="mb-4 p-3 rounded-md border bg-secondary/20">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">{t('crowdWisdom.riskAssessment')}</h4>
              <Badge 
                variant={
                  advice.riskAssessment.level === 'low' ? 'default' :
                  advice.riskAssessment.level === 'medium' ? 'secondary' :
                  advice.riskAssessment.level === 'high' ? 'outline' : 'destructive'
                }
                className={cn(
                  "capitalize",
                  advice.riskAssessment.level === 'low' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                  advice.riskAssessment.level === 'medium' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                  advice.riskAssessment.level === 'high' && "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
                  advice.riskAssessment.level === 'very-high' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                )}
              >
                {t(`crowdWisdom.riskLevel.${advice.riskAssessment.level}`)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{t('crowdWisdom.volatilityIndex')}</span>
                  <span>{advice.riskAssessment.volatilityIndex}/100</span>
                </div>
                <div className={cn(
                  "relative w-full overflow-hidden rounded-full bg-secondary h-1.5",
                  advice.riskAssessment.volatilityIndex > 66 ? "bg-red-200 dark:bg-red-800" :
                  advice.riskAssessment.volatilityIndex > 33 ? "bg-yellow-200 dark:bg-yellow-800" :
                  "bg-green-200 dark:bg-green-800"
                )}>
                  <Progress 
                    value={advice.riskAssessment.volatilityIndex} 
                    className={cn(
                      advice.riskAssessment.volatilityIndex > 66 ? "bg-red-500" :
                      advice.riskAssessment.volatilityIndex > 33 ? "bg-yellow-500" :
                      "bg-green-500"
                    )}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{t('crowdWisdom.consensusStrength')}</span>
                  <span>{advice.riskAssessment.communityConsensus}/100</span>
                </div>
                <div className="relative w-full overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800 h-1.5">
                  <Progress 
                    value={advice.riskAssessment.communityConsensus}
                    className="bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
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
