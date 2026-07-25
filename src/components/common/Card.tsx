import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-neutral-900 border border-neutral-800/80 rounded-2xl min-w-0 relative transition-all shadow-lg shadow-black/20 ${!noPadding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
};
