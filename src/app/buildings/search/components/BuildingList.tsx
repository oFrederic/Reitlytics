'use client';

import { useState } from 'react';
import styles from './BuildingList.module.css';
import BuildingCard, { BuildingData } from './BuildingCard';

interface BuildingListProps {
  buildings: BuildingData[];
  onSelectBuilding?: (building: BuildingData) => void;
}

export default function BuildingList({ buildings, onSelectBuilding }: BuildingListProps) {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  const handleSelectBuilding = (building: BuildingData) => {
    setSelectedBuildingId(building.id);
    if (onSelectBuilding) {
      onSelectBuilding(building);
    }
  };

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