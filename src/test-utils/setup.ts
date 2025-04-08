import { NextRequest } from 'next/server';

// Set up global objects for tests
// @ts-expect-error - Necessary for API route testing
global.Request = NextRequest as unknown as typeof Request;
global.Response = Response;
global.Headers = Headers;

// Ensure URL and URLSearchParams are available
global.URL = URL;
global.URLSearchParams = URLSearchParams; 