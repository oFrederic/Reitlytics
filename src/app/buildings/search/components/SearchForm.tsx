'use client';

import { useState, useEffect } from 'react';
import styles from './SearchForm.module.css';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { searchBuildings, clearSearchFilters, BuildingSearchParams } from '@/redux/slices/buildingsSlice';

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

/**
 * Validate that a string contains a valid number
 */
function isValidNumberInput(value: string): boolean {
  // Allow empty input or valid numbers (including decimals)
  return value === '' || /^(\d+)?(\.\d+)?$/.test(value);
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const dispatch = useAppDispatch();
  const { loading, searchParams } = useAppSelector(state => state.buildings);
  
  const [filters, setFilters] = useState<SearchFilters>({
    minYield: '',
    maxYield: '',
    minPrice: '',
    maxPrice: '',
    minCap: '',
    maxCap: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof SearchFilters, boolean>>>({});

  // Update local form state when Redux search params change
  useEffect(() => {
    if (searchParams) {
      setFilters({
        minYield: searchParams.minYield || '',
        maxYield: searchParams.maxYield || '',
        minPrice: searchParams.minPrice || '',
        maxPrice: searchParams.maxPrice || '',
        minCap: searchParams.minCap || '',
        maxCap: searchParams.maxCap || '',
      });
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validate numeric input
    if (isValidNumberInput(value)) {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear validation error if valid
      if (validationErrors[name as keyof SearchFilters]) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: false
        }));
      }
    } else {
      // Set validation error
      setValidationErrors(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there are any validation errors
    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }
    
    // Convert empty strings to undefined
    const cleanedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      acc[key as keyof SearchFilters] = value || '';
      return acc;
    }, {} as SearchFilters);
    
    onSearch(cleanedFilters);
  };

  const handleReset = () => {
    // Reset local state
    setFilters({
      minYield: '',
      maxYield: '',
      minPrice: '',
      maxPrice: '',
      minCap: '',
      maxCap: '',
    });
    
    // Clear validation errors
    setValidationErrors({});
    
    // Clear filters in Redux and fetch all buildings
    dispatch(clearSearchFilters());
    dispatch(searchBuildings({}));
  };

  const getInputClassName = (fieldName: keyof SearchFilters) => {
    return `${styles.rangeInput} ${validationErrors[fieldName] ? styles.inputError : ''}`;
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
                className={getInputClassName('minYield')}
                placeholder=""
              />
              <span className={styles.rangeSeparator}>〜</span>
              <input
                type="text"
                name="maxYield"
                value={filters.maxYield}
                onChange={handleChange}
                className={getInputClassName('maxYield')}
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
                className={getInputClassName('minPrice')}
                placeholder=""
              />
              <span className={styles.rangeSeparator}>〜</span>
              <input
                type="text"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                className={getInputClassName('maxPrice')}
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
                className={getInputClassName('minCap')}
                placeholder=""
              />
              <span className={styles.rangeSeparator}>〜</span>
              <input
                type="text"
                name="maxCap"
                value={filters.maxCap}
                onChange={handleChange}
                className={getInputClassName('maxCap')}
                placeholder=""
              />
              <span className={styles.unitLabel}>%</span>
            </div>
          </div>
        </div>
        
        <div className={styles.formFooter}>
          <button 
            type="submit" 
            className={styles.searchButton} 
            disabled={loading || Object.values(validationErrors).some(Boolean)}
          >
            {loading ? '検索中...' : '検索'}
          </button>
          <button 
            type="button" 
            className={styles.resetButton} 
            onClick={handleReset} 
            disabled={loading}
          >
            検索結果をリセット
          </button>
        </div>
      </form>
    </div>
  );
} 