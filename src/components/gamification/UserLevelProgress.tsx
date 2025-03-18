
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { UserRank } from '@/types/gamification';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserLevelProgressProps {
  userRank: UserRank;
  showTitle?: boolean;
  compact?: boolean;
}

const UserLevelProgress: React.FC<UserLevelProgressProps> = ({
  userRank,
  showTitle = true,
  compact = false
}) => {
  const { t } = useLanguage();
  
  if (!userRank.nextLevel) {
    return (
      <div className="space-y-2">
        {showTitle && (
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">
              {t('gamification.currentLevel')}
            </h4>
            <span className="text-sm font-semibold">
              {userRank.title} (Max)
            </span>
          </div>
        )}
        <Progress value={100} className="h-2" />
        {!compact && (
          <p className="text-xs text-muted-foreground">
            {t('gamification.maxLevelReached')}
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {showTitle && (
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">
            {t('gamification.levelProgress')}
          </h4>
          <span className="text-sm font-semibold">
            {userRank.level}
          </span>
        </div>
      )}
      
      <Progress value={userRank.percentToNextLevel || 0} className="h-2" />
      
      {!compact && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{userRank.title}</span>
          <span>
            {userRank.points} / {userRank.nextLevel.pointsNeeded} {t('gamification.points')}
          </span>
          <span>{userRank.nextLevel.title}</span>
        </div>
      )}
    </div>
  );
};

export default UserLevelProgress;
