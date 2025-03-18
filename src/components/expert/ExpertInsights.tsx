
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExpertInsight } from '@/types/user';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, BarChart2, Bookmark, Clock, Play, ThumbsUp, Eye, Calendar } from 'lucide-react';
import { formatDistance } from 'date-fns';

// Mock expert insights data
const mockExpertInsights: ExpertInsight[] = [
  {
    id: '1',
    authorId: 'expert1',
    authorName: 'Dr. Jane Williams',
    authorAvatar: '/assets/experts/jane-williams.jpg',
    title: 'Bitcoin Halving Impact Analysis',
    summary: 'Detailed analysis of how the Bitcoin halving will affect the market in the coming months.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    assetId: 'bitcoin',
    assetName: 'Bitcoin',
    category: 'analysis',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    tags: ['Bitcoin', 'Halving', 'Market Analysis'],
    likes: 324,
    views: 4501
  },
  {
    id: '2',
    authorId: 'expert2',
    authorName: 'Michael Chen, CFA',
    title: 'Ethereum 2.0 Technical Review',
    summary: 'Technical implications of Ethereum 2.0 and what it means for investors and developers.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    assetId: 'ethereum',
    assetName: 'Ethereum',
    category: 'report',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    mediaUrl: 'https://example.com/video/ethereum-2-review',
    tags: ['Ethereum', 'Technical Analysis', 'ETH 2.0'],
    likes: 246,
    views: 3872
  },
  {
    id: '3',
    authorId: 'expert3',
    authorName: 'Sarah Martinez',
    title: 'Altcoin Season: Identifying Potential Winners',
    summary: 'How to identify promising altcoins during altcoin season using fundamental analysis.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'tutorial',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    tags: ['Altcoins', 'Investment Strategy', 'Fundamental Analysis'],
    likes: 189,
    views: 2984
  }
];

interface ExpertInsightsProps {
  assetId?: string; // Optional: filter insights by asset
}

const ExpertInsights: React.FC<ExpertInsightsProps> = ({ assetId }) => {
  const { t } = useLanguage();
  
  // Filter insights by asset if assetId is provided
  const insights = assetId 
    ? mockExpertInsights.filter(insight => insight.assetId === assetId)
    : mockExpertInsights;
    
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analysis':
        return <BarChart2 className="h-4 w-4" />;
      case 'report':
        return <BookOpen className="h-4 w-4" />;
      case 'tutorial':
        return <Play className="h-4 w-4" />;
      case 'news':
        return <Calendar className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };
  
  if (insights.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">{t('expert.noInsightsAvailable')}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {insights.map(insight => (
        <Card key={insight.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <Badge className="mb-2 flex items-center gap-1 w-fit">
                {getCategoryIcon(insight.category)}
                {t(`expert.categories.${insight.category}`)}
              </Badge>
              <Button variant="ghost" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-xl">{insight.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistance(new Date(insight.publishedAt), new Date(), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-3">{insight.summary}</p>
            {insight.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {insight.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center mt-4">
              <div className="flex items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold mr-2">
                  {insight.authorName.charAt(0)}
                </div>
                <span className="text-sm font-medium">{insight.authorName}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-0 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                {insight.likes}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {insight.views}
              </span>
            </div>
            <Button size="sm">{t('expert.readMore')}</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ExpertInsights;
