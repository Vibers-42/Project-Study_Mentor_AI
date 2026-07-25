import React from 'react';
import { LeaderboardUser } from '../../types';
import { FaCrown, FaMedal } from 'react-icons/fa';
import { Card } from '../common/Card';

interface LeaderboardProps {
  users: LeaderboardUser[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  return (
    <Card className="p-0">
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
        <h3 className="font-semibold text-neutral-200">Top Learners</h3>
      </div>
      <div className="divide-y divide-neutral-800">
        {users.map((user, index) => (
          <div 
            key={user.id} 
            className={`flex items-center p-4 transition-colors ${
              user.isCurrentUser ? 'bg-violet-900/10' : 'hover:bg-neutral-800/50'
            }`}
          >
            <div className="w-8 flex justify-center mr-2">
              {index === 0 ? (
                <FaCrown className="text-yellow-500 w-5 h-5" />
              ) : index === 1 ? (
                <FaMedal className="text-gray-400 w-5 h-5" />
              ) : index === 2 ? (
                <FaMedal className="text-amber-600 w-5 h-5" />
              ) : (
                <span className="text-neutral-500 font-medium text-sm">{user.rank}</span>
              )}
            </div>
            
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mr-3 overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-medium">{user.name.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${user.isCurrentUser ? 'text-violet-400' : 'text-neutral-200'}`}>
                {user.name} {user.isCurrentUser && '(You)'}
              </h4>
              <p className="text-xs text-neutral-500">Lvl {user.level} • {user.streak}🔥</p>
            </div>
            
            <div className="text-right">
              <span className="text-sm font-bold text-neutral-300">{user.xp}</span>
              <span className="text-xs text-neutral-500 ml-1">XP</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
