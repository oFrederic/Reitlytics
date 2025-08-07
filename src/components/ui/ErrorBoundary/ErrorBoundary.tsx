/**
 * Error Boundary Component
 * 
 * React error boundary for graceful error handling and user-friendly
 * error displays when components fail to render.
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { UI_TEXT } from '@/constants/ui';
import { logError, createErrorBoundaryInfo } from '@/utils/errors';
import { Button } from '../Button/Button';
import { ButtonVariant } from '@/types/ui';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({
  error,
  errorInfo,
  onRetry,
  showDetails = false,
}: {
  error?: Error;
  errorInfo?: ErrorInfo;
  onRetry: () => void;
  showDetails?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-gray-50 rounded-lg border border-gray-200">
      {/* Error icon */}
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      {/* Error message */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {UI_TEXT.ERROR_OCCURRED}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        申し訳ございませんが、予期しないエラーが発生しました。
        ページを再読み込みするか、しばらく待ってから再試行してください。
      </p>

      {/* Action buttons */}
      <div className="flex space-x-3">
        <Button variant={ButtonVariant.PRIMARY} onClick={onRetry}>
          再試行
        </Button>
        <Button 
          variant={ButtonVariant.SECONDARY} 
          onClick={() => window.location.reload()}
        >
          ページを再読み込み
        </Button>
      </div>

      {/* Error details (development only) */}
      {showDetails && error && (
        <details className="mt-6 w-full max-w-2xl">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            エラー詳細 (開発用)
          </summary>
          <div className="mt-2 p-4 bg-gray-100 rounded border text-sm">
            <div className="mb-2">
              <strong>エラー:</strong> {error.name}
            </div>
            <div className="mb-2">
              <strong>メッセージ:</strong> {error.message}
            </div>
            {error.stack && (
              <div className="mb-2">
                <strong>スタックトレース:</strong>
                <pre className="mt-1 text-xs overflow-auto whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </div>
            )}
            {errorInfo?.componentStack && (
              <div>
                <strong>コンポーネントスタック:</strong>
                <pre className="mt-1 text-xs overflow-auto whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  );
}

/**
 * Error Boundary Component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    const errorDetails = createErrorBoundaryInfo(error, { 
      componentStack: errorInfo.componentStack || 'No component stack available' 
    });
    logError(error, errorDetails);

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className={this.props.className}>
          <DefaultErrorFallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            showDetails={this.props.showDetails}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for catching async errors in functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error; // This will be caught by the error boundary
    }
  }, [error]);

  return React.useCallback((error: Error) => {
    setError(error);
  }, []);
}

export default ErrorBoundary;