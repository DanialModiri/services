import React, { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
// FIX: Corrected react-hook-form imports by using the 'type' keyword for type-only imports.
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import { Document, PersonType, FileFormat } from '../../types';
import CustomSelect from './CustomSelect';

interface DocumentPopoverFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (document: Document) => void;
    documentToEdit: Document | null | undefined;
    personType: PersonType;
    anchorEl: HTMLElement | null;
}

type DocumentFormData = {
    type: string;
    description: string;
    file: FileList | null;
}

const getFileFormat = (fileName: string): FileFormat => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) return 'image';
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension || '')) return 'docx';
    return 'other';
};

const DocumentPopoverForm: React.FC<DocumentPopoverFormProps> = ({ isOpen, onClose, onSave, documentToEdit, personType, anchorEl }) => {
    const { t } = useI18n();
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<DocumentFormData>();
    const popoverRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: -9999, left: 0, width: 300, transformOrigin: 'top center' });

    const documentTypes = useMemo(() => {
        const keys = personType === 'REAL' 
            ? ['personalPhoto', 'other']
            : ['registrationDocs', 'other'];
        return keys.map(key => ({
            value: key,
            label: t(`docForm.type.option.${key}`)
        }));
    }, [personType, t]);
    
    useEffect(() => {
        if(isOpen) {
            if (documentToEdit) {
                reset({ type: documentToEdit.type, description: documentToEdit.description, file: null });
            } else {
                reset({ type: documentTypes[0].value, description: '', file: null });
            }
        }
    }, [isOpen, documentToEdit, reset, documentTypes]);
    
    useLayoutEffect(() => {
        if (anchorEl && popoverRef.current) {
            const rect = anchorEl.getBoundingClientRect();
            const popoverHeight = popoverRef.current.offsetHeight;
            const popoverWidth = Math.max(300, rect.width);
            const margin = 8;

            let newTop;
            let newTransformOrigin = 'top center';
            
            if (rect.bottom + popoverHeight + margin > window.innerHeight && rect.top - popoverHeight - margin > 0) {
                newTop = rect.top - popoverHeight - margin;
                newTransformOrigin = 'bottom center';
            } else {
                newTop = rect.bottom + margin;
            }

            setPosition({
                top: newTop,
                left: rect.left + (rect.width / 2) - (popoverWidth / 2),
                width: popoverWidth,
                transformOrigin: newTransformOrigin
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
        
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const onSubmit: SubmitHandler<DocumentFormData> = (data) => {
        const file = data.file?.[0];
        if (!file && !documentToEdit) return; // File is required for new documents
        
        const newDoc: Document = {
            id: documentToEdit?.id || new Date().toISOString(),
            type: data.type,
            description: data.description,
            fileName: file ? file.name : (documentToEdit?.fileName || 'unknown'),
            fileFormat: file ? getFileFormat(file.name) : (documentToEdit?.fileFormat || 'other'),
            file: file
        };
        onSave(newDoc);
    };

    if (!isOpen) return null;

    return createPortal(
        <div 
          ref={popoverRef}
          className="fixed z-50"
          style={{ 
            top: `${position.top}px`, 
            left: `${position.left}px`,
            width: `${position.width}px`,
          }}
        >
            <div className="bg-white rounded-2xl shadow-2xl border w-full animate-scale-in" style={{transformOrigin: position.transformOrigin}}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-bold text-gray-800">
                            {t(documentToEdit ? 'docForm.title.edit' : 'docForm.title.add')}
                        </h2>
                    </div>
                    <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: t('docForm.error.typeRequired') }}
                            render={({ field, fieldState }) => (
                                <CustomSelect 
                                    label={t('docForm.label.type')} 
                                    options={documentTypes} 
                                    value={field.value} 
                                    onChange={field.onChange}
                                    error={fieldState.error}
                                />
                            )}
                        />
                         <div>
                            <label htmlFor="description-popover" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('docForm.label.description')}
                            </label>
                            <textarea
                                id="description-popover"
                                {...register("description")}
                                rows={2}
                                className="w-full text-base px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="file-upload-popover" className="block text-sm font-medium text-gray-700 mb-1.5">
                                {t('docForm.label.file')}
                            </label>
                            <input 
                                type="file" 
                                id="file-upload-popover"
                                {...register("file", { required: !documentToEdit })}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                             {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>}
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-b-2xl flex justify-end space-x-2 space-x-reverse">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                            {t('general.button.cancel')}
                        </button>
                        <button type="submit" className="py-2 px-4 bg-blue-600 border border-transparent rounded-lg font-medium text-white hover:bg-blue-700 transition-colors text-sm">
                            {t('general.button.save')}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes scale-and-fade-in {
                    0% { opacity: 0; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in { animation: scale-and-fade-in 0.15s ease-out; }
            `}</style>
        </div>,
        document.body
    );
};

export default DocumentPopoverForm;