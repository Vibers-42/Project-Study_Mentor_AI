import React from 'react';
import { Card } from '../../shared/ui/Card';
import { Avatar } from '../../shared/ui/Avatar';
import { FaMedal, FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface RankCardProps {
  rank: number;
  name: string;
  xp: number;
  previousRank?: number;
  avatarUrl?: string;
}

export const RankCard: React.FC<RankCardProps> = ({ rank, name, xp, previousRank, avatarUrl }) => {
  const rankChange = previousRank ? previousRank - rank : 0;

  return (
    <Card className="bg-gradient-to-br from-violet-900/30 to-fuchsia-900/20 border-violet-500/20">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar src={avatarUrl} name={name} size="lg" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
            #{rank}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg">{name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-violet-300 font-medium">{xp.toLocaleString()} XP</span>
            {rankChange !== 0 && (
              <span className={`flex items-center gap-1 text-xs font-medium ${rankChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {rankChange > 0 ? <FaArrowUp className="w-2.5 h-2.5" /> : <FaArrowDown className="w-2.5 h-2.5" />}
                {Math.abs(rankChange)} places
              </span>
            )}
          </div>
        </div>
        <FaMedal className="w-8 h-8 text-amber-400/60" />
      </div>
    </Card>
  );
};
