import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const colorFromName = (name: string) => {
  const styles = [
    'bg-[var(--accent)] text-[var(--text-primary)] border-[var(--border-accent)]',
    'bg-[var(--secondary)] text-[var(--text-primary)] border-[var(--border-accent)]',
    'bg-[var(--success)] text-[var(--text-primary)] border-[var(--border)]',
    'bg-[var(--warning)] text-neutral-900 border-[var(--border)]',
    'bg-[var(--info)] text-[var(--text-primary)] border-[var(--border)]',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return styles[Math.abs(hash) % styles.length];
};

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeMap[size]} rounded-full object-cover border-2 border-[var(--border)] ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeMap[size]} rounded-full ${colorFromName(name)} flex items-center justify-center font-bold shadow-md border ${className}`}>
      {getInitials(name)}
    </div>
  );
};
