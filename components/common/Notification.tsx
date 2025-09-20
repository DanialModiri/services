import React, { useState, useEffect, useRef } from 'react';
import { SuccessIcon, ErrorIcon, CloseIcon } from '../icons/FeedbackIcons';

export type NotificationType = 'success' | 'error';

export interface NotificationProps {
  id: string;
  message: string;
  type: NotificationType;
  onDismiss: (id: string) => void;
  duration?: number;
}

const typeStyles = {
  success: {
    icon: <SuccessIcon className="w-6 h-6 text-green-500" />,
    progressBarClass: 'bg-green-500',
  },
  error: {
    icon: <ErrorIcon className="w-6 h-6 text-red-500" />,
    progressBarClass: 'bg-red-500',
  },
};

const Notification: React.FC<NotificationProps> = ({ id, message, type, onDismiss, duration = 5000 }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [show, setShow] = useState(false);
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const handleDismiss = () => {
    setShow(false); // Start fade-out animation
    setTimeout(() => onDismiss(id), 300); // Remove after animation
  };

  useEffect(() => {
    // Start fade-in animation
    requestAnimationFrame(() => setShow(true));

    if (!isPaused) {
      if (progressRef.current) {
        progressRef.current.style.transition = `width ${duration}ms linear`;
        progressRef.current.style.width = '0%';
      }
      timerRef.current = window.setTimeout(handleDismiss, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused, duration]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) {
      const computedStyle = getComputedStyle(progressRef.current);
      progressRef.current.style.width = computedStyle.width;
      progressRef.current.style.transition = 'none';
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const styles = typeStyles[type];

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-sm bg-white shadow-2xl rounded-xl border border-gray-200/80 overflow-hidden transform transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      role="alert"
    >
      <div className="p-4 flex items-start space-x-3 space-x-reverse">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="flex-1 text-sm font-medium text-gray-800">
          {message}
        </div>
        <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div
          ref={progressRef}
          className={`h-full ${styles.progressBarClass}`}
          style={{ width: '100%' }}
        ></div>
      </div>
    </div>
  );
};

export default Notification;