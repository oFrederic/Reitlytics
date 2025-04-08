import buildings from '@/mocks/buildings.json';
import type { JReitData } from '@/mocks/buildings.type';
import { errorHandlers, createSuccessResponse } from '../../utils/error-handler';

// Define the structure of the buildings.json file
interface BuildingsFile {
  data: JReitData;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id || id.trim() === '') {
      return errorHandlers.badRequest('Building ID is required');
    }
    
    const data = (buildings as BuildingsFile).data;
    
    const building = data.jReitBuildings.find(
      (building) => building.id === id
    );
    
    if (!building) {
      return errorHandlers.notFound(
        'Building not found',
        { id }
      );
    }
    
    return createSuccessResponse(building);
  } catch (error) {
    console.error('Error fetching building data:', error);
    return errorHandlers.internalError(
      'Failed to fetch building data',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
} 