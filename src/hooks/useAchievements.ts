import { useState, useEffect } from 'react';
import { Achievement } from '../types';
import { getProgress } from '../services/profile.service';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setIsLoading(true);
      try {
        const data = await getProgress();
        setAchievements(data.achievements);
      } catch (err) {
        console.error('Failed to load achievements', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return { achievements, isLoading };
};
