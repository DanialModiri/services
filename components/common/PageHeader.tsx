import React from 'react';
import { SearchIcon, RefreshIcon } from '../icons/AppleIcons';
import Card from './Card';
import { useI18n } from '../../hooks/useI18n';

interface PageHeaderProps {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  actionButton: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, searchTerm, onSearchChange, searchPlaceholder, actionButton, onRefresh, isRefreshing }) => {
  const { t } = useI18n();
  return (
    <Card className="mb-6" padding="p-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-shrink-0">
            {title}
          </h1>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-wait"
                aria-label={t('general.button.refresh')}
              >
                <RefreshIcon className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
            {actionButton}
          </div>
        </div>
        
        <div className="relative w-full">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id={`search-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="block w-full pr-12 pl-4 py-2.5 border border-gray-200/80 rounded-xl leading-5 bg-white/80 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};

export default PageHeader;