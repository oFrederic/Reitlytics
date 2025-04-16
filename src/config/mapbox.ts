// Mapbox configuration settings

// Add your Mapbox API token in .env.local file as NEXT_PUBLIC_MAPBOX_TOKEN
export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Default map settings centered on Tokyo
export const DEFAULT_MAP_CENTER: [number, number] = [139.7527, 35.6852]; // Tokyo coordinates
export const DEFAULT_MAP_ZOOM = 11;
export const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/streets-v12'; // More colorful Google Maps-like style

// Color scheme for different property types
export const MARKER_COLORS = {
  office: '#4285F4',      // Blue
  retail: '#EA4335',      // Red
  hotel: '#FBBC05',       // Yellow
  residential: '#34A853', // Green
  other: '#9C27B0'        // Purple
}; 