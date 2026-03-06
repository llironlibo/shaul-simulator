
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = "font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500 shadow-md hover:shadow-lg",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-brand-500 shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-brand-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
