/**
 * Style utilities
 * 
 * Utility functions for working with CSS classes and styling,
 * including class name concatenation and conditional styling.
 */

import { clsx, type ClassValue } from 'clsx';

/**
 * Combine class names with proper handling of conditionals
 * This is a wrapper around clsx for consistent usage
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Create conditional class names based on state
 */
export function conditionalClass(
  baseClass: string,
  condition: boolean,
  conditionalClass: string
): string {
  return cn(baseClass, condition && conditionalClass);
}

/**
 * Create variant-based class names
 */
export function variantClass<T extends Record<string, string>>(
  variants: T,
  variant: keyof T,
  baseClass?: string
): string {
  return cn(baseClass, variants[variant]);
}

/**
 * Create responsive class names
 */
export function responsiveClass(classes: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}): string {
  return cn(
    classes.base,
    classes.sm && `sm:${classes.sm}`,
    classes.md && `md:${classes.md}`,
    classes.lg && `lg:${classes.lg}`,
    classes.xl && `xl:${classes.xl}`
  );
}

/**
 * Create size-based class names
 */
export function sizeClass<T extends Record<string, string>>(
  sizes: T,
  size: keyof T
): string {
  return sizes[size] || '';
}

/**
 * Merge component props with default classes
 */
export function mergeProps<T extends { className?: string }>(
  defaultProps: T,
  userProps: Partial<T>
): T {
  return {
    ...defaultProps,
    ...userProps,
    className: cn(defaultProps.className, userProps.className),
  };
}