import React, { useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Service, ServiceArea, ServiceStatus, Contract } from '../../types';
import { EditIcon, DeleteIcon, FilterIcon } from '../icons/AppleIcons';
import Pagination from '../admin/Pagination';

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price);
};

const areaColors: { [key in ServiceArea]: string } = {
    'ACCOUNTING': 'bg-blue-100 text-blue-800',
    'TAX': 'bg-red-100 text-red-800',
    'REGISTRATION': 'bg-purple-100 text-purple-800',
    'TRAINING': 'bg-yellow-100 text-yellow-800',
};

const statusColors: { [key in ServiceStatus]: string } = {
    'ACTIVE': 'bg-green-100 text-green-800',
    'INACTIVE': 'bg-gray-200 text-gray-800',
};

interface ServiceListProps {
  services: Service[];
  allContracts: Contract[];
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

const ServiceCard: React.FC<{ 
  service: Service; 
  contractCount: number;
  onEdit: () => void; 
  onDelete: () => void; 
}> = ({ service, contractCount, onEdit, onDelete }) => {
  const { t } = useI18n();
  const editAriaLabel = t('serviceCard.editAriaLabel', { title: service.title });
  const deleteAriaLabel = t('serviceCard.deleteAriaLabel', { title: service.title });

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 shadow-lg rounded-3xl p-5 transition-all duration-300 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow min-w-0">
          <h3 className="text-xl font-bold text-gray-900 truncate" title={service.title}>{service.title}</h3>
          <p className="text-sm text-gray-500">{service.code}</p>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button onClick={onEdit} className="p-2.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-all duration-200" aria-label={editAriaLabel}><EditIcon /></button>
          <button onClick={onDelete} className="p-2.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-all duration-200" aria-label={deleteAriaLabel}><DeleteIcon /></button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 flex-grow">
          <div>
            <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${areaColors[service.area]}`}>
              {t(`enum.serviceArea.${service.area}`)}
            </span>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-800">{formatPrice(service.defaultPrice)}</p>
            <span className="text-sm text-gray-600 mr-1">{t('serviceCard.currency')}</span>
          </div>
          <div>
            <p className="text-base text-gray-600">
                {service.defaultDuration > 0 
                  ? t('serviceCard.durationInfo', { duration: service.defaultDuration })
                  : t('serviceCard.oneTimeService')
                }
            </p>
          </div>
      </div>
      
       {/* Contract Info */}
       <div className="border-t border-gray-200/80 pt-3 mt-4 space-y-2">
            <p className="text-sm text-gray-600">{t('serviceCard.contractCount', { count: contractCount })}</p>
       </div>

      {/* Footer */}
      <div className="border-t border-gray-200/80 pt-3 mt-4 flex justify-end">
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${statusColors[service.status]}`}>
            {t(`enum.serviceStatus.${service.status}`)}
          </span>
      </div>
    </div>
  );
};


const ServiceList: React.FC<ServiceListProps> = ({ services, allContracts, onEdit, onDelete, currentPage, totalPages, onPageChange, totalItems }) => {
  const { t } = useI18n();

  const contractCounts = useMemo(() => {
    const counts = new Map<number, number>();
    services.forEach(service => {
        const count = allContracts.filter(contract => 
            contract.contractServices.some(cs => cs.serviceId === service.id)
        ).length;
        counts.set(service.id, count);
    });
    return counts;
  }, [services, allContracts]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {services.length > 0 ? (
          services.map(service => (
            <ServiceCard 
              key={service.id} 
              service={service}
              contractCount={contractCounts.get(service.id) || 0}
              onEdit={() => onEdit(service)}
              onDelete={() => onDelete(service.id)}
            />
          ))
        ) : (
          <div className="text-center p-10 bg-white/70 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-lg col-span-full">
              <p className="text-gray-500">{t('servicesPanel.notFound')}</p>
          </div>
        )}
      </div>
      {totalItems > 0 && totalPages > 1 && (
         <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default ServiceList;