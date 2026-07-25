import React from 'react';
import { Card } from '../common/Card';
import { ProgressRing } from '../common/ProgressRing';

interface ProfileCompletionProps {
  completedFields: number;
  totalFields: number;
  missingItems?: string[];
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  completedFields = 7,
  totalFields = 10,
  missingItems = ['Add bio', 'Upload avatar', 'Link GitHub'],
}) => {
  const pct = Math.round((completedFields / totalFields) * 100);

  return (
    <Card className="flex flex-col justify-between h-full">
      <h3 className="text-sm font-semibold text-neutral-200 mb-4">Profile Completion</h3>
      <div className="flex items-center gap-6 my-auto">
        <div className="shrink-0">
          <ProgressRing
            value={completedFields}
            max={totalFields}
            size={84}
            strokeWidth={8}
            color={pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444'}
            showValue={true}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-neutral-300 mb-2">{completedFields} of {totalFields} sections completed</p>
          {missingItems.length > 0 && (
            <ul className="space-y-1.5">
              {missingItems.map((item, i) => (
                <li key={i} className="text-xs text-neutral-400 flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
};
