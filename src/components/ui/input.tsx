import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-pink-500 focus:ring-2 focus:ring-opacity-50 ${className}`}
      {...props}
    />
  ),
);

Input.displayName = 'Input';