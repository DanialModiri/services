import React, { useMemo, useEffect, useState } from 'react';
// FIX: Corrected react-hook-form imports by using the 'type' keyword for type-only imports.
import { Controller, useWatch, type Control, type UseFormRegister, type UseFormSetValue, type FieldArrayWithId } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import { Service, Contract, ContractServiceItem } from '../../types';
import { DeleteIcon, PlusIcon } from '../icons/AppleIcons';
import CustomSelect from '../admin/CustomSelect';
import Button from '../common/Button';
import MultiSelect from '../common/MultiSelect';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import * as api from '../../api/apiService';
import useDebounce from '../../hooks/useDebounce';
import { formatPrice, parsePrice, calculateEndDate } from '../../utils/helpers';

type FormValues = Omit<Contract, 'id' | 'totalAmount'>;

interface ContractServicesTableProps {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  allServices: Service[];
  fields: FieldArrayWithId<FormValues, "contractServices", "id">[];
  append: (service: Omit<ContractServiceItem, 'id'> & { id: string }) => void;
  remove: (index?: number | number[]) => void;
}

interface ServiceRowProps {
    control: Control<FormValues>;
    register: UseFormRegister<FormValues>;
    setValue: UseFormSetValue<FormValues>;
    allServices: Service[];
    index: number;
    remove: (index: number) => void;
    isDeletable: boolean;
}

