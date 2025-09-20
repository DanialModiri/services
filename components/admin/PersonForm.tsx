import React, { useEffect, useState, useRef, useMemo } from 'react';
// FIX: Corrected react-hook-form imports by using the 'type' keyword for type-only imports.
import { useForm, Controller, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import { Person, PersonType, OrganizationRoles, LegalEntityTypes, Gender, LegalEntityType, OrganizationRole, Document } from '../../types';
import CustomSelect from './CustomSelect';
import CustomDatePicker from './CustomDatePicker';
import DocumentPopoverForm from './DocumentPopoverForm';
import { PdfIcon, ImageIcon, DocxIcon, GenericFileIcon } from '../icons/FileIcons';
import { EditIcon, DeleteIcon, InfoIcon, ChevronRightIcon } from '../icons/AppleIcons';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import { useQuery } from '@tanstack/react-query';
import * as api from '../../api/apiService';
import SkeletonForm from '../common/SkeletonForm';
import Card from '../common/Card';


interface PersonFormProps {
  personId: number | null;
  onSave: (person: Omit<Person, 'id'> | Person, options?: { stayOnPage?: boolean }) => void;
  onBack: () => void;
  isSidebarCollapsed: boolean;
}

type PersonFormData = {
    personType: PersonType;
    nationalId: string;
    organizationRole: OrganizationRole;
    documents: Document[];
    firstName?: string;
    lastName?: string;
    name?: string;
    birthDate?: string;
    gender?: Gender;
    registrationDate?: string;
    legalEntityType?: LegalEntityType;
    financialYearStart?: string;
    email?: string;
    landline?: string;
    mobile?: string;
    address?: string;
    postalCode?: string;
    description?: string;
};

const defaultValues: PersonFormData = {
    personType: 'REAL',
    firstName: '',
    lastName: '',
    name: '',
    nationalId: '',
    organizationRole: 'CUSTOMER',
    birthDate: '',
    registrationDate: '',
    email: '',
    mobile: '',
    landline: '',
    address: '',
    postalCode: '',
    description: '',
    financialYearStart: '',
    gender: undefined,
    legalEntityType: undefined,
    documents: [],
};

const DocumentList: React.FC<{ control: any; personType: PersonType }> = ({ control, personType }) => {
    const { fields, append, remove, update } = useFieldArray({ control, name: "documents" });
    const { t } = useI18n();
    
    const [popoverState, setPopoverState] = useState<{ openFor: 'new' | number | null, anchorEl: HTMLElement | null }>({ openFor: null, anchorEl: null });
    const [activeDescription, setActiveDescription] = useState<{ index: number, anchorEl: HTMLElement | null } | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDescription && popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setActiveDescription(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDescription]);


    const getFileIcon = (format: string) => {
        switch (format) {
            case 'image': return <ImageIcon className="w-6 h-6 text-blue-500" />;
            case 'pdf': return <PdfIcon className="w-6 h-6 text-red-500" />;
            case 'docx': return <DocxIcon className="w-6 h-6 text-blue-700" />;
            default: return <GenericFileIcon className="w-6 h-6 text-gray-500" />;
        }
    }

    const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>, index: 'new' | number) => {
        setPopoverState({ openFor: index, anchorEl: event.currentTarget });
    };

    const handleSaveDocument = (doc: Document) => {
        if (popoverState.openFor !== 'new' && typeof popoverState.openFor === 'number') {
            update(popoverState.openFor, doc);
        } else {
            append(doc);
        }
        setPopoverState({ openFor: null, anchorEl: null });
    };
    
    const handleToggleDescription = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        if (activeDescription?.index === index) {
            setActiveDescription(null);
        } else {
            setActiveDescription({ index, anchorEl: event.currentTarget });
        }
    }

    const docTypeLabel = (typeKey: string) => {
        const id = `docForm.type.option.${typeKey}`;
        return t(id);
    }


    return (
        <div className="border-t pt-5 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{t('documents.title')}</h3>
                <button type="button" onClick={(e) => handleOpenPopover(e, 'new')} className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                    {t('documents.add')}
                </button>
            </div>
            <div className="space-y-3">
                {fields.length > 0 ? fields.map((field, index) => {
                    const doc = field as Document;
                    return (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                            <div className="flex items-center gap-3 flex-grow min-w-0">
                                {getFileIcon(doc.fileFormat)}
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-gray-800 truncate">{doc.fileName}</span>
                                    <span className="text-sm text-gray-500">{docTypeLabel(doc.type)}</span>
                                </div>
                                {doc.description && (
                                    <div className="relative">
                                        <button type="button" onClick={(e) => handleToggleDescription(e, index)}>
                                            <InfoIcon className="w-5 h-5 text-gray-400" />
                                        </button>
                                        {activeDescription?.index === index && (
                                            <div ref={popoverRef} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-3 text-sm text-white bg-gray-900/90 rounded-md shadow-lg z-20 backdrop-blur-sm">
                                                {doc.description}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button type="button" onClick={(e) => handleOpenPopover(e, index)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-200 transition-colors"><EditIcon className="w-5 h-5"/></button>
                                <button type="button" onClick={() => remove(index)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-200 transition-colors"><DeleteIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    );
                }) : <p className="text-center text-gray-500 text-sm py-2">{t('documents.notFound')}</p>}
            </div>
             
             {popoverState.openFor !== null && (
                 <DocumentPopoverForm
                    isOpen={popoverState.openFor !== null}
                    onClose={() => setPopoverState({ openFor: null, anchorEl: null })}
                    onSave={handleSaveDocument}
                    documentToEdit={popoverState.openFor !== 'new' ? fields[popoverState.openFor] as Document : null}
                    personType={personType}
                    anchorEl={popoverState.anchorEl}
                />
             )}
        </div>
    );
}


const PersonForm: React.FC<PersonFormProps> = ({ personId, onBack, onSave, isSidebarCollapsed }) => {
  const { t } = useI18n();
  const { register, handleSubmit, reset, watch, formState: { errors }, control } = useForm<PersonFormData>();
  
  const { data: personToEdit, isLoading, isError } = useQuery({
    queryKey: ['person', personId],
    queryFn: () => api.getPersonById(personId!),
    enabled: !!personId,
  });

  const inFormActionsRef = useRef<HTMLDivElement>(null);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            setIsStickyBarVisible(!entry.isIntersecting);
        },
        { root: null, threshold: 0 }
    );
    const currentRef = inFormActionsRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
        if (currentRef) observer.unobserve(currentRef);
    };
  }, [isLoading]);


  const personType = watch('personType', personToEdit?.personType || 'REAL');

  useEffect(() => {
    if (personId && personToEdit) {
      reset(personToEdit);
    } else if (!personId) {
      reset(defaultValues);
    }
  }, [personId, personToEdit, reset]);
  
  const processData = (data: PersonFormData) => {
    return data;
  };
  
  const handleSave: SubmitHandler<PersonFormData> = (data) => {
     const dataToSave = processData(data);
     if (personId) {
      onSave({ ...dataToSave, id: personId } as Person);
    } else {
      onSave(dataToSave as Omit<Person, 'id'>);
    }
  };

  const handleSaveAndNew: SubmitHandler<PersonFormData> = (data) => {
    const dataToSave = processData(data);
    onSave(dataToSave as Omit<Person, 'id'>, { stayOnPage: true });
    reset(defaultValues);
  };
  
  const translatedOptions = useMemo(() => ({
      genders: (['MALE', 'FEMALE'] as const).map(g => ({ value: g, label: t(`enum.gender.${g}`) })),
      orgRoles: OrganizationRoles.map(r => ({ value: r, label: t(`enum.orgRole.${r}`) })),
      legalEntityTypes: LegalEntityTypes.map(entityType => ({ value: entityType, label: t(`enum.legalEntityType.${entityType}`) })),
  }), [t]);
  
  const actionButtonsGroup = (
      <div className="flex justify-end space-x-4 space-x-reverse">
          <Button type="button" onClick={onBack} variant="secondary">
              {t('general.button.cancel')}
          </Button>
          {personId ? (
              <Button type="button" onClick={handleSubmit(handleSave)} disabled={isLoading}>
                  {t('serviceDetail.button.saveChanges')}
              </Button>
          ) : (
              <>
                  <Button type="button" onClick={handleSubmit(handleSaveAndNew)} variant="success">
                      {t('personForm.button.createAndNew')}
                  </Button>
                  <Button type="button" onClick={handleSubmit(handleSave)}>
                      {t('serviceDetail.button.create')}
                  </Button>
              </>
          )}
      </div>
  );

  const renderFormContent = () => {
    if (isLoading && personId) {
      return <SkeletonForm />;
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
        <>
            <div className="space-y-5">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">{t('personForm.label.personType')}</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200 rounded-xl">
                   <Controller
                      name="personType"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <>
                          <button type="button" onClick={() => field.onChange('REAL')} className={`px-3 py-2 rounded-lg text-center font-semibold transition-all text-base ${field.value === 'REAL' ? 'bg-white shadow' : 'text-gray-600'}`}>
                            {t('enum.personType.REAL')}
                          </button>
                          <button type="button" onClick={() => field.onChange('LEGAL')} className={`px-3 py-2 rounded-lg text-center font-semibold transition-all text-base ${field.value === 'LEGAL' ? 'bg-white shadow' : 'text-gray-600'}`}>
                            {t('enum.personType.LEGAL')}
                          </button>
                        </>
                      )}
                   />
                </div>
              </div>

              {personType === 'REAL' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label={t("personForm.label.firstName")} id="firstName" error={errors.firstName} {...register("firstName", { required: t("personForm.error.firstNameRequired") })} />
                    <Input label={t("personForm.label.lastName")} id="lastName" error={errors.lastName} {...register("lastName", { required: t("personForm.error.lastNameRequired") })} />
                  </div>
                  <Input label={t("personForm.label.nationalId")} id="nationalId" error={errors.nationalId} {...register("nationalId", { required: t("personForm.error.nationalIdRequired"), pattern: { value: /^[0-9]{10}$/, message: t("personForm.error.nationalIdPattern") } })} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Controller name="birthDate" control={control} render={({ field }) => <CustomDatePicker labelId="personForm.label.birthDate" value={field.value} onChange={field.onChange} />} />
                     <Controller name="gender" control={control} render={({ field }) => <CustomSelect label={t("personForm.label.gender")} options={translatedOptions.genders} value={field.value} onChange={field.onChange} />} />
                  </div>
                </>
              ) : ( 
                <>
                   <Input label={t("personForm.label.legalName")} id="name" error={errors.name} {...register("name", { required: t("personForm.error.legalNameRequired") })} />
                   <Input label={t("personForm.label.legalNationalId")} id="nationalId" error={errors.nationalId} {...register("nationalId", { required: t("personForm.error.legalNationalIdRequired"), pattern: { value: /^[0-9]{11}$/, message: t("personForm.error.legalNationalIdPattern") } })} />
                   <Controller name="registrationDate" control={control} render={({ field }) => <CustomDatePicker labelId="personForm.label.regDate" value={field.value} onChange={field.onChange} />} />
                   <Controller name="legalEntityType" control={control} render={({ field }) => <CustomSelect label={t("personForm.label.legalEntityType")} options={translatedOptions.legalEntityTypes} value={field.value} onChange={field.onChange} />} />
                </>
              )}
            </div>

            <div className="border-t pt-5 mt-5 space-y-5">
              <Controller
                name="organizationRole"
                control={control}
                rules={{ required: t("personForm.error.orgRoleRequired") }}
                render={({ field, fieldState }) => <CustomSelect error={fieldState.error} label={t("personForm.label.orgRole")} options={translatedOptions.orgRoles} value={field.value} onChange={field.onChange} />}
              />
              <Controller name="financialYearStart" control={control} render={({ field }) => <CustomDatePicker labelId="personForm.label.financialYearStart" value={field.value} onChange={field.onChange} />} />
              <Input label={t("personForm.label.email")} id="email" type="email" error={errors.email} {...register("email", { pattern: { value: /^\S+@\S+$/i, message: t("personForm.error.emailPattern") } })} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t("personForm.label.mobile")} id="mobile" type="tel" {...register("mobile")} />
                <Input label={t("personForm.label.landline")} id="landline" type="tel" {...register("landline")} />
              </div>
              <TextArea label={t('personForm.label.address')} id="address" {...register("address")} />
              <Input label={t("personForm.label.postalCode")} id="postalCode" {...register("postalCode")} />
              <TextArea label={t('personForm.label.description')} id="description" {...register("description")} />
            </div>
            
            <DocumentList control={control} personType={personType} />
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
                {t(personId ? 'personForm.title.edit' : 'personForm.title.add')}
              </h1>
            </div>
            
            {renderFormContent()}

            <div ref={inFormActionsRef} className="border-t pt-6 mt-6">
              {actionButtonsGroup}
            </div>
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

export default PersonForm;