
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdviceSentiment } from '@/types/user';

interface SentimentDisplayProps {
  sentiment: AdviceSentiment;
}

const SentimentDisplay: React.FC<SentimentDisplayProps> = ({ sentiment }) => {
  // Calculate sentiment percentages for the progress bars
  const buyPercentage = sentiment.total > 0 ? (sentiment.buy / sentiment.total) * 100 : 0;
  const sellPercentage = sentiment.total > 0 ? (sentiment.sell / sentiment.total) * 100 : 0;
  const holdPercentage = sentiment.total > 0 ? (sentiment.hold / sentiment.total) * 100 : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Community Sentiment</CardTitle>
        <CardDescription>
          Based on {sentiment.total} recommendation{sentiment.total !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">Buy</span>
              <span>{sentiment.buy} ({Math.round(buyPercentage)}%)</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-600 rounded-full" 
                style={{ width: `${buyPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-600 font-medium">Hold</span>
              <span>{sentiment.hold} ({Math.round(holdPercentage)}%)</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${holdPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-red-600 font-medium">Sell</span>
              <span>{sentiment.sell} ({Math.round(sellPercentage)}%)</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 rounded-full" 
                style={{ width: `${sellPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentDisplay;
