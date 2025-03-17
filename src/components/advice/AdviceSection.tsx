import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvicePost, AdviceSentiment } from '@/types/user';
import CreateAdviceForm from './CreateAdviceForm';
import SentimentDisplay from './SentimentDisplay';
import AdviceList from './AdviceList';

// Mock data for initial render
const mockAdvice: AdvicePost[] = [
  {
    id: '1',
    assetId: 'bitcoin',
    userId: 'user1',
    userName: 'CryptoExpert',
    recommendation: 'buy',
    content: 'Bitcoin is showing strong support at current levels. The recent institutional adoption and increasing scarcity due to the halving make this a great time to accumulate.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    votes: { upvotes: 15, downvotes: 2 },
  },
  {
    id: '2',
    assetId: 'bitcoin',
    userId: 'user2',
    userName: 'TradingGuru',
    recommendation: 'hold',
    content: 'While the long-term outlook is bullish, we might see some short-term volatility. Hold your position and consider dollar-cost averaging if we see a dip.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    votes: { upvotes: 8, downvotes: 1 },
  },
  {
    id: '3',
    assetId: 'bitcoin',
    userId: 'user3',
    userName: 'BearMarketAnalyst',
    recommendation: 'sell',
    content: 'Technical indicators suggest we might be entering a correction phase. Consider taking some profits now and re-entering at lower levels.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    votes: { upvotes: 5, downvotes: 12 },
  },
];

interface AdviceSectionProps {
  assetId: string;
  assetName: string;
}

const AdviceSection: React.FC<AdviceSectionProps> = ({ assetId, assetName }) => {
  const [advice, setAdvice] = useState<AdvicePost[]>([]);
  const [sentiment, setSentiment] = useState<AdviceSentiment>({ buy: 0, sell: 0, hold: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // This would be an API call in a real app
    const fetchAdvice = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, use mock data filtered by assetId
        const assetAdvice = mockAdvice.filter(post => post.assetId === assetId);
        setAdvice(assetAdvice);
        
        // Calculate sentiment
        const sentimentCount = assetAdvice.reduce((acc, post) => {
          acc[post.recommendation]++;
          acc.total++;
          return acc;
        }, { buy: 0, sell: 0, hold: 0, total: 0 } as AdviceSentiment);
        
        setSentiment(sentimentCount);
      } catch (error) {
        console.error('Error fetching advice:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdvice();
  }, [assetId]);
  
  const handleVote = (id: string, voteType: 'up' | 'down') => {
    // This would be an API call in a real app
    setAdvice(prevAdvice => 
      prevAdvice.map(post => {
        if (post.id === id) {
          const wasUpvoted = post.userVote === 'up';
          const wasDownvoted = post.userVote === 'down';
          
          let upvotes = post.votes.upvotes;
          let downvotes = post.votes.downvotes;
          
          // Remove previous vote if any
          if (wasUpvoted) upvotes--;
          if (wasDownvoted) downvotes--;
          
          // Add new vote
          if (voteType === 'up' && !wasUpvoted) upvotes++;
          if (voteType === 'down' && !wasDownvoted) downvotes++;
          
          return {
            ...post,
            votes: { upvotes, downvotes },
            userVote: voteType === post.userVote ? null : voteType
          };
        }
        return post;
      })
    );
  };
  
  const handleAdviceCreated = () => {
    // In a real app, we would refetch the advice from the server
    // For now, we'll just simulate a refetch by waiting a bit
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <div className="mb-8">
      <h2 className="section-title mb-6">Community Advice</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SentimentDisplay sentiment={sentiment} />
        
        <div className="md:col-span-2">
          <CreateAdviceForm 
            assetId={assetId} 
            assetName={assetName}
            onAdviceCreated={handleAdviceCreated}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Advice</TabsTrigger>
          <TabsTrigger value="buy">Buy</TabsTrigger>
          <TabsTrigger value="hold">Hold</TabsTrigger>
          <TabsTrigger value="sell">Sell</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <AdviceList 
            advice={advice}
            isLoading={isLoading}
            activeTab={activeTab}
            onVote={handleVote}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdviceSection;
