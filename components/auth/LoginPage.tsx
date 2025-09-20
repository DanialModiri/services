import React, { useState } from 'react';
// FIX: Corrected react-hook-form imports by using the 'type' keyword for type-only imports.
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import { useLocation } from '../../lib/router';

type LoginFormInputs = {
  username: string;
  password_sent: string;
};

const LoginPage: React.FC = () => {
  const { t } = useI18n();
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsSubmitting(true);
    setLoginError(null);
    try {
      await login(data.username, data.password_sent);
      setLocation('/app/dashboard');
    } catch (error) {
      console.log(error);
      if (error instanceof Error && error.message.includes('Invalid credentials')) {
        setLoginError(t('login.error.invalidCredentials'));
      } else {
        setLoginError(t('login.error.generic'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-teal-600 mb-2">{t('sidebar.title')}</h1>
            <h2 className="text-2xl font-bold text-gray-800">{t('login.title')}</h2>
            <p className="text-gray-600 mt-2">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/70 backdrop-blur-xl border border-gray-200/80 shadow-lg rounded-2xl p-8 space-y-6">
          <Input
            id="username"
            label={t('login.usernameLabel')}
            type="text"
            error={errors.username}
            {...register('username', { required: true })}
            autoComplete="username"
          />
          <Input
            id="password"
            label={t('login.passwordLabel')}
            type="password"
            error={errors.password_sent}
            {...register('password_sent', { required: true })}
            autoComplete="current-password"
          />
          
          {loginError && <p className="text-sm text-red-600 text-center">{loginError}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              t('login.button')
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;