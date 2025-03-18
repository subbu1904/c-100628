
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRank } from '@/types/gamification';
import UserLevelProgress from './UserLevelProgress';
import LeaderboardTable from './LeaderboardTable';
import { Trophy, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Mock user rank for demonstration
const mockUserRank: UserRank = {
  level: 5,
  title: "Trend Spotter",
  points: 450,
  nextLevel: {
    title: "Market Strategist",
    pointsNeeded: 600
  },
  percentToNextLevel: 75
};

const GameSidebar: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      {/* User Level Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-primary" />
            {t('gamification.yourProgress')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.isAuthenticated ? (
            <div className="space-y-4">
              <UserLevelProgress userRank={mockUserRank} />
              
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-muted-foreground">{t('gamification.points')}: </span>
                  <span className="font-medium">{mockUserRank.points}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => navigate('/profile')}
                >
                  {t('gamification.viewProfile')}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Award className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                {t('gamification.loginToTrack')}
              </p>
              <Button 
                size="sm" 
                onClick={() => navigate('/login')}
              >
                {t('common.login')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-primary" />
            {t('gamification.topPerformers')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <LeaderboardTable compact maxEntries={3} />
          
          <div className="p-4 pt-0 flex justify-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/leaderboard')}
            >
              {t('gamification.viewFullLeaderboard')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSidebar;
