
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge as BadgeType } from '@/types/gamification';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, Award, Star, Target, Zap, 
  Users, MessageSquare, TrendingUp, Medal,
  Lock
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock badges data
const mockBadges: BadgeType[] = [
  {
    id: '1',
    name: 'First Prediction',
    description: 'Made your first prediction',
    icon: 'star',
    unlocked: true,
    unlockedAt: '2023-10-15T10:30:00Z',
    category: 'prediction',
    level: 1
  },
  {
    id: '2',
    name: 'Consistent Analyst',
    description: 'Made predictions for 7 consecutive days',
    icon: 'target',
    unlocked: true,
    unlockedAt: '2023-10-22T14:15:00Z',
    category: 'prediction',
    level: 2
  },
  {
    id: '3',
    name: 'Market Guru',
    description: 'Achieve 80% success rate on at least 20 predictions',
    icon: 'trophy',
    unlocked: false,
    category: 'prediction',
    level: 3
  },
  {
    id: '4',
    name: 'Social Beginner',
    description: 'Gain your first 10 followers',
    icon: 'users',
    unlocked: true,
    unlockedAt: '2023-10-18T09:45:00Z',
    category: 'social',
    level: 1
  },
  {
    id: '5',
    name: 'Crypto Influencer',
    description: 'Reach 100 followers',
    icon: 'users',
    unlocked: false,
    category: 'social',
    level: 2
  },
  {
    id: '6',
    name: 'Helpful Advisor',
    description: 'Get 50 upvotes on your advice',
    icon: 'message',
    unlocked: true,
    unlockedAt: '2023-11-05T16:20:00Z',
    category: 'contribution',
    level: 1
  },
  {
    id: '7',
    name: 'Community Leader',
    description: 'Get 200 upvotes on your advice',
    icon: 'trend',
    unlocked: false,
    category: 'contribution',
    level: 2
  },
  {
    id: '8',
    name: 'Early Adopter',
    description: 'Joined during the beta phase',
    icon: 'zap',
    unlocked: true,
    unlockedAt: '2023-09-01T08:00:00Z',
    category: 'achievement',
    level: 1
  }
];

interface BadgesGalleryProps {
  userId?: string; // If provided, shows badges for a specific user, otherwise shows all possible badges
  initialTab?: string;
}

const BadgesGallery: React.FC<BadgesGalleryProps> = ({
  userId,
  initialTab = 'all'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { t } = useLanguage();
  
  // In a real app, this would fetch from an API
  const badges = mockBadges;
  
  const getBadgesByCategory = (category: string) => {
    if (category === 'all') return badges;
    return badges.filter(badge => badge.category === category);
  };
  
  const getBadgeIcon = (badge: BadgeType) => {
    switch (badge.icon) {
      case 'trophy': return <Trophy className="h-6 w-6" />;
      case 'award': return <Award className="h-6 w-6" />;
      case 'star': return <Star className="h-6 w-6" />;
      case 'target': return <Target className="h-6 w-6" />;
      case 'zap': return <Zap className="h-6 w-6" />;
      case 'users': return <Users className="h-6 w-6" />;
      case 'message': return <MessageSquare className="h-6 w-6" />;
      case 'trend': return <TrendingUp className="h-6 w-6" />;
      case 'medal': return <Medal className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };
  
  const getBadgeColor = (badge: BadgeType) => {
    if (!badge.unlocked) {
      return 'bg-muted text-muted-foreground';
    }
    
    switch (badge.category) {
      case 'prediction':
        return badge.level === 3 ? 'bg-amber-500 text-white' : 
               badge.level === 2 ? 'bg-slate-400 text-white' : 'bg-amber-700 text-white';
      case 'social':
        return 'bg-blue-500 text-white';
      case 'contribution':
        return 'bg-green-500 text-white';
      case 'achievement':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">{t('gamification.badges.all')}</TabsTrigger>
          <TabsTrigger value="prediction">{t('gamification.badges.prediction')}</TabsTrigger>
          <TabsTrigger value="social">{t('gamification.badges.social')}</TabsTrigger>
          <TabsTrigger value="contribution">{t('gamification.badges.contribution')}</TabsTrigger>
          <TabsTrigger value="achievement">{t('gamification.badges.achievement')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getBadgesByCategory(activeTab).map(badge => (
              <Card key={badge.id} className={badge.unlocked ? '' : 'opacity-70'}>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`h-14 w-14 rounded-full ${getBadgeColor(badge)} flex items-center justify-center mt-2`}>
                      {badge.unlocked ? (
                        getBadgeIcon(badge)
                      ) : (
                        <Lock className="h-6 w-6" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{badge.name}</h3>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                    
                    {badge.unlocked && badge.unlockedAt && (
                      <p className="text-xs text-muted-foreground">
                        {t('gamification.badges.unlocked')}: {formatDate(badge.unlockedAt)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BadgesGallery;
