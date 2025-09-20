import React from 'react';
import Sidebar from './Sidebar';
import AppHeader from './common/AppHeader';

interface MainLayoutProps {
  children: React.ReactNode;
  isSidebarCollapsed: boolean;
  onToggleCollapse: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, isSidebarCollapsed, onToggleCollapse }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={onToggleCollapse}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;