import buildings from '@/mocks/buildings.json';
import type { JReitData } from '@/mocks/buildings.type';
import { errorHandlers, createSuccessResponse } from '../utils/error-handler';
import { logError } from '@/utils/errors';

// Define the structure of the buildings.json file
interface BuildingsFile {
  data: JReitData;
}

export async function GET() {
  try {
    const data = (buildings as BuildingsFile).data;
    return createSuccessResponse(data);
  } catch (error) {
    logError(error as Error, { 
      endpoint: '/api/buildings',
      method: 'GET'
    });
    
    return errorHandlers.internalError(
      'Failed to fetch buildings data',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
} 