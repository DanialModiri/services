import React, { useMemo } from 'react';
// FIX: Corrected react-hook-form imports by using the 'type' keyword for type-only imports.
import { Controller, useWatch, type Control, type UseFormRegister, type FieldErrors, type FieldArrayWithId } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import { Service, StandardAction, ActionFrequencies, ActionActors } from '../../types';
import { DeleteIcon, PlusIcon } from '../icons/AppleIcons';
import CustomSelect from '../admin/CustomSelect';
import Button from '../common/Button';

type FormValues = Omit<Service, 'id'>;

interface StandardActionsTableProps {
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  fields: FieldArrayWithId<FormValues, "standardActions", "id">[];
  append: (action: Omit<StandardAction, 'id'> & { id: string }) => void;
  remove: (index?: number | number[]) => void;
}

const StandardActionsTable: React.FC<StandardActionsTableProps> = ({ control, register, errors, fields, append, remove }) => {
    const { t } = useI18n();
    
    const watchedActions = useWatch({
        control,
        name: 'standardActions',
        defaultValue: []
    });

    const handleAddAction = () => {
        append({
            id: new Date().toISOString(), 
            title: '',
            actor: 'ORGANIZATION',
            frequency: 'CALENDAR_MONTH',
            issuanceDay: 1,
            prerequisiteActionId: null,
        });
    };
    
    const translatedOptions = useMemo(() => ({
        frequencies: ActionFrequencies.map(f => ({ value: f, label: t(`enum.actionFrequency.${f}`)})),
        actors: ActionActors.map(a => ({ value: a, label: t(`enum.actionActor.${a}`)})),
    }), [t]);


    const baseInputClass = "w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base flex justify-between items-center";
    const errorInputClass = "border-red-500";


    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{t('actionsTable.title')}</h3>
                <Button
                    type="button"
                    onClick={handleAddAction}
                    variant="ghost"
                    size="sm"
                    icon={<PlusIcon className="w-5 h-5"/>}
                >
                    {t('actionsTable.add')}
                </Button>
            </div>
            <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200/80 shadow">
                <table className="w-full text-sm text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 min-w-[200px]">{t('actionsTable.header.title')}</th>
                            <th scope="col" className="px-4 py-3 min-w-[180px]">{t('actionsTable.header.actor')}</th>
                            <th scope="col" className="px-4 py-3">{t('actionsTable.header.frequency')}</th>
                            <th scope="col" className="px-4 py-3">{t('actionsTable.header.issuanceDay')}</th>
                            <th scope="col" className="px-4 py-3 min-w-[150px]">{t('actionsTable.header.prerequisite')}</th>
                            <th scope="col" className="px-4 py-3 text-center sticky left-0 bg-gray-50 z-10">{t('actionsTable.header.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((field, index) => {
                             const actionErrors = errors.standardActions?.[index];
                             const prerequisiteOptions = [
                                { label: t('actionsTable.placeholder.prerequisite'), value: '' },
                                ...watchedActions
                                    .filter((act, i) => i !== index && !!act.title)
                                    .map(opt => ({ label: opt.title, value: opt.id }))
                             ];
                            return (
                                <tr key={field.id} className="group border-b hover:bg-gray-50">
                                    <td className="px-2 py-2">
                                        <div>
                                            <input
                                                {...register(`standardActions.${index}.title`, { required: t('actionsTable.error.titleRequired') })}
                                                className={`${baseInputClass} ${actionErrors?.title ? errorInputClass : ''}`}
                                                placeholder={t('actionsTable.placeholder.title')}
                                            />
                                            {actionErrors?.title && <p className="mt-1 text-xs text-red-600">{actionErrors.title.message}</p>}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2">
                                        <Controller
                                            name={`standardActions.${index}.actor`}
                                            control={control}
                                            render={({ field }) => (
                                                <div className="grid grid-cols-2 gap-1 p-0.5 bg-gray-200 rounded-xl w-full max-w-[160px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => field.onChange('ORGANIZATION')}
                                                        className={`px-2 py-[9px] rounded-lg text-center font-semibold transition-all text-base ${field.value === 'ORGANIZATION' ? 'bg-white shadow' : 'text-gray-600'}`}
                                                    >
                                                        {t('actionsTable.label.organization')}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => field.onChange('CUSTOMER')}
                                                        className={`px-2 py-[9px] rounded-lg text-center font-semibold transition-all text-base ${field.value === 'CUSTOMER' ? 'bg-white shadow' : 'text-gray-600'}`}
                                                    >
                                                        {t('actionsTable.label.customer')}
                                                    </button>
                                                </div>
                                            )}
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                       <Controller
                                            name={`standardActions.${index}.frequency`}
                                            control={control}
                                            rules={{ required: t('actionsTable.error.frequencyRequired')}}
                                            render={({ field, fieldState }) => (
                                                <CustomSelect
                                                    options={translatedOptions.frequencies}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    buttonClassName={`${baseInputClass} ${fieldState.error ? errorInputClass : ''}`}
                                                    error={fieldState.error}
                                                />
                                            )}
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <div>
                                            <input
                                                type="number"
                                                {...register(`standardActions.${index}.issuanceDay`, { 
                                                    required: t('actionsTable.error.dayRequired'), 
                                                    valueAsNumber: true, 
                                                    min: { value: 1, message: t('actionsTable.error.dayMin') }, 
                                                    max: { value: 31, message: t('actionsTable.error.dayMax') }
                                                })}
                                                className={`${baseInputClass} w-24 ${actionErrors?.issuanceDay ? errorInputClass : ''}`}
                                            />
                                            {actionErrors?.issuanceDay && <p className="mt-1 text-xs text-red-600">{actionErrors.issuanceDay.message}</p>}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2">
                                        <Controller
                                            name={`standardActions.${index}.prerequisiteActionId`}
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <CustomSelect
                                                    options={prerequisiteOptions}
                                                    value={field.value || ''}
                                                    onChange={field.onChange}
                                                    buttonClassName={`${baseInputClass} ${fieldState.error ? errorInputClass : ''}`}
                                                    placeholder={t('actionsTable.placeholder.prerequisite')}
                                                    error={fieldState.error}
                                                />
                                            )}
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center sticky left-0 bg-white group-hover:bg-gray-50 z-10 transition-colors">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            disabled={fields.length <= 1}
                                            className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
                                            aria-label={t('actionsTable.deleteAriaLabel')}
                                        >
                                            <DeleteIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {fields.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                    {t('actionsTable.notFound')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StandardActionsTable;