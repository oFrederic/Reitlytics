'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { JReitBuilding } from '@/mocks/buildings.type';
import {
  MAPBOX_ACCESS_TOKEN,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  DEFAULT_MAP_STYLE,
  MARKER_COLORS
} from '@/config/mapbox';

// Only set the token if it exists and we're in the browser
if (typeof window !== 'undefined' && MAPBOX_ACCESS_TOKEN) {
  console.log('Setting Mapbox token:', MAPBOX_ACCESS_TOKEN ? 'Token exists' : 'No token');
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
}

// Helper function to get building type label
function getBuildingTypeLabel(assetType: {
  isOffice?: boolean;
  isRetail?: boolean;
  isResidential?: boolean;
  isHotel?: boolean;
  isLogistic?: boolean;
}): string {
  if (assetType.isOffice) return 'オフィス';
  if (assetType.isRetail) return '商業施設';
  if (assetType.isResidential) return '住宅';
  if (assetType.isHotel) return 'ホテル';
  if (assetType.isLogistic) return '物流施設';
  return 'その他';
}

interface MapComponentProps {
  buildings?: JReitBuilding[];
  selectedBuilding?: JReitBuilding | null;
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  onBuildingClick?: (building: JReitBuilding) => void;
}

export default function MapComponent({
  buildings = [],
  selectedBuilding = null,
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  onBuildingClick
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{[id: string]: mapboxgl.Marker & { popup?: mapboxgl.Popup, building: JReitBuilding }}>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize map on component mount
  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error('No Mapbox token available');
      setError('No Mapbox access token provided');
      return;
    }
    
    if (map.current || !mapContainer.current) return;

    try {
      console.log('Initializing map with token:', MAPBOX_ACCESS_TOKEN ? 'Available' : 'Missing');
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: DEFAULT_MAP_STYLE,
        center,
        zoom,
      });

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
      });
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Error loading map: ' + (e.error?.message || 'Unknown error'));
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Error initializing map: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
    
    // Clean up resources when component unmounts
    return () => {
      if (map.current) {
        clearMarkers();
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom]);

  // Helper function to remove all markers
  const clearMarkers = () => {
    Object.values(markers.current).forEach(marker => {
      if (marker.popup) marker.popup.remove();
      marker.remove();
    });
    markers.current = {};
  };

  // Create markers for buildings
  const createMarkers = useCallback(() => {
    if (!map.current || !mapLoaded) return;
    
    // Remove existing markers
    clearMarkers();
    
    // Filter buildings to show only the selected one if any is selected
    const buildingsToShow = selectedBuilding ? 
      buildings.filter(building => building.id === selectedBuilding.id) : 
      buildings;
    
    // Add markers for each building
    buildingsToShow.forEach((building) => {
      if (!building.buildingSpec.latitude || !building.buildingSpec.longitude) return;
      
      const longitude = parseFloat(building.buildingSpec.longitude);
      const latitude = parseFloat(building.buildingSpec.latitude);
      
      if (isNaN(longitude) || isNaN(latitude)) return;
      
      // Set color based on building type
      let markerColor = MARKER_COLORS.other;
      if (building.assetType.isOffice) markerColor = MARKER_COLORS.office;
      else if (building.assetType.isRetail) markerColor = MARKER_COLORS.retail;
      else if (building.assetType.isHotel) markerColor = MARKER_COLORS.hotel;
      else if (building.assetType.isResidential) markerColor = MARKER_COLORS.residential;
      
      // Determine if this is the selected building
      const isSelected = selectedBuilding && building.id === selectedBuilding.id;
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = markerColor; // Always use the building type color
      el.style.width = isSelected ? '26px' : '18px'; // Make selected marker larger
      el.style.height = isSelected ? '26px' : '18px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = isSelected ? '3px solid white' : '2px solid white'; // Thicker border for selected
      el.style.boxShadow = isSelected ? '0 0 8px rgba(0, 0, 0, 0.3)' : '0 0 2px rgba(0,0,0,0.2)'; // Add shadow for selected
      el.style.zIndex = isSelected ? '100' : '1'; // Make selected marker appear on top
      
      // Create popup for this marker
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: isSelected ? true : false, // Use explicit boolean values
        closeOnClick: false,
        className: 'building-popup' // Add custom class for styling
      })
      .setHTML(`
        <div style="padding: 12px; max-width: 300px; font-family: sans-serif;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
            <span style="display: inline-flex; align-items: center; vertical-align: middle; margin-right: 4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" fill="currentColor"/>
              </svg>
            </span>
            ${building.buildingSpec.name}
          </h3>
          
          <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; font-size: 13px;">
            <div style="display: flex; align-items: center;">
              <span style="color: #666; margin-right: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
              </span>
              <span style="font-weight: 500;">住所</span>
            </div>
            <div>${building.buildingSpec.address}</div>
            
            <div style="display: flex; align-items: center;">
              <span style="color: #666; margin-right: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" fill="currentColor"/>
                </svg>
              </span>
              <span style="font-weight: 500;">アセット</span>
            </div>
            <div>${getBuildingTypeLabel(building.assetType)}</div>
            
            <div style="display: flex; align-items: center;">
              <span style="color: #666; margin-right: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="currentColor"/>
                </svg>
              </span>
              <span style="font-weight: 500;">初回取得日</span>
            </div>
            <div>${building.acquisition?.acquisitionDate || '-'}</div>
            
            <div style="display: flex; align-items: center;">
              <span style="color: #666; margin-right: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="currentColor"/>
                </svg>
              </span>
              <span style="font-weight: 500;">最新実CR</span>
            </div>
            <div>${building.yieldEvaluation.capRate}%</div>
            
            <div style="display: flex; align-items: center;">
              <span style="color: #666; margin-right: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="currentColor"/>
                </svg>
              </span>
              <span style="font-weight: 500;">最新鑑定評価額</span>
            </div>
            <div>${(building.yieldEvaluation.appraisedPrice / 100000000).toFixed(2)}億円</div>
            
            ${building.buildingSpec.netLeasableAreaTotal ? `
            <div style="display: flex; align-items: center;">
              <span style="color: #666; margin-right: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z" fill="currentColor"/>
                </svg>
              </span>
              <span style="font-weight: 500;">貸付可能面積</span>
            </div>
            <div>${building.buildingSpec.netLeasableAreaTotal}坪</div>
            ` : ''}
            
            ${building.buildingSpec.grossFloorArea ? `
            <div style="display: flex; align-items: center;">
              <span style="color: #666; margin-right: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.15 3.85l-.82.82-.95-.96-.96.96.96.96-.96.96.96.96-.96.96.96.96-.96.96c-.39.39-.39 1.02 0 1.41l.96.96c.39.39 1.02.39 1.41 0l.96-.96.96.96c.39.39 1.02.39 1.41 0l.96-.96c.39-.39.39-1.02 0-1.41l-.96-.96.96-.96-.96-.96.96-.96-.96-.96.96-.96-.96-.96.82-.82c.39-.39.39-1.02 0-1.41l-.25-.26c-.39-.39-1.02-.39-1.41 0zm-3.6 3.59L18 6.9l-.96.96-.96-.96.96-.96-.45-.45-2.13 2.13 1.42 1.42L17 8.92l.96.96-.96.96.96.96-1.11 1.11 1.42 1.42 2.13-2.12-.96-.96.96-.96-.96-.96.96-.96-.96-.96zM8.58 7.17l1.42 1.42-5.66 5.66L2.92 12.8l5.66-5.66zm12.16 12.16l-1.42-1.42-5.66 5.66 1.42 1.42 5.66-5.66z" fill="currentColor"/>
                </svg>
              </span>
              <span style="font-weight: 500;">延床面積</span>
            </div>
            <div>${building.buildingSpec.grossFloorArea}坪</div>
            ` : ''}
            
            ${building.financials && building.financials.length > 0 ? `
            <div style="display: flex; align-items: center;">
              <span style="color: #666; margin-right: 4px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2v-7h2v7zm4 0h-2V7h2v10z" fill="currentColor"/>
                </svg>
              </span>
              <span style="font-weight: 500;">現在の稼働率</span>
            </div>
            <div>${building.financials[0].leasing.occupancyRate}%</div>
            ` : ''}
          </div>
        </div>
      `);
      
      // Create and add marker with popup
      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(popup);
        
      // Only add to map if map.current exists
      if (map.current) {
        marker.addTo(map.current);
      }
      
      // Show popup for selected building or on hover for others
      if (isSelected) {
        if (map.current) {
          popup.addTo(map.current);
        }
      } else {
        // Show popup on hover for non-selected buildings
        el.addEventListener('mouseenter', () => {
          if (map.current) {
            popup.addTo(map.current);
          }
        });
        
        // Hide popup when not hovering (only for non-selected buildings)
        el.addEventListener('mouseleave', () => {
          popup.remove();
        });
      }
      
      // Set up click handler
      if (onBuildingClick) {
        el.addEventListener('click', () => {
          onBuildingClick(building);
        });
      }
      
      // Store marker with its associated building for later reference
      markers.current[building.id] = Object.assign(marker, { popup, building });
    });
  }, [buildings, selectedBuilding, mapLoaded, onBuildingClick]);

  // Update markers when buildings or selected building changes
  useEffect(() => {
    if (map.current) {
      createMarkers();
    }
  }, [buildings, selectedBuilding, createMarkers]);

  // Handle selected building - zoom to it or reset to default position when deselected
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    if (selectedBuilding) {
      // Zoom to selected building
      const selectedMarker = markers.current[selectedBuilding.id];
      if (selectedMarker) {
        // Get coordinates
        const longitude = parseFloat(selectedBuilding.buildingSpec.longitude);
        const latitude = parseFloat(selectedBuilding.buildingSpec.latitude);
        
        if (!isNaN(longitude) && !isNaN(latitude)) {
          // Use jumpTo for instant movement without animation
          map.current.jumpTo({
            center: [longitude, latitude],
            zoom: 15
          });
          
          // Ensure popup is showing
          if (selectedMarker.popup && map.current) {
            selectedMarker.popup.addTo(map.current);
          }
        }
      }
    } else {
      // No building selected, reset to default view
      map.current.jumpTo({
        center: DEFAULT_MAP_CENTER,
        zoom: DEFAULT_MAP_ZOOM
      });
    }
  }, [selectedBuilding, mapLoaded]);

  // Add style element for custom popup styling
  useEffect(() => {
    // Only add the style once
    if (!document.getElementById('mapbox-custom-styles')) {
      const style = document.createElement('style');
      style.id = 'mapbox-custom-styles';
      style.innerHTML = `
        .building-popup {
          z-index: 10 !important;
        }
        .mapboxgl-popup {
          z-index: 10 !important; 
        }
        .mapboxgl-marker {
          z-index: 1;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-sm text-gray-600">Please check the console for more details.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="map-container"
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  );
} 