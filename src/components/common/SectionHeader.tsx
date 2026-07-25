import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div>
        <h2 className="text-xl font-semibold text-neutral-100">{title}</h2>
        {description && <p className="text-neutral-400 text-sm mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
