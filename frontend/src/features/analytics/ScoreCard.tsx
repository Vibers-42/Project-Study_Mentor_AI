import React from 'react';
import { Card } from '../../shared/ui/Card';
import { getScoreColor } from '../../utils';
import { CountUp } from '../../shared/animations/CountUp';
import { FaAward, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface ScoreCardProps {
  score: number;
  label?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, label = "Score Mastery Analysis" }) => {
  const colorClass = getScoreColor(score);
  const targetScore = 90;
  const progressToTarget = Math.min(Math.round((score / targetScore) * 100), 100);

  return (
    <Card className="min-h-[320px] h-full flex flex-col justify-between p-6 bg-gradient-to-br from-neutral-900 via-neutral-900 to-violet-950/30 border-violet-500/20">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-neutral-100">{label}</h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1">
            <FaAward /> Top Tier
          </span>
        </div>
        <p className="text-xs text-neutral-400">Aggregate score rating across all completed modules</p>
      </div>

      <div className="my-auto py-4 text-center">
        <div className={`text-6xl sm:text-7xl font-black tracking-tighter drop-shadow-md ${colorClass}`}>
          <CountUp value={score} suffix="%" duration={1.5} />
        </div>
        <p className="text-sm font-medium text-neutral-300 mt-2">
          {score >= 80 ? '🔥 Exceptional comprehension and logic' : 
           score >= 60 ? '⚡ Solid foundation, keep refining' : 
           '📚 Additional targeted review required'}
        </p>
      </div>

      <div className="space-y-3 pt-4 border-t border-neutral-800/80">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-neutral-400">Target Benchmark (90%)</span>
          <span className="text-violet-400">{progressToTarget}% to Goal</span>
        </div>
        <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
          <div 
            className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full transition-all duration-1000"
            style={{ width: `${progressToTarget}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-medium pt-1">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <FaCheckCircle className="shrink-0" /> Best Session: 100%
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400 justify-end">
            <FaExclamationCircle className="shrink-0 text-amber-500" /> Lowest: 64%
          </div>
        </div>
      </div>
    </Card>
  );
};
