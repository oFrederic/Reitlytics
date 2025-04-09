'use client';

import { useState } from 'react';
import styles from './search.module.css';
import { IoLocationOutline } from 'react-icons/io5';
import { IoStatsChartOutline } from 'react-icons/io5';
import { IoChevronBack } from 'react-icons/io5';

export default function BuildingSearchPage() {
  const [activeView, setActiveView] = useState('map'); // 'map' or 'analysis'

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
          <span className={styles.locationCount}>選択中 55/55 件</span>
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
          <h2>Search Form (Placeholder)</h2>
          <p>This will contain the search filters</p>
        </div>
        
        {/* Building List - 25% */}
        <div className={styles.buildingListContainer}>
          <h2>Building List (Placeholder)</h2>
          <p>This will show the list of buildings</p>
        </div>
        
        {/* Map/Graph View - 50% */}
        <div className={styles.mapGraphContainer}>
          {activeView === 'map' ? (
            <div>
              <h2>Map View</h2>
              <p>This is the map view placeholder. It will show buildings on a map.</p>
              <div style={{ height: '300px', backgroundColor: '#d1e4fc', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px' }}>
                🗺️ Map Placeholder
              </div>
            </div>
          ) : (
            <div>
              <h2>Analysis View</h2>
              <p>This is the analysis view placeholder. It will show charts and data visualization.</p>
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