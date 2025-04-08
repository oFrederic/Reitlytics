'use client';

import { useRef, useEffect, useState } from 'react';
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

interface MapComponentProps {
  buildings?: JReitBuilding[];
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  onBuildingClick?: (building: JReitBuilding) => void;
}

export default function MapComponent({
  buildings = [],
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  onBuildingClick
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
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

  // Update markers when buildings data changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Remove existing markers
    clearMarkers();
    
    // Add markers for each building
    buildings.forEach((building) => {
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
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = markerColor;
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      
      // Create and add marker with popup
      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${building.buildingSpec.name}</h3><p>${building.buildingSpec.address}</p>`)
        )
        .addTo(map.current);
      
      // Set up click handler
      if (onBuildingClick) {
        el.addEventListener('click', () => {
          onBuildingClick(building);
        });
      }
      
      // Store for later cleanup
      markers.current.push(marker);
    });
  }, [buildings, mapLoaded, onBuildingClick]);

  // Helper function to remove all markers
  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

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