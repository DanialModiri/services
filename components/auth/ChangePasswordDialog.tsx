import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
// FIX: Corrected react-hook-form imports by using the 'type' keyword for type-only imports.
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../hooks/useAuth';
import * as api from '../../api/apiService';
import { useNotifier } from '../../hooks/useNotifier';
import Input from '../common/Input';
import Button from '../common/Button';
import { CheckIcon } from '../icons/AppleIcons';
import { CloseIcon } from '../icons/FeedbackIcons';

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChangePasswordFormInputs = {
  currentPassword_sent: string;
  newPassword_sent: string;
  confirmNewPassword_sent: string;
};

const PasswordChecklistItem: React.FC<{ text: string; isValid: boolean }> = ({ text, isValid }) => (
    <li className={`flex items-center text-sm transition-colors ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
        <CheckIcon className={`w-4 h-4 ml-2 p-0.5 rounded-full ${isValid ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`} />
        <span>{text}</span>
    </li>
);

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const { notify } = useNotifier();
  const { register, handleSubmit, formState: { errors, isValid }, watch, reset, setError } = useForm<ChangePasswordFormInputs>({
      mode: 'onChange'
  });

  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newPassword = watch('newPassword_sent', '');

  const passwordChecks = useMemo(() => {
    return {
        length: newPassword.length >= 8,
        number: /\d/.test(newPassword),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };
  }, [newPassword]);

  useEffect(() => {
    if (isOpen) {
        const timer = setTimeout(() => setShow(true), 10);
        return () => clearTimeout(timer);
    } else {
        setShow(false);
    }
  }, [isOpen]);

  const handleClose = () => {
      reset();
      onClose();
  };
  
  const handleTransitionEnd = () => {
    if (!isOpen) {
        reset();
    }
  };

  const onSubmit: SubmitHandler<ChangePasswordFormInputs> = async (data) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
        await api.changePassword(user.id, data.currentPassword_sent, data.newPassword_sent);
        notify(t('changePasswordDialog.notification.success'), 'success');
        handleClose();
    } catch (error) {
        console.log(error);
        if (error instanceof Error && error.message.includes('Incorrect current password')) {
             setError('currentPassword_sent', { type: 'manual', message: t('changePasswordDialog.error.currentPasswordIncorrect') });
        } else {
            notify(t('changePasswordDialog.notification.error'), 'error');
        }
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (!isOpen && !show) return null;

  return createPortal(
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
        role="dialog"
        aria-modal="true"
        onTransitionEnd={handleTransitionEnd}
    >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} aria-hidden="true"></div>
        
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200/80 transition-all duration-300 transform ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        >
             <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-bold text-gray-900">
                    {t('changePasswordDialog.title')}
                </h3>
                <button type="button" onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100">
                    <CloseIcon className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <div className="p-6 space-y-4">
                 <Input
                    id="currentPassword"
                    label={t('changePasswordDialog.currentPassword')}
                    type="password"
                    error={errors.currentPassword_sent}
                    {...register('currentPassword_sent', { required: t('changePasswordDialog.error.required', { fieldName: t('changePasswordDialog.currentPassword') }) })}
                />
                 <Input
                    id="newPassword"
                    label={t('changePasswordDialog.newPassword')}
                    type="password"
                    error={errors.newPassword_sent}
                    {...register('newPassword_sent', { 
                        required: t('changePasswordDialog.error.required', { fieldName: t('changePasswordDialog.newPassword') }),
                        minLength: { value: 8, message: t('changePasswordDialog.error.minLength')},
                        validate: {
                            hasNumber: v => /\d/.test(v) || t('changePasswordDialog.error.numberRequired'),
                            hasSpecialChar: v => /[!@#$%^&*(),.?":{}|<>]/.test(v) || t('changePasswordDialog.error.specialCharRequired'),
                        }
                    })}
                />
                
                <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('changePasswordDialog.checklist.title')}</h4>
                    <ul className="space-y-1">
                        <PasswordChecklistItem text={t('changePasswordDialog.checklist.length')} isValid={passwordChecks.length} />
                        <PasswordChecklistItem text={t('changePasswordDialog.checklist.number')} isValid={passwordChecks.number} />
                        <PasswordChecklistItem text={t('changePasswordDialog.checklist.specialChar')} isValid={passwordChecks.specialChar} />
                    </ul>
                </div>

                <Input
                    id="confirmNewPassword"
                    label={t('changePasswordDialog.confirmNewPassword')}
                    type="password"
                    error={errors.confirmNewPassword_sent}
                    {...register('confirmNewPassword_sent', { 
                        required: t('changePasswordDialog.error.required', { fieldName: t('changePasswordDialog.confirmNewPassword') }),
                        validate: value => value === newPassword || t('changePasswordDialog.error.passwordsDoNotMatch')
                    })}
                />
            </div>
            
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end space-x-3 space-x-reverse">
                <Button type="button" onClick={handleClose} variant="secondary">
                    {t('general.button.cancel')}
                </Button>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        t('changePasswordDialog.saveButton')
                    )}
                </Button>
            </div>
        </form>
    </div>,
    document.body
  );
};

export default ChangePasswordDialog;