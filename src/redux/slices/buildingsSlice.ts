import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { JReitBuilding } from '@/mocks/buildings.type';

// Define search params interface that matches our search form
export interface BuildingSearchParams {
  minYield?: string;
  maxYield?: string;
  minPrice?: string;
  maxPrice?: string;
  minCap?: string;
  maxCap?: string;
}

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
      const response = await fetch('/api/buildings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch buildings');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Unknown error');
      }
      
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Async thunk to search buildings with filters
export const searchBuildings = createAsyncThunk(
  'buildings/searchBuildings',
  async (params: BuildingSearchParams, { getState, rejectWithValue }) => {
    try {
      // Convert parameters to query string
      const queryParams = new URLSearchParams();
      
      // Add filters that are specified
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      // If no filters, use the main buildings endpoint
      if (queryParams.toString() === '') {
        const response = await fetch('/api/buildings');
        if (!response.ok) {
          throw new Error('Failed to fetch buildings');
        }
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error?.message || 'Unknown error');
        }
        
        return { data: result.data, params };
      }
      
      // Otherwise use the search endpoint
      const response = await fetch(`/api/buildings/search?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search buildings');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Unknown error');
      }
      
      return { data: { jReitBuildings: result.data.results }, params };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
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
    clearSearchFilters: (state) => {
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
        state.filteredBuildings = action.payload.data.jReitBuildings;
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
  clearSearchFilters,
} = buildingsSlice.actions;

export default buildingsSlice.reducer; 