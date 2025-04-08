// Import mock data
import mockBuildingsData from '@/mocks/__mocks__/buildings.json';

// Auto-mock the buildings.json import
jest.mock('@/mocks/buildings.json', () => mockBuildingsData, { virtual: true });

import { GET } from '../route';
import { createMockRequestWithParams } from '@/test-utils/test-helpers';

describe('Building Types API Route', () => {
  it('should filter buildings by office type', async () => {
    const request = createMockRequestWithParams('http://localhost:3000/api/buildings/types', { type: 'office' });
    
    const response = await GET(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.buildings).toHaveLength(1);
    expect(data.data.count).toBe(1);
    expect(data.data.assetType).toBe('office');
    expect(data.data.buildings[0].id).toBe('test-id-1');
  });
  
  it('should filter buildings by retail type', async () => {
    const request = createMockRequestWithParams('http://localhost:3000/api/buildings/types', { type: 'retail' });
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.data.buildings).toHaveLength(1);
    expect(data.data.buildings[0].id).toBe('test-id-2');
  });
  
  it('should filter buildings by hotel type', async () => {
    const request = createMockRequestWithParams('http://localhost:3000/api/buildings/types', { type: 'hotel' });
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.data.buildings).toHaveLength(1);
    expect(data.data.buildings[0].id).toBe('test-id-3');
  });
  
  it('should return validation error for invalid asset type', async () => {
    const request = createMockRequestWithParams('http://localhost:3000/api/buildings/types', { type: 'invalid' });
    
    const response = await GET(request);
    expect(response.status).toBe(422);
    
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('VALIDATION_ERROR');
    expect(data.error.details).toBeDefined();
  });
  
  it('should return bad request error when no type is provided', async () => {
    const request = createMockRequestWithParams('http://localhost:3000/api/buildings/types', {});
    
    const response = await GET(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('BAD_REQUEST');
  });
}); 