import buildings from '@/mocks/buildings.json';
import type { JReitData } from '@/mocks/buildings.type';
import { errorHandlers, createSuccessResponse } from '../../utils/error-handler';

// Define the structure of the buildings.json file
interface BuildingsFile {
  data: JReitData;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    const data = (buildings as BuildingsFile).data;
    
    if (!query) {
      return errorHandlers.badRequest('Search query parameter is required');
    }
    
    // Search buildings by name and address
    const searchResults = data.jReitBuildings.filter((building) => {
      const buildingName = building.buildingSpec.name.toLowerCase();
      const buildingAddress = building.buildingSpec.address.toLowerCase();
      
      return buildingName.includes(query) || buildingAddress.includes(query);
    });
    
    return createSuccessResponse({ 
      results: searchResults,
      count: searchResults.length,
      query
    });
  } catch (error) {
    console.error('Error searching buildings:', error);
    return errorHandlers.internalError(
      'Failed to search buildings',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
} 