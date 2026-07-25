import React from 'react';
import { motion } from 'framer-motion';

interface ProgressAnimationProps {
  value: number;
  max?: number;
  className?: string;
}

export const ProgressAnimation: React.FC<ProgressAnimationProps> = ({ value, max = 100, className = '' }) => {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden ${className}`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
};
