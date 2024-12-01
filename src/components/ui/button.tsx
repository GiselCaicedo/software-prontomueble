// src/components/ui/button.tsx
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline';
  className?: string;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    const baseStyles =
      'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50';
    
    const variants = {
      default: 'bg-pink-600 text-white hover:bg-pink-700',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    };

    return (
      <button
        ref={ref}
        type="button" // changed single quote to double quote for JSX attributes
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
