import { useState, useEffect } from 'react';
import { GamificationProgress } from '../types';
import { getProgress } from '../services/profile.service';

export const useProgress = () => {
  const [progress, setProgress] = useState<GamificationProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setIsLoading(true);
        const data = await getProgress();
        setProgress(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error fetching progress'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return { progress, isLoading, error };
};
