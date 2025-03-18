
import React, { useState } from 'react';
import { 
  Table, TableHeader, TableBody, 
  TableHead, TableRow, TableCell 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  LeaderboardEntry, LeaderboardPeriod, 
  LeaderboardCategory 
} from '@/types/gamification';
import UserRankBadge from './UserRankBadge';
import { Trophy, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock leaderboard data for now
const mockLeaderboardData: LeaderboardEntry[] = [
  {
    userId: "user1",
    userName: "CryptoGuru",
    rank: 1,
    points: 1250,
    successRate: 86,
    followers: 327,
    badges: 12,
    userRank: {
      level: 8,
      title: "Crypto Oracle",
      points: 1250,
      nextLevel: {
        title: "Crypto Legend",
        pointsNeeded: 1500
      },
      percentToNextLevel: 83
    }
  },
  {
    userId: "user2",
    userName: "TradingQueen",
    rank: 2,
    points: 980,
    successRate: 81,
    followers: 245,
    badges: 9,
    userRank: {
      level: 7,
      title: "Master Analyst",
      points: 980,
      nextLevel: {
        title: "Crypto Oracle",
        pointsNeeded: 1200
      },
      percentToNextLevel: 82
    }
  },
  {
    userId: "user3",
    userName: "CoinHunter",
    rank: 3,
    points: 870,
    successRate: 78,
    followers: 189,
    badges: 7,
    userRank: {
      level: 6,
      title: "Market Strategist",
      points: 870,
      nextLevel: {
        title: "Master Analyst",
        pointsNeeded: 1000
      },
      percentToNextLevel: 87
    }
  },
  {
    userId: "user4",
    userName: "BlockchainWiz",
    rank: 4,
    points: 760,
    successRate: 75,
    followers: 142,
    badges: 6,
    userRank: {
      level: 5,
      title: "Trend Spotter",
      points: 760,
      nextLevel: {
        title: "Market Strategist",
        pointsNeeded: 900
      },
      percentToNextLevel: 84
    }
  },
  {
    userId: "user5",
    userName: "TokenMaster",
    rank: 5,
    points: 720,
    successRate: 73,
    followers: 118,
    badges: 5,
    userRank: {
      level: 5,
      title: "Trend Spotter",
      points: 720,
      nextLevel: {
        title: "Market Strategist",
        pointsNeeded: 900
      },
      percentToNextLevel: 80
    }
  }
];

interface LeaderboardTableProps {
  category?: LeaderboardCategory;
  period?: LeaderboardPeriod;
  compact?: boolean;
  maxEntries?: number;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  category: initialCategory = "predictions",
  period: initialPeriod = "weekly",
  compact = false,
  maxEntries = 5
}) => {
  const [category, setCategory] = useState<LeaderboardCategory>(initialCategory);
  const [period, setPeriod] = useState<LeaderboardPeriod>(initialPeriod);
  const { t } = useLanguage();
  
  // In a real app, this would fetch from an API with the selected parameters
  const leaderboardData = mockLeaderboardData.slice(0, maxEntries);
  
  const getCategoryIcon = () => {
    switch (category) {
      case "predictions": return <BarChart3 className="w-4 h-4 mr-2" />;
      case "followers": return <Users className="w-4 h-4 mr-2" />;
      case "contributions": return <TrendingUp className="w-4 h-4 mr-2" />;
      default: return <Trophy className="w-4 h-4 mr-2" />;
    }
  };
  
  const getCategoryLabel = () => {
    return t(`gamification.categories.${category}`);
  };
  
  const getPeriodLabel = () => {
    return t(`gamification.periods.${period}`);
  };
  
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-amber-500";
      case 2: return "text-slate-400";
      case 3: return "text-amber-700";
      default: return "text-muted-foreground";
    }
  };
  
  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center">
            {getCategoryIcon()}
            <h3 className="text-lg font-semibold">
              {t('gamification.leaderboard')} - {getCategoryLabel()}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as LeaderboardCategory)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={t('gamification.categories.predictions')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="predictions">{t('gamification.categories.predictions')}</SelectItem>
                <SelectItem value="followers">{t('gamification.categories.followers')}</SelectItem>
                <SelectItem value="contributions">{t('gamification.categories.contributions')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={period} 
              onValueChange={(value) => setPeriod(value as LeaderboardPeriod)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={t('gamification.periods.weekly')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">{t('gamification.periods.weekly')}</SelectItem>
                <SelectItem value="monthly">{t('gamification.periods.monthly')}</SelectItem>
                <SelectItem value="allTime">{t('gamification.periods.allTime')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">{t('gamification.rank')}</TableHead>
            <TableHead>{t('gamification.user')}</TableHead>
            {!compact && (
              <>
                {category === "predictions" && (
                  <TableHead className="text-right">{t('gamification.successRate')}</TableHead>
                )}
                {category === "followers" && (
                  <TableHead className="text-right">{t('gamification.followers')}</TableHead>
                )}
                {category === "contributions" && (
                  <TableHead className="text-right">{t('gamification.points')}</TableHead>
                )}
                <TableHead className="text-right">{t('gamification.badges')}</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((entry) => (
            <TableRow key={entry.userId}>
              <TableCell className="text-center font-medium">
                <span className={`${getMedalColor(entry.rank)}`}>
                  {entry.rank <= 3 ? (
                    <Trophy className="w-5 h-5 mx-auto" />
                  ) : (
                    entry.rank
                  )}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.userAvatar} alt={entry.userName} />
                    <AvatarFallback>{entry.userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{entry.userName}</div>
                    <UserRankBadge 
                      user={{ 
                        id: entry.userId, 
                        name: entry.userName, 
                        email: '', 
                        role: 'free',
                        createdAt: '',
                        membership: { type: 'free' },
                        rank: {
                          level: entry.userRank.level,
                          title: entry.userRank.title
                        }
                      }}
                      size="sm"
                    />
                  </div>
                </div>
              </TableCell>
              {!compact && (
                <>
                  {category === "predictions" && (
                    <TableCell className="text-right">{entry.successRate}%</TableCell>
                  )}
                  {category === "followers" && (
                    <TableCell className="text-right">{entry.followers}</TableCell>
                  )}
                  {category === "contributions" && (
                    <TableCell className="text-right">{entry.points}</TableCell>
                  )}
                  <TableCell className="text-right">{entry.badges}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {!compact && (
        <div className="flex justify-center mt-4">
          <Button variant="outline">
            {t('gamification.viewFullLeaderboard')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
