import { useState, useEffect } from 'react';
import { LeaderboardData } from '../types';
import { getLeaderboardData } from '../services/leaderboard.service';

export const useLeaderboard = () => {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const result = await getLeaderboardData();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLeaderboard();
    return () => { isMounted = false; };
  }, []);

  return { data, isLoading, error };
};
