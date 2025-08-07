/**
 * Button Component
 * 
 * Reusable button component with consistent styling and behavior
 * following design system patterns for the entire application.
 */

import { forwardRef } from 'react';
import type { ButtonProps } from '@/types/ui';
import { ButtonVariant, ButtonSize } from '@/types/ui';
import { cn } from '@/utils/styles';

// Button variant styles
const buttonVariants = {
  [ButtonVariant.PRIMARY]: 
    'bg-blue-500 hover:bg-blue-600 text-white shadow-sm',
  [ButtonVariant.SECONDARY]: 
    'bg-gray-200 hover:bg-gray-300 text-gray-900',
  [ButtonVariant.DANGER]: 
    'bg-red-500 hover:bg-red-600 text-white shadow-sm',
  [ButtonVariant.GHOST]: 
    'bg-transparent hover:bg-gray-100 text-gray-700',
};

// Button size styles
const buttonSizes = {
  [ButtonSize.SMALL]: 'px-3 py-1.5 text-sm',
  [ButtonSize.MEDIUM]: 'px-4 py-2 text-base',
  [ButtonSize.LARGE]: 'px-6 py-3 text-lg',
};

// Base button styles
const baseStyles = [
  'inline-flex',
  'items-center',
  'justify-center',
  'font-medium',
  'rounded-md',
  'border',
  'border-transparent',
  'transition-all',
  'duration-200',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-2',
  'focus:ring-blue-500',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
];

/**
 * Button component with configurable variants and sizes
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = ButtonVariant.PRIMARY,
      size = ButtonSize.MEDIUM,
      disabled = false,
      loading = false,
      className,
      onClick,
      type = 'button',
      'data-testid': testId,
      ...props
    },
    ref
  ) => {
    const handleClick: ButtonProps['onClick'] = (event) => {
      if (disabled || loading) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          ...baseStyles,
          buttonVariants[variant],
          buttonSizes[size],
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        data-testid={testId}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;