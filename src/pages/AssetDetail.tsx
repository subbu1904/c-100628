
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Asset, AssetHistory, fetchAsset, fetchAssetHistory, formatCurrency, formatPercentChange, getChangeColorClass } from '../services/api';
import Header from '../components/Header';
import PriceChart from '../components/PriceChart';
import Loader from '../components/Loader';

type ChartInterval = 'd1' | 'h1' | 'm15' | 'm5' | 'm1';

const AssetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedInterval, setSelectedInterval] = useState<ChartInterval>('d1');
  
  // Redirect if no id is provided
  useEffect(() => {
    if (!id) {
      navigate('/');
    }
  }, [id, navigate]);
  
  // Fetch asset data
  const { 
    data: asset,
    isLoading: isLoadingAsset,
    isError: isAssetError,
    error: assetError
  } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => fetchAsset(id!),
    enabled: !!id,
  });
  
  // Fetch price history
  const { 
    data: priceHistory,
    isLoading: isLoadingHistory,
    isError: isHistoryError,
    error: historyError
  } = useQuery({
    queryKey: ['assetHistory', id, selectedInterval],
    queryFn: () => fetchAssetHistory(id!, selectedInterval),
    enabled: !!id,
  });
  
  // Handle interval change
  const handleIntervalChange = (interval: ChartInterval) => {
    setSelectedInterval(interval);
  };
  
  const intervals: { value: ChartInterval; label: string }[] = [
    { value: 'm5', label: '5m' },
    { value: 'm15', label: '15m' },
    { value: 'h1', label: '1h' },
    { value: 'd1', label: '1d' },
  ];
  
  // Error states
  const hasError = isAssetError || isHistoryError;
  const errorMessage = assetError instanceof Error 
    ? assetError.message 
    : historyError instanceof Error 
    ? historyError.message 
    : 'An error occurred while fetching data';
  
  // Loading skeleton for asset details
  const renderSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-10 w-48 bg-muted rounded mb-4"></div>
      <div className="h-6 w-32 bg-muted rounded mb-8"></div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-4">
            <div className="h-4 w-16 bg-muted rounded mb-2"></div>
            <div className="h-6 w-24 bg-muted rounded"></div>
          </div>
        ))}
      </div>
      
      <div className="h-8 w-32 bg-muted rounded mb-4"></div>
      <div className="h-[300px] bg-muted rounded-xl"></div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container animate-slide-up">
        {hasError ? (
          <div className="glass-card p-8 text-center my-8 border-destructive/20 border-2">
            <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Data</h3>
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <button 
              onClick={() => navigate('/')} 
              className="btn-primary bg-destructive hover:bg-destructive/90"
            >
              Back to Assets
            </button>
          </div>
        ) : isLoadingAsset ? (
          renderSkeleton()
        ) : asset ? (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary font-semibold text-lg">
                  {asset.symbol.slice(0, 3)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl md:text-4xl font-bold">{asset.name}</h1>
                    <span className="badge bg-secondary text-secondary-foreground">
                      Rank #{asset.rank}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{asset.symbol}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-xl font-semibold">{formatCurrency(asset.priceUsd)}</p>
              </div>
              
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-1">24h Change</p>
                <p className={`text-xl font-semibold ${getChangeColorClass(asset.changePercent24Hr)}`}>
                  {formatPercentChange(asset.changePercent24Hr)}
                </p>
              </div>
              
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
                <p className="text-xl font-semibold">{formatCurrency(asset.marketCapUsd)}</p>
              </div>
              
              <div className="glass-card p-4">
                <p className="text-sm text-muted-foreground mb-1">Volume (24h)</p>
                <p className="text-xl font-semibold">{formatCurrency(asset.volumeUsd24Hr)}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="section-title">Price Chart</h2>
                <div className="flex items-center bg-secondary rounded-lg p-1">
                  {intervals.map((interval) => (
                    <button
                      key={interval.value}
                      className={`px-3 py-1 text-sm rounded-md transition-all ${
                        selectedInterval === interval.value
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => handleIntervalChange(interval.value)}
                    >
                      {interval.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <PriceChart
                data={priceHistory || []}
                isLoading={isLoadingHistory}
              />
            </div>
            
            <div className="glass-card p-6 mb-8">
              <h2 className="section-title mb-4">Asset Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Supply Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Supply:</span>
                      <span className="font-medium">
                        {Number(asset.supply).toLocaleString()} {asset.symbol}
                      </span>
                    </div>
                    {asset.maxSupply && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Supply:</span>
                        <span className="font-medium">
                          {Number(asset.maxSupply).toLocaleString()} {asset.symbol}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Market Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VWAP (24h):</span>
                      <span className="font-medium">{formatCurrency(asset.vwap24Hr)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default AssetDetail;
