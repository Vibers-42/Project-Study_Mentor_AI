import React from 'react';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { LeaderboardUser } from '../../types';

interface RankingTableProps {
  users: LeaderboardUser[];
  title: string;
  sortKey: 'xp' | 'streak' | 'level';
}

export const RankingTable: React.FC<RankingTableProps> = ({ users, title, sortKey }) => {
  const sorted = [...users].sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));

  return (
    <Card>
      <h3 className="text-sm font-semibold text-neutral-200 mb-4">{title}</h3>
      <div className="space-y-2">
        {sorted.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              user.isCurrentUser ? 'bg-violet-900/20 border border-violet-500/20' : 'hover:bg-neutral-800/50'
            }`}
          >
            <span className="text-xs font-bold text-neutral-500 w-6 text-center">{index + 1}</span>
            <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${user.isCurrentUser ? 'text-violet-300' : 'text-neutral-300'}`}>
                {user.name} {user.isCurrentUser && '(You)'}
              </p>
            </div>
            <span className="text-sm font-bold text-neutral-200">
              {(user[sortKey] as number).toLocaleString()} {sortKey === 'xp' ? 'XP' : sortKey === 'streak' ? '🔥' : 'Lv'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const WeeklyRanking: React.FC<{ users: LeaderboardUser[] }> = ({ users }) => (
  <RankingTable users={users} title="Weekly Top Performers" sortKey="xp" />
);

export const MonthlyRanking: React.FC<{ users: LeaderboardUser[] }> = ({ users }) => (
  <RankingTable users={users} title="Monthly Top Performers" sortKey="xp" />
);

export const XPRanking: React.FC<{ users: LeaderboardUser[] }> = ({ users }) => (
  <RankingTable users={users} title="XP Rankings" sortKey="xp" />
);

export const AchievementRanking: React.FC<{ users: LeaderboardUser[] }> = ({ users }) => (
  <RankingTable users={users} title="Achievement Rankings" sortKey="level" />
);
