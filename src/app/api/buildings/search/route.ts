import buildings from '@/mocks/buildings.json';
import type { JReitData } from '@/mocks/buildings.type';
import { errorHandlers, createSuccessResponse } from '../../utils/error-handler';
import { convertYenToMillionYen } from '@/utils/currency';
import { validateBuildingSearchParams, sanitizeSearchParams } from '@/lib/validation/schemas';
import { logError } from '@/utils/errors';

// Define the structure of the buildings.json file
interface BuildingsFile {
  data: JReitData;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Convert URLSearchParams to plain object
    const rawParams: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      rawParams[key] = value;
    }
    
    // Validate search parameters
    const validation = validateBuildingSearchParams(rawParams);
    if (!validation.isValid) {
      return errorHandlers.validationError(
        'Invalid search parameters',
        { errors: validation.errors }
      );
    }
    
    // Sanitize and normalize parameters
    const cleanParams = sanitizeSearchParams(rawParams);
    const query = cleanParams.q?.toLowerCase() || '';
    const minYield = cleanParams.minYield || '';
    const maxYield = cleanParams.maxYield || '';
    const minPrice = cleanParams.minPrice || '';
    const maxPrice = cleanParams.maxPrice || '';
    const minCap = cleanParams.minCap || '';
    const maxCap = cleanParams.maxCap || '';
    
    const data = (buildings as BuildingsFile).data;
    
    // Filter buildings based on search parameters
    const filteredBuildings = data.jReitBuildings.filter((building) => {
      // Text search (optional)
      if (query && 
          !building.buildingSpec.name.toLowerCase().includes(query) && 
          !building.buildingSpec.address.toLowerCase().includes(query)) {
        return false;
      }
      
      // Filter by occupancy rate (yield)
      if (minYield && building.financials.length > 0) {
        const occupancyRate = parseFloat(building.financials[0].leasing.occupancyRate);
        if (isNaN(occupancyRate) || occupancyRate < parseFloat(minYield)) {
          return false;
        }
      }
      
      if (maxYield && building.financials.length > 0) {
        const occupancyRate = parseFloat(building.financials[0].leasing.occupancyRate);
        if (isNaN(occupancyRate) || occupancyRate > parseFloat(maxYield)) {
          return false;
        }
      }
      
      // Filter by appraisal price - convert search values from 百万円 (million yen) to yen
      if (minPrice) {
        const priceInYen = building.yieldEvaluation.appraisedPrice;
        // Convert price in DB (yen) to million yen for comparison with search param
        const priceIn百万円 = convertYenToMillionYen(priceInYen);
        if (priceIn百万円 < parseFloat(minPrice)) {
          return false;
        }
      }
      
      if (maxPrice) {
        const priceInYen = building.yieldEvaluation.appraisedPrice;
        // Convert price in DB (yen) to million yen for comparison with search param
        const priceIn百万円 = convertYenToMillionYen(priceInYen);
        if (priceIn百万円 > parseFloat(maxPrice)) {
          return false;
        }
      }
      
      // Filter by cap rate
      if (minCap) {
        const capRate = parseFloat(building.yieldEvaluation.capRate);
        if (isNaN(capRate) || capRate < parseFloat(minCap)) {
          return false;
        }
      }
      
      if (maxCap) {
        const capRate = parseFloat(building.yieldEvaluation.capRate);
        if (isNaN(capRate) || capRate > parseFloat(maxCap)) {
          return false;
        }
      }
      
      // All filters passed
      return true;
    });
    
    return createSuccessResponse({ 
      results: filteredBuildings,
      count: filteredBuildings.length,
      filters: {
        query,
        minYield,
        maxYield,
        minPrice,
        maxPrice,
        minCap,
        maxCap
      }
    });
  } catch (error) {
    logError(error as Error, { 
      endpoint: '/api/buildings/search',
      method: 'GET',
      url: request.url 
    });
    
    return errorHandlers.internalError(
      'Failed to search buildings',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
} 