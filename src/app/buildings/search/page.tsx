'use client';

import { useState, useEffect } from 'react';
import styles from './search.module.css';
import { IoLocationOutline } from 'react-icons/io5';
import { IoStatsChartOutline } from 'react-icons/io5';
import { IoChevronBack } from 'react-icons/io5';
import SearchForm, { SearchFilters } from './components/SearchForm';
import BuildingList from './components/BuildingList';
import { BuildingData } from './components/BuildingCard';
import MapComponent from '@/components/Map/MapComponent';
import CapRateChart from '@/components/Charts/CapRateChart';
import OccupancyRateChart from '@/components/Charts/OccupancyRateChart';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchBuildings, searchBuildings, setSelectedBuilding } from '@/redux/slices/buildingsSlice';
import { mapToBuildings, mapToBuilding } from './utils/buildingMapper';

export default function BuildingSearchPage() {
  const dispatch = useAppDispatch();
  const { filteredBuildings, selectedBuilding, loading, error } = useAppSelector(state => state.buildings);
  const [activeView, setActiveView] = useState('map'); // 'map' or 'analysis'
  const [uiBuildings, setUiBuildings] = useState<BuildingData[]>([]);
  const [selectedUiBuilding, setSelectedUiBuilding] = useState<BuildingData | null>(null);

  // Fetch buildings on component mount
  useEffect(() => {
    dispatch(fetchBuildings());
  }, [dispatch]);

  // Transform JReitBuilding to BuildingData when filtered buildings change
  useEffect(() => {
    if (filteredBuildings.length > 0) {
      setUiBuildings(mapToBuildings(filteredBuildings));
    } else {
      setUiBuildings([]);
    }
  }, [filteredBuildings]);

  // Handle selecting a building
  useEffect(() => {
    if (selectedBuilding) {
      setSelectedUiBuilding(mapToBuilding(selectedBuilding));
    } else {
      setSelectedUiBuilding(null);
    }
  }, [selectedBuilding]);

  // Handle form search
  const handleSearch = (filters: SearchFilters) => {
    dispatch(searchBuildings(filters));
  };

  // Handle building selection
  const handleSelectBuilding = (building: BuildingData) => {
    // Find the corresponding JReitBuilding in the Redux store
    const selectedJReitBuilding = filteredBuildings.find(b => b.id === building.id) || null;
    
    // Update the selected building in Redux
    dispatch(setSelectedBuilding(selectedJReitBuilding));
    
    // Update local state for UI
    setSelectedUiBuilding(building);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>検索</h1>
          <button className={styles.backButton}>
            <IoChevronBack className={styles.backButtonIcon} />
          </button>
        </div>
        
        <div className={styles.headerCenter}>
          <span className={styles.locationCount}>
            選択中 {selectedUiBuilding ? '1' : '0'}/{uiBuildings.length} 件
            {loading && ' (読み込み中...)'}
          </span>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.headerButtons}>
            <button 
              className={activeView === 'map' ? styles.activeButton : styles.inactiveButton}
              onClick={() => setActiveView('map')}
            >
              <IoLocationOutline className={styles.buttonIcon} />
              地図
            </button>
            <button 
              className={activeView === 'analysis' ? styles.activeButton : styles.inactiveButton}
              onClick={() => setActiveView('analysis')}
            >
              <IoStatsChartOutline className={styles.buttonIcon} />
              分析
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className={styles.contentContainer}>
        {/* Search Form - 25% */}
        <div className={styles.searchFormContainer}>
          <SearchForm onSearch={handleSearch} />
        </div>
        
        {/* Building List - 25% */}
        <div className={styles.buildingListContainer}>
          {error ? (
            <div className="p-4 text-red-500">エラーが発生しました: {error}</div>
          ) : (
            <BuildingList 
              buildings={uiBuildings} 
              onSelectBuilding={handleSelectBuilding} 
            />
          )}
        </div>
        
        {/* Map/Graph View - 50% */}
        <div className={styles.mapGraphContainer}>
          {activeView === 'map' ? (
            <MapComponent 
              buildings={filteredBuildings}
              onBuildingClick={(building) => {
                dispatch(setSelectedBuilding(building));
              }}
            />
          ) : (
            <div>
              {selectedBuilding ? (
                <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
                  <CapRateChart 
                    capRateHistories={selectedBuilding.capRateHistories || []} 
                    height={250}
                    className="mb-4" 
                  />
                  <OccupancyRateChart 
                    occupancyRateHistories={selectedBuilding.financials?.map((f, index) => ({
                      leasing: f.leasing,
                      // Use the corresponding capRate history date if available, otherwise use incremental dates
                      closingDate: selectedBuilding.capRateHistories?.[index]?.closingDate || 
                        new Date(new Date(selectedBuilding.capRateHistories?.[0]?.closingDate || '').getTime() + index * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    })) || []} 
                    height={250}
                  />
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">建物を選択すると、キャップレート推移と稼働率推移が表示されます</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 