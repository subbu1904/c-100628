
import React from 'react';
import { Link } from 'react-router-dom';
import { Asset, formatCurrency, formatPercentChange, getChangeColorClass } from '../services/api';
import { ThumbsUp, ThumbsDown, Pause } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Sample sentiment data - in a real app, this would come from an API
const mockSentimentData: Record<string, { buy: number; sell: number; hold: number }> = {
  'bitcoin': { buy: 65, sell: 10, hold: 25 },
  'ethereum': { buy: 70, sell: 5, hold: 25 },
  'tether': { buy: 30, sell: 20, hold: 50 },
  'binance-coin': { buy: 55, sell: 15, hold: 30 },
  'solana': { buy: 75, sell: 5, hold: 20 },
  'xrp': { buy: 40, sell: 30, hold: 30 },
  'cardano': { buy: 60, sell: 15, hold: 25 },
  'dogecoin': { buy: 35, sell: 45, hold: 20 },
  'avalanche': { buy: 65, sell: 15, hold: 20 },
  'polkadot': { buy: 55, sell: 15, hold: 30 },
};

// Get sentiment for an asset (default values if not in mock data)
const getSentiment = (assetId: string) => {
  return mockSentimentData[assetId] || { buy: 50, sell: 20, hold: 30 };
};

// Get the dominant sentiment
const getDominantSentiment = (sentiment: { buy: number; sell: number; hold: number }) => {
  const { buy, sell, hold } = sentiment;
  if (buy >= sell && buy >= hold) return 'buy';
  if (sell >= buy && sell >= hold) return 'sell';
  return 'hold';
};

interface AssetCardProps {
  asset: Asset;
  rank: number;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, rank }) => {
  const percentChangeClass = getChangeColorClass(asset.changePercent24Hr);
  const sentiment = getSentiment(asset.id);
  const dominantSentiment = getDominantSentiment(sentiment);
  
  return (
    <Link to={`/asset/${asset.id}`} className="block">
      <div className="asset-card animate-fade-in" style={{ animationDelay: `${rank * 50}ms` }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-primary font-semibold">
              {asset.symbol.slice(0, 3)}
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">{asset.name}</h3>
              <span className="text-xs text-muted-foreground">{asset.symbol}</span>
            </div>
          </div>
          <div className="badge bg-secondary text-secondary-foreground">
            Rank #{asset.rank}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-left">
            <p className="text-xs text-muted-foreground mb-1">Price</p>
            <p className="font-medium">{formatCurrency(asset.priceUsd)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">24h Change</p>
            <p className={`font-medium ${percentChangeClass}`}>
              {formatPercentChange(asset.changePercent24Hr)}
            </p>
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
            <p className="font-medium">{formatCurrency(asset.marketCapUsd)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Volume (24h)</p>
            <p className="font-medium">{formatCurrency(asset.volumeUsd24Hr)}</p>
          </div>
        </div>
        
        {/* Community Sentiment Section */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Community Sentiment</span>
            <Badge 
              variant={dominantSentiment === 'buy' ? 'default' : dominantSentiment === 'sell' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {dominantSentiment === 'buy' && (
                <ThumbsUp className="w-3 h-3 mr-1" />
              )}
              {dominantSentiment === 'sell' && (
                <ThumbsDown className="w-3 h-3 mr-1" />
              )}
              {dominantSentiment === 'hold' && (
                <Pause className="w-3 h-3 mr-1" />
              )}
              {dominantSentiment.charAt(0).toUpperCase() + dominantSentiment.slice(1)}
            </Badge>
          </div>
          
          <div className="w-full h-2 bg-secondary rounded-full mt-2 overflow-hidden flex">
            <div 
              className="h-full bg-green-600 rounded-l-full" 
              style={{ width: `${sentiment.buy}%` }}
              title={`Buy: ${sentiment.buy}%`}
            ></div>
            <div 
              className="h-full bg-blue-600" 
              style={{ width: `${sentiment.hold}%` }}
              title={`Hold: ${sentiment.hold}%`}
            ></div>
            <div 
              className="h-full bg-red-600 rounded-r-full" 
              style={{ width: `${sentiment.sell}%` }}
              title={`Sell: ${sentiment.sell}%`}
            ></div>
          </div>
          
          <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
            <span>{sentiment.buy}%</span>
            <span>{sentiment.hold}%</span>
            <span>{sentiment.sell}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AssetCard;
