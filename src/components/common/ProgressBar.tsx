import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizeMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  color,
  className = '',
}) => {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const barColor = color || (pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444');

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm font-medium text-neutral-300">{label}</span>}
          {showPercentage && <span className="text-xs text-neutral-500">{pct}%</span>}
        </div>
      )}
      <div className={`w-full bg-neutral-800 rounded-full overflow-hidden ${sizeMap[size]}`}>
        <motion.div
          className={`${sizeMap[size]} rounded-full`}
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
