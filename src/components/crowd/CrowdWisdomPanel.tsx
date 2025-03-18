
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AdviceSentiment, RiskAssessment } from '@/types/user';
import { CrowdConsensusScore } from '@/types/gamification';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, TrendingDown, AlertTriangle, BarChart2, ShieldCheck, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

// Mock data for crowd consensus
const mockConsensusData: CrowdConsensusScore = {
  assetId: 'bitcoin',
  assetName: 'Bitcoin',
  overallSentiment: 'bullish',
  buyPercentage: 68,
  sellPercentage: 15,
  holdPercentage: 17,
  expertConsensus: 'bullish',
  consensusStrength: 72,
  historicalAccuracy: 64,
  riskAssessment: {
    volatilityIndex: 58,
    riskLevel: 'medium',
    confidenceScore: 71
  },
  predictionTimeframe: 'medium'
};

interface CrowdWisdomPanelProps {
  assetId: string;
  sentiment: AdviceSentiment;
}

const CrowdWisdomPanel: React.FC<CrowdWisdomPanelProps> = ({ 
  assetId,
  sentiment
}) => {
  const { t } = useLanguage();
  
  // In a real app, this would be fetched from an API based on the assetId
  const consensusData = mockConsensusData;
  
  const getRiskBadgeColor = (level: string) => {
    switch(level) {
      case 'low': return 'bg-green-500 hover:bg-green-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'high': return 'bg-orange-500 hover:bg-orange-600';
      case 'very-high': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };
  
  const getSentimentIcon = (sentiment: string) => {
    switch(sentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral': return <BarChart2 className="h-4 w-4 text-blue-500" />;
      default: return <BarChart2 className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t('crowdWisdom.communityConsensus')}
          </CardTitle>
          <CardDescription>
            {t('crowdWisdom.basedOn', { count: sentiment.total })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {getSentimentIcon(consensusData.overallSentiment)}
                  <span className="font-medium capitalize">
                    {t(`crowdWisdom.sentiment.${consensusData.overallSentiment}`)}
                  </span>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {consensusData.historicalAccuracy}% {t('crowdWisdom.accuracy')}
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-medium">{t('recommendations.buy')}</span>
                    <span>{consensusData.buyPercentage}%</span>
                  </div>
                  <div className="relative w-full overflow-hidden rounded-full bg-green-200 dark:bg-green-800 h-2">
                    <Progress value={consensusData.buyPercentage} className="bg-green-600" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600 font-medium">{t('recommendations.hold')}</span>
                    <span>{consensusData.holdPercentage}%</span>
                  </div>
                  <div className="relative w-full overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800 h-2">
                    <Progress value={consensusData.holdPercentage} className="bg-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600 font-medium">{t('recommendations.sell')}</span>
                    <span>{consensusData.sellPercentage}%</span>
                  </div>
                  <div className="relative w-full overflow-hidden rounded-full bg-red-200 dark:bg-red-800 h-2">
                    <Progress value={consensusData.sellPercentage} className="bg-red-600" />
                  </div>
                </div>
              </div>
            </div>
            
            {sentiment.accuracy && (
              <div className="border-t pt-3">
                <h4 className="text-sm font-medium mb-2">{t('crowdWisdom.predictionAccuracy')}</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-secondary/50 rounded p-2 text-center">
                    <p className="text-xs text-muted-foreground">{t('recommendations.buy')}</p>
                    <p className="text-green-600 font-semibold">{sentiment.accuracy.buy}%</p>
                  </div>
                  <div className="bg-secondary/50 rounded p-2 text-center">
                    <p className="text-xs text-muted-foreground">{t('recommendations.hold')}</p>
                    <p className="text-blue-600 font-semibold">{sentiment.accuracy.hold}%</p>
                  </div>
                  <div className="bg-secondary/50 rounded p-2 text-center">
                    <p className="text-xs text-muted-foreground">{t('recommendations.sell')}</p>
                    <p className="text-red-600 font-semibold">{sentiment.accuracy.sell}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            {t('crowdWisdom.riskAssessment')}
          </CardTitle>
          <CardDescription>
            {t('crowdWisdom.communityRiskAnalysis')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-3">
              <Badge 
                variant="secondary" 
                className={cn("capitalize", getRiskBadgeColor(consensusData.riskAssessment.riskLevel))}
              >
                {t(`crowdWisdom.riskLevel.${consensusData.riskAssessment.riskLevel}`)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t('crowdWisdom.timeframe', { timeframe: t(`crowdWisdom.timeframes.${consensusData.predictionTimeframe}`) })}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{t('crowdWisdom.volatilityIndex')}</span>
                  <span>{consensusData.riskAssessment.volatilityIndex}/100</span>
                </div>
                <div className={cn(
                  "relative w-full overflow-hidden rounded-full h-2.5",
                  consensusData.riskAssessment.volatilityIndex > 66 ? "bg-red-200 dark:bg-red-800" :
                  consensusData.riskAssessment.volatilityIndex > 33 ? "bg-yellow-200 dark:bg-yellow-800" :
                  "bg-green-200 dark:bg-green-800"
                )}>
                  <Progress 
                    value={consensusData.riskAssessment.volatilityIndex} 
                    className={cn(
                      consensusData.riskAssessment.volatilityIndex > 66 ? "bg-red-500" :
                      consensusData.riskAssessment.volatilityIndex > 33 ? "bg-yellow-500" :
                      "bg-green-500"
                    )}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{t('crowdWisdom.consensusStrength')}</span>
                  <span>{consensusData.consensusStrength}/100</span>
                </div>
                <div className="relative w-full overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800 h-2.5">
                  <Progress 
                    value={consensusData.consensusStrength}
                    className="bg-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{t('crowdWisdom.confidenceScore')}</span>
                  <span>{consensusData.riskAssessment.confidenceScore}/100</span>
                </div>
                <div className="relative w-full overflow-hidden rounded-full bg-purple-200 dark:bg-purple-800 h-2.5">
                  <Progress 
                    value={consensusData.riskAssessment.confidenceScore}
                    className="bg-purple-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/40 p-3 rounded-md mt-4">
              <h4 className="text-sm font-medium mb-1">{t('crowdWisdom.whatThisMeans')}</h4>
              <p className="text-xs text-muted-foreground">
                {t('crowdWisdom.riskExplanation', { 
                  level: t(`crowdWisdom.riskLevel.${consensusData.riskAssessment.riskLevel}`),
                  asset: consensusData.assetName 
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrowdWisdomPanel;
