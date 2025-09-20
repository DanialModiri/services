import React, { useState, useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Person } from '../../types';
import PersonList from './PersonTable';
import PersonForm from './PersonForm';
import PageHeader from '../common/PageHeader';
import Button from '../common/Button';
import { PlusIcon } from '../icons/AppleIcons';
import * as api from '../../api/apiService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifier } from '../../hooks/useNotifier';
import { useConfirm } from '../../hooks/useConfirm';
import SkeletonCard from '../common/SkeletonCard';

interface AdminPanelProps {
  isSidebarCollapsed: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isSidebarCollapsed }) => {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { notify } = useNotifier();
  const { confirm } = useConfirm();

  const [activePersonId, setActivePersonId] = useState<number | 'new' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  
  // Data fetching using react-query
  const { data: filteredPeople = [], isLoading, isError, isFetching } = useQuery<Person[]>({
    queryKey: ['people', searchTerm],
    queryFn: () => api.getPeople(searchTerm),
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['people'] });
  };

  // Mutations
  const addPersonMutation = useMutation({
    mutationFn: (person: Omit<Person, 'id'>) => api.addPerson(person),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      notify(t('notification.success.personAdded'), 'success');
    },
    onError: () => {
      notify(t('notification.error.generic'), 'error');
    }
  });

  const updatePersonMutation = useMutation({
    mutationFn: (person: Person) => api.updatePerson(person),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      notify(t('notification.success.personUpdated'), 'success');
    },
    onError: () => {
      notify(t('notification.error.generic'), 'error');
    }
  });

  const deletePersonMutation = useMutation({
    mutationFn: api.deletePerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      notify(t('notification.success.personDeleted'), 'success');
    },
    onError: () => {
      notify(t('notification.error.generic'), 'error');
    }
  });

  const handleAddPerson = () => {
    setActivePersonId('new');
  };

  const handleEditPerson = (person: Person) => {
    setActivePersonId(person.id);
  };

  const handleDeletePerson = async (id: number) => {
    const confirmed = await confirm({
      title: t('confirmDialog.deletePersonTitle'),
      message: t('confirmDialog.deletePersonMessage'),
    });
    if (confirmed) {
       deletePersonMutation.mutate(id);
    }
  };

  const handleSavePerson = async (personData: Omit<Person, 'id'> | Person, options?: { stayOnPage?: boolean }) => {
    try {
      if ('id' in personData) {
        await updatePersonMutation.mutateAsync(personData);
      } else {
        await addPersonMutation.mutateAsync(personData);
      }
      if (!options?.stayOnPage) {
        setActivePersonId(null);
      }
    } catch (err) {
      console.error('Failed to save person:', err);
    }
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const paginatedPeople = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredPeople.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPeople, currentPage]);

  const totalPages = Math.ceil(filteredPeople.length / ITEMS_PER_PAGE);
  
  if (activePersonId !== null) {
    return (
      <PersonForm
        personId={activePersonId === 'new' ? null : activePersonId}
        onSave={handleSavePerson}
        onBack={() => setActivePersonId(null)}
        isSidebarCollapsed={isSidebarCollapsed}
      />
    );
  }

  const renderContent = () => {
    if (isFetching) {
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
      <PersonList
        people={paginatedPeople}
        onEdit={handleEditPerson}
        onDelete={handleDeletePerson}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredPeople.length}
      />
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
       <PageHeader
          title={t('peoplePanel.title')}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder={t('peoplePanel.searchPlaceholder')}
          onRefresh={handleRefresh}
          isRefreshing={isFetching && !isLoading}
          actionButton={
            <Button onClick={handleAddPerson} icon={<PlusIcon />} disabled={addPersonMutation.isPending || updatePersonMutation.isPending}>
              {t('peoplePanel.newPerson')}
            </Button>
          }
       />
      
      {renderContent()}
    </div>
  );
};

export default AdminPanel;