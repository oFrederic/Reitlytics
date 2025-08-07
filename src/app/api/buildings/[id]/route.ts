import buildings from '@/mocks/buildings.json';
import type { JReitData } from '@/mocks/buildings.type';
import { errorHandlers, createSuccessResponse } from '../../utils/error-handler';
import { validateBuildingId } from '@/lib/validation/schemas';
import { logError } from '@/utils/errors';

// Define the structure of the buildings.json file
interface BuildingsFile {
  data: JReitData;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate building ID
    const validation = validateBuildingId(id);
    if (!validation.isValid) {
      return errorHandlers.validationError(
        'Invalid building ID',
        { errors: validation.errors }
      );
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
    const resolvedParams = await params;
    logError(error as Error, { 
      endpoint: '/api/buildings/[id]',
      method: 'GET',
      buildingId: resolvedParams.id 
    });
    
    return errorHandlers.internalError(
      'Failed to fetch building data',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
} 