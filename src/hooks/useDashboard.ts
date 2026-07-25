import { useState, useEffect } from 'react';
import { DashboardData } from '../types';
import { getDashboardData } from '../services/dashboard.service';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setIsLoading(true);
        const result = await getDashboardData();
        if (mounted) { setData(result); setError(null); }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Failed to load dashboard'));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  return { data, isLoading, error };
};
