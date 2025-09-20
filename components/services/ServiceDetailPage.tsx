import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import { Service, ServiceAreas, ServiceStatuses, StandardAction } from '../../types';
import CustomSelect from '../admin/CustomSelect';
import StandardActionsTable from './StandardActionsTable';
import { ChevronRightIcon } from '../icons/AppleIcons';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useQuery } from '@tanstack/react-query';
import * as api from '../../api/apiService';
import SkeletonForm from '../common/SkeletonForm';

interface ServiceDetailPageProps {
  serviceId: number | null;
  onSave: (service: Service | Omit<Service, 'id'>, options?: { stayOnPage?: boolean }) => void;
  onBack: () => void;
  isSidebarCollapsed: boolean;
}

type ServiceFormData = Omit<Service, 'id' | 'standardActions'> & {
    standardActions: StandardAction[];
};

const newServiceDefaults: ServiceFormData = {
    code: '',
    title: '',
    area: 'ACCOUNTING',
    defaultPrice: 0,
    defaultDuration: 0,
    status: 'ACTIVE',
    standardActions: [],
};

// Helper functions for number formatting
const formatPrice = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return '';
  const num = Number(String(value).replace(/[^۰-۹0-9]/g, ''));
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('fa-IR').format(num);
};

const parsePrice = (value: string): number => {
  // Replace Persian numerals with English ones for parsing
  const englishValue = value.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  return Number(englishValue.replace(/[^0-9]/g, ''));
};


