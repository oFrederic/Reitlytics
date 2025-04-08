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

interface Financial {
  leasing: {
    occupancyRate: string;
  };
  closingDate?: string; // Adding date since it's needed for time series
}

interface OccupancyRateChartProps {
  financials: Financial[];
  height?: number;
}

type TimeFilter = '1month' | '3months' | '6months' | '1year' | 'all';

export default function OccupancyRateChart({ financials, height = 300 }: OccupancyRateChartProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  
  // Helper functions defined before they're used
  // Helper to apply time filter
  const applyTimeFilter = (data: Financial[], filter: TimeFilter): Financial[] => {
    if (filter === 'all') return data;
    
    const now = new Date();
    const monthsAgo = filter === '1month' ? 1 : 
                      filter === '3months' ? 3 : 
                      filter === '6months' ? 6 : 12;
    
    const cutoffDate = new Date(now.setMonth(now.getMonth() - monthsAgo));
    
    return data.filter(item => new Date(item.closingDate!) >= cutoffDate);
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
    if (!financials || financials.length === 0) {
      return [];
    }
    
    // Make sure we have date information
    const financialsWithDates = financials.filter(f => f.closingDate);
    
    if (financialsWithDates.length === 0) {
      return [
        {
          date: '現在',
          occupancyRate: parseFloat(financials[0]?.leasing?.occupancyRate || '0')
        }
      ];
    }
    
    // Sort by date (oldest to newest)
    const sortedFinancials = [...financialsWithDates].sort((a, b) => 
      new Date(a.closingDate!).getTime() - new Date(b.closingDate!).getTime()
    );
    
    // Apply time filter
    const filteredFinancials = applyTimeFilter(sortedFinancials, timeFilter);
    
    // Format data for chart
    return filteredFinancials.map(financial => ({
      date: formatDate(financial.closingDate!),
      occupancyRate: parseFloat(financial.leasing.occupancyRate),
    }));
  }, [financials, timeFilter]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">稼働率推移</h3>
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
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}%`, '稼働率']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="occupancyRate"
              name="稼働率"
              stroke="#10B981"
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