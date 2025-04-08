// Import mock data
import mockBuildingsData from '@/mocks/__mocks__/buildings.json';

// Auto-mock the buildings.json import
jest.mock('@/mocks/buildings.json', () => mockBuildingsData, { virtual: true });

import { GET } from '../route';

describe('Building Stats API Route', () => {
  it('should return correct building stats', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    
    const stats = data.data;
    expect(stats.totalBuildings).toBe(3);
    expect(stats.assetTypes.office).toBe(1);
    expect(stats.assetTypes.retail).toBe(1);
    expect(stats.assetTypes.hotel).toBe(1);
  });
  
  it('should calculate the correct average cap rate', async () => {
    const response = await GET();
    const data = await response.json();
    
    const stats = data.data;
    // Average of 4.5, 5.2, and 3.8 = 4.5
    expect(stats.averageCapRate).toBe('4.50');
  });
}); 