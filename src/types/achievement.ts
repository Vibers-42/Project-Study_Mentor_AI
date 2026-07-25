export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string; // Used to pick an icon from react-icons
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  rewardXP: number;
  isCompleted: boolean;
}

export interface GamificationProgress {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  dailyStreak: number;
  badges: Badge[];
  achievements: Achievement[];
}
