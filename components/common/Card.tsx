import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'p-5' | 'p-8' | 'p-0';
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'p-5' }) => {
  return (
    <div className={`bg-white/70 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-lg ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
