'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface CapRateHistory {
  id: string;
  jReitBuildingId: string;
  capRate: string;
  closingDate: string;
}

interface CapRateChartProps {
  capRateHistories: CapRateHistory[];
  height?: number;
}

type TimeFilter = '1month' | '3months' | '6months' | '1year' | 'all';

export default function CapRateChart({ capRateHistories, height = 300 }: CapRateChartProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  
  // Helper functions defined before they're used
  // Helper to apply time filter
  const applyTimeFilter = (data: CapRateHistory[], filter: TimeFilter): CapRateHistory[] => {
    if (filter === 'all') return data;
    
    const now = new Date();
    const monthsAgo = filter === '1month' ? 1 : 
                      filter === '3months' ? 3 : 
                      filter === '6months' ? 6 : 12;
    
    const cutoffDate = new Date(now.setMonth(now.getMonth() - monthsAgo));
    
    return data.filter(item => new Date(item.closingDate) >= cutoffDate);
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short'
    }).format(date);
  };
  
  // Transform and filter data based on time period
  const chartData = useMemo(() => {
    if (!capRateHistories || capRateHistories.length === 0) {
      return [];
    }
    
    // Sort by date (oldest to newest)
    const sortedHistories = [...capRateHistories].sort((a, b) => 
      new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime()
    );
    
    // Apply time filter
    const filteredHistories = applyTimeFilter(sortedHistories, timeFilter);
    
    // Format data for chart
    return filteredHistories.map(history => ({
      date: formatDate(history.closingDate),
      capRate: parseFloat(history.capRate),
    }));
  }, [capRateHistories, timeFilter]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">キャップレート推移</h3>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setTimeFilter('1month')}
            className={`px-2 py-1 rounded ${timeFilter === '1month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            1ヶ月
          </button>
          <button
            onClick={() => setTimeFilter('3months')}
            className={`px-2 py-1 rounded ${timeFilter === '3months' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            4半期
          </button>
          <button
            onClick={() => setTimeFilter('6months')}
            className={`px-2 py-1 rounded ${timeFilter === '6months' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            半期
          </button>
          <button
            onClick={() => setTimeFilter('1year')}
            className={`px-2 py-1 rounded ${timeFilter === '1year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            1年
          </button>
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-2 py-1 rounded ${timeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            全期間
          </button>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${value.toFixed(2)}%`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'キャップレート']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="capRate"
              name="キャップレート"
              stroke="#4F46E5"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded">
          <p className="text-gray-500">データがありません</p>
        </div>
      )}
    </div>
  );
} 