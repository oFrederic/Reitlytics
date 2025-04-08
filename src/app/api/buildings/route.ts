import buildings from '@/mocks/buildings.json';
import type { JReitData } from '@/mocks/buildings.type';
import { errorHandlers, createSuccessResponse } from '../utils/error-handler';

// Define the structure of the buildings.json file
interface BuildingsFile {
  data: JReitData;
}

export async function GET() {
  try {
    const data = (buildings as BuildingsFile).data;
    return createSuccessResponse(data);
  } catch (error) {
    console.error('Error fetching buildings data:', error);
    return errorHandlers.internalError(
      'Failed to fetch buildings data',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
} 