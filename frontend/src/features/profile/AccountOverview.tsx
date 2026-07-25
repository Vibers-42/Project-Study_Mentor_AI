import React from 'react';
import { Card } from '../../shared/ui/Card';
import { FaEnvelope, FaCalendarAlt, FaShieldAlt, FaUser } from 'react-icons/fa';

interface AccountOverviewProps {
  name: string;
  email: string;
  joinedDate?: string;
  plan?: string;
}

export const AccountOverview: React.FC<AccountOverviewProps> = ({
  name,
  email,
  joinedDate = 'July 2026',
  plan = 'Free',
}) => {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-neutral-200 mb-4">Account Overview</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <FaUser className="w-4 h-4 text-neutral-500" />
          <span className="text-neutral-400">Name</span>
          <span className="ml-auto text-neutral-200">{name}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FaEnvelope className="w-4 h-4 text-neutral-500" />
          <span className="text-neutral-400">Email</span>
          <span className="ml-auto text-neutral-200">{email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FaCalendarAlt className="w-4 h-4 text-neutral-500" />
          <span className="text-neutral-400">Member since</span>
          <span className="ml-auto text-neutral-200">{joinedDate}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <FaShieldAlt className="w-4 h-4 text-neutral-500" />
          <span className="text-neutral-400">Plan</span>
          <span className="ml-auto text-violet-400 font-medium">{plan}</span>
        </div>
      </div>
    </Card>
  );
};
