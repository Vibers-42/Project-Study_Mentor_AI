import React from 'react';
import { MdErrorOutline } from 'react-icons/md';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Something went wrong", 
  message = "We encountered an error loading this data.", 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-950/20 border border-red-900/50 rounded-xl">
      <MdErrorOutline className="w-10 h-10 text-red-500 mb-3" />
      <h3 className="text-lg font-medium text-red-200 mb-2">{title}</h3>
      <p className="text-red-400/80 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-200 rounded-lg transition-colors border border-red-800/50"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
