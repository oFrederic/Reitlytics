import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JReitBuilding } from '@/mocks/buildings.type';

// My state interface for building data management
interface BuildingsState {
  buildings: JReitBuilding[];           // All buildings from API
  filteredBuildings: JReitBuilding[];   // Buildings after search/filter
  selectedBuilding: JReitBuilding | null; // Current selected building for detail view
  loading: boolean;                     // Loading state for API calls
  error: string | null;                 // Error message if API call fails
}

const initialState: BuildingsState = {
  buildings: [],
  filteredBuildings: [],
  selectedBuilding: null,
  loading: false,
  error: null,
};

export const buildingsSlice = createSlice({
  name: 'buildings',
  initialState,
  reducers: {
    setBuildingsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setBuildingsSuccess: (state, action: PayloadAction<JReitBuilding[]>) => {
      state.buildings = action.payload;
      state.filteredBuildings = action.payload;
      state.loading = false;
    },
    setBuildingsError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setFilteredBuildings: (state, action: PayloadAction<JReitBuilding[]>) => {
      state.filteredBuildings = action.payload;
    },
    setSelectedBuilding: (state, action: PayloadAction<JReitBuilding | null>) => {
      state.selectedBuilding = action.payload;
    },
  },
});

export const {
  setBuildingsLoading,
  setBuildingsSuccess,
  setBuildingsError,
  setFilteredBuildings,
  setSelectedBuilding,
} = buildingsSlice.actions;

export default buildingsSlice.reducer; 