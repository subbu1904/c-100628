
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AssetHistory, formatCurrency } from '../services/api';
import Loader from './Loader';

interface PriceChartProps {
  data: AssetHistory[];
  isLoading: boolean;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3">
        <p className="text-sm font-medium mb-1">{new Date(label!).toLocaleDateString()}</p>
        <p className="text-base font-bold text-primary">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  isLoading, 
  color = "hsl(var(--primary))" 
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (data && data.length > 0) {
      const formattedData = data.map((item) => ({
        date: new Date(item.time).toISOString(),
        price: parseFloat(item.priceUsd),
      }));
      setChartData(formattedData);
    }
  }, [data]);
  
  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-secondary/30 rounded-xl">
        <Loader />
      </div>
    );
  }
  
  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-secondary/30 rounded-xl">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[300px] glass-card p-4 animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tickFormatter={(tick) => new Date(tick).toLocaleDateString()} 
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            minTickGap={50}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(tick) => `$${tick.toLocaleString()}`}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)" 
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
