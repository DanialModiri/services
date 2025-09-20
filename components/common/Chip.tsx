import React from 'react';
import { CloseIcon } from '../icons/FeedbackIcons';

interface ChipProps {
  label: React.ReactNode;
  onRemove: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, onRemove }) => {
  return (
    <div className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full animate-fade-in">
      <span>{label}</span>
      <button 
        onClick={onRemove}
        className="ml-2 p-0.5 rounded-full text-blue-500 hover:bg-blue-200 hover:text-blue-700"
        aria-label={`Remove ${label}`}
      >
        <CloseIcon className="w-4 h-4" />
      </button>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Chip;
