import React from 'react';
import { FaCamera } from 'react-icons/fa';
import { Avatar } from '../../shared/ui/Avatar';

interface EditableAvatarProps {
  name: string;
  src?: string;
  size?: 'lg' | 'xl';
}

export const EditableAvatar: React.FC<EditableAvatarProps> = ({ name, src, size = 'xl' }) => {
  return (
    <div className="relative group inline-block">
      <Avatar name={name} src={src} size={size} />
      <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
        <FaCamera className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};
