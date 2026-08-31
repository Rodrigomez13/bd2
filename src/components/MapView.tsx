import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Compass, LocateFixed, Minus, Plus, ShieldCheck } from 'lucide-react';
import { LocationItem } from '../types';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  origin?: LocationItem | null;
  destination?: LocationItem | null;
  isNavigating?: boolean;
  progress?: number;
  driverApproaching?: boolean;
  showCars?: boolean;
  onMapClick?: (coords: { x: number; y: number }) => void;
  className?: string;
  interactive?: boolean;
}

const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined;
const fallbackCenter: [number, number] = [-58.1781, -26.1775];

export const MapView: React.FC<MapViewProps> = ({
  origin,
  destination,
  isNavigating = false,
  progress = 0,
  driverApproaching = false,
  showCars = true,
  onMapClick,
  className = '',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const originMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState(!token);

  useEffect(() => {
    if (!containerRef.current || !token) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: origin ? [origin.lng, origin.lat] : fallbackCenter,
      zoom: 12.5,
      attributionControl: false,
      cooperativeGestures: true,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');
    map.on('load', () => setMapReady(true));
    map.on('error', () => setError(true));
    map.on('click', (event) => onMapClick?.({ x: event.lngLat.lng, y: event.lngLat.lat }));
    return () => { map.remove(); mapRef.current = null; };
  }, [onMapClick]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !origin || !destination) return;
    const coordinates: [number, number][] = [[origin.lng, origin.lat], [destination.lng, destination.lat]];
    const source = map.getSource('bear-route') as mapboxgl.GeoJSONSource | undefined;
    const data = { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } } as unknown as Parameters<mapboxgl.GeoJSONSource['setData']>[0];
    if (source) source.setData(data);
    else {
      map.addSource('bear-route', { type: 'geojson', data });
      map.addLayer({ id: 'bear-route-casing', type: 'line', source: 'bear-route', paint: { 'line-color': '#081226', 'line-width': 8, 'line-opacity': 0.75 } });
      map.addLayer({ id: 'bear-route-line', type: 'line', source: 'bear-route', paint: { 'line-color': '#F5B51B', 'line-width': 4, 'line-opacity': 0.95 }, layout: { 'line-cap': 'round', 'line-join': 'round' } });
    }
    originMarkerRef.current?.remove();
    destinationMarkerRef.current?.remove();
    originMarkerRef.current = new mapboxgl.Marker({ color: '#F5B51B' }).setLngLat([origin.lng, origin.lat]).setPopup(new mapboxgl.Popup({ offset: 20 }).setText(`Salida: ${origin.name}`)).addTo(map);
    destinationMarkerRef.current = new mapboxgl.Marker({ color: '#FF4B4B' }).setLngLat([destination.lng, destination.lat]).setPopup(new mapboxgl.Popup({ offset: 20 }).setText(`Destino: ${destination.name}`)).addTo(map);
    const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);
    coordinates.forEach((coordinate) => bounds.extend(coordinate));
    map.fitBounds(bounds, { padding: 70, maxZoom: 14, duration: 900 });
  }, [origin, destination, mapReady]);

  const recenter = () => {
    const map = mapRef.current;
    if (!map) return;
    if (origin && destination) map.fitBounds(new mapboxgl.LngLatBounds([origin.lng, origin.lat], [destination.lng, destination.lat]), { padding: 70, duration: 700 });
    else map.flyTo({ center: origin ? [origin.lng, origin.lat] : fallbackCenter, zoom: 12.5 });
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-[280px] overflow-hidden bg-[#081226] ${className}`} id="bear-map-container">
      {error && <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#081226] p-6 text-center"><div><p className="font-bold text-[#F5B51B]">Mapa no disponible</p><p className="mt-1 text-xs text-[#AEB7C8]">Verificá tu token público de Mapbox.</p></div></div>}
      {interactive && !error && <div className="absolute top-4 right-4 z-20 flex flex-col gap-2"><button type="button" onClick={() => mapRef.current?.zoomIn()} aria-label="Acercar mapa" className="map-control"><Plus /></button><button type="button" onClick={() => mapRef.current?.zoomOut()} aria-label="Alejar mapa" className="map-control"><Minus /></button><button type="button" onClick={recenter} aria-label="Recentrar mapa" className="map-control"><Compass /></button><button type="button" onClick={() => mapRef.current?.locate()} aria-label="Mi ubicación" className="map-control"><LocateFixed /></button></div>}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full border border-[#33405A] bg-[#15213A]/90 px-3 py-1.5 shadow-lg backdrop-blur-md"><ShieldCheck className="h-4 w-4 text-[#59C878]" /><span className="text-[11px] font-semibold tracking-wide text-white">Viaje Seguro GPS</span></div>
      {(isNavigating || driverApproaching || showCars) && <span className="sr-only">Mapa interactivo con seguimiento de viaje al {progress}%</span>}
    </div>
  );
};
