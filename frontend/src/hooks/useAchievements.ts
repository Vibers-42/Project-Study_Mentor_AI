import { useState, useEffect } from 'react';
import { Achievement } from '../types';
import { getAchievements } from '../services/achievement.service';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setIsLoading(true);
      try {
        const data = await getAchievements();
        setAchievements(data);
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
