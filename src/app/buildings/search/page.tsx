'use client';

import { useState } from 'react';
import styles from './search.module.css';
import { IoLocationOutline } from 'react-icons/io5';
import { IoStatsChartOutline } from 'react-icons/io5';
import { IoChevronBack } from 'react-icons/io5';
import SearchForm, { SearchFilters } from './components/SearchForm';
import BuildingList from './components/BuildingList';
import { BuildingData } from './components/BuildingCard';
import { mockBuildings } from './mockData';

export default function BuildingSearchPage() {
  const [activeView, setActiveView] = useState('map'); // 'map' or 'analysis'
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);

  const handleSearch = (filters: SearchFilters) => {
    console.log('Search filters:', filters);
    // Here you would typically call an API or update the building list based on filters
  };

  const handleSelectBuilding = (building: BuildingData) => {
    console.log('Selected building:', building);
    setSelectedBuilding(building);
    // Here you would typically update the map or visualization
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
          <span className={styles.locationCount}>選択中 {selectedBuilding ? '1' : '0'}/{mockBuildings.length} 件</span>
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
          <BuildingList 
            buildings={mockBuildings} 
            onSelectBuilding={handleSelectBuilding} 
          />
        </div>
        
        {/* Map/Graph View - 50% */}
        <div className={styles.mapGraphContainer}>
          {activeView === 'map' ? (
            <div>
              <h2>Map View</h2>
              {selectedBuilding && (
                <div className={styles.selectedBuildingInfo}>
                  <h3>Selected Building</h3>
                  <p>{selectedBuilding.name}</p>
                  <p>{selectedBuilding.type}</p>
                  <p>評価額: {selectedBuilding.evaluationAmount}億円</p>
                </div>
              )}
              <div style={{ height: '300px', backgroundColor: '#d1e4fc', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px' }}>
                🗺️ Map Placeholder
              </div>
            </div>
          ) : (
            <div>
              <h2>Analysis View</h2>
              {selectedBuilding && (
                <div className={styles.selectedBuildingInfo}>
                  <h3>Selected Building Analytics</h3>
                  <p>{selectedBuilding.name}</p>
                  <p>Cap Rate: {selectedBuilding.capRate}%</p>
                  <p>Occupancy: {selectedBuilding.occupancyRate}%</p>
                </div>
              )}
              <div style={{ height: '300px', backgroundColor: '#e4fcdf', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px' }}>
                📊 Analysis Placeholder
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 