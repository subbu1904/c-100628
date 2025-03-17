
import React from 'react';
import { Link } from 'react-router-dom';
import { Asset, formatCurrency, formatPercentChange, getChangeColorClass } from '../services/api';

interface AssetCardProps {
  asset: Asset;
  rank: number;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, rank }) => {
  const percentChangeClass = getChangeColorClass(asset.changePercent24Hr);
  
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
      </div>
    </Link>
  );
};

export default AssetCard;
