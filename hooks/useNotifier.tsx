import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
import { createPortal } from 'react-dom';
import Notification, { NotificationProps, NotificationType } from '../components/common/Notification';

interface NotificationContextType {
  notify: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type NotificationData = Omit<NotificationProps, 'onDismiss'>;

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const notify = (message: string, type: NotificationType) => {
    const id = new Date().toISOString() + Math.random();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 left-4 z-50 space-y-3">
          {notifications.map(notification => (
            <Notification
              key={notification.id}
              {...notification}
              onDismiss={dismiss}
            />
          ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifier = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifier must be used within a NotificationProvider');
  }
  return context;
};