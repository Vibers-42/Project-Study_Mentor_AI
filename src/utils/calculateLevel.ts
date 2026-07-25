/**
 * Defines how much XP is required for each level.
 * Using a simple exponential scale for gamification.
 */
export const getXPForLevel = (level: number): number => {
  // Base XP is 100 for level 1, then scales up
  return Math.floor(100 * Math.pow(1.2, level - 1));
};

/**
 * Calculates current level based on total XP.
 */
export const calculateLevel = (totalXP: number): number => {
  let level = 1;
  let remainingXP = totalXP;
  
  while (remainingXP >= getXPForLevel(level)) {
    remainingXP -= getXPForLevel(level);
    level++;
  }
  
  return level;
};
