import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { messages } from './locales/fa';
import { I18nProvider } from './hooks/useI18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from './hooks/useNotifier';
import { ConfirmProvider } from './hooks/useConfirm';
import { AuthProvider } from './hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 60 seconds
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nProvider messages={messages}>
        <NotificationProvider>
          <ConfirmProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ConfirmProvider>
        </NotificationProvider>
      </I18nProvider>
    </QueryClientProvider>
  </React.StrictMode>
);