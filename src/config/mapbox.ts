/**
 * Mapbox configuration settings
 * 
 * Centralized configuration for Mapbox GL JS integration including
 * access tokens, default settings, and styling options.
 */

import { ASSET_TYPES } from '@/constants/business';

// Mapbox access configuration
export const MAPBOX_CONFIG = {
  get ACCESS_TOKEN() { return process.env.NEXT_PUBLIC_MAPBOX_TOKEN; },
  get STYLE() { return process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12'; },
  
  // Default map settings centered on Tokyo
  DEFAULT_CENTER: [139.7527, 35.6852] as [number, number], // Tokyo coordinates
  DEFAULT_ZOOM: 11,
  SELECTED_BUILDING_ZOOM: 15,
  
  // Map interaction settings
  ANIMATION_DURATION: 500,
  POPUP_OFFSET: 25,
  
  // Map bounds for Japan (optional constraint)
  JAPAN_BOUNDS: {
    NORTH: 45.5,
    SOUTH: 24.0, 
    EAST: 146.0,
    WEST: 129.0,
  },
} as const;

// Marker configuration using asset type colors
export const MARKER_CONFIG = {
  COLORS: {
    [ASSET_TYPES.OFFICE.key]: ASSET_TYPES.OFFICE.color,
    [ASSET_TYPES.RETAIL.key]: ASSET_TYPES.RETAIL.color,
    [ASSET_TYPES.HOTEL.key]: ASSET_TYPES.HOTEL.color,
    [ASSET_TYPES.RESIDENTIAL.key]: ASSET_TYPES.RESIDENTIAL.color,
    [ASSET_TYPES.LOGISTICS.key]: ASSET_TYPES.LOGISTICS.color,
    [ASSET_TYPES.PARKING.key]: ASSET_TYPES.PARKING.color,
    [ASSET_TYPES.INDUSTRIAL.key]: ASSET_TYPES.INDUSTRIAL.color,
    [ASSET_TYPES.HEALTHCARE.key]: ASSET_TYPES.HEALTHCARE.color,
    [ASSET_TYPES.OTHER.key]: ASSET_TYPES.OTHER.color,
  },
  
  // Marker sizes for different states
  SIZES: {
    NORMAL: 18,
    HOVERED: 24,
    SELECTED: 26,
  },
  
  // Border and shadow styles
  STYLES: {
    NORMAL: {
      border: '2px solid white',
      boxShadow: '0 0 2px rgba(0,0,0,0.2)',
      zIndex: '1',
    },
    HOVERED: {
      border: '3px solid white',
      boxShadow: '0 0 6px rgba(0, 0, 0, 0.25)',
      zIndex: '50',
    },
    SELECTED: {
      border: '3px solid white',
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)', 
      zIndex: '100',
    },
  },
} as const;

// Legacy exports for backward compatibility
export const MAPBOX_ACCESS_TOKEN = MAPBOX_CONFIG.ACCESS_TOKEN;
export const DEFAULT_MAP_CENTER = MAPBOX_CONFIG.DEFAULT_CENTER;
export const DEFAULT_MAP_ZOOM = MAPBOX_CONFIG.DEFAULT_ZOOM;
export const DEFAULT_MAP_STYLE = MAPBOX_CONFIG.STYLE;
export const MARKER_COLORS = MARKER_CONFIG.COLORS; 