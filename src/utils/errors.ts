/**
 * Error handling utilities
 * 
 * Centralized error handling, logging, and user-friendly error message
 * generation for consistent error management across the application.
 */

import { LOGGING_CONFIG, ENV_CONFIG } from '@/config/environment';
import type { ApiError as ApiErrorType } from '@/types/api';

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Application error class
export class AppError extends Error {
  public readonly code: string;
  public readonly severity: ErrorSeverity;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date();
  }
}

// Network error class
export class NetworkError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'NETWORK_ERROR', ErrorSeverity.HIGH, context);
    this.name = 'NetworkError';
  }
}

// Validation error class
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', ErrorSeverity.LOW, context);
    this.name = 'ValidationError';
  }
}

// API error class
export class ApiError extends AppError {
  public readonly statusCode?: number;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    context?: Record<string, unknown>
  ) {
    super(message, code, ErrorSeverity.MEDIUM, context);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Convert API error response to AppError
 */
export function createErrorFromApiResponse(apiError: ApiErrorType): AppError {
  return new ApiError(
    apiError.message,
    apiError.code,
    undefined,
    apiError.details
  );
}

/**
 * Get user-friendly error message in Japanese
 */
export function getUserFriendlyErrorMessage(error: Error | AppError | string): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof AppError) {
    // Return custom error messages for specific error codes
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'ネットワークエラーが発生しました。接続を確認してください。';
      case 'TIMEOUT_ERROR':
        return 'リクエストがタイムアウトしました。しばらく待ってから再試行してください。';
      case 'VALIDATION_ERROR':
        return error.message; // Validation errors usually have specific messages
      case 'NOT_FOUND':
        return '該当するデータが見つかりません。';
      case 'UNAUTHORIZED':
        return '認証が必要です。';
      case 'FORBIDDEN':
        return 'アクセス権限がありません。';
      case 'INTERNAL_SERVER_ERROR':
        return 'サーバーエラーが発生しました。しばらく待ってから再試行してください。';
      default:
        return error.message || '予期しないエラーが発生しました。';
    }
  }

  // Handle common JavaScript errors
  if (error.name === 'TypeError') {
    return 'データの形式に問題があります。';
  }
  
  if (error.name === 'SyntaxError') {
    return 'データの解析に失敗しました。';
  }

  return error.message || '予期しないエラーが発生しました。';
}

/**
 * Log error with appropriate level and context
 */
export function logError(
  error: Error | AppError | string,
  context?: Record<string, unknown>,
  level: 'error' | 'warn' | 'info' | 'debug' = 'error'
): void {
  if (!LOGGING_CONFIG.ENABLE_CONSOLE) {
    return;
  }

  const errorInfo = {
    message: typeof error === 'string' ? error : error.message,
    code: error instanceof AppError ? error.code : 'UNKNOWN',
    severity: error instanceof AppError ? error.severity : ErrorSeverity.MEDIUM,
    context: {
      ...(error instanceof AppError ? error.context : {}),
      ...context,
    },
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  };

  // Log based on environment and level
  switch (level) {
    case 'error':
      console.error('[ERROR]', errorInfo);
      break;
    case 'warn':
      console.warn('[WARN]', errorInfo);
      break;
    case 'info':
      console.info('[INFO]', errorInfo);
      break;
    case 'debug':
      if (ENV_CONFIG.IS_DEVELOPMENT || LOGGING_CONFIG.LEVEL === 'debug') {
        console.debug('[DEBUG]', errorInfo);
      }
      break;
  }
}

/**
 * Handle async operation with error catching
 */
export async function handleAsync<T>(
  operation: () => Promise<T>,
  errorContext?: Record<string, unknown>
): Promise<[T | null, Error | null]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error) {
    const appError = error instanceof AppError 
      ? error 
      : new AppError(
          error instanceof Error ? error.message : String(error),
          'OPERATION_ERROR',
          ErrorSeverity.MEDIUM,
          errorContext
        );
    
    logError(appError);
    return [null, appError];
  }
}

/**
 * Retry operation with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    retryCondition?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    retryCondition = () => true,
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts || !retryCondition(lastError)) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
        maxDelay
      );

      logError(
        new AppError(
          `Operation failed, retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`,
          'RETRY_ATTEMPT',
          ErrorSeverity.LOW,
          { attempt, delay, originalError: lastError.message }
        ),
        {},
        'warn'
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Create error boundary error info
 */
export function createErrorBoundaryInfo(
  error: Error,
  errorInfo: { componentStack: string }
): Record<string, unknown> {
  return {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    errorInfo: {
      componentStack: errorInfo.componentStack,
    },
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error | AppError): boolean {
  if (error instanceof NetworkError) {
    return true;
  }

  if (error instanceof ApiError) {
    // Retry on server errors but not client errors
    return error.statusCode ? error.statusCode >= 500 : false;
  }

  // Retry on timeout and network-related errors
  return error.message.includes('timeout') || 
         error.message.includes('network') ||
         error.message.includes('fetch');
}

/**
 * Sanitize error for logging (remove sensitive information)
 */
export function sanitizeError(error: Error | AppError): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {
    name: error.name,
    message: error.message,
    timestamp: new Date().toISOString(),
  };

  if (error instanceof AppError) {
    sanitized.code = error.code;
    sanitized.severity = error.severity;
    
    // Sanitize context to remove potentially sensitive data
    if (error.context) {
      sanitized.context = Object.keys(error.context).reduce((acc, key) => {
        const value = error.context![key];
        // Remove sensitive fields
        if (typeof key === 'string' && 
            (key.toLowerCase().includes('password') ||
             key.toLowerCase().includes('token') ||
             key.toLowerCase().includes('secret'))) {
          acc[key] = '[REDACTED]';
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>);
    }
  }

  // Only include stack trace in development
  if (ENV_CONFIG.IS_DEVELOPMENT) {
    sanitized.stack = error.stack;
  }

  return sanitized;
}