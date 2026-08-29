import React, { useEffect, useState } from 'react';
import { Compass, Navigation, Plus, Minus, ShieldCheck, Zap } from 'lucide-react';
import { LocationItem } from '../types';

interface MapViewProps {
  origin?: LocationItem | null;
  destination?: LocationItem | null;
  isNavigating?: boolean;
  progress?: number; // 0 to 100
  driverApproaching?: boolean;
  showCars?: boolean;
  onMapClick?: (coords: { x: number; y: number }) => void;
  className?: string;
  interactive?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  origin,
  destination,
  isNavigating = false,
  progress = 0,
  driverApproaching = false,
  showCars = true,
  className = '',
  interactive = true,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => (p + 1) % 100);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Route path coordinates in SVG space (0-400 x, 0-600 y)
  // Origin approx at (100, 480), Destination approx at (300, 140)
  const routePoints = [
    { x: 100, y: 480 },
    { x: 100, y: 380 },
    { x: 170, y: 350 },
    { x: 220, y: 260 },
    { x: 260, y: 220 },
    { x: 300, y: 140 },
  ];

  // Calculate current vehicle position based on progress
  const getCarPosition = (pct: number) => {
    const totalSegments = routePoints.length - 1;
    const segmentIndex = Math.min(
      Math.floor((pct / 100) * totalSegments),
      totalSegments - 1
    );
    const segmentProgress = ((pct / 100) * totalSegments) % 1;
    const p1 = routePoints[segmentIndex];
    const p2 = routePoints[segmentIndex + 1] || p1;

    const x = p1.x + (p2.x - p1.x) * segmentProgress;
    const y = p1.y + (p2.y - p1.y) * segmentProgress;
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI) + 90;

    return { x, y, angle };
  };

  // Driver approaching position (moving towards origin)
  const approachingCar = {
    x: 100 + (Math.sin(pulse * 0.1) * 30),
    y: 430 - (pulse * 0.5),
    angle: 180,
  };

  const activeCar = isNavigating ? getCarPosition(progress) : null;

  return (
    <div
      className={`relative w-full h-full min-h-[280px] bg-[#081226] overflow-hidden select-none ${className}`}
      id="bear-map-container"
    >
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Redise%C3%B1o%20de%20Pantalla%20de%20Inicio%20App.png-yoNfwwFbq5u5XoyGM27D4kW8OFtr9e.jpeg"
        alt="Paisaje futurista de Formosa al atardecer"
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#081226]/35 pointer-events-none" />
      {/* Dynamic Night City Map SVG overlay */}
      <svg
        viewBox="0 0 400 600"
        className="w-full h-full object-cover opacity-35 transition-transform duration-500"
        style={{ transform: `scale(${zoom})` }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Water gradient for Rio Paraguay / Costanera */}
          <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#040b17" />
            <stop offset="100%" stopColor="#0c1a30" />
          </linearGradient>

          {/* Neon Route Glow */}
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Grid pattern */}
          <pattern id="nightGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#15213A" strokeWidth="0.8" opacity="0.6" />
            <circle cx="20" cy="20" r="0.8" fill="#33405A" opacity="0.4" />
          </pattern>
        </defs>

        {/* Base Background */}
        <rect width="400" height="600" fill="#081226" />
        <rect width="400" height="600" fill="url(#nightGrid)" />

        {/* River bend at top-right (Costanera Vuelta Fermosa vibe) */}
        <path
          d="M260 0 C 280 100, 370 140, 400 200 L400 0 Z"
          fill="url(#riverGrad)"
          stroke="#15213A"
          strokeWidth="1.5"
        />
        <text x="330" y="80" fill="#33405A" fontSize="9" fontWeight="600" letterSpacing="1">
          RÍO PARAGUAY
        </text>

        {/* City Blocks / Zoning areas */}
        <rect x="30" y="60" width="80" height="100" rx="6" fill="#0D1930" stroke="#15213A" strokeWidth="1" />
        <rect x="130" y="80" width="100" height="70" rx="6" fill="#0D1930" stroke="#15213A" strokeWidth="1" />
        <rect x="40" y="200" width="110" height="120" rx="6" fill="#0D1930" stroke="#15213A" strokeWidth="1" />
        <rect x="180" y="180" width="90" height="100" rx="6" fill="#0D1930" stroke="#15213A" strokeWidth="1" />
        <rect x="40" y="360" width="120" height="90" rx="6" fill="#0D1930" stroke="#15213A" strokeWidth="1" />
        <rect x="190" y="320" width="160" height="130" rx="6" fill="#0D1930" stroke="#15213A" strokeWidth="1" />

        {/* Green park zones */}
        <rect x="190" y="90" width="40" height="50" rx="4" fill="#0c2419" stroke="#1b4d36" strokeWidth="0.8" opacity="0.7" />
        <text x="194" y="118" fill="#59C878" fontSize="7" fontWeight="600">P. San Martín</text>

        {/* Secondary Street Grid */}
        <g stroke="#15213A" strokeWidth="3" strokeLinecap="round">
          <line x1="0" y1="180" x2="400" y2="180" />
          <line x1="0" y1="340" x2="400" y2="340" />
          <line x1="0" y1="480" x2="400" y2="480" />
          <line x1="160" y1="0" x2="160" y2="600" />
          <line x1="280" y1="0" x2="280" y2="600" />
          <line x1="60" y1="0" x2="60" y2="600" />
        </g>

        {/* Primary Avenues (Illuminated Dark Gold/Blue) */}
        <g stroke="#202D47" strokeWidth="7" strokeLinecap="round">
          {/* Av. 25 de Mayo (Diagonal / Main) */}
          <line x1="20" y1="560" x2="380" y2="120" />
          {/* Av. Gutnisky */}
          <line x1="100" y1="580" x2="100" y2="40" />
          {/* Av. Pantaleón Gómez */}
          <line x1="0" y1="260" x2="400" y2="260" />
          {/* Costanera */}
          <path d="M250 0 Q 280 120 370 190" fill="none" />
        </g>

        {/* Street Name Labels */}
        <text x="75" y="440" fill="#6A778F" fontSize="8" fontWeight="600" transform="rotate(-90 75 440)">
          Av. Gutnisky
        </text>
        <text x="210" y="305" fill="#6A778F" fontSize="8" fontWeight="600" transform="rotate(-30 210 305)">
          Av. 25 de Mayo
        </text>
        <text x="285" y="195" fill="#6A778F" fontSize="8" fontWeight="600">
          Costanera Vuelta Fermosa
        </text>

        {/* Surrounding Active Fleet Cars (Dots) */}
        {showCars && (
          <g>
            <circle cx="160" cy="220" r="5" fill="#15213A" stroke="#F5B51B" strokeWidth="2" />
            <circle cx="280" cy="380" r="5" fill="#15213A" stroke="#F5B51B" strokeWidth="2" />
            <circle cx="70" cy="140" r="4" fill="#15213A" stroke="#59C878" strokeWidth="2" />
            <circle cx="230" cy="460" r="5" fill="#15213A" stroke="#FFD66A" strokeWidth="2" />
          </g>
        )}

        {/* Planned Route Line (Gold Neon) */}
        {(origin || destination || isNavigating) && (
          <g>
            {/* Glowing blur underlayer */}
            <path
              d="M 100 480 L 100 380 L 170 350 L 220 260 L 260 220 L 300 140"
              fill="none"
              stroke="#F5B51B"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
              filter="url(#routeGlow)"
            />
            {/* Solid golden route line */}
            <path
              d="M 100 480 L 100 380 L 170 350 L 220 260 L 260 220 L 300 140"
              fill="none"
              stroke="#F5B51B"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Animated dotted overlay */}
            <path
              d="M 100 480 L 100 380 L 170 350 L 220 260 L 260 220 L 300 140"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="6 8"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>
        )}

        {/* Origin Pin (Pick-up) */}
        <g transform="translate(100, 480)">
          {/* Ripple */}
          <circle cx="0" cy="0" r="14" fill="#F5B51B" opacity="0.2" className="animate-ping" />
          <circle cx="0" cy="0" r="8" fill="#F5B51B" stroke="#081226" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="3" fill="#081226" />
          {/* Label banner */}
          <rect x="-42" y="12" width="84" height="20" rx="10" fill="#15213A" stroke="#F5B51B" strokeWidth="1" />
          <text x="0" y="25" fill="#F5F7FA" fontSize="8" fontWeight="600" textAnchor="middle">
            Tu ubicación
          </text>
        </g>

        {/* Destination Pin (Drop-off) */}
        <g transform="translate(300, 140)">
          <circle cx="0" cy="0" r="18" fill="#F5B51B" opacity="0.25" />
          <circle cx="0" cy="0" r="10" fill="#FF4B4B" stroke="#F5F7FA" strokeWidth="2" />
          <path d="M0 -4 L0 4 M-4 0 L4 0" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Label banner */}
          <rect x="-46" y="-32" width="92" height="22" rx="11" fill="#15213A" stroke="#33405A" strokeWidth="1" />
          <text x="0" y="-18" fill="#F5B51B" fontSize="8" fontWeight="700" textAnchor="middle">
            {destination ? destination.name.slice(0, 14) : 'Destino'}
          </text>
        </g>

        {/* Live Approaching Driver Marker */}
        {driverApproaching && (
          <g transform={`translate(${approachingCar.x}, ${approachingCar.y}) rotate(${approachingCar.angle})`}>
            <circle cx="0" cy="0" r="14" fill="#F5B51B" opacity="0.3" className="animate-pulse" />
            <rect x="-10" y="-16" width="20" height="32" rx="6" fill="#F5B51B" stroke="#081226" strokeWidth="2" />
            {/* Windshield */}
            <rect x="-7" y="-8" width="14" height="8" rx="2" fill="#081226" />
            <circle cx="-5" cy="-14" r="2" fill="#FFFFFF" />
            <circle cx="5" cy="-14" r="2" fill="#FFFFFF" />
          </g>
        )}

        {/* Live Active Navigation Vehicle */}
        {activeCar && (
          <g transform={`translate(${activeCar.x}, ${activeCar.y}) rotate(${activeCar.angle})`}>
            {/* Gold Halo */}
            <circle cx="0" cy="0" r="16" fill="#F5B51B" opacity="0.4" />
            {/* Vehicle body */}
            <rect x="-11" y="-18" width="22" height="36" rx="6" fill="#F5F7FA" stroke="#081226" strokeWidth="2.5" />
            {/* Front & Rear windows */}
            <rect x="-8" y="-9" width="16" height="8" rx="2" fill="#15213A" />
            <rect x="-7" y="6" width="14" height="5" rx="1.5" fill="#15213A" />
            {/* Yellow Taxi / Bear Cap roof accent */}
            <rect x="-5" y="-2" width="10" height="4" rx="2" fill="#F5B51B" />
            {/* Headlights beam */}
            <polygon points="-8,-18 8,-18 16,-45 -16,-45" fill="#FFF4B8" opacity="0.25" />
          </g>
        )}
      </svg>

      {/* Floating Map Controls */}
      {interactive && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z + 0.2, 1.8))}
            className="w-10 h-10 rounded-full bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
            aria-label="Zoom in"
          >
            <Plus className="w-5 h-5 text-[#F5B51B]" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
            className="w-10 h-10 rounded-full bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
            aria-label="Zoom out"
          >
            <Minus className="w-5 h-5 text-white" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="w-10 h-10 rounded-full bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
            aria-label="Recentrar mapa"
          >
            <Compass className="w-5 h-5 text-[#AEB7C8]" />
          </button>
        </div>
      )}

      {/* Top Floating Security Pill */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] shadow-lg">
        <ShieldCheck className="w-4 h-4 text-[#59C878]" />
        <span className="text-[11px] font-semibold text-white tracking-wide">Viaje Seguro GPS</span>
      </div>
    </div>
  );
};
