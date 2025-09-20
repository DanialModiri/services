import React, { useEffect, useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import Button from './Button';
import { WarningIcon } from '../icons/FeedbackIcons';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText,
  cancelText
}) => {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
        const timer = setTimeout(() => setShow(true), 10);
        return () => clearTimeout(timer);
    } else {
        setShow(false);
    }
  }, [isOpen]);

  const handleTransitionEnd = () => {
      // This could be used to remove the component from the DOM after fade-out
      // but our provider logic already handles that.
  };

  if (!isOpen && !show) return null;

  return (
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
        role="dialog"
        aria-modal="true"
        onTransitionEnd={handleTransitionEnd}
    >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} aria-hidden="true"></div>
        
        <div 
            className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200/80 transition-all duration-300 transform ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
            <div className="p-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                        <WarningIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                            {title || t('confirmDialog.defaultTitle')}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end space-x-3 space-x-reverse">
                <Button onClick={onCancel} variant="secondary">
                    {cancelText || t('confirmDialog.cancelButton')}
                </Button>
                <Button onClick={onConfirm} variant="danger">
                    {confirmText || t('confirmDialog.deleteButton')}
                </Button>
            </div>
        </div>
    </div>
  );
};

export default ConfirmDialog;
