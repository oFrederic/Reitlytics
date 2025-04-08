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
    const assetType = searchParams.get('type');
    
    const data = (buildings as BuildingsFile).data;
    
    if (!assetType) {
      return errorHandlers.badRequest('Asset type query parameter is required');
    }
    
    // Validate asset type
    const validAssetTypes = [
      'office', 
      'retail', 
      'hotel', 
      'parking', 
      'industrial', 
      'logistic', 
      'residential', 
      'healthCare', 
      'other'
    ];
    
    if (!validAssetTypes.includes(assetType)) {
      return errorHandlers.validationError(
        'Invalid asset type', 
        { assetType, validTypes: validAssetTypes }
      );
    }
    
    // Filter buildings by asset type
    const filteredBuildings = data.jReitBuildings.filter(building => {
      const assetTypeKey = `is${assetType.charAt(0).toUpperCase() + assetType.slice(1)}` as keyof typeof building.assetType;
      return building.assetType[assetTypeKey] === true;
    });
    
    return createSuccessResponse({ 
      buildings: filteredBuildings,
      count: filteredBuildings.length,
      assetType
    });
  } catch (error) {
    console.error('Error fetching buildings by type:', error);
    return errorHandlers.internalError(
      'Failed to fetch buildings by type',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
} 