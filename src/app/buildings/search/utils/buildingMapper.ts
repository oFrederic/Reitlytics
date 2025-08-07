import { transformBuildingData, transformBuildingsData } from '@/utils/data';
import type { JReitBuilding, BuildingData } from '@/types';

/**
 * Utility function to convert JReitBuilding model from API to BuildingData model used by UI
 * @deprecated Use transformBuildingData from @/utils/data instead
 */
export function mapToBuilding(jReitBuilding: JReitBuilding): BuildingData {
  return transformBuildingData(jReitBuilding);
}

/**
 * Utility function to convert array of JReitBuilding to BuildingData
 * @deprecated Use transformBuildingsData from @/utils/data instead
 */
export function mapToBuildings(jReitBuildings: JReitBuilding[]): BuildingData[] {
  return transformBuildingsData(jReitBuildings);
} 