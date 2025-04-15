'use client';

import { useState } from 'react';
import styles from './BuildingList.module.css';
import BuildingCard, { BuildingData } from './BuildingCard';
import { useAppSelector } from '@/redux/store';

interface BuildingListProps {
  buildings: BuildingData[];
  onSelectBuilding?: (building: BuildingData) => void;
}

export default function BuildingList({ buildings, onSelectBuilding }: BuildingListProps) {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const { loading } = useAppSelector(state => state.buildings);

  const handleSelectBuilding = (building: BuildingData) => {
    setSelectedBuildingId(building.id);
    if (onSelectBuilding) {
      onSelectBuilding(building);
    }
  };

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
      <div className={styles.listContainer}>
        {buildings.map(building => (
          <BuildingCard 
            key={building.id}
            building={building}
            isSelected={building.id === selectedBuildingId}
            onClick={() => handleSelectBuilding(building)}
          />
        ))}
      </div>
    </div>
  );
} 