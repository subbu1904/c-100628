
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Asset, fetchAssets } from '../services/api';
import AssetCard from '../components/AssetCard';
import Loader from '../components/Loader';
import Header from '../components/Header';
import PopularRecommendations from '../components/PopularRecommendations';

const Index: React.FC = () => {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [limit, setLimit] = useState(20);
  
  const { 
    data: assets,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['assets', limit],
    queryFn: () => fetchAssets(limit),
  });
  
  useEffect(() => {
    if (assets) {
      setSelectedAssets(assets);
    }
  }, [assets]);
  
  const handleLoadMore = () => {
    setLimit(prevLimit => prevLimit + 20);
  };
  
  // Loading skeletons for assets
  const renderSkeletons = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div 
        key={`skeleton-${index}`} 
        className="glass-card p-6 animate-pulse"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted"></div>
            <div>
              <div className="h-5 w-24 bg-muted rounded"></div>
              <div className="h-3 w-12 bg-muted rounded mt-2"></div>
            </div>
          </div>
          <div className="h-5 w-16 bg-muted rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <div className="h-3 w-12 bg-muted rounded"></div>
            <div className="h-5 w-20 bg-muted rounded"></div>
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <div className="h-3 w-12 bg-muted rounded"></div>
            <div className="h-5 w-16 bg-muted rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-12 bg-muted rounded"></div>
            <div className="h-5 w-24 bg-muted rounded"></div>
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <div className="h-3 w-12 bg-muted rounded"></div>
            <div className="h-5 w-16 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    ));
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="page-container animate-slide-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <span className="badge bg-primary/10 text-primary mb-2">Cryptocurrency</span>
            <h1 className="page-header">Market Overview</h1>
            <p className="text-muted-foreground max-w-lg">
              Track top cryptocurrencies by market capitalization. Click on any asset for detailed information.
            </p>
          </div>
        </div>
        
        {/* Popular Recommendations Section - Desktop */}
        <div className="hidden lg:block mb-8">
          <PopularRecommendations />
        </div>
        
        {isError && (
          <div className="glass-card p-8 text-center my-8 border-destructive/20 border-2">
            <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Data</h3>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'Failed to fetch cryptocurrency data.'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary bg-destructive hover:bg-destructive/90"
            >
              Retry
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area for Assets */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {isLoading ? (
                renderSkeletons()
              ) : (
                selectedAssets.map((asset, index) => (
                  <AssetCard key={asset.id} asset={asset} rank={index} />
                ))
              )}
            </div>
            
            {!isLoading && !isError && selectedAssets.length > 0 && (
              <div className="flex justify-center mt-10">
                <button onClick={handleLoadMore} className="btn-primary">
                  Load More Assets
                </button>
              </div>
            )}
          </div>
          
          {/* Sidebar for Popular Recommendations - Tablet and Mobile */}
          <div className="lg:hidden mt-8 mb-4">
            <PopularRecommendations />
          </div>
          
          {/* Sidebar for Desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              {/* Additional content can be added here */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
