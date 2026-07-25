import React from 'react';
import { Card } from '../../shared/ui/Card';
import { UserProfile } from '../../types';
import { FaUserCircle, FaEdit } from 'react-icons/fa';

interface ProfileCardProps {
  profile: UserProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Card className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border-2 border-violet-500/50">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle className="w-full h-full text-neutral-600" />
          )}
        </div>
        <button className="absolute bottom-0 right-0 p-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-full transition-colors shadow-lg border border-neutral-900">
          <FaEdit className="w-3 h-3" />
        </button>
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl font-bold text-neutral-100">{profile.name}</h2>
        <p className="text-neutral-400 mb-3">{profile.email}</p>
        
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium rounded-full">
            Level {profile.level} Master
          </span>
          <span className="px-3 py-1 bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm font-medium rounded-full">
            {profile.currentXP} / {profile.nextLevelXP} XP
          </span>
        </div>
      </div>
      
      <div className="w-full md:w-auto flex flex-col gap-2 min-w-[200px]">
        <button className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors">
          Edit Profile
        </button>
        <button className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium rounded-lg transition-colors border border-neutral-700">
          Share Profile
        </button>
      </div>
    </Card>
  );
};
