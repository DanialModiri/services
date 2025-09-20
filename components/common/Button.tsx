import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

const baseClasses = "rounded-xl font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center flex-shrink-0";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20",
  secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100",
  success: "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-500/20",
  ghost: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "py-2 px-4 text-sm",
  md: "py-2.5 px-5 text-base",
  lg: "py-3 px-8 text-lg"
};


// FIX: Wrapped Button component in React.forwardRef to allow passing a ref to it.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, variant = 'primary', size = 'md', icon, className = '', ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && <span className="ml-2">{icon}</span>}
      <span>{children}</span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;