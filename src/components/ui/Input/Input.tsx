/**
 * Input Component
 * 
 * Reusable input field component with validation, error states,
 * and consistent styling across the application.
 */

import { forwardRef } from 'react';
import type { InputFieldProps } from '@/types/ui';
import { cn } from '@/utils/styles';

// Input base styles
const baseStyles = [
  'block',
  'w-full',
  'rounded-md',
  'border',
  'px-3',
  'py-2',
  'text-sm',
  'placeholder:text-gray-400',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-2',
  'disabled:bg-gray-50',
  'disabled:text-gray-500',
  'disabled:cursor-not-allowed',
  'transition-colors',
];

// Input variant styles
const inputVariants = {
  default: [
    'border-gray-300',
    'focus:border-blue-500',
    'focus:ring-blue-500',
  ],
  error: [
    'border-red-300',
    'bg-red-50',
    'focus:border-red-500',
    'focus:ring-red-500',
  ],
};

/**
 * Input field component with validation support
 */
export const Input = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      value,
      onChange,
      placeholder,
      disabled = false,
      error = false,
      errorMessage,
      label,
      required = false,
      type = 'text',
      className,
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    const variant = error ? 'error' : 'default';
    const inputId = label ? `input-${Math.random().toString(36).substr(2, 9)}` : undefined;

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-gray-700',
              required && "after:content-['*'] after:ml-0.5 after:text-red-500"
            )}
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            ...baseStyles,
            ...inputVariants[variant],
            className
          )}
          data-testid={testId}
          aria-invalid={error}
          aria-describedby={errorMessage ? `${inputId}-error` : undefined}
          {...props}
        />
        
        {errorMessage && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;