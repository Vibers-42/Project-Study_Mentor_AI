import React from 'react';
import { IconType } from 'react-icons';

interface EmptyStateProps {
  icon: IconType;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-neutral-900 border border-neutral-800 rounded-xl border-dashed">
      <div className="p-4 bg-neutral-800 rounded-full mb-4">
        <Icon className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-medium text-neutral-200 mb-2">{title}</h3>
      <p className="text-neutral-400 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
