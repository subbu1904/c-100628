
import React from 'react';
import { AdvicePost } from '@/types/user';
import AdviceCard from './AdviceCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdviceListProps {
  advice: AdvicePost[];
  isLoading: boolean;
  activeTab: string;
  onVote: (id: string, voteType: 'up' | 'down') => void;
}

const AdviceList: React.FC<AdviceListProps> = ({ advice, isLoading, activeTab, onVote }) => {
  const { t } = useLanguage();
  
  const filteredAdvice = React.useMemo(() => {
    if (activeTab === 'all') {
      return advice;
    } else if (activeTab === 'verified') {
      return advice.filter(post => post.verificationStatus === 'verified');
    } else {
      return advice.filter(post => post.recommendation === activeTab);
    }
  }, [advice, activeTab]);
    
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (filteredAdvice.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">
          {activeTab === 'verified' 
            ? t('verification.noVerifiedAdvice')
            : activeTab !== 'all' 
              ? t('advice.noAdviceType', { type: t(`recommendations.${activeTab}`) }) 
              : t('advice.noAdviceYet')}
        </p>
        <p className="text-sm">{t('advice.beFirstToShare')}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredAdvice.map(post => (
        <AdviceCard 
          key={post.id} 
          advice={post} 
          onVote={onVote} 
        />
      ))}
    </div>
  );
};

export default AdviceList;
