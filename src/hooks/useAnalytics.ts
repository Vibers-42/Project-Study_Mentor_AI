import { useState, useEffect } from 'react';
import { AnalyticsData } from '../types';
import { getAnalyticsData } from '../services/analytics.service';

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const analyticsData = await getAnalyticsData();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { data, isLoading, error, refetch: fetchAnalytics };
};
