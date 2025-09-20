import React, { useState } from 'react';
import { Switch, Route, Redirect } from './lib/router';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import MainLayout from './components/MainLayout';
import AdminPanel from './components/admin/AdminPanel';
import DashboardPage from './components/dashboard/DashboardPage';
import ServicePanel from './components/services/ServicePanel';
import ContractPanel from './components/contracts/ContractPanel';
import { ContractFilterProvider } from './hooks/useContractFilter';

const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login">
        { user ? <Redirect to="/app/dashboard" /> : <LoginPage /> }
      </Route>

      <Route path="/app/:rest*">
        { !user ? <Redirect to="/login" /> : (
            <ContractFilterProvider>
              <MainLayout
                isSidebarCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                <Switch>
                  <Route path="/app/dashboard" component={DashboardPage} />
                  <Route path="/app/people">
                    <AdminPanel isSidebarCollapsed={isSidebarCollapsed} />
                  </Route>
                  <Route path="/app/services">
                    <ServicePanel isSidebarCollapsed={isSidebarCollapsed} />
                  </Route>
                  <Route path="/app/contracts">
                    <ContractPanel isSidebarCollapsed={isSidebarCollapsed} />
                  </Route>
                  <Route path="/app">
                    <Redirect to="/app/dashboard" />
                  </Route>
                </Switch>
              </MainLayout>
            </ContractFilterProvider>
          )
        }
      </Route>

      <Route>
        { user ? <Redirect to="/app/dashboard" /> : <Redirect to="/login" /> }
      </Route>
    </Switch>
  );
};

export default App;