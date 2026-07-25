import React from 'react';
import { Badge } from '../../types';
import * as Icons from 'react-icons/fa';

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  // @ts-ignore
  const Icon = Icons[badge.iconName] || Icons.FaAward;
  
  return (
    <div className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
      badge.isUnlocked 
        ? 'bg-neutral-800/50 border-violet-500/30 hover:border-violet-500/50' 
        : 'bg-neutral-900 border-neutral-800 opacity-60 grayscale'
    }`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
        badge.isUnlocked ? 'bg-violet-500/20 text-violet-400' : 'bg-neutral-800 text-neutral-500'
      }`}>
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="font-semibold text-neutral-200 text-sm mb-1">{badge.name}</h4>
      <p className="text-xs text-neutral-500 line-clamp-2">{badge.description}</p>
    </div>
  );
};
