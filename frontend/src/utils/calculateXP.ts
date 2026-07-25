import { getXPForLevel } from './calculateLevel';

/**
 * Calculates the percentage progress towards the next level.
 */
export const calculateXPProgress = (totalXP: number, currentLevel: number): number => {
  let pastLevelsXP = 0;
  for (let i = 1; i < currentLevel; i++) {
    pastLevelsXP += getXPForLevel(i);
  }
  
  const currentLevelXP = totalXP - pastLevelsXP;
  const nextLevelRequiredXP = getXPForLevel(currentLevel);
  
  if (nextLevelRequiredXP === 0) return 100;
  
  return Math.round((currentLevelXP / nextLevelRequiredXP) * 100);
};
