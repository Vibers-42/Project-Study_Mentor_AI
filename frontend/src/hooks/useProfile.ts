import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getUserProfile } from '../services/profile.service';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setIsLoading(true);
        const result = await getUserProfile();
        if (mounted) { setProfile(result); setError(null); }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Failed to load profile'));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  return { profile, isLoading, error };
};
