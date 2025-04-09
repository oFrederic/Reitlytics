'use client';

import { useState } from 'react';
import styles from './SearchForm.module.css';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  minYield: string;
  maxYield: string;
  minPrice: string;
  maxPrice: string;
  minCap: string;
  maxCap: string;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    minYield: '',
    maxYield: '',
    minPrice: '',
    maxPrice: '',
    minCap: '',
    maxCap: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      minYield: '',
      maxYield: '',
      minPrice: '',
      maxPrice: '',
      minCap: '',
      maxCap: '',
    });
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formFields}>
          <div className={styles.formGroup}>
            <label className={styles.label}>稼働率</label>
            <div className={styles.rangeInputs}>
              <input
                type="text"
                name="minYield"
                value={filters.minYield}
                onChange={handleChange}
                className={styles.rangeInput}
                placeholder=""
              />
              <span className={styles.rangeSeparator}>〜</span>
              <input
                type="text"
                name="maxYield"
                value={filters.maxYield}
                onChange={handleChange}
                className={styles.rangeInput}
                placeholder=""
              />
              <span className={styles.unitLabel}>%</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>最新鑑定評価額</label>
            <div className={styles.rangeInputs}>
              <input
                type="text"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                className={styles.rangeInput}
                placeholder=""
              />
              <span className={styles.rangeSeparator}>〜</span>
              <input
                type="text"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                className={styles.rangeInput}
                placeholder=""
              />
              <span className={styles.unitLabel}>百万円</span>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>最新CR</label>
            <div className={styles.rangeInputs}>
              <input
                type="text"
                name="minCap"
                value={filters.minCap}
                onChange={handleChange}
                className={styles.rangeInput}
                placeholder=""
              />
              <span className={styles.rangeSeparator}>〜</span>
              <input
                type="text"
                name="maxCap"
                value={filters.maxCap}
                onChange={handleChange}
                className={styles.rangeInput}
                placeholder=""
              />
              <span className={styles.unitLabel}>%</span>
            </div>
          </div>
        </div>
        
        <div className={styles.formFooter}>
          <button type="submit" className={styles.searchButton}>
            検索
          </button>
          <button type="button" className={styles.resetButton} onClick={handleReset}>
            検索結果をリセット
          </button>
        </div>
      </form>
    </div>
  );
} 