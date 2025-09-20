import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
// FIX: Corrected react-hook-form imports by using the 'type' keyword for type-only imports.
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import { ContractFilters, Service, ServiceAreas } from '../../types';
import MultiSelect from '../common/MultiSelect';
import CustomDatePicker from '../admin/CustomDatePicker';
import Button from '../common/Button';
import { useQuery } from '@tanstack/react-query';
import * as api from '../../api/apiService';

interface ContractFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: ContractFilters) => void;
  initialFilters: ContractFilters;
  anchorEl: HTMLElement | null;
}

const ContractFilterPopover: React.FC<ContractFilterPopoverProps> = ({ isOpen, onClose, onApply, initialFilters, anchorEl }) => {
  const { t } = useI18n();
  const { control, handleSubmit, reset } = useForm<ContractFilters>({
    defaultValues: initialFilters,
  });
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: -9999, left: 0, width: 350, transformOrigin: 'top right' });
  
  const { data: allServices = [] } = useQuery<Service[]>({
    queryKey: ['services', ''], // Fetch all services for the filter dropdown
    queryFn: () => api.getServices(''),
  });

  useEffect(() => {
    reset(initialFilters);
  }, [initialFilters, reset]);
  
  useLayoutEffect(() => {
    if (anchorEl && popoverRef.current) {
        const rect = anchorEl.getBoundingClientRect();
        const popoverWidth = 350;
        const margin = 8;

        let newLeft = rect.left + rect.width - popoverWidth;
        let newTransformOrigin = 'top right';

        // Check if there's enough space on the left. If not, open from the left side.
        if (newLeft < margin) {
            newLeft = rect.left;
            newTransformOrigin = 'top left';
        }

        setPosition({
            top: rect.bottom + margin,
            left: newLeft,
            width: popoverWidth,
            transformOrigin: newTransformOrigin,
        });
    }
  }, [anchorEl, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const onSubmit: SubmitHandler<ContractFilters> = (data) => {
    const cleanedFilters: ContractFilters = {};
    if (data.serviceIds && data.serviceIds.length > 0) cleanedFilters.serviceIds = data.serviceIds;
    if (data.serviceAreas && data.serviceAreas.length > 0) cleanedFilters.serviceAreas = data.serviceAreas;
    if (data.startDate) cleanedFilters.startDate = data.startDate;
    if (data.endDate) cleanedFilters.endDate = data.endDate;
    onApply(cleanedFilters);
    onClose();
  };

  const handleClear = () => {
    reset({ serviceIds: [], serviceAreas: [], startDate: '', endDate: '' });
    onApply({});
    onClose();
  };
  
  const translatedOptions = useMemo(() => ({
    services: allServices.map(s => ({ value: String(s.id), label: s.title })),
    areas: ServiceAreas.map(a => ({ value: a, label: t(`enum.serviceArea.${a}`) })),
  }), [allServices, t]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popoverRef}
      className="fixed z-50 animate-scale-in"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        transformOrigin: position.transformOrigin
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">{t('filter.title')}</h2>
          </div>
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <Controller
              name="serviceIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label={t('filter.services')}
                  options={translatedOptions.services}
                  selectedValues={(field.value || []).map(String)}
                  onChange={(values) => field.onChange(values.map(Number))}
                />
              )}
            />
            <Controller
              name="serviceAreas"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label={t('filter.serviceArea')}
                  options={translatedOptions.areas}
                  selectedValues={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => <CustomDatePicker labelId="filter.startDate" value={field.value} onChange={field.onChange} />}
              />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => <CustomDatePicker labelId="filter.endDate" value={field.value} onChange={field.onChange} />}
              />
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-b-2xl flex justify-between items-center">
            <Button type="button" variant="ghost" size="sm" onClick={handleClear}>{t('filter.clear')}</Button>
            <Button type="submit" size="sm">{t('filter.apply')}</Button>
          </div>
        </form>
      </div>
      <style>{`
          @keyframes scale-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
          .animate-scale-in { animation: scale-in 0.15s ease-out; }
      `}</style>
    </div>,
    document.body
  );
};

export default ContractFilterPopover;