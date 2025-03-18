
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercentChange, getChangeColorClass, Asset } from '../services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  rank: number;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, rank }) => {
  const { 
    id, 
    name, 
    symbol, 
    priceUsd, 
    changePercent24Hr, 
    marketCapUsd,
    followersCount
  } = asset;
  
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const formattedPrice = formatCurrency(priceUsd);
  const formattedChange = formatPercentChange(changePercent24Hr);
  const changeColorClass = getChangeColorClass(changePercent24Hr);
  const formattedMarketCap = formatCurrency(marketCapUsd);
  
  // Get a deterministic but random-like color for the asset icon
  const getAssetColor = (id: string, name: string): string => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500',
      'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    
    // Simple hash function to get a stable color for each asset
    const hash = (id + name).split('').reduce(
      (acc, char) => acc + char.charCodeAt(0), 0
    );
    
    return colors[hash % colors.length];
  };
  
  const assetColor = getAssetColor(id, name);
  
  return (
    <Link 
      to={`/asset/${id}`}
      className="glass-card p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${assetColor} flex items-center justify-center text-white font-bold shadow`}>
            {symbol.substring(0, 1)}
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <span className="text-sm text-muted-foreground">{symbol}</span>
          </div>
        </div>
        <span className="badge bg-muted/50">{`#${Number(asset.rank)}`}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <span className="text-xs text-muted-foreground">{t('asset.price')}</span>
          <p className="font-semibold">{formattedPrice}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground">{t('asset.change24h')}</span>
          <p className={`font-semibold ${changeColorClass}`}>{formattedChange}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">{t('asset.marketCap')}</span>
          <p className="font-medium">{formattedMarketCap}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted-foreground">{t('asset.followers')}</span>
          <div className="flex items-center justify-end gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <p className="font-medium">{followersCount ? followersCount.toLocaleString() : '0'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AssetCard;
