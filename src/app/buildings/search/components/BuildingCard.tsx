'use client';

import styles from './BuildingCard.module.css';

export interface BuildingData {
  id: string;
  name: string;
  type: string;
  acquisitionDate: string;
  capRate: number;
  evaluationAmount: number; // in 億円
  occupancyRate: number;
}

interface BuildingCardProps {
  building: BuildingData;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * Format number with commas for better readability
 */
function formatNumberWithCommas(value: number): string {
  return value.toLocaleString('ja-JP');
}

export default function BuildingCard({ building, isSelected = false, onClick }: BuildingCardProps) {
  return (
    <div 
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <h3 className={styles.name}>{building.name}</h3>
        <span className={styles.type}>
          <span className={styles.buildingIcon}>•</span>
          {building.type}
        </span>
      </div>
      
      <div className={styles.details}>
        <div className={styles.detailRow}>
          <span className={styles.label}>初回取得日</span>
          <span className={styles.value}>{building.acquisitionDate}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>最新実CR</span>
          <span className={styles.value}>{building.capRate}%</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>最新鑑定評価額</span>
          <span className={styles.value}>{formatNumberWithCommas(building.evaluationAmount)}億円</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>現在の稼働率</span>
          <span className={styles.value}>{building.occupancyRate}%</span>
        </div>
      </div>
    </div>
  );
} 