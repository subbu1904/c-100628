
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LeaderboardTable from '@/components/gamification/LeaderboardTable';
import BadgesGallery from '@/components/gamification/BadgesGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Trophy className="w-6 h-6 mr-2 text-primary" />
        <h1 className="text-3xl font-bold">{t('gamification.leaderboard')}</h1>
      </div>
      
      <Tabs defaultValue="leaderboard">
        <TabsList className="mb-6">
          <TabsTrigger value="leaderboard">{t('gamification.rankings')}</TabsTrigger>
          <TabsTrigger value="badges">{t('gamification.badges.all')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaderboard" className="mt-0">
          <LeaderboardTable />
        </TabsContent>
        
        <TabsContent value="badges" className="mt-0">
          <BadgesGallery />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
