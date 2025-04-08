import { NextResponse } from 'next/server';

// Standard error codes
export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

// Error response interface
export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
}

// Success response interface for consistent formatting
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

// Create standardized error response
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  details?: unknown,
  status = 500
): NextResponse<ErrorResponse> {
  const errorBody: ErrorResponse = {
    success: false,
    error: {
      code,
      message
    }
  };
  
  // Add details only if provided
  if (details !== undefined) {
    errorBody.error.details = details;
  }
  
  return NextResponse.json(errorBody, { status });
}

// Create standardized success response
export function createSuccessResponse<T>(
  data: T,
  status = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data
    },
    { status }
  );
}

// Common error handlers
export const errorHandlers = {
  badRequest: (message: string, details?: unknown) => 
    createErrorResponse(ErrorCode.BAD_REQUEST, message, details, 400),
  
  notFound: (message: string, details?: unknown) => 
    createErrorResponse(ErrorCode.NOT_FOUND, message, details, 404),
  
  internalError: (message: string, details?: unknown) => 
    createErrorResponse(ErrorCode.INTERNAL_ERROR, message, details, 500),
  
  validationError: (message: string, details?: unknown) => 
    createErrorResponse(ErrorCode.VALIDATION_ERROR, message, details, 422)
}; 