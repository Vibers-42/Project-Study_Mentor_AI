import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm ${!noPadding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
};
