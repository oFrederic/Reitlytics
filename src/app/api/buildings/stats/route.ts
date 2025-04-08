import buildings from '@/mocks/buildings.json';
import type { JReitData } from '@/mocks/buildings.type';
import { errorHandlers, createSuccessResponse } from '../../utils/error-handler';

// Define the structure of the buildings.json file
interface BuildingsFile {
  data: JReitData;
}

export async function GET() {
  try {
    const buildingsData = (buildings as BuildingsFile).data;
    const totalBuildings = buildingsData.jReitBuildings.length;
    
    // Calculate basic statistics
    const stats = {
      totalBuildings,
      assetTypes: {
        office: buildingsData.jReitBuildings.filter(b => b.assetType.isOffice).length,
        retail: buildingsData.jReitBuildings.filter(b => b.assetType.isRetail).length,
        hotel: buildingsData.jReitBuildings.filter(b => b.assetType.isHotel).length,
        parking: buildingsData.jReitBuildings.filter(b => b.assetType.isParking).length,
        industrial: buildingsData.jReitBuildings.filter(b => b.assetType.isIndustrial).length,
        logistic: buildingsData.jReitBuildings.filter(b => b.assetType.isLogistic).length,
        residential: buildingsData.jReitBuildings.filter(b => b.assetType.isResidential).length,
        healthCare: buildingsData.jReitBuildings.filter(b => b.assetType.isHealthCare).length,
        other: buildingsData.jReitBuildings.filter(b => b.assetType.isOther).length
      },
      // Average cap rate calculation (if available)
      averageCapRate: calculateAverageCapRate(buildingsData.jReitBuildings)
    };
    
    return createSuccessResponse(stats);
  } catch (error) {
    console.error('Error generating building statistics:', error);
    return errorHandlers.internalError(
      'Failed to generate building statistics',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
}

// Helper function to calculate average cap rate
function calculateAverageCapRate(buildings: JReitData['jReitBuildings']) {
  const buildingsWithCapRate = buildings.filter(b => 
    b.yieldEvaluation?.capRate && 
    !isNaN(parseFloat(b.yieldEvaluation.capRate))
  );
  
  if (buildingsWithCapRate.length === 0) return null;
  
  const sum = buildingsWithCapRate.reduce((acc, building) => {
    return acc + parseFloat(building.yieldEvaluation.capRate);
  }, 0);
  
  return (sum / buildingsWithCapRate.length).toFixed(2);
} 