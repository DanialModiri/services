import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import { ContractFilters, Service, ServiceArea, ServiceAreas } from '../../types';
import Chip from './Chip';
import { toJalaliDisplay } from '../../utils/helpers';

interface FilterChipsProps {
  filters: ContractFilters;
  onFilterChange: (newFilters: ContractFilters) => void;
  allServices: Service[];
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, onFilterChange, allServices }) => {
  const { t } = useI18n();

  const handleRemoveService = (serviceId: number) => {
    onFilterChange({
      ...filters,
      serviceIds: filters.serviceIds?.filter(id => id !== serviceId),
    });
  };

  const handleRemoveArea = (area: ServiceArea) => {
    onFilterChange({
      ...filters,
      serviceAreas: filters.serviceAreas?.filter(a => a !== area),
    });
  };

  const handleRemoveDate = (key: 'startDate' | 'endDate') => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFilterChange(newFilters);
  };
  
  const handleClearAll = () => {
    onFilterChange({});
  };

  const serviceChips = filters.serviceIds?.map(id => {
    const service = allServices.find(s => s.id === id);
    return (
      <Chip key={`service-${id}`} onRemove={() => handleRemoveService(id)} label={<>{t('filter.chips.label.service')}: <span className="font-semibold">{service?.title || id}</span></>} />
    );
  });
  
  const areaChips = filters.serviceAreas?.map(area => {
    return (
      <Chip key={`area-${area}`} onRemove={() => handleRemoveArea(area)} label={<>{t('filter.chips.label.area')}: <span className="font-semibold">{t(`enum.serviceArea.${area}`)}</span></>} />
    );
  });

  const dateChips = [];
  if (filters.startDate && filters.endDate) {
      const label = `${toJalaliDisplay(filters.startDate)} - ${toJalaliDisplay(filters.endDate)}`;
      dateChips.push(
          <Chip key="date-range" onRemove={() => { handleRemoveDate('startDate'); handleRemoveDate('endDate'); }} label={<>{t('filter.chips.label.dateRange')}: <span className="font-semibold">{label}</span></>} />
      );
  } else {
      if (filters.startDate) {
          dateChips.push(<Chip key="start-date" onRemove={() => handleRemoveDate('startDate')} label={<>{t('filter.startDate')}: <span className="font-semibold">{toJalaliDisplay(filters.startDate)}</span></>} />);
      }
      if (filters.endDate) {
          dateChips.push(<Chip key="end-date" onRemove={() => handleRemoveDate('endDate')} label={<>{t('filter.endDate')}: <span className="font-semibold">{toJalaliDisplay(filters.endDate)}</span></>} />);
      }
  }


  const allChips = [...(serviceChips || []), ...(areaChips || []), ...dateChips];

  if (allChips.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center flex-wrap gap-2">
      {allChips}
      {allChips.length > 1 && (
        <button
          onClick={handleClearAll}
          className="text-sm font-semibold text-red-600 hover:text-red-800 mr-2"
        >
          {t('filter.chips.clearAll')}
        </button>
      )}
    </div>
  );
};

export default FilterChips;
