import React, { useEffect, useMemo, useState } from 'react';
import { Compass, Minus, Plus, ShieldCheck } from 'lucide-react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { LocationItem } from '../types';

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

const FORMOSA: L.LatLngExpression = [-26.1775, -58.1781];
const DESTINATION: L.LatLngExpression = [-26.171, -58.159];
const DRIVER: L.LatLngExpression = [-26.182, -58.169];

const makeIcon = (color: string, label: string) => L.divIcon({
  className: 'bear-map-marker',
  html: `<span style="--marker-color:${color}" aria-label="${label}"></span>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const originIcon = makeIcon('#F5B51B', 'Tu ubicación');
const destinationIcon = makeIcon('#FF6B6B', 'Destino');
const driverIcon = makeIcon('#59C878', 'Conductor');

function MapClickHandler({ onMapClick }: { onMapClick?: MapViewProps['onMapClick'] }) {
  useMapEvents({ click: (event) => onMapClick?.({ x: event.latlng.lng, y: event.latlng.lat }) });
  return null;
}

function MapControls({ zoom }: { zoom: number }) {
  const map = useMap();
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button type="button" onClick={() => map.zoomIn()} className="map-control" aria-label="Acercar mapa"><Plus className="h-5 w-5 text-[#F5B51B]" /></button>
      <button type="button" onClick={() => map.zoomOut()} className="map-control" aria-label="Alejar mapa"><Minus className="h-5 w-5" /></button>
      <button type="button" onClick={() => map.setView(FORMOSA, zoom)} className="map-control" aria-label="Recentrar mapa"><Compass className="h-5 w-5 text-[#AEB7C8]" /></button>
    </div>
  );
}

export const MapView: React.FC<MapViewProps> = ({ origin, destination, driverApproaching = false, showCars = true, onMapClick, className = '', interactive = true }) => {
  const [zoom, setZoom] = useState(14);
  const destinationPosition = useMemo(() => destination ? DESTINATION : null, [destination]);

  useEffect(() => {
    const handler = () => setZoom(14);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div id="bear-map-container" className={`relative min-h-[280px] h-full w-full overflow-hidden bg-[#081226] ${className}`}>
      <MapContainer center={FORMOSA} zoom={zoom} zoomControl={false} scrollWheelZoom={interactive} dragging={interactive} className="h-full w-full">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onMapClick={onMapClick} />
        {interactive && <MapControls zoom={zoom} />}
        <Marker position={FORMOSA} icon={originIcon} title="Tu ubicación" />
        {destinationPosition && <Marker position={destinationPosition} icon={destinationIcon} title={destination.name} />}
        {driverApproaching && <Marker position={DRIVER} icon={driverIcon} title="Conductor acercándose" />}
        {showCars && <><Marker position={[-26.168, -58.174]} icon={driverIcon} /><Marker position={[-26.185, -58.16]} icon={driverIcon} /></>}
      </MapContainer>
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-1.5 rounded-full border border-[#33405A] bg-[#15213A]/90 px-3 py-1.5 shadow-lg backdrop-blur-md">
        <ShieldCheck className="h-4 w-4 text-[#59C878]" /><span className="text-[11px] font-semibold tracking-wide text-white">Mapa OpenStreetMap</span>
      </div>
    </div>
  );
};
