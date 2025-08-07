import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_ENDPOINTS } from '@/constants/api';
import { logError, getUserFriendlyErrorMessage } from '@/utils/errors';
import type { JReitBuilding, BuildingSearchParams, ApiSuccessResponse } from '@/types';

// Re-export for convenience
export type { BuildingSearchParams } from '@/types';

// My state interface for building data management
interface BuildingsState {
  buildings: JReitBuilding[];           // All buildings from API
  filteredBuildings: JReitBuilding[];   // Buildings after search/filter
  selectedBuilding: JReitBuilding | null; // Current selected building for detail view
  loading: boolean;                     // Loading state for API calls
  error: string | null;                 // Error message if API call fails
  searchParams: BuildingSearchParams;   // Current search parameters
}

const initialState: BuildingsState = {
  buildings: [],
  filteredBuildings: [],
  selectedBuilding: null,
  loading: false,
  error: null,
  searchParams: {},
};

// Async thunk to fetch all buildings
export const fetchBuildings = createAsyncThunk(
  'buildings/fetchBuildings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_ENDPOINTS.BUILDINGS.ROOT);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch buildings`);
      }
      
      const result: ApiSuccessResponse<{ jReitBuildings: JReitBuilding[] }> = await response.json();
      
      if (!result.success) {
        const errorMessage = result.error?.message || 'Failed to fetch buildings';
        throw new Error(errorMessage);
      }
      
      return result.data;
    } catch (error) {
      const errorMessage = getUserFriendlyErrorMessage(error as Error);
      logError(error as Error, { action: 'fetchBuildings' });
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to search buildings with filters
export const searchBuildings = createAsyncThunk(
  'buildings/searchBuildings',
  async (params: BuildingSearchParams, { rejectWithValue }) => {
    try {
      // Convert parameters to query string
      const queryParams = new URLSearchParams();
      
      // Add filters that are specified
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      // Determine endpoint
      const hasFilters = queryParams.toString() !== '';
      const endpoint = hasFilters 
        ? `${API_ENDPOINTS.BUILDINGS.SEARCH}?${queryParams.toString()}`
        : API_ENDPOINTS.BUILDINGS.ROOT;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to search buildings`);
      }
      
      const result: ApiSuccessResponse<{ results: JReitBuilding[]; count: number; filters: BuildingSearchParams }> = await response.json();
      
      if (!result.success) {
        const errorMessage = result.error?.message || 'Failed to search buildings';
        throw new Error(errorMessage);
      }
      
      // Handle different response formats
      const data = hasFilters 
        ? { jReitBuildings: result.data.results }
        : result.data;
      
      return { data, params };
    } catch (error) {
      const errorMessage = getUserFriendlyErrorMessage(error as Error);
      logError(error as Error, { action: 'searchBuildings', params });
      return rejectWithValue(errorMessage);
    }
  }
);

export const buildingsSlice = createSlice({
  name: 'buildings',
  initialState,
  reducers: {
    setSelectedBuilding: (state, action: PayloadAction<JReitBuilding | null>) => {
      state.selectedBuilding = action.payload;
    },
    
    clearSelectedBuilding: (state) => {
      state.selectedBuilding = null;
    },
    
    setSearchParams: (state, action: PayloadAction<BuildingSearchParams>) => {
      state.searchParams = action.payload;
    },
    
    clearSearchFilters: (state) => {
      state.searchParams = {};
      // Reset to all buildings when clearing filters
      state.filteredBuildings = state.buildings;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetBuildingsState: (state) => {
      state.buildings = [];
      state.filteredBuildings = [];
      state.selectedBuilding = null;
      state.loading = false;
      state.error = null;
      state.searchParams = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchBuildings
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.loading = false;
        state.buildings = action.payload.jReitBuildings;
        state.filteredBuildings = action.payload.jReitBuildings;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle searchBuildings
      .addCase(searchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBuildings.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data as { jReitBuildings?: JReitBuilding[]; results?: JReitBuilding[] };
        state.filteredBuildings = data.jReitBuildings || data.results || [];
        state.searchParams = action.payload.params;
      })
      .addCase(searchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedBuilding,
  clearSelectedBuilding,
  setSearchParams,
  clearSearchFilters,
  clearError,
  resetBuildingsState,
} = buildingsSlice.actions;

export default buildingsSlice.reducer; 