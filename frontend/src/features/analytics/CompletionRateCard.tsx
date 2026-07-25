import React from 'react';
import { Card } from '../../shared/ui/Card';
import { ProgressRing } from '../../shared/ui/ProgressRing';
import { FaCheckCircle, FaCalendarCheck } from 'react-icons/fa';

interface CompletionRateCardProps {
  rate: number;
}

export const CompletionRateCard: React.FC<CompletionRateCardProps> = ({ rate }) => {
  const scheduledSessions = 40;
  const completedSessions = Math.round((rate / 100) * scheduledSessions);
  const remainingSessions = scheduledSessions - completedSessions;

  return (
    <Card className="min-h-[320px] h-full flex flex-col justify-between p-6 bg-neutral-900 border-neutral-800/80">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-neutral-100">Completion Rate</h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
            <FaCheckCircle /> Consistent
          </span>
        </div>
        <p className="text-xs text-neutral-400">Percentage of assigned AI practice interviews concluded</p>
      </div>

      <div className="py-2 my-auto flex justify-center">
        <ProgressRing
          value={rate}
          max={100}
          size={146}
          strokeWidth={14}
          color={rate >= 80 ? '#0ea5e9' : rate >= 50 ? '#eab308' : '#ef4444'}
          bgColor="#1e293b"
          showValue={true}
        />
      </div>

      <div className="space-y-2 pt-4 border-t border-neutral-800/80">
        <div className="flex items-center justify-between text-xs text-neutral-300 font-medium">
          <span className="flex items-center gap-1.5"><FaCalendarCheck className="text-sky-400" /> {completedSessions} sessions completed</span>
          <span className="text-neutral-500">{remainingSessions} remaining</span>
        </div>
        <div className="w-full bg-neutral-800/60 text-[11px] text-neutral-400 px-3 py-1.5 rounded-lg text-center font-medium border border-neutral-800">
          🚀 On schedule to fulfill monthly learning objectives
        </div>
      </div>
    </Card>
  );
};
