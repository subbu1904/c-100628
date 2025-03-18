
import React from 'react';
import { Badge as BadgeType } from '@/types/gamification';
import { 
  Trophy, Award, Star, Target, Zap, 
  Users, MessageSquare, TrendingUp, Medal 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from '@/contexts/LanguageContext';

interface UserBadgesProps {
  badges: BadgeType[];
  maxDisplay?: number;
  showTooltips?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const UserBadges: React.FC<UserBadgesProps> = ({ 
  badges, 
  maxDisplay = 3,
  showTooltips = true,
  size = 'md'
}) => {
  const { t } = useLanguage();
  
  if (!badges || badges.length === 0) return null;
  
  const getBadgeIcon = (badge: BadgeType) => {
    const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
    
    switch (badge.icon) {
      case 'trophy': return <Trophy className={iconSize} />;
      case 'award': return <Award className={iconSize} />;
      case 'star': return <Star className={iconSize} />;
      case 'target': return <Target className={iconSize} />;
      case 'zap': return <Zap className={iconSize} />;
      case 'users': return <Users className={iconSize} />;
      case 'message': return <MessageSquare className={iconSize} />;
      case 'trend': return <TrendingUp className={iconSize} />;
      case 'medal': return <Medal className={iconSize} />;
      default: return <Award className={iconSize} />;
    }
  };
  
  const getBadgeColor = (badge: BadgeType) => {
    switch (badge.category) {
      case 'prediction':
        return badge.level === 3 ? 'bg-amber-500' : 
               badge.level === 2 ? 'bg-slate-400' : 'bg-amber-700';
      case 'social':
        return 'bg-blue-500';
      case 'contribution':
        return 'bg-green-500';
      case 'achievement':
        return 'bg-purple-500';
      default:
        return 'bg-slate-500';
    }
  };
  
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9"
  };
  
  const displayBadges = badges.slice(0, maxDisplay);
  const remainingCount = badges.length - maxDisplay;
  
  return (
    <div className="flex -space-x-1">
      {displayBadges.map((badge) => (
        <TooltipProvider key={badge.id}>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div 
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${getBadgeColor(badge)}`}
              >
                {getBadgeIcon(badge)}
              </div>
            </TooltipTrigger>
            {showTooltips && (
              <TooltipContent side="top">
                <p className="font-medium">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
      
      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-muted`}
              >
                <span className="text-xs">+{remainingCount}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('gamification.moreBadges', { count: remainingCount })}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default UserBadges;
