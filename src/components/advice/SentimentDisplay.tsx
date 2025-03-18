
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AdviceSentiment } from '@/types/user';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SentimentDisplayProps {
  sentiment: AdviceSentiment;
}

const SentimentDisplay: React.FC<SentimentDisplayProps> = ({ sentiment }) => {
  const { t } = useLanguage();
  
  // Calculate sentiment percentages for the progress bars
  const buyPercentage = sentiment.total > 0 ? (sentiment.buy / sentiment.total) * 100 : 0;
  const sellPercentage = sentiment.total > 0 ? (sentiment.sell / sentiment.total) * 100 : 0;
  const holdPercentage = sentiment.total > 0 ? (sentiment.hold / sentiment.total) * 100 : 0;
  
  // Expert sentiment percentages
  const expertBuyPercentage = sentiment.expert && sentiment.expert.total > 0 
    ? (sentiment.expert.buy / sentiment.expert.total) * 100 
    : 0;
  const expertSellPercentage = sentiment.expert && sentiment.expert.total > 0 
    ? (sentiment.expert.sell / sentiment.expert.total) * 100 
    : 0;
  const expertHoldPercentage = sentiment.expert && sentiment.expert.total > 0 
    ? (sentiment.expert.hold / sentiment.expert.total) * 100 
    : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t('sentiment.title')}</CardTitle>
        <CardDescription>
          {t('sentiment.basedOn', { count: sentiment.total })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="all" className="text-xs py-1 flex items-center gap-1">
              <Users className="h-3 w-3" />
              {t('sentiment.allUsers')}
            </TabsTrigger>
            <TabsTrigger value="experts" className="text-xs py-1 flex items-center gap-1">
              <Award className="h-3 w-3" />
              {t('sentiment.expertUsers')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">{t('recommendations.buy')}</span>
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
                  <span className="text-blue-600 font-medium">{t('recommendations.hold')}</span>
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
                  <span className="text-red-600 font-medium">{t('recommendations.sell')}</span>
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
          </TabsContent>
          
          <TabsContent value="experts" className="mt-0">
            <div className="space-y-4">
              {sentiment.expert && sentiment.expert.total > 0 ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium">{t('recommendations.buy')}</span>
                      <span>{sentiment.expert.buy} ({Math.round(expertBuyPercentage)}%)</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600 rounded-full" 
                        style={{ width: `${expertBuyPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-600 font-medium">{t('recommendations.hold')}</span>
                      <span>{sentiment.expert.hold} ({Math.round(expertHoldPercentage)}%)</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${expertHoldPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600 font-medium">{t('recommendations.sell')}</span>
                      <span>{sentiment.expert.sell} ({Math.round(expertSellPercentage)}%)</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 rounded-full" 
                        style={{ width: `${expertSellPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">{t('sentiment.noExpertAdvice')}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SentimentDisplay;
