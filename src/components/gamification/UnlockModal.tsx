import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ConfettiEffect } from './ConfettiEffect';
import { Button } from '../common/Button';
import { FaTrophy } from 'react-icons/fa';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  rewardXP: number;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({ isOpen, onClose, title, description, rewardXP }) => {
  return (
    <>
      <ConfettiEffect active={isOpen} duration={3500} />
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center mb-5 shadow-xl shadow-amber-500/30">
            <FaTrophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">🎉 Achievement Unlocked!</h2>
          <h3 className="text-lg font-semibold text-violet-300 mb-1">{title}</h3>
          <p className="text-sm text-neutral-400 mb-4">{description}</p>
          <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
            <span className="text-sm font-bold text-violet-400">+{rewardXP} XP Earned</span>
          </div>
          <Button onClick={onClose} variant="primary">Continue</Button>
        </div>
      </Modal>
    </>
  );
};
