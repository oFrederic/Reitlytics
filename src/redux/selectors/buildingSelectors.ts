/**
 * Building-related Redux selectors
 * 
 * Centralized selectors for accessing building state from Redux store
 * with memoization for performance optimization.
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { transformBuildingsData, calculateBuildingStatistics } from '@/utils/data';
import type { BuildingData } from '@/types/business';

// Basic selectors
export const selectBuildingsState = (state: RootState) => state.buildings;

export const selectBuildings = (state: RootState) => state.buildings.buildings;

export const selectFilteredBuildings = (state: RootState) => state.buildings.filteredBuildings;

export const selectSelectedBuilding = (state: RootState) => state.buildings.selectedBuilding;

export const selectBuildingsLoading = (state: RootState) => state.buildings.loading;

export const selectBuildingsError = (state: RootState) => state.buildings.error;

export const selectSearchParams = (state: RootState) => state.buildings.searchParams;

// Memoized selectors
export const selectBuildingsCount = createSelector(
  [selectBuildings],
  (buildings) => buildings.length
);

export const selectFilteredBuildingsCount = createSelector(
  [selectFilteredBuildings], 
  (filteredBuildings) => filteredBuildings.length
);

export const selectUIBuildings = createSelector(
  [selectFilteredBuildings],
  (filteredBuildings): BuildingData[] => transformBuildingsData(filteredBuildings)
);

export const selectSelectedUIBuilding = createSelector(
  [selectSelectedBuilding],
  (selectedBuilding) => selectedBuilding ? transformBuildingsData([selectedBuilding])[0] : null
);

export const selectBuildingById = createSelector(
  [selectBuildings, (_, buildingId: string) => buildingId],
  (buildings, buildingId) => buildings.find(building => building.id === buildingId) || null
);

export const selectBuildingStatistics = createSelector(
  [selectUIBuildings],
  (uiBuildings) => calculateBuildingStatistics(uiBuildings)
);

export const selectHasBuildings = createSelector(
  [selectBuildingsCount],
  (count) => count > 0
);

export const selectHasFilteredBuildings = createSelector(
  [selectFilteredBuildingsCount],
  (count) => count > 0
);

export const selectIsSearchActive = createSelector(
  [selectSearchParams],
  (searchParams) => {
    return Object.values(searchParams).some(value => value && value.trim() !== '');
  }
);

export const selectLoadingState = createSelector(
  [selectBuildingsLoading, selectBuildingsError],
  (loading, error) => ({
    isLoading: loading,
    error: error,
    hasError: !!error,
  })
);

// Complex selectors for building analysis
export const selectBuildingsByAssetType = createSelector(
  [selectUIBuildings],
  (uiBuildings) => {
    return uiBuildings.reduce((acc, building) => {
      const assetType = building.type;
      if (!acc[assetType]) {
        acc[assetType] = [];
      }
      acc[assetType].push(building);
      return acc;
    }, {} as Record<string, BuildingData[]>);
  }
);

export const selectCapRateRange = createSelector(
  [selectUIBuildings],
  (uiBuildings) => {
    if (uiBuildings.length === 0) {
      return { min: 0, max: 0 };
    }
    
    const capRates = uiBuildings.map(building => building.capRate);
    return {
      min: Math.min(...capRates),
      max: Math.max(...capRates),
    };
  }
);

export const selectOccupancyRateRange = createSelector(
  [selectUIBuildings],
  (uiBuildings) => {
    if (uiBuildings.length === 0) {
      return { min: 0, max: 0 };
    }
    
    const occupancyRates = uiBuildings.map(building => building.occupancyRate);
    return {
      min: Math.min(...occupancyRates),
      max: Math.max(...occupancyRates),
    };
  }
);

export const selectEvaluationAmountRange = createSelector(
  [selectUIBuildings],
  (uiBuildings) => {
    if (uiBuildings.length === 0) {
      return { min: 0, max: 0 };
    }
    
    const amounts = uiBuildings.map(building => building.evaluationAmount);
    return {
      min: Math.min(...amounts),
      max: Math.max(...amounts),
    };
  }
);

// Selector for search result summary
export const selectSearchSummary = createSelector(
  [
    selectFilteredBuildingsCount,
    selectBuildingsCount,
    selectIsSearchActive,
    selectBuildingsLoading,
  ],
  (filteredCount, totalCount, isSearchActive, loading) => ({
    filteredCount,
    totalCount,
    isSearchActive,
    loading,
    hasResults: filteredCount > 0,
    showingAll: !isSearchActive || filteredCount === totalCount,
  })
);

// Selector for building selection info
export const selectSelectionInfo = createSelector(
  [selectSelectedBuilding, selectFilteredBuildings],
  (selectedBuilding, filteredBuildings) => ({
    hasSelection: !!selectedBuilding,
    selectedId: selectedBuilding?.id || null,
    selectedIndex: selectedBuilding 
      ? filteredBuildings.findIndex(b => b.id === selectedBuilding.id)
      : -1,
    canSelectNext: selectedBuilding 
      ? filteredBuildings.findIndex(b => b.id === selectedBuilding.id) < filteredBuildings.length - 1
      : false,
    canSelectPrevious: selectedBuilding 
      ? filteredBuildings.findIndex(b => b.id === selectedBuilding.id) > 0
      : false,
  })
);