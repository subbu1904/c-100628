
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSuperCategories } from '@/services/superCategoryService';
import { Button } from './ui/button';

interface SuperCategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const SuperCategorySelector: React.FC<SuperCategorySelectorProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['superCategories'],
    queryFn: fetchSuperCategories,
  });
  
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-muted animate-pulse rounded"></div>
        ))}
      </div>
    );
  }
  
  // Always include 'All' category
  const allCategories = [
    { id: 'all', name: 'All', color: 'bg-primary' },
    ...(categories || [])
  ];
  
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {allCategories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={`whitespace-nowrap ${selectedCategory === category.id ? '' : 'hover:bg-secondary/10'}`}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default SuperCategorySelector;
