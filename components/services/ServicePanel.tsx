import React, { useState, useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Service } from '../../types';
import ServiceTable from './ServiceTable';
import ServiceDetailPage from './ServiceDetailPage';
import PageHeader from '../common/PageHeader';
import Button from '../common/Button';
import { PlusIcon } from '../icons/AppleIcons';
import * as api from '../../api/apiService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifier } from '../../hooks/useNotifier';
import { useConfirm } from '../../hooks/useConfirm';
import SkeletonCard from '../common/SkeletonCard';

interface ServicePanelProps {
  isSidebarCollapsed: boolean;
}

const ServicePanel: React.FC<ServicePanelProps> = ({ isSidebarCollapsed }) => {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { notify } = useNotifier();
  const { confirm } = useConfirm();

  const [selectedServiceId, setSelectedServiceId] = useState<number | 'new' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  
  // Data fetching
  const { data: filteredServices = [], isLoading, isError, isFetching } = useQuery<Service[]>({
      queryKey: ['services', searchTerm],
      queryFn: () => api.getServices(searchTerm),
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  // Mutations
  const addServiceMutation = useMutation({
    mutationFn: api.addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      notify(t('notification.success.serviceAdded'), 'success');
    },
    onError: () => notify(t('notification.error.generic'), 'error'),
  });

  const updateServiceMutation = useMutation({
    mutationFn: api.updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      notify(t('notification.success.serviceUpdated'), 'success');
    },
    onError: () => notify(t('notification.error.generic'), 'error'),
  });

  const deleteServiceMutation = useMutation({
    mutationFn: api.deleteService,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services'] });
        notify(t('notification.success.serviceDeleted'), 'success');
    },
    onError: () => notify(t('notification.error.generic'), 'error'),
  });

  const handleSaveService = async (serviceData: Service | Omit<Service, 'id'>, options?: { stayOnPage?: boolean }) => {
    try {
      if ('id' in serviceData) {
        await updateServiceMutation.mutateAsync(serviceData);
        setSelectedServiceId(null);
      } else {
        await addServiceMutation.mutateAsync(serviceData);
        if (!options?.stayOnPage) {
            setSelectedServiceId(null);
        }
      }
    } catch (err) {
      console.error('Failed to save service:', err);
    }
  };

  const handleDeleteService = async (id: number) => {
    const confirmed = await confirm({
      title: t('confirmDialog.deleteServiceTitle'),
      message: t('confirmDialog.deleteServiceMessage'),
    });
    if (confirmed) {
      deleteServiceMutation.mutate(id);
    }
  };

  const handleSearchChange = (value: string) => {
      setSearchTerm(value);
      setCurrentPage(1);
  };

  const paginatedServices = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredServices, currentPage]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);

  if (selectedServiceId !== null) {
      return (
          <ServiceDetailPage
              serviceId={selectedServiceId === 'new' ? null : selectedServiceId}
              onSave={handleSaveService}
              onBack={() => setSelectedServiceId(null)}
              isSidebarCollapsed={isSidebarCollapsed}
          />
      );
  }
  
  const renderContent = () => {
    if (isFetching) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
        <ServiceTable
            services={paginatedServices}
            onEdit={(service) => setSelectedServiceId(service.id)}
            onDelete={handleDeleteService}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredServices.length}
        />
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <PageHeader
          title={t('servicesPanel.title')}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder={t('servicesPanel.searchPlaceholder')}
          onRefresh={handleRefresh}
          isRefreshing={isFetching && !isLoading}
          actionButton={
            <Button onClick={() => setSelectedServiceId('new')} icon={<PlusIcon />}>
              {t('servicesPanel.newService')}
            </Button>
          }
       />

      {renderContent()}
    </div>
  );
};

export default ServicePanel;