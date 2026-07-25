/**
 * Adapter: Backend progress/gamification → UI GamificationProgress type.
 * Backend remains the single source of truth for Level, XP, and Badges.
 */
import { GamificationProgress, Badge, Achievement } from '../../types';

// ── Backend response shapes ──────────────────────────────────────

export interface BackendProgressStats {
  total_sessions: number;
  average_score: number;       // 0-10 scale from backend
  total_questions: number;
  total_study_minutes: number;
  streak: number;
  topics_studied: string[];
  recent_sessions: any[];
  score_trend: { date: string; score: number; topic?: string }[];
}

export interface BackendUserPayload {
  id: string;
  email: string;
  full_name: string;
  xp?: number;
  level?: number;
  next_level_xp?: number;
  badges?: string[];
}

// ── Badge metadata lookup ────────────────────────────────────────
// Frontend-side mapping from backend badge IDs to full Badge objects.
// This unblocks the UI immediately without requiring backend changes.

const BADGE_METADATA: Record<string, Omit<Badge, 'id' | 'isUnlocked' | 'unlockedAt'>> = {
  first_session: {
    name: 'First Steps',
    description: 'Complete your first study session',
    iconName: 'FaPlay',
  },
  streak_3: {
    name: 'On a Roll',
    description: 'Maintain a 3-day study streak',
    iconName: 'FaFire',
  },
  streak_7: {
    name: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    iconName: 'FaCalendarCheck',
  },
  perfect_score: {
    name: 'Perfect Score',
    description: 'Score 100% on a session',
    iconName: 'FaStar',
  },
  high_achiever: {
    name: 'High Achiever',
    description: 'Maintain an average score above 80%',
    iconName: 'FaTrophy',
  },
  ten_sessions: {
    name: 'Dedicated Learner',
    description: 'Complete 10 study sessions',
    iconName: 'FaGraduationCap',
  },
};

function mapBadgeIds(ids: string[]): Badge[] {
  return ids.map(id => {
    const meta = BADGE_METADATA[id];
    return {
      id,
      name: meta?.name ?? id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: meta?.description ?? `Unlocked badge: ${id}`,
      iconName: meta?.iconName ?? 'FaAward',
      isUnlocked: true,
      unlockedAt: new Date().toISOString(),
    };
  });
}

// ── Adapter ──────────────────────────────────────────────────────

export const adaptProgressData = (
  stats: BackendProgressStats,
  user?: BackendUserPayload
): GamificationProgress => {
  return {
    level: user?.level ?? 1,
    currentXP: user?.xp ?? 0,
    nextLevelXP: user?.next_level_xp ?? ((user?.level ?? 1) * 500),
    dailyStreak: stats?.streak ?? 0,
    badges: mapBadgeIds(user?.badges ?? []),
    achievements: [] as Achievement[], // Populated when backend adds achievement tracking
  };
};
