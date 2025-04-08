// Import mock data
import mockBuildingsData from '@/mocks/__mocks__/buildings.json';

// Auto-mock the buildings.json import
jest.mock('@/mocks/buildings.json', () => mockBuildingsData, { virtual: true });

import { GET } from '../route';
import { createMockParams, createMockRequest } from '@/test-utils/test-helpers';

describe('Building By ID API Route', () => {
  it('should return a building when a valid ID is provided', async () => {
    const request = createMockRequest();
    const params = createMockParams({ id: 'test-id-1' });
    
    const response = await GET(request, params);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.id).toBe('test-id-1');
    expect(data.data.buildingSpec.name).toBe('Test Building 1');
  });
  
  it('should return 404 when an invalid ID is provided', async () => {
    const request = createMockRequest();
    const params = createMockParams({ id: 'non-existent-id' });
    
    const response = await GET(request, params);
    expect(response.status).toBe(404);
    
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('NOT_FOUND');
    expect(data.error.message).toBe('Building not found');
  });
  
  it('should return 400 when no ID is provided', async () => {
    const request = createMockRequest();
    const params = createMockParams({ id: '' });
    
    const response = await GET(request, params);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('BAD_REQUEST');
    expect(data.error.message).toBe('Building ID is required');
  });
}); 