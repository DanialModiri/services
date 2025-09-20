import React, { useState } from 'react';
import AdminPanel from './components/admin/AdminPanel';
import Sidebar from './components/Sidebar';
import DashboardPage from './components/dashboard/DashboardPage';
import ServicePanel from './components/services/ServicePanel';
import AppHeader from './components/common/AppHeader';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import ContractPanel from './components/contracts/ContractPanel';

export type Page = 'dashboard' | 'people' | 'services' | 'contracts';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, isLoading } = useAuth();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'people':
        return <AdminPanel isSidebarCollapsed={isSidebarCollapsed} />;
      case 'services':
        return <ServicePanel isSidebarCollapsed={isSidebarCollapsed} />;
      case 'contracts':
        return <ContractPanel isSidebarCollapsed={isSidebarCollapsed} />;
      default:
        return <DashboardPage />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <Sidebar 
        activePage={activePage} 
        onPageChange={setActivePage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;