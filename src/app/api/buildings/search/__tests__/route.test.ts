// Import mock data
import mockBuildingsData from '@/mocks/__mocks__/buildings.json';

// Auto-mock the buildings.json import
jest.mock('@/mocks/buildings.json', () => mockBuildingsData, { virtual: true });

import { GET } from '../route';
import { createMockRequestWithParams } from '@/test-utils/test-helpers';

describe('Building Search API Route', () => {
  it('should search buildings by name', async () => {
    const request = createMockRequestWithParams('http://localhost:3000/api/buildings/search', { q: 'test building 1' });
    
    const response = await GET(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.results).toHaveLength(1);
    expect(data.data.count).toBe(1);
    expect(data.data.results[0].id).toBe('test-id-1');
  });
  
  it('should search buildings by address', async () => {
    const request = createMockRequestWithParams('http://localhost:3000/api/buildings/search', { q: 'tokyo' });
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.data.results).toHaveLength(2);
    expect(data.data.count).toBe(2);
    
    // Should match both Tokyo-related buildings (Test Building 1 and Shibuya Mall)
    const ids = data.data.results.map((b: { id: string }) => b.id).sort();
    expect(ids).toEqual(['test-id-1', 'test-id-3'].sort());
  });
  
  it('should be case insensitive', async () => {
    const request = createMockRequestWithParams('http://localhost:3000/api/buildings/search', { q: 'OSAKA' });
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.data.results).toHaveLength(1);
    expect(data.data.results[0].id).toBe('test-id-2');
  });
  
  it('should return bad request error when no query is provided', async () => {
    const request = createMockRequestWithParams('http://localhost:3000/api/buildings/search', {});
    
    const response = await GET(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('BAD_REQUEST');
  });
  
  it('should return empty results when no match is found', async () => {
    const request = createMockRequestWithParams('http://localhost:3000/api/buildings/search', { q: 'nonexistent' });
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data.results).toHaveLength(0);
    expect(data.data.count).toBe(0);
  });
}); 