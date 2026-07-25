import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  const baseClass = "animate-pulse bg-neutral-800";
  
  let variantClass = "";
  if (variant === 'circular') {
    variantClass = "rounded-full";
  } else if (variant === 'text') {
    variantClass = "rounded h-4 w-full";
  } else {
    variantClass = "rounded-xl";
  }

  return (
    <div className={`${baseClass} ${variantClass} ${className}`} />
  );
};
