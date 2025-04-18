'use client';

import { useState, useEffect, useRef, createRef } from 'react';
import styles from './BuildingList.module.css';
import BuildingCard, { BuildingData } from './BuildingCard';
import { useAppSelector } from '@/redux/store';

interface BuildingListProps {
  buildings: BuildingData[];
  onSelectBuilding?: (building: BuildingData | null) => void;
}

export default function BuildingList({ buildings, onSelectBuilding }: BuildingListProps) {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const { loading, selectedBuilding } = useAppSelector(state => state.buildings);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{[id: string]: React.RefObject<HTMLDivElement>}>({});
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const prevSelectedIdRef = useRef<string | null>(null);
  
  // Setup refs for all building items
  useEffect(() => {
    // Create refs for all buildings
    buildings.forEach(building => {
      if (!itemRefs.current[building.id]) {
        itemRefs.current[building.id] = createRef<HTMLDivElement>();
      }
    });
  }, [buildings]);
  
  // Keep local selection state in sync with Redux state
  useEffect(() => {
    const newSelectedId = selectedBuilding?.id || null;
    setSelectedBuildingId(newSelectedId);
    
    // Only scroll if selection changed and it wasn't from the list itself
    if (newSelectedId && newSelectedId !== prevSelectedIdRef.current && !isUserScrolling) {
      scrollToSelectedItem(newSelectedId);
    }
    
    prevSelectedIdRef.current = newSelectedId;
  }, [selectedBuilding, isUserScrolling]);

  // Scroll to the selected item
  const scrollToSelectedItem = (buildingId: string) => {
    if (listContainerRef.current && itemRefs.current[buildingId]?.current) {
      const container = listContainerRef.current;
      const item = itemRefs.current[buildingId].current;
      
      if (item) {
        // Smooth scroll to the selected item
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        
        // Calculate if item is in view
        const isInView = 
          itemRect.top >= containerRect.top && 
          itemRect.bottom <= containerRect.bottom;
        
        if (!isInView) {
          container.scrollTo({
            top: item.offsetTop - container.offsetTop - (containerRect.height / 2) + (itemRect.height / 2),
            behavior: 'smooth'
          });
        }
      }
    }
  };

  const handleSelectBuilding = (building: BuildingData) => {
    // Set flag to indicate user is selecting from list
    setIsUserScrolling(true);
    
    // Toggle selection if clicking the same building
    if (selectedBuildingId === building.id) {
      setSelectedBuildingId(null);
      if (onSelectBuilding) {
        // Pass null to indicate deselection
        onSelectBuilding(null);
      }
    } else {
      // Select new building
      setSelectedBuildingId(building.id);
      if (onSelectBuilding) {
        onSelectBuilding(building);
      }
    }
    
    // Reset user scrolling flag after a short delay
    setTimeout(() => {
      setIsUserScrolling(false);
    }, 100);
  };

  // User interaction with list container
  const handleUserScroll = () => {
    setIsUserScrolling(true);
    
    // Reset after a delay
    clearTimeout(resetScrollTimeout.current);
    resetScrollTimeout.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
  };
  
  // Ref for the timeout to clear on component unmount
  const resetScrollTimeout = useRef<NodeJS.Timeout>();
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (resetScrollTimeout.current) {
        clearTimeout(resetScrollTimeout.current);
      }
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent align-[-0.125em]"></div>
            <p className="mt-2 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (buildings.length === 0) {
    return (
      <div className={styles.container}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-4">
            <p className="text-gray-600">該当する建物がありません</p>
            <p className="text-sm text-gray-500 mt-1">検索条件を変更してください</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div 
        ref={listContainerRef}
        className={styles.listContainer}
        onScroll={handleUserScroll}
      >
        {buildings.map(building => (
          <div 
            key={building.id} 
            ref={itemRefs.current[building.id] || null}
          >
            <BuildingCard 
              building={building}
              isSelected={building.id === selectedBuildingId}
              onClick={() => handleSelectBuilding(building)}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 