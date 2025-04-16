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
              <h2 className="text-lg font-semibold mb-2">分析表示</h2>
              {selectedUiBuilding && (
                <div className={styles.selectedBuildingInfo}>
                  <h3 className="font-medium">選択された建物の分析</h3>
                  <p>{selectedUiBuilding.name}</p>
                  <p>Cap Rate: {selectedUiBuilding.capRate}%</p>
                  <p>稼働率: {selectedUiBuilding.occupancyRate}%</p>
                </div>
              )}
              <div className="h-[300px] bg-green-50 flex justify-center items-center rounded-lg">
                📊 分析グラフ（準備中）
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 