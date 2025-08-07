'use client';

import { useEffect, useState, useCallback } from 'react';

interface MapUsageMonitorProps {
  onUsageLimit?: () => void;
  maxRequestsPerHour?: number;
  maxRequestsPerDay?: number;
}

export default function MapUsageMonitor({ 
  onUsageLimit, 
  maxRequestsPerHour = 1000,
  maxRequestsPerDay = 10000 
}: MapUsageMonitorProps) {
  const [hourlyCount, setHourlyCount] = useState(0);
  const [dailyCount, setDailyCount] = useState(0);
  const [isLimited, setIsLimited] = useState(false);

  useEffect(() => {
    // Load usage from localStorage
    const now = Date.now();
    const hourKey = `mapbox_hourly_${Math.floor(now / (1000 * 60 * 60))}`;
    const dayKey = `mapbox_daily_${Math.floor(now / (1000 * 60 * 60 * 24))}`;
    
    const storedHourly = localStorage.getItem(hourKey);
    const storedDaily = localStorage.getItem(dayKey);
    
    if (storedHourly) {
      setHourlyCount(parseInt(storedHourly));
    }
    if (storedDaily) {
      setDailyCount(parseInt(storedDaily));
    }

    // Check if we're over limits
    if (parseInt(storedHourly || '0') >= maxRequestsPerHour || 
        parseInt(storedDaily || '0') >= maxRequestsPerDay) {
      setIsLimited(true);
      onUsageLimit?.();
    }
  }, [maxRequestsPerHour, maxRequestsPerDay, onUsageLimit]);

  const incrementUsage = useCallback(() => {
    if (isLimited) return false;

    const now = Date.now();
    const hourKey = `mapbox_hourly_${Math.floor(now / (1000 * 60 * 60))}`;
    const dayKey = `mapbox_daily_${Math.floor(now / (1000 * 60 * 60 * 24))}`;
    
    const newHourly = hourlyCount + 1;
    const newDaily = dailyCount + 1;
    
    setHourlyCount(newHourly);
    setDailyCount(newDaily);
    
    localStorage.setItem(hourKey, newHourly.toString());
    localStorage.setItem(dayKey, newDaily.toString());
    
    // Check limits
    if (newHourly >= maxRequestsPerHour || newDaily >= maxRequestsPerDay) {
      setIsLimited(true);
      onUsageLimit?.();
      return false;
    }
    
    return true;
  }, [isLimited, hourlyCount, dailyCount, maxRequestsPerHour, maxRequestsPerDay, onUsageLimit]);

  // Expose incrementUsage for external use
  useEffect(() => {
    (window as { mapboxUsageMonitor?: { incrementUsage: () => boolean; isLimited: boolean } }).mapboxUsageMonitor = { incrementUsage, isLimited };
  }, [isLimited, incrementUsage]);

  return null; // This component doesn't render anything
}
