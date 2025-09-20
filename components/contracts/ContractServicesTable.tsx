import React, { useMemo, useEffect } from 'react';
import { useFieldArray, Control, UseFormRegister, FieldErrors, useWatch, Controller, UseFormSetValue } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import { Service, Contract } from '../../types';
import { DeleteIcon, PlusIcon } from '../icons/AppleIcons';
import CustomSelect from '../admin/CustomSelect';
import Button from '../common/Button';
import MultiSelect from '../common/MultiSelect';

type FormValues = Omit<Contract, 'id' | 'totalAmount'>;

interface ContractServicesTableProps {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  allServices: Service[];
}

// Helper functions
const formatPrice = (value: number | string | undefined): string => {
  if (value === undefined || value === null || value === '') return '';
  const num = Number(String(value).replace(/[^۰-۹0-9]/g, ''));
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('fa-IR').format(num);
};

const parsePrice = (value: string): number => {
  const englishValue = value.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  return Number(englishValue.replace(/[^0-9]/g, ''));
};

const toJalali = (gy: number, gm: number, gd: number): [number, number, number] => {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    const gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return [jy, jm, jd];
}

const calculateEndDate = (startDate: string, durationDays: number): string => {
    if (!startDate || durationDays === undefined || isNaN(durationDays)) return '';
    try {
        const start = new Date(startDate);
        start.setDate(start.getDate() + durationDays);
        const [jy, jm, jd] = toJalali(start.getFullYear(), start.getMonth() + 1, start.getDate());
        return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
    } catch (e) {
        return '';
    }
};


const ServiceRow: React.FC<Omit<ContractServicesTableProps, 'errors'> & { index: number; remove: (index: number) => void; }> = ({ control, register, setValue, allServices, index, remove }) => {
    const { t } = useI18n();
    const serviceId = useWatch({ control, name: `contractServices.${index}.serviceId` });
    const durationDays = useWatch({ control, name: `contractServices.${index}.initialDurationDays` });
    const contractStartDate = useWatch({ control, name: 'startDate' });
    
    const selectedService = useMemo(() => allServices.find(s => s.id === serviceId), [serviceId, allServices]);

    const serviceArea = selectedService?.area ?? '';
    const serviceCode = selectedService?.code ?? '';

    useEffect(() => {
        setValue(`contractServices.${index}.selectedStandardActionIds`, []);
    }, [serviceId, index, setValue]);

    const serviceOptions = useMemo(() => allServices.map(s => ({ value: String(s.id), label: s.title })), [allServices]);
    
    const standardActionOptions = useMemo(() => {
        return selectedService?.standardActions.map(sa => ({ value: sa.id, label: sa.title })) ?? [];
    }, [selectedService]);

    const endDateDisplay = calculateEndDate(contractStartDate, durationDays);

    return (
        <tr className="border-b hover:bg-gray-50 text-sm align-top">
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
                                const service = allServices.find(s => s.id === newServiceId);
                                if (service) {
                                    setValue(`contractServices.${index}.price`, service.defaultPrice);
                                    setValue(`contractServices.${index}.initialDurationDays`, (service.defaultDuration || 0) * 30);
                                }
                            }}
                        />
                    )}
                />
            </td>
            <td className="px-2 py-3 text-gray-500 font-mono"><div className="pt-2.5">{serviceCode}</div></td>
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
            <td className="px-2 py-3 font-mono text-gray-500"><div className="pt-2.5">{endDateDisplay}</div></td>
            <td className="px-2 py-3 text-center">
                 <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
                    aria-label="حذف خدمت"
                >
                    <DeleteIcon className="w-5 h-5"/>
                </button>
            </td>
        </tr>
    );
};


const ContractServicesTable: React.FC<ContractServicesTableProps> = ({ control, register, errors, setValue, allServices }) => {
    const { t } = useI18n();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "contractServices",
    });

    const handleAddService = () => {
        append({
            id: new Date().toISOString(),
            serviceId: null,
            initialDurationDays: 0,
            price: 0,
            description: '',
            selectedStandardActionIds: [],
        });
    };
    
    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">خدمات قرارداد</h3>
                <Button type="button" onClick={handleAddService} variant="ghost" size="sm" icon={<PlusIcon />}>
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
                            <th className="px-4 py-3 min-w-[80px] whitespace-nowrap"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((field, index) => (
                           <ServiceRow key={field.id} index={index} remove={remove} control={control} register={register} setValue={setValue} allServices={allServices} />
                        ))}
                         {fields.length === 0 && (
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