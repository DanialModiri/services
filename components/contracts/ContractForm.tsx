import React, { useEffect, useMemo, useRef, useState } from 'react';
// FIX: Corrected react-hook-form imports by using the 'type' keyword for type-only imports.
import { useForm, Controller, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import { Contract, ServiceAreas, ContractStatuses, Person, Service, ContractServiceItem, ContractAccessSetting } from '../../types';
import CustomSelect from '../admin/CustomSelect';
import CustomDatePicker from '../admin/CustomDatePicker';
import { ChevronRightIcon } from '../icons/AppleIcons';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { useQuery } from '@tanstack/react-query';
import * as api from '../../api/apiService';
import SkeletonForm from '../common/SkeletonForm';
import ContractServicesTable from './ContractServicesTable';
import ContractAccessSettingsTable from './ContractAccessSettingsTable';

interface ContractFormProps {
  contractId: number | null;
  onSave: (contract: Omit<Contract, 'id'> | Contract) => void;
  onBack: () => void;
  isSidebarCollapsed: boolean;
}

type ContractFormData = Omit<Contract, 'id' | 'totalAmount'>;

const newContractWithDefaults: ContractFormData = {
    contractCode: '',
    title: '',
    customerId: 0,
    serviceArea: 'ACCOUNTING',
    startDate: '',
    endDate: '',
    status: 'REGISTERED',
    contractServices: [{
        id: crypto.randomUUID(),
        serviceId: null,
        initialDurationDays: 0,
        price: 0,
        description: '',
        selectedStandardActionIds: [],
    }],
    contractAccessSettings: [{
        id: crypto.randomUUID(),
        roleType: 'SERVICE_CONTACT_CUSTOMER',
        serviceArea: 'ACCOUNTING',
        personnelId: null,
        notificationMethods: [],
        mobile: '', email: ''
    }],
};

const ContractForm: React.FC<ContractFormProps> = ({ contractId, onSave, onBack, isSidebarCollapsed }) => {
  const { t } = useI18n();
  const { register, handleSubmit, reset, formState: { errors }, control, watch, setValue } = useForm<ContractFormData>({
      defaultValues: contractId ? undefined : newContractWithDefaults,
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({ control, name: "contractServices" });
  const { fields: accessFields, append: appendAccess, remove: removeAccess } = useFieldArray({ control, name: "contractAccessSettings" });

  const { data: contractToEdit, isLoading: isLoadingContract } = useQuery({
    queryKey: ['contract', contractId],
    queryFn: () => api.getContractById(contractId!),
    enabled: !!contractId,
  });

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<Person[]>({ queryKey: ['customers'], queryFn: api.getCustomers });
  const { data: allServices = [], isLoading: isLoadingServices } = useQuery<Service[]>({ queryKey: ['services'], queryFn: () => api.getServices() });
  
  const inFormActionsRef = useRef<HTMLDivElement>(null);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);

  const isLoading = isLoadingContract || isLoadingCustomers || isLoadingServices;
  const startDate = watch('startDate');
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsStickyBarVisible(!entry.isIntersecting), { root: null, threshold: 0 });
    const currentRef = inFormActionsRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [isLoading]);

  useEffect(() => {
    if (contractId && contractToEdit) {
      reset(contractToEdit);
    } else if (!contractId) {
      reset(newContractWithDefaults);
    }
  }, [contractId, contractToEdit, reset]);

  const handleSave: SubmitHandler<ContractFormData> = (data) => {
    const dataToSave = { ...data, totalAmount: 0 }; 
    if (contractId) {
        onSave({ ...dataToSave, id: contractId });
    } else {
        onSave(dataToSave);
    }
  };
  
  const translatedOptions = useMemo(() => ({
    customers: customers.map(c => ({ 
        value: String(c.id), 
        label: c.personType === 'REAL' ? `${c.firstName} ${c.lastName}` : c.name 
    })),
    areas: ServiceAreas.map(a => ({ value: a, label: t(`enum.serviceArea.${a}`)})),
    statuses: ContractStatuses.map(s => ({ value: s, label: t(`enum.contractStatus.${s}`)})),
  }), [t, customers]);

  const actionButtonsGroup = (
      <div className="flex justify-end space-x-4 space-x-reverse">
          <Button type="button" onClick={onBack} variant="secondary">{t('general.button.cancel')}</Button>
          <Button type="button" onClick={handleSubmit(handleSave)} disabled={isLoading}>{t(contractId ? 'serviceDetail.button.saveChanges' : 'serviceDetail.button.create')}</Button>
      </div>
  );

  const renderFormContent = () => {
    if (isLoading && contractId) return <SkeletonForm />;
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            <Input containerClassName="lg:col-span-3" label={t("contractForm.label.title")} id="title" error={errors.title} {...register("title", { required: t('contractForm.error.titleRequired') })} />
            <Controller name="customerId" control={control} rules={{ required: t('contractForm.error.customerRequired'), validate: val => val > 0 || t('contractForm.error.customerRequired') }} render={({ field, fieldState }) => <CustomSelect label={t('contractForm.label.customer')} options={translatedOptions.customers} value={String(field.value)} onChange={val => field.onChange(Number(val))} error={fieldState.error} placeholder='مشتری را انتخاب کنید' />} />
            <Input label={t("contractForm.label.contractCode")} id="contractCode" error={errors.contractCode} {...register("contractCode", { required: t('contractForm.error.codeRequired') })} />
            <Controller name="serviceArea" control={control} rules={{ required: t('contractForm.error.areaRequired') }} render={({ field, fieldState }) => <CustomSelect label={t('contractForm.label.serviceArea')} options={translatedOptions.areas} value={field.value} onChange={field.onChange} error={fieldState.error} />} />
            <Controller name="startDate" control={control} rules={{ required: t('contractForm.error.startDateRequired') }} render={({ field }) => <CustomDatePicker labelId="contractForm.label.startDate" value={field.value} onChange={field.onChange} />} />
            <div>
                <Controller name="endDate" control={control} rules={{ required: t('contractForm.error.endDateRequired'), validate: value => !startDate || !value || new Date(value) > new Date(startDate) || t('contractForm.error.endDateAfterStart'), }} render={({ field }) => <CustomDatePicker labelId="contractForm.label.endDate" value={field.value} onChange={field.onChange} />} />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
            </div>
            <Controller name="status" control={control} rules={{ required: t('contractForm.error.statusRequired') }} render={({ field, fieldState }) => <CustomSelect label={t('contractForm.label.status')} options={translatedOptions.statuses} value={field.value} onChange={field.onChange} error={fieldState.error} />} />
        </div>

        <div className="border-t pt-8 mt-8">
            <div>
                 <ContractServicesTable 
                    control={control} 
                    register={register} 
                    setValue={setValue} 
                    allServices={allServices} 
                    fields={serviceFields} 
                    append={appendService}
                    remove={removeService} />
            </div>
            
            <div className="mt-8">
                <ContractAccessSettingsTable 
                    control={control} 
                    setValue={setValue} 
                    fields={accessFields} 
                    append={appendAccess}
                    remove={removeAccess} />
            </div>
        </div>
        
        <div ref={inFormActionsRef} className="pt-6 mt-6">
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
              {t(contractId ? 'contractForm.title.edit' : 'contractForm.title.add')}
            </h1>
          </div>
          
          {renderFormContent()}
        </Card>

        {/* Sticky Bottom Action Bar */}
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

export default ContractForm;