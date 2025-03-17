
import React from 'react';
import { AdvicePost } from '@/types/user';
import AdviceCard from './AdviceCard';

interface AdviceListProps {
  advice: AdvicePost[];
  isLoading: boolean;
  activeTab: string;
  onVote: (id: string, voteType: 'up' | 'down') => void;
}

const AdviceList: React.FC<AdviceListProps> = ({ advice, isLoading, activeTab, onVote }) => {
  const filteredAdvice = activeTab === 'all' 
    ? advice 
    : advice.filter(post => post.recommendation === activeTab);
    
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
        <p className="text-muted-foreground">No {activeTab !== 'all' ? activeTab : ''} advice yet</p>
        <p className="text-sm">Be the first to share your thoughts!</p>
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
