/**
 * Explicitly declare Jest globals for TypeScript
 */

// These declarations help TypeScript recognize Jest's global functions
declare global {
  // Jest globals
  const expect: jest.Expect;
  const jest: typeof import('jest');
  const describe: jest.Describe;
  const it: jest.It;
  const test: jest.It;
  const beforeAll: jest.Lifecycle;
  const beforeEach: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
}

export {}; 