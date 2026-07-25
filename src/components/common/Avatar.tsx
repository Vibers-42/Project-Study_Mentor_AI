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
  const colors = [
    'from-violet-600 to-fuchsia-600',
    'from-blue-600 to-cyan-600',
    'from-emerald-600 to-teal-600',
    'from-amber-600 to-orange-600',
    'from-rose-600 to-pink-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeMap[size]} rounded-full object-cover border-2 border-neutral-700 ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br ${colorFromName(name)} flex items-center justify-center font-bold text-white shadow-md ${className}`}>
      {getInitials(name)}
    </div>
  );
};
