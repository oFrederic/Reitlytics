// Import mock data
import mockBuildingsData from '@/mocks/__mocks__/buildings.json';

// Auto-mock the buildings.json import
jest.mock('@/mocks/buildings.json', () => mockBuildingsData, { virtual: true });

import { GET } from '../route';

describe('Buildings API Route', () => {
  it('should return a 200 status code', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it('should return a success response with buildings data', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data.jReitBuildings)).toBe(true);
    expect(data.data.jReitBuildings.length).toBe(mockBuildingsData.data.jReitBuildings.length);
  });

  it('should have the correct building data', async () => {
    const response = await GET();
    const data = await response.json();
    
    const buildings = data.data.jReitBuildings;
    expect(buildings[0].id).toBe('test-id-1');
    expect(buildings[0].buildingSpec.name).toBe('Test Building 1');
    expect(buildings[1].id).toBe('test-id-2');
    expect(buildings[1].buildingSpec.address).toBe('Osaka, Japan');
  });
}); 