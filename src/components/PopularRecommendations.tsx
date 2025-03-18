
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Pause, TrendingUp, MessageSquare } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/contexts/LanguageContext';

// Mock popular recommendations data
const mockPopularRecommendations = [
  {
    id: '1',
    assetId: 'bitcoin',
    assetName: 'Bitcoin',
    assetSymbol: 'BTC',
    recommendation: 'buy',
    upvotes: 42,
    content: 'Strong buy signal on Bitcoin with institutional adoption accelerating.',
    userName: 'CryptoExpert',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: '2',
    assetId: 'ethereum',
    assetName: 'Ethereum',
    assetSymbol: 'ETH',
    recommendation: 'buy',
    upvotes: 38,
    content: 'ETH 2.0 progress is promising. Accumulate before the next major upgrade.',
    userName: 'BlockchainDev',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: '3',
    assetId: 'solana',
    assetName: 'Solana',
    assetSymbol: 'SOL',
    recommendation: 'hold',
    upvotes: 31,
    content: 'Hold position through market volatility. Long-term prospects remain strong.',
    userName: 'TechTrader',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
  },
  {
    id: '4',
    assetId: 'cardano',
    assetName: 'Cardano',
    assetSymbol: 'ADA',
    recommendation: 'buy',
    upvotes: 29,
    content: 'ADA showing strength after recent upgrades. Good entry point now.',
    userName: 'CryptoAnalyst',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
  {
    id: '5',
    assetId: 'dogecoin',
    assetName: 'Dogecoin',
    assetSymbol: 'DOGE',
    recommendation: 'sell',
    upvotes: 27,
    content: 'Take profits on DOGE rally, potential pullback coming soon.',
    userName: 'MemeInvestor',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
  }
];

// Helper to format timestamp as relative time (e.g., "3 hours ago")
const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  }
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
};

// Get recommendation icon based on type
const getRecommendationIcon = (recommendation: string) => {
  switch (recommendation) {
    case "buy":
      return <ThumbsUp className="text-green-500 w-4 h-4" />;
    case "sell":
      return <ThumbsDown className="text-red-500 w-4 h-4" />;
    case "hold":
      return <Pause className="text-blue-500 w-4 h-4" />;
    default:
      return null;
  }
};

// Get recommendation color based on type
const getRecommendationColor = (recommendation: string) => {
  switch (recommendation) {
    case "buy":
      return "bg-green-500";
    case "sell":
      return "bg-red-500";
    case "hold":
      return "bg-blue-500";
    default:
      return "bg-secondary";
  }
};

const PopularRecommendations: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="mt-4 lg:mt-0"> {/* Added margin top for mobile */}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>{t('recommendations.title')}</span>
        </CardTitle>
        <CardDescription>
          {t('recommendations.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {mockPopularRecommendations.map((rec) => (
            <div key={rec.id} className="border-b border-border/30 pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <Link to={`/asset/${rec.assetId}`} className="font-medium hover:underline flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${getRecommendationColor(rec.recommendation)}`}></div>
                  {rec.assetName} ({rec.assetSymbol})
                </Link>
                <Badge variant={rec.recommendation === 'buy' ? 'default' : rec.recommendation === 'sell' ? 'destructive' : 'secondary'} className="text-xs capitalize">
                  {getRecommendationIcon(rec.recommendation)}
                  <span className="ml-1">{t(`recommendations.${rec.recommendation}`)}</span>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                "{rec.content}"
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{rec.userName}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {rec.upvotes}
                  </span>
                  <span>{formatRelativeTime(rec.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularRecommendations;
