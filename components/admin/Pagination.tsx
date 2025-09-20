import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/AppleIcons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useI18n();
  
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  return (
    <div className="mt-8 flex justify-center">
        <div className="flex justify-center items-center space-x-2 space-x-reverse bg-white/70 backdrop-blur-xl border border-gray-200/80 shadow-lg rounded-2xl p-2">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label={t('pagination.prev')}
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>

            <span className="text-gray-700 font-medium text-base px-4">
                {t('pagination.pageInfo', { currentPage, totalPages })}
            </span>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                aria-label={t('pagination.next')}
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
        </div>
    </div>
  );
};

export default Pagination;