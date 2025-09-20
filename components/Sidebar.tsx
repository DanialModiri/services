import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { DashboardIcon, UsersIcon, ServicesIcon, CollapseSidebarIcon, ExpandSidebarIcon, ContractIcon } from './icons/AppleIcons';
import { Page } from '../App';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive = false, isCollapsed, onClick }) => {
  const tooltip = isCollapsed ? label : '';
  
  return (
    <li title={tooltip}>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
          isCollapsed ? 'justify-center' : ''
        } ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
            : 'text-gray-600 hover:bg-gray-200/60'
        }`}
      >
        <span className="w-6 h-6">{icon}</span>
        {!isCollapsed && (
          <span className="mr-4 font-semibold text-base whitespace-nowrap">{label}</span>
        )}
      </a>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange, isCollapsed, onToggleCollapse }) => {
  const { t } = useI18n();

  return (
    <aside className={`bg-white/70 backdrop-blur-xl border-l border-gray-200/80 p-4 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-center h-12 pb-4 mb-4 border-b">
        <div className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            <h1 className="text-2xl font-bold text-teal-600 whitespace-nowrap">{t('sidebar.title')}</h1>
        </div>
      </div>
      <nav className="flex-grow">
        <ul>
          <NavItem
            icon={<DashboardIcon />}
            label={t('sidebar.dashboard')}
            isActive={activePage === 'dashboard'}
            onClick={() => onPageChange('dashboard')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={<UsersIcon />}
            label={t('sidebar.people')}
            isActive={activePage === 'people'}
            onClick={() => onPageChange('people')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={<ServicesIcon />}
            label={t('sidebar.services')}
            isActive={activePage === 'services'}
            onClick={() => onPageChange('services')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={<ContractIcon />}
            label={t('sidebar.contracts')}
            isActive={activePage === 'contracts'}
            onClick={() => onPageChange('contracts')}
            isCollapsed={isCollapsed}
          />
        </ul>
      </nav>
      <div className="border-t pt-4 mt-auto">
        <button 
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-3 rounded-lg text-gray-600 hover:bg-gray-200/60 transition-colors"
          title={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
        >
          {isCollapsed ? <ExpandSidebarIcon className="w-6 h-6" /> : <CollapseSidebarIcon className="w-6 h-6" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;