const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ serviceId, onSave, onBack, isSidebarCollapsed }) => {
  const { t } = useI18n();
  const { register, handleSubmit, reset, formState: { errors }, control } = useForm<ServiceFormData>({
      defaultValues: newServiceDefaults
  });

  const { data: serviceToEdit, isLoading, isError } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => api.getServiceById(serviceId!),
    enabled: !!serviceId,
  });
  
  const inFormActionsRef = useRef<HTMLDivElement>(null);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            setIsStickyBarVisible(!entry.isIntersecting);
        },
        { 
            root: null,
            threshold: 0,
        }
    );

    const currentRef = inFormActionsRef.current;
    if (currentRef) {
        observer.observe(currentRef);
    }

    return () => {
        if (currentRef) {
            observer.unobserve(currentRef);
        }
    };
  }, [isLoading]);


  useEffect(() => {
    if (serviceId && serviceToEdit) {
      reset(serviceToEdit);
    } else {
      reset(newServiceDefaults);
    }
  }, [serviceId, serviceToEdit, reset]);

  const processData = (data: ServiceFormData) => {
    return {
        ...data,
        defaultPrice: parsePrice(String(data.defaultPrice)) || 0,
        defaultDuration: Number(data.defaultDuration) || 0,
    };
  };

  const handleSave: SubmitHandler<ServiceFormData> = (data) => {
    const dataToSave = processData(data);
    if (serviceId) {
        onSave({ ...dataToSave, id: serviceId });
    } else {
        onSave(dataToSave);
    }
  };
  
  const handleSaveAndNew: SubmitHandler<ServiceFormData> = (data) => {
    const dataToSave = processData(data);
    onSave(dataToSave, { stayOnPage: true });
    reset(newServiceDefaults);
  };
  
  const translatedOptions = useMemo(() => ({
    areas: ServiceAreas.map(a => ({ value: a, label: t(`enum.serviceArea.${a}`)})),
    statuses: ServiceStatuses.map(s => ({ value: s, label: t(`enum.serviceStatus.${s}`)})),
  }), [t]);

  const actionButtonsGroup = (
      <div className="flex justify-end space-x-4 space-x-reverse">
          <Button type="button" onClick={onBack} variant="secondary">
              {t(serviceId ? 'serviceDetail.button.cancelEdit' : 'serviceDetail.button.cancelAdd')}
          </Button>
          
          {serviceId ? (
              <Button type="button" onClick={handleSubmit(handleSave)} disabled={isLoading}>
                  {t('serviceDetail.button.saveChanges')}
              </Button>
          ) : (
              <>
                  <Button type="button" onClick={handleSubmit(handleSaveAndNew)} variant="success">
                      {t('serviceDetail.button.createAndNew')}
                  </Button>
                  <Button type="button" onClick={handleSubmit(handleSave)}>
                      {t('serviceDetail.button.create')}
                  </Button>
              </>
          )}
      </div>
  );

  const renderFormContent = () => {
    if (isLoading && serviceId) {
      return <SkeletonForm />;
    }

    if (isError) {
      return (
        <div className="text-center py-10 my-6 bg-red-100 text-red-800 rounded-2xl shadow-lg border border-red-200">
          <p className="font-semibold">{t('general.error.title')}</p>
          <p>{t('general.error.dataFetch')}</p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label={t("serviceDetail.label.code")} id="code" error={errors.code} {...register("code", { required: t('serviceDetail.error.codeRequired') })} />
              <Input label={t("serviceDetail.label.title")} id="title" error={errors.title} {...register("title", { required: t('serviceDetail.error.titleRequired') })} />
          </div>
          
          <Controller
              name="area"
              control={control}
              rules={{ required: t('serviceDetail.error.areaRequired') }}
              render={({ field, fieldState }) => <CustomSelect error={fieldState.error} label={t('serviceDetail.label.area')} options={translatedOptions.areas} value={field.value} onChange={field.onChange} />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <Controller
                name="defaultPrice"
                control={control}
                rules={{ required: t('serviceDetail.error.priceRequired'), min: { value: 0, message: t('serviceDetail.error.priceMin')} }}
                render={({ field, fieldState }) => (
                  <div>
                    <label htmlFor="defaultPrice" className="block text-base font-medium text-gray-700 mb-1.5">{t('serviceDetail.label.price')}</label>
                    <input
                      id="defaultPrice"
                      type="text"
                      dir="ltr"
                      value={formatPrice(field.value)}
                      onChange={(e) => {
                          field.onChange(parsePrice(e.target.value));
                      }}
                      className={`w-full px-4 py-2.5 border ${fieldState.error ? 'border-red-500' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors text-base text-left`}
                    />
                    {fieldState.error && <p className="mt-1 text-sm text-red-600">{fieldState.error.message}</p>}
                  </div>
                )}
              />
              <Input 
                  label={t("serviceDetail.label.duration")}
                  id="defaultDuration" 
                  type="number"
                  error={errors.defaultDuration} 
                  {...register("defaultDuration", { required: t('serviceDetail.error.durationRequired'), valueAsNumber: true, min: { value: 0, message: t('serviceDetail.error.durationMin')} })} 
              />
          </div>

          <Controller
              name="status"
              control={control}
              rules={{ required: t('serviceDetail.error.statusRequired') }}
              render={({ field, fieldState }) => <CustomSelect error={fieldState.error} label={t('serviceDetail.label.status')} options={translatedOptions.statuses} value={field.value} onChange={field.onChange} />}
          />
        </div>

        <div className="border-t my-6"></div>

        <StandardActionsTable control={control} register={register} errors={errors} />

        <div ref={inFormActionsRef} className="border-t pt-6 mt-6">
          {actionButtonsGroup}
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <form>
        <Card>
          <div className="flex items-center mb-6">
            <button type="button" onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <ChevronRightIcon className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mr-2">
              {t(serviceId ? 'serviceDetail.title.edit' : 'serviceDetail.title.add')}
            </h1>
          </div>
          
          {renderFormContent()}
        </Card>

        <div 
          className={`fixed bottom-0 left-0 z-20 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'right-20' : 'right-64'
          } ${
            isStickyBarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
          }`}
        >
          <div className="bg-white/90 backdrop-blur-lg border-t border-gray-200/80 py-4 px-4 sm:px-6 lg:px-8 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.07)]">
            {actionButtonsGroup}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceDetailPage;