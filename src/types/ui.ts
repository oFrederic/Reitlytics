/**
 * UI component type definitions
 * 
 * Types for React components, props, and UI-related interfaces
 * to ensure consistent component APIs throughout the application.
 */

import { ReactNode, MouseEventHandler, ChangeEventHandler } from 'react';

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Generic event handlers
export type ClickHandler<T = HTMLElement> = MouseEventHandler<T>;
export type ChangeHandler<T = HTMLInputElement> = ChangeEventHandler<T>;

// Form field validation
export interface FieldValidation {
  isValid: boolean;
  errorMessage?: string;
}

export interface FormValidationState {
  [fieldName: string]: FieldValidation;
}

// Modal/Dialog props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// Button variants and sizes
export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary', 
  DANGER = 'danger',
  GHOST = 'ghost',
}

export enum ButtonSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}

export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: ClickHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
}

// Input field props
export interface InputFieldProps extends BaseComponentProps {
  value: string;
  onChange: ChangeHandler<HTMLInputElement>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  type?: 'text' | 'number' | 'email' | 'password';
}

// Select dropdown props
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps<T = string> extends BaseComponentProps {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
}

// Layout component props
export interface LayoutProps extends BaseComponentProps {
  title?: string;
  description?: string;
}

// Chart component props
export interface ChartProps extends BaseComponentProps {
  height?: number;
  compact?: boolean;
  loading?: boolean;
}

// Map component interfaces
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapCenter {
  latitude: number;
  longitude: number;
}

// Animation and transition props
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
}

// Responsive breakpoint values
export type BreakpointValue<T> = {
  [K in keyof typeof import('@/constants/ui')['BREAKPOINTS']]?: T;
} & {
  base?: T;
};

// Theme and styling
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

// Accessibility props
export interface A11yProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  role?: string;
  tabIndex?: number;
}