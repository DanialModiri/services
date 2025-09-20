import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../hooks/useAuth';
import { KeyIcon, LogoutIcon } from '../icons/AppleIcons';
import ChangePasswordDialog from '../auth/ChangePasswordDialog';

const AppHeader: React.FC = () => {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userName = user?.name || "";
  const userRole = user?.role || "";
  const userImageUrl = user?.avatarUrl;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChangePassword = () => {
      setIsChangePasswordOpen(true);
      setIsMenuOpen(false);
  }

  const handleLogout = () => {
      logout();
      setIsMenuOpen(false);
  }

  return (
    <>
      <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200/80 h-16 px-4 flex-shrink-0 z-30">
        <div className="flex justify-end items-center h-full">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-4 space-x-reverse rounded-full p-2 hover:bg-gray-200/60 transition-colors"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              <div className="text-right">
                <p className="font-semibold text-gray-800">{userName}</p>
                <p className="text-sm text-gray-500">{userRole}</p>
              </div>
              {userImageUrl && (
                <img 
                  src={userImageUrl} 
                  alt={userName} 
                  className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-white"
                />
              )}
            </button>
            
            {/* Dropdown Menu */}
            <div
              className={`absolute left-0 mt-2 w-56 origin-top-left bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out z-40 ${
                isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="p-2" role="none">
                <button
                  onClick={handleChangePassword}
                  className="w-full text-right flex items-center px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  <KeyIcon className="w-5 h-5 ml-3" />
                  <span>{t('header.changePassword')}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-right flex items-center px-4 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50"
                  role="menuitem"
                >
                  <LogoutIcon className="w-5 h-5 ml-3" />
                  <span>{t('sidebar.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <ChangePasswordDialog 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
};

export default AppHeader;