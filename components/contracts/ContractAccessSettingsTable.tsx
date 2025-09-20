import React, { useMemo, useState, useEffect } from 'react';
// FIX: Corrected react-hook-form imports by using the 'type' keyword for type-only imports.
import { Controller, useWatch, type Control, type UseFormSetValue, type FieldArrayWithId } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import { Contract, Personnel, ContractRoleTypes, ServiceAreas, NotificationMethods, ContractAccessSetting } from '../../types';
import { DeleteIcon, PlusIcon } from '../icons/AppleIcons';
import CustomSelect from '../admin/CustomSelect';
import MultiSelect from '../common/MultiSelect';
import { useQuery } from '@tanstack/react-query';
import * as api from '../../api/apiService';
import Button from '../common/Button';

type FormValues = Omit<Contract, 'id' | 'totalAmount'>;

interface ContractAccessSettingsTableProps {
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  fields: FieldArrayWithId<FormValues, "contractAccessSettings", "id">[];
  append: (setting: Omit<ContractAccessSetting, 'id'> & { id: string }) => void;
  remove: (index?: number | number[]) => void;
}

const AccessRow: React.FC<{
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  index: number;
  remove: (index: number) => void;
  personnelOptions: { label: string; value: string; }[];
  allPersonnel: Personnel[];
  isDeletable: boolean;
}> = ({ control, setValue, index, remove, personnelOptions, allPersonnel, isDeletable }) => {
    const { t } = useI18n();

    const personnelId = useWatch({ control, name: `contractAccessSettings.${index}.personnelId` });

    const selectedPersonnel = useMemo(() => allPersonnel.find(p => p.id === personnelId), [personnelId, allPersonnel]);
    
    const translatedOptions = useMemo(() => ({
        roleTypes: ContractRoleTypes.map(rt => ({ value: rt, label: t(`enum.contractRoleType.${rt}`)})),
        serviceAreas: ServiceAreas.map(sa => ({ value: sa, label: t(`enum.serviceArea.${sa}`)})),
        notificationMethods: NotificationMethods.map(nm => ({ value: nm, label: t(`enum.notificationMethod.${nm}`)})),
    }), [t]);

    return (
        <tr className="group border-b hover:bg-gray-50 text-sm align-top">
            <td className="px-2 py-3">
                <Controller name={`contractAccessSettings.${index}.roleType`} control={control} render={({ field }) => (
                    <CustomSelect options={translatedOptions.roleTypes} value={field.value} onChange={field.onChange} />
                )} />
            </td>
            <td className="px-2 py-3">
                <Controller name={`contractAccessSettings.${index}.serviceArea`} control={control} render={({ field }) => (
                    <CustomSelect options={translatedOptions.serviceAreas} value={field.value} onChange={field.onChange} />
                )} />
            </td>
            <td className="px-2 py-3">
                <Controller name={`contractAccessSettings.${index}.personnelId`} control={control} render={({ field }) => (
                    <CustomSelect 
                        options={personnelOptions} 
                        value={String(field.value)} 
                        onChange={(val) => {
                            const newPersonnelId = Number(val);
                            field.onChange(newPersonnelId);
                            const person = allPersonnel.find(p => p.id === newPersonnelId);
                            if (person) {
                                setValue(`contractAccessSettings.${index}.mobile`, person.mobile);
                                setValue(`contractAccessSettings.${index}.email`, person.email);
                            }
                        }}
                        placeholder={t('accessSettingsTable.placeholder.selectPerson')}
                    />
                )} />
            </td>
            <td className="px-2 py-3 text-gray-500"><div className="pt-2.5">{selectedPersonnel?.position ?? '-'}</div></td>
            <td className="px-2 py-3">
                <Controller name={`contractAccessSettings.${index}.notificationMethods`} control={control} render={({ field }) => (
                     <MultiSelect options={translatedOptions.notificationMethods} selectedValues={field.value} onChange={field.onChange} placeholder='انتخاب کنید...' />
                )} />
            </td>
            <td className="px-2 py-3 text-gray-500"><div className="pt-2.5">{selectedPersonnel?.name ?? '-'}</div></td>
            <td className="px-2 py-3">
                <Controller name={`contractAccessSettings.${index}.mobile`} control={control} render={({ field }) => (
                    <input type="text" value={field.value ?? ''} onChange={field.onChange} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-base" />
                )} />
            </td>
            <td className="px-2 py-3">
                 <Controller name={`contractAccessSettings.${index}.email`} control={control} render={({ field }) => (
                    <input type="email" value={field.value ?? ''} onChange={field.onChange} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-base" />
                )} />
            </td>
            <td className="px-2 py-3 text-center sticky left-0 bg-white group-hover:bg-gray-50 z-10 transition-colors">
                 <button type="button" onClick={() => remove(index)} disabled={!isDeletable} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500" aria-label="حذف">
                    <DeleteIcon className="w-5 h-5"/>
                </button>
            </td>
        </tr>
    );
};

const ContractAccessSettingsTable: React.FC<ContractAccessSettingsTableProps> = ({ control, setValue, fields, append, remove }) => {
    const { t } = useI18n();
    
    const { data: allPersonnel = [] } = useQuery<Personnel[]>({
        queryKey: ['personnel'],
        queryFn: () => api.getPersonnel(),
    });

    const personnelOptions = useMemo(() => allPersonnel.map(p => ({
        value: String(p.id),
        label: p.name
    })), [allPersonnel]);

    const handleAddAccessRow = () => {
        append({
            id: crypto.randomUUID(),
            roleType: 'SERVICE_CONTACT_CUSTOMER',
            serviceArea: 'ACCOUNTING',
            personnelId: null,
            notificationMethods: [],
            mobile: '', 
            email: ''
        });
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{t('accessSettingsTable.title')}</h3>
                <Button
                    type="button"
                    onClick={handleAddAccessRow}
                    variant="ghost"
                    size="sm"
                    icon={<PlusIcon className="w-5 h-5"/>}
                >
                    {t('accessSettingsTable.add')}
                </Button>
            </div>
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200/80 shadow">
                <table className="w-full min-w-[1600px] text-sm text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 min-w-[220px]">{t('accessSettingsTable.header.roleType')}</th>
                            <th className="px-4 py-3 min-w-[200px]">{t('accessSettingsTable.header.serviceArea')}</th>
                            <th className="px-4 py-3 min-w-[220px]">{t('accessSettingsTable.header.fullName')}</th>
                            <th className="px-4 py-3 min-w-[150px]">{t('accessSettingsTable.header.position')}</th>
                            <th className="px-4 py-3 min-w-[220px]">{t('accessSettingsTable.header.notificationMethod')}</th>
                            <th className="px-4 py-3 min-w-[150px]">{t('accessSettingsTable.header.systemUser')}</th>
                            <th className="px-4 py-3 min-w-[180px]">{t('accessSettingsTable.header.mobile')}</th>
                            <th className="px-4 py-3 min-w-[220px]">{t('accessSettingsTable.header.email')}</th>
                            <th className="px-4 py-3 min-w-[80px] sticky left-0 bg-gray-50 z-10">{t('accessSettingsTable.header.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.length > 0 ? (
                            fields.map((field, index) => (
                                <AccessRow 
                                    key={field.id} 
                                    index={index} 
                                    remove={remove} 
                                    control={control} 
                                    setValue={setValue}
                                    personnelOptions={personnelOptions}
                                    allPersonnel={allPersonnel}
                                    isDeletable={fields.length > 1}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-500">
                                    {t('accessSettingsTable.notFound')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContractAccessSettingsTable;