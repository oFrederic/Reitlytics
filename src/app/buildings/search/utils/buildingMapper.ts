import { JReitBuilding } from '@/mocks/buildings.type';
import { BuildingData } from '../components/BuildingCard';
import { convertYenToHundredMillionYen } from './currencyUtils';

/**
 * Utility function to convert JReitBuilding model from API to BuildingData model used by UI
 */
export function mapToBuilding(jReitBuilding: JReitBuilding): BuildingData {
  // Determine building type
  let type = 'その他';
  if (jReitBuilding.assetType.isOffice) type = 'オフィス';
  else if (jReitBuilding.assetType.isRetail) type = '商業施設';
  else if (jReitBuilding.assetType.isResidential) type = '住宅';
  else if (jReitBuilding.assetType.isHotel) type = 'ホテル';
  else if (jReitBuilding.assetType.isLogistic) type = '物流施設';
  
  // Get latest occupancy rate or default to 0
  const occupancyRate = jReitBuilding.financials.length > 0
    ? parseFloat(jReitBuilding.financials[0].leasing.occupancyRate)
    : 0;
  
  return {
    id: jReitBuilding.id,
    name: jReitBuilding.buildingSpec.name,
    type: type,
    acquisitionDate: jReitBuilding.acquisition.acquisitionDate,
    capRate: parseFloat(jReitBuilding.yieldEvaluation.capRate),
    evaluationAmount: convertYenToHundredMillionYen(jReitBuilding.yieldEvaluation.appraisedPrice), // Convert to 億円 (100 million yen)
    occupancyRate: occupancyRate
  };
}

/**
 * Utility function to convert array of JReitBuilding to BuildingData
 */
export function mapToBuildings(jReitBuildings: JReitBuilding[]): BuildingData[] {
  return jReitBuildings.map(mapToBuilding);
} 