const ServiceRow: React.FC<ServiceRowProps> = ({ control, register, setValue, allServices, index, remove, isDeletable }) => {
    const { t } = useI18n();
    const [serviceSearchTerm, setServiceSearchTerm] = useState('');
    const debouncedServiceSearchTerm = useDebounce(serviceSearchTerm, 200);

    const { data: searchedServices, isFetching: isSearchingServices } = useQuery<Service[]>({
        queryKey: ['services', debouncedServiceSearchTerm],
        queryFn: () => api.getServices(debouncedServiceSearchTerm),
        placeholderData: keepPreviousData,
    });

    const serviceId = useWatch({ control, name: `contractServices.${index}.serviceId` });
    const durationDays = useWatch({ control, name: `contractServices.${index}.initialDurationDays` });
    const contractStartDate = useWatch({ control, name: 'startDate' });
    
    const selectedService = useMemo(() => (searchedServices || allServices).find(s => s.id === serviceId), [serviceId, allServices, searchedServices]);

    const serviceArea = selectedService?.area ?? '';
    const serviceCode = selectedService?.code ?? '';

    useEffect(() => {
        setValue(`contractServices.${index}.selectedStandardActionIds`, []);
    }, [serviceId, index, setValue]);

    const serviceOptions = useMemo(() => (searchedServices || []).map(s => ({ value: String(s.id), label: s.title })), [searchedServices]);
    
    const standardActionOptions = useMemo(() => {
        return selectedService?.standardActions.map(sa => ({ value: sa.id, label: sa.title })) ?? [];
    }, [selectedService]);

    const endDateDisplay = calculateEndDate(contractStartDate, durationDays);

    return (
        <tr className="group border-b hover:bg-gray-50 text-sm align-top">
            <td className="px-2 py-3">
                <Controller
                    name={`contractServices.${index}.serviceId`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <CustomSelect
                            options={serviceOptions}
                            value={String(field.value)}
                            onChange={(val) => {
                                const newServiceId = Number(val);
                                field.onChange(newServiceId);
                                const service = (searchedServices || allServices).find(s => s.id === newServiceId);
                                if (service) {
                                    setValue(`contractServices.${index}.price`, service.defaultPrice);
                                    setValue(`contractServices.${index}.initialDurationDays`, (service.defaultDuration || 0) * 30);
                                }
                            }}
                            isSearchable
                            onSearch={setServiceSearchTerm}
                            isLoading={isSearchingServices}
                        />
                    )}
                />
            </td>
            <td className="px-2 py-3 text-gray-500"><div className="pt-2.5">{serviceCode}</div></td>
            <td className="px-2 py-3 text-gray-500"><div className="pt-2.5">{serviceArea ? t(`enum.serviceArea.${serviceArea}`) : ''}</div></td>
            <td className="px-2 py-3">
                <input
                    type="number"
                    {...register(`contractServices.${index}.initialDurationDays`, { valueAsNumber: true })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-base"
                />
            </td>
            <td className="px-2 py-3">
                 <Controller
                    name={`contractServices.${index}.price`}
                    control={control}
                    render={({ field }) => (
                        <input
                            type="text"
                            dir="ltr"
                            value={formatPrice(field.value)}
                            onChange={(e) => field.onChange(parsePrice(e.target.value))}
                            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-base text-left"
                        />
                    )}
                />
            </td>
            <td className="px-2 py-3">
                 <input
                    type="text"
                    {...register(`contractServices.${index}.description`)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-base"
                />
            </td>
            <td className="px-2 py-3">
                <Controller
                    name={`contractServices.${index}.selectedStandardActionIds`}
                    control={control}
                    render={({ field }) => (
                       <MultiSelect 
                            options={standardActionOptions}
                            selectedValues={field.value}
                            onChange={field.onChange}
                            placeholder='انتخاب اقدامات'
                       />
                    )}
                />
            </td>
            <td className="px-2 py-3">
                <Button type="button" variant="ghost" size="sm">تمدید</Button>
            </td>
            <td className="px-2 py-3 text-gray-500"><div className="pt-2.5">{endDateDisplay}</div></td>
            <td className="px-2 py-3 text-center sticky left-0 bg-white group-hover:bg-gray-50 z-10 transition-colors">
                 <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={!isDeletable}
                    className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
                    aria-label="حذف خدمت"
                >
                    <DeleteIcon className="w-5 h-5"/>
                </button>
            </td>
        </tr>
    );
};

const ContractServicesTable: React.FC<ContractServicesTableProps> = ({ control, register, setValue, allServices, fields, append, remove }) => {
    const { t } = useI18n();

    const handleAddService = () => {
        append({ 
            id: crypto.randomUUID(), 
            serviceId: null, 
            initialDurationDays: 0, 
            price: 0, 
            description: '', 
            selectedStandardActionIds: [] 
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{t('contractForm.tab.services')}</h3>
                <Button
                    type="button"
                    onClick={handleAddService}
                    variant="ghost"
                    size="sm"
                    icon={<PlusIcon className="w-5 h-5"/>}
                >
                    افزودن خدمت
                </Button>
            </div>
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200/80 shadow">
                <table className="w-full min-w-[1400px] text-sm text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 min-w-[250px] whitespace-nowrap">عنوان خدمت</th>
                            <th className="px-4 py-3 min-w-[120px] whitespace-nowrap">کد خدمت</th>
                            <th className="px-4 py-3 min-w-[150px] whitespace-nowrap">حوزه خدمت</th>
                            <th className="px-4 py-3 min-w-[120px] whitespace-nowrap">مدت (روز)</th>
                            <th className="px-4 py-3 min-w-[180px] whitespace-nowrap">قیمت (ریال)</th>
                            <th className="px-4 py-3 min-w-[250px] whitespace-nowrap">شرح</th>
                            <th className="px-4 py-3 min-w-[220px] whitespace-nowrap">اقدامات استاندارد</th>
                            <th className="px-4 py-3 min-w-[100px] whitespace-nowrap">تمدید</th>
                            <th className="px-4 py-3 min-w-[150px] whitespace-nowrap">تاریخ پایان</th>
                            <th className="px-4 py-3 min-w-[80px] whitespace-nowrap sticky left-0 bg-gray-50 z-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.length > 0 ? (
                            fields.map((field, index) => (
                            <ServiceRow key={field.id} index={index} remove={remove} control={control} register={register} setValue={setValue} allServices={allServices} isDeletable={fields.length > 1} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="text-center py-8 text-gray-500">
                                    هیچ خدمتی به این قرارداد اضافه نشده است.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContractServicesTable;