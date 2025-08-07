/**
 * Loading Component
 * 
 * Reusable loading indicators and skeleton components
 * for consistent loading states across the application.
 */

import { cn } from '@/utils/styles';
import { UI_TEXT } from '@/constants/ui';
import type { BaseComponentProps } from '@/types/ui';

// Loading spinner variants
export enum LoadingVariant {
  SPINNER = 'spinner',
  DOTS = 'dots',
  PULSE = 'pulse',
  SKELETON = 'skeleton',
}

// Loading sizes
export enum LoadingSize {
  SMALL = 'sm',
  MEDIUM = 'md', 
  LARGE = 'lg',
}

interface LoadingProps extends BaseComponentProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  text?: string;
  inline?: boolean;
}

// Size classes for different variants
const spinnerSizes = {
  [LoadingSize.SMALL]: 'h-4 w-4',
  [LoadingSize.MEDIUM]: 'h-6 w-6',
  [LoadingSize.LARGE]: 'h-8 w-8',
};

const textSizes = {
  [LoadingSize.SMALL]: 'text-xs',
  [LoadingSize.MEDIUM]: 'text-sm',
  [LoadingSize.LARGE]: 'text-base',
};

/**
 * Spinner loading component
 */
function SpinnerLoading({ size = LoadingSize.MEDIUM, className }: {
  size?: LoadingSize;
  className?: string;
}) {
  return (
    <svg
      className={cn(
        'animate-spin text-blue-500',
        spinnerSizes[size],
        className
      )}
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
  );
}

/**
 * Dots loading component
 */
function DotsLoading({ size = LoadingSize.MEDIUM, className }: {
  size?: LoadingSize;
  className?: string;
}) {
  const dotSize = {
    [LoadingSize.SMALL]: 'h-1.5 w-1.5',
    [LoadingSize.MEDIUM]: 'h-2 w-2',
    [LoadingSize.LARGE]: 'h-3 w-3',
  }[size];

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-blue-500 rounded-full animate-bounce',
            dotSize
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Pulse loading component
 */
function PulseLoading({ size = LoadingSize.MEDIUM, className }: {
  size?: LoadingSize;
  className?: string;
}) {
  const pulseSize = {
    [LoadingSize.SMALL]: 'h-4 w-16',
    [LoadingSize.MEDIUM]: 'h-6 w-24',
    [LoadingSize.LARGE]: 'h-8 w-32',
  }[size];

  return (
    <div className={cn('animate-pulse bg-gray-200 rounded', pulseSize, className)} />
  );
}

/**
 * Skeleton loading component
 */
function SkeletonLoading({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse space-y-2', className)}>
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

/**
 * Main Loading component
 */
export function Loading({
  variant = LoadingVariant.SPINNER,
  size = LoadingSize.MEDIUM,
  text = UI_TEXT.LOADING,
  inline = false,
  className,
  children,
  ...props
}: LoadingProps) {
  const containerClasses = inline
    ? 'inline-flex items-center space-x-2'
    : 'flex flex-col items-center justify-center space-y-2 p-4';

  const renderLoading = () => {
    switch (variant) {
      case LoadingVariant.DOTS:
        return <DotsLoading size={size} />;
      case LoadingVariant.PULSE:
        return <PulseLoading size={size} />;
      case LoadingVariant.SKELETON:
        return <SkeletonLoading />;
      case LoadingVariant.SPINNER:
      default:
        return <SpinnerLoading size={size} />;
    }
  };

  return (
    <div className={cn(containerClasses, className)} {...props}>
      {renderLoading()}
      {text && variant !== LoadingVariant.SKELETON && (
        <p className={cn('text-gray-600', textSizes[size])}>
          {text}
        </p>
      )}
      {children}
    </div>
  );
}

/**
 * Loading overlay component
 */
export function LoadingOverlay({
  loading,
  children,
  variant = LoadingVariant.SPINNER,
  size = LoadingSize.MEDIUM,
  text = UI_TEXT.LOADING,
  className,
}: {
  loading: boolean;
  children: React.ReactNode;
  variant?: LoadingVariant;
  size?: LoadingSize;
  text?: string;
  className?: string;
}) {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div className={cn('relative', className)}>
      {/* Overlay background */}
      <div className="absolute inset-0 bg-white/75 backdrop-blur-sm z-10 flex items-center justify-center">
        <Loading variant={variant} size={size} text={text} />
      </div>
      {/* Content (dimmed) */}
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export default Loading;