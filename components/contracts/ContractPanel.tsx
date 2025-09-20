import React, { useState, useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Contract, ContractFilters, Service } from '../../types';
import ContractTable from './ContractTable';
import ContractForm from './ContractForm';
import PageHeader from '../common/PageHeader';
import Button from '../common/Button';
import { PlusIcon, FilterIcon } from '../icons/AppleIcons';
import * as api from '../../api/apiService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifier } from '../../hooks/useNotifier';
import { useConfirm } from '../../hooks/useConfirm';
import SkeletonCard from '../common/SkeletonCard';
import { useContractFilter } from '../../hooks/useContractFilter';
import ContractFilterPopover from './ContractFilterPopover';
import FilterChips from '../common/FilterChips';

interface ContractPanelProps {
  isSidebarCollapsed: boolean;
}

const ContractPanel: React.FC<ContractPanelProps> = ({ isSidebarCollapsed }) => {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { notify } = useNotifier();
  const { confirm } = useConfirm();
  
  const [activeContractId, setActiveContractId] = useState<number | 'new' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const { filters, setFilters } = useContractFilter();
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const filterButtonRef = React.useRef<HTMLButtonElement>(null);
  
  const { data: contracts = [], isLoading, isError, isFetching } = useQuery<Contract[]>({
    queryKey: ['contracts', searchTerm, filters],
    queryFn: () => api.getContracts(searchTerm, filters),
  });

  const { data: peopleData } = useQuery({ queryKey: ['people', ''], queryFn: () => api.getPeople('') });
  const { data: allServices = [] } = useQuery<Service[]>({ queryKey: ['services', ''], queryFn: () => api.getServices('') });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['contracts', searchTerm, filters] });
  };
  
  const addContractMutation = useMutation({
    mutationFn: (contract: Omit<Contract, 'id'>) => api.addContract(contract),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      notify(t('notification.success.contractAdded'), 'success');
    },
    onError: () => notify(t('notification.error.generic'), 'error'),
  });

  const updateContractMutation = useMutation({
    mutationFn: (contract: Contract) => api.updateContract(contract),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      notify(t('notification.success.contractUpdated'), 'success');
    },
    onError: () => notify(t('notification.error.generic'), 'error'),
  });

  const deleteContractMutation = useMutation({
    mutationFn: api.deleteContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      notify(t('notification.success.contractDeleted'), 'success');
    },
    onError: () => notify(t('notification.error.generic'), 'error'),
  });

  const handleDeleteContract = async (id: number) => {
    const confirmed = await confirm({
      title: t('confirmDialog.deleteContractTitle'),
      message: t('confirmDialog.deleteContractMessage'),
    });
    if (confirmed) {
       deleteContractMutation.mutate(id);
    }
  };

  const handleSaveContract = async (contractData: Omit<Contract, 'id'> | Contract) => {
    try {
      if ('id' in contractData) {
        await updateContractMutation.mutateAsync(contractData);
      } else {
        await addContractMutation.mutateAsync(contractData);
      }
      setActiveContractId(null);
    } catch (err) {
      console.error('Failed to save contract:', err);
    }
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleApplyFilters = (newFilters: ContractFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const paginatedContracts = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return contracts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [contracts, currentPage]);

  const totalPages = Math.ceil(contracts.length / ITEMS_PER_PAGE);
  
  if (activeContractId !== null) {
    return (
      <ContractForm
        contractId={activeContractId === 'new' ? null : activeContractId}
        onSave={handleSaveContract}
        onBack={() => setActiveContractId(null)}
        isSidebarCollapsed={isSidebarCollapsed}
      />
    );
  }

  const renderContent = () => {
    if (isFetching && !paginatedContracts.length) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }
    if (isError) {
      return (
        <div className="text-center p-10 bg-red-100 text-red-800 rounded-2xl shadow-lg border border-red-200">
            <p className="font-semibold">{t('general.error.title')}</p>
            <p>{t('general.error.dataFetch')}</p>
        </div>
      );
    }
    return (
      <>
        <FilterChips 
          filters={filters} 
          onFilterChange={handleApplyFilters} 
          allServices={allServices} 
        />
        <ContractTable
          contracts={paginatedContracts}
          people={peopleData || []}
          onEdit={(contract) => setActiveContractId(contract.id)}
          onDelete={handleDeleteContract}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={contracts.length}
        />
      </>
    );
  };
  
  const pageActions = (
    <div className="flex items-center gap-2">
        <Button 
          ref={filterButtonRef}
          onClick={() => setIsFilterPopoverOpen(true)} 
          variant="ghost" 
          icon={<FilterIcon />}
        >
          {t('filter.title')}
        </Button>
        <Button onClick={() => setActiveContractId('new')} icon={<PlusIcon />}>
          {t('contractsPanel.newContract')}
        </Button>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <PageHeader
          title={t('contractsPanel.title')}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder={t('contractsPanel.searchPlaceholder')}
          onRefresh={handleRefresh}
          isRefreshing={isFetching && !isLoading}
          actionButton={pageActions}
       />
      
      {renderContent()}

      <ContractFilterPopover
        isOpen={isFilterPopoverOpen}
        onClose={() => setIsFilterPopoverOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
        anchorEl={filterButtonRef.current}
      />
    </div>
  );
};

export default ContractPanel;