import React from 'react';
import { FieldError } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: FieldError;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, containerClassName = '', ...props }, ref) => {
    return (
      <div className={containerClassName}>
        <label htmlFor={id} className="block text-base font-medium text-gray-700 mb-1.5">{label}</label>
        <input
          id={id}
          ref={ref}
          {...props}
          className={`w-full px-4 py-2.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors text-base`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
