'use client';

import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  TIME_FILTER_LABELS,
  formatDateForDisplay,
  calculateMonthsBetween,
  isFilterAvailable,
  getTimeGroupKey,
  createDefaultDataGranularity,
  calculateInitialTimeFilter,
  calculateChartWidth,
  TOOLTIP_STYLES
} from './ChartUtils';
import { CHART_COLORS, FILTER_STYLES, TIME_FILTERS } from '@/constants/charts';
import type { TimeFilterOption, DataGranularity } from '@/types/charts';

/**
 * Type Definitions
 */

// Raw cap rate history data from API
interface CapRateHistory {
  id: string;
  jReitBuildingId: string;
  capRate: string;
  closingDate: string;
}

// Processed data point for chart display
interface ChartDataPoint {
  date: string;      // Display date
  rawDate: Date;     // Actual date object for sorting
  capRate: number;
}

// Component props
interface CapRateChartProps {
  capRateHistories: CapRateHistory[];
  height?: number;
  compact?: boolean;
  className?: string;
}

/**
 * Sub-Components
 */

// Filter button for time period selection
const FilterButton = memo(({ 
  label, 
  isActive, 
  isDisabled,
  onClick 
}: { 
  label: string; 
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    disabled={isDisabled}
    className={`px-2 py-1 rounded ${
      isDisabled 
        ? FILTER_STYLES.disabled
        : isActive 
          ? FILTER_STYLES.active 
          : FILTER_STYLES.inactive
    }`}
    aria-pressed={isActive}
    title={isDisabled ? "データの粒度が不足しています" : undefined}
  >
    {label}
  </button>
));

FilterButton.displayName = 'FilterButton';

// Empty state when no data is available
const EmptyState = memo(({ height }: { height: number }) => (
  <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
    <p className="text-gray-500">データがありません</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

const ChartLegend = memo(() => (
  <div className="flex justify-center w-full mb-2">
    <div className="inline-flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.capRate }}></div>
      <span className="text-sm">キャップレート</span>
    </div>
  </div>
));

ChartLegend.displayName = 'ChartLegend';

const FilterButtons = memo(({ 
  timeFilter,
  dataGranularity,
  handleSetFilter
}: {
  timeFilter: TimeFilterOption;
  dataGranularity: DataGranularity;
  handleSetFilter: (filter: TimeFilterOption) => () => void;
}) => (
  <div className="flex justify-center gap-2 text-sm pt-2">
    {Object.entries(TIME_FILTER_LABELS).map(([filter, label]) => {
      const filterOption = filter as TimeFilterOption;
             const isDisabled = 
         (filterOption === TIME_FILTERS.MONTH.value && !dataGranularity.isMonthlyAvailable) ||
         (filterOption === TIME_FILTERS.QUARTER.value && !dataGranularity.isQuarterlyAvailable) ||
         (filterOption === TIME_FILTERS.HALFYEAR.value && !dataGranularity.isHalfYearlyAvailable);
      
      return (
        <FilterButton 
          key={filter}
          label={label} 
          isActive={timeFilter === filterOption} 
          isDisabled={isDisabled}
          onClick={handleSetFilter(filterOption)} 
        />
      );
    })}
  </div>
));

FilterButtons.displayName = 'FilterButtons';

/**
 * Main Component
 */
function CapRateChart({ 
  capRateHistories = [], 
  height = 300,
  compact = false,
  className
}: CapRateChartProps) {
  // Process and sort the raw data chronologically
  const sortedHistories = useMemo(() => {
    if (!capRateHistories?.length) return [];
    
    return [...capRateHistories].sort((a, b) => 
      new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime()
    );
  }, [capRateHistories]);
  
  // Analyze data granularity to detect the minimum interval between data points
  const dataGranularity = useMemo((): DataGranularity => {
    // Default values if we don't have enough data points
    if (sortedHistories.length < 2) {
      return createDefaultDataGranularity();
    }
    
    // Convert closing dates to Date objects
    const dates = sortedHistories.map(h => new Date(h.closingDate));
    
    // Calculate intervals between consecutive data points
    let minInterval = Infinity;
    for (let i = 1; i < dates.length; i++) {
      const interval = calculateMonthsBetween(dates[i-1], dates[i]);
      minInterval = Math.min(minInterval, interval);
    }
    
         return {
       minIntervalMonths: minInterval,
       isMonthlyAvailable: isFilterAvailable(TIME_FILTERS.MONTH.value as TimeFilterOption, minInterval),
       isQuarterlyAvailable: isFilterAvailable(TIME_FILTERS.QUARTER.value as TimeFilterOption, minInterval),
       isHalfYearlyAvailable: isFilterAvailable(TIME_FILTERS.HALFYEAR.value as TimeFilterOption, minInterval)
     };
  }, [sortedHistories]);
  
  // Initialize time filter based on data granularity
  const initialTimeFilter = useMemo(() => 
    calculateInitialTimeFilter(dataGranularity)
  , [dataGranularity]);
  
  // State for active time filter
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>(initialTimeFilter);
  
     // Ensure the selected filter is valid for the data granularity
   useEffect(() => {
     if (
       (timeFilter === TIME_FILTERS.MONTH.value && !dataGranularity.isMonthlyAvailable) ||
       (timeFilter === TIME_FILTERS.QUARTER.value && !dataGranularity.isQuarterlyAvailable) ||
       (timeFilter === TIME_FILTERS.HALFYEAR.value && !dataGranularity.isHalfYearlyAvailable)
     ) {
       setTimeFilter(initialTimeFilter);
     }
   }, [timeFilter, dataGranularity, initialTimeFilter]);
  
  // Process data for chart display
  const chartData = useMemo(() => {
    if (!sortedHistories.length) return [];
    
    // Group data points based on the time filter
    const groupedData: Record<string, { points: CapRateHistory[]; avgCapRate: number }> = {};
    
    // Group all data points based on the selected time filter
    sortedHistories.forEach(point => {
      const date = new Date(point.closingDate);
      const groupKey = getTimeGroupKey(date, timeFilter);
      
      // Initialize group if it doesn't exist
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = { points: [], avgCapRate: 0 };
      }
      
      // Add point to the group
      groupedData[groupKey].points.push(point);
    });
    
    // Calculate average cap rate for each group and select representative data points
    const resultPoints: ChartDataPoint[] = Object.keys(groupedData).map(groupKey => {
      const group = groupedData[groupKey];
      
      // Calculate average cap rate
      const sum = group.points.reduce((total, point) => total + parseFloat(point.capRate), 0);
      group.avgCapRate = parseFloat((sum / group.points.length).toFixed(2));
      
      // Sort points by date
      const sortedPoints = [...group.points].sort(
        (a, b) => new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime()
      );
      
      // Pick a representative point (middle point)
      const midPointIndex = Math.floor(sortedPoints.length / 2);
      const representativePoint = sortedPoints[midPointIndex];
      
      // Create a chart point with actual date but average cap rate
      const actualDate = new Date(representativePoint.closingDate);
      
      return {
        date: formatDateForDisplay(actualDate, timeFilter),
        rawDate: actualDate,
        capRate: group.avgCapRate
      };
    });
    
    // Sort by date and return
    return resultPoints.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  }, [sortedHistories, timeFilter]);
  
  // Chart configuration
  const needsScrolling = useMemo(() => chartData.length > 20, [chartData]);
  const chartWidth = useMemo(() => 
    calculateChartWidth(chartData.length, needsScrolling)
  , [chartData.length, needsScrolling]);
  
  // Event handlers
  const handleSetFilter = useCallback((filter: TimeFilterOption) => () => {
    setTimeFilter(filter);
  }, []);
  
  // Formatters
  const formatTooltipValue = useCallback((value: number) => {
    return [`${value.toFixed(2)}%`, 'キャップレート'];
  }, []);
  
  const formatYAxisTick = useCallback((value: number) => {
    return `${value.toFixed(2)}%`;
  }, []);
  
  // Render
  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className || ''} ${compact ? 'p-2' : ''}`}>
      <div className="flex items-center justify-start mb-4">
        <h3 className={`text-lg font-semibold ${compact ? 'text-base' : ''}`}>キャップレート推移</h3>
      </div>
      
      {chartData.length > 0 ? (
        <div className="flex flex-col h-full">
          {/* Chart container with fixed centered legend */}
          <div className="relative">
            {/* Fixed Legend - Always centered */}
            <ChartLegend />
            
            {/* Scrollable chart area */}
            <div 
              className={needsScrolling ? "overflow-x-auto" : ""}
              style={{ height: `${height}px` }}
            >
              <div style={{ 
                width: needsScrolling ? chartWidth : '100%', 
                height: '100%'
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 2, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke={CHART_COLORS.text}
                      angle={-45}
                      textAnchor="end"
                      tickMargin={5}
                      height={28}
                      padding={{ left: 5, right: 5 }}
                      tick={{ fontSize: 11 }}
                      interval={0} // Show all ticks, no skipping
                      axisLine={false} // Hide the X-axis line
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tickFormatter={formatYAxisTick}
                      stroke={CHART_COLORS.text}
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: CHART_COLORS.grid }}
                      tickCount={10}
                    />
                    <Tooltip 
                      formatter={formatTooltipValue}
                      labelFormatter={(label) => {
                        // Find the full date for this data point
                        const dataPoint = chartData.find(point => point.date === label);
                        if (dataPoint) {
                          return dataPoint.rawDate.toLocaleDateString('ja-JP');
                        }
                        return label;
                      }}
                      contentStyle={TOOLTIP_STYLES}
                    />
                    <Line
                      type="monotone"
                      dataKey="capRate"
                      name="キャップレート"
                      stroke={CHART_COLORS.capRate}
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Filter buttons */}
          <FilterButtons 
            timeFilter={timeFilter}
            dataGranularity={dataGranularity}
            handleSetFilter={handleSetFilter}
          />
        </div>
      ) : (
        <EmptyState height={height} />
      )}
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(CapRateChart); 