/**
 * Test utility functions
 */

/**
 * Create a mock request for testing API routes
 */
export function createMockRequest(
  url: string = 'http://localhost:3000',
  method: string = 'GET',
  headers: Record<string, string> = {}
): Request {
  return new Request(url, {
    method,
    headers,
  });
}

/**
 * Create a mock request with search parameters
 */
export function createMockRequestWithParams(
  url: string,
  params: Record<string, string>
): Request {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  
  return createMockRequest(`${url}?${searchParams.toString()}`);
}

/**
 * Create a mock params object for dynamic routes
 */
export function createMockParams<T extends Record<string, string>>(params: T): { params: T } {
  return { params };
} 