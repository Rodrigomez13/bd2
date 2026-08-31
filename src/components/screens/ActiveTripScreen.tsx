import React, { useEffect, useState, useRef } from 'react';
import { 
  Navigation, 
  ShieldAlert, 
  Phone, 
  MessageSquare, 
  Share2, 
  CheckCircle, 
  Compass, 
  Zap, 
  MapPin, 
  Clock, 
  Car,
  Flag,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Gauge
} from 'lucide-react';
import { MapView } from '../MapView';
import { ActiveTripState } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

interface ActiveTripScreenProps {
  trip: ActiveTripState;
  onFinishTrip: () => void;
  onOpenChat: () => void;
  onOpenShare: () => void;
  onEmergencySOS: () => void;
}

export const ActiveTripScreen: React.FC<ActiveTripScreenProps> = ({
  trip,
  onFinishTrip,
  onOpenChat,
  onOpenShare,
  onEmergencySOS,
}) => {
  const [progress, setProgress] = useState(15);
  const [speed, setSpeed] = useState(42);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simulationSpeedMultiplier, setSimulationSpeedMultiplier] = useState<number>(1);

  // References for requestAnimationFrame tracking
  const progressRef = useRef(15);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Keep progressRef in sync with state for accurate frame delta calculations
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const estimatedMinutes = trip.etaMinutes || 8;
  const totalDistanceKm = trip.distanceKm || 3.8;

  // Real-time trip progress simulation using requestAnimationFrame
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    // Calibrated simulation duration: scaled proportionally to estimated trip duration
    // (e.g. 8 min real-world trip simulated smoothly in ~45 seconds at 1x)
    const baseSimulationDurationMs = (estimatedMinutes * 60 * 1000) / 11;

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current !== null) {
        const deltaMs = timestamp - lastTimestampRef.current;
        
        // Progress delta percentage based on actual frame time delta and multiplier
        const progressDelta = (deltaMs / baseSimulationDurationMs) * 100 * simulationSpeedMultiplier;
        
        setProgress((prev) => {
          const nextProgress = prev + progressDelta;
          if (nextProgress >= 100) {
            triggerHaptic('success');
            return 100;
          }
          return nextProgress;
        });

        // Calculate dynamic physics-based speed (slowing down at corners/intersections and near destination)
        const currentP = progressRef.current;
        let targetSpeed = 46;
        if (currentP < 6 || currentP >= 96) {
          targetSpeed = 18; // Departure / Arrival slow crawl
        } else if (
          (currentP > 22 && currentP < 30) || 
          (currentP > 52 && currentP < 60) || 
          (currentP > 80 && currentP < 88)
        ) {
          targetSpeed = 26; // City turn / Avenue junction deceleration
        } else {
          // Cruising speed with micro-fluctuations
          targetSpeed = 46 + Math.sin(timestamp / 700) * 6;
        }

        setSpeed(Math.round(targetSpeed));
      }

      lastTimestampRef.current = timestamp;

      if (progressRef.current < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimestampRef.current = null;
    };
  }, [isPlaying, simulationSpeedMultiplier, estimatedMinutes]);

  // Derived real-time trip metrics synchronized with progress
  const progressRatio = Math.min(1, Math.max(0, progress / 100));
  const remainingRatio = Math.max(0, 1 - progressRatio);
  
  const remainingDistance = (remainingRatio * totalDistanceKm).toFixed(1);
  const remainingTotalSeconds = Math.max(0, Math.round(remainingRatio * estimatedMinutes * 60));
  const remainingMinutes = Math.floor(remainingTotalSeconds / 60);
  const remainingSeconds = remainingTotalSeconds % 60;
  const progressPercent = Math.min(100, Math.max(0, Math.round(progress)));

  // Dynamic turn-by-turn guidance based on real-time vehicle progress
  const getTurnByTurnGuidance = () => {
    if (progressPercent >= 98) {
      return {
        instruction: '¡Llegaste a tu destino!',
        street: trip.destination.name,
        badge: 'Destino alcanzado',
      };
    }
    if (progressPercent >= 82) {
      return {
        instruction: 'A 150 m • Tu destino está a la derecha',
        street: trip.destination.address || trip.destination.name,
        badge: 'Tramo final',
      };
    }
    if (progressPercent >= 55) {
      return {
        instruction: 'En 400 m • Girá a la izquierda',
        street: 'Av. Gutnisky hacia el acceso principal',
        badge: 'Giro próximo',
      };
    }
    if (progressPercent >= 25) {
      return {
        instruction: 'Continuá recto durante 1.6 km',
        street: 'Av. 25 de Mayo hacia Av. Gutnisky',
        badge: 'Ruta principal',
      };
    }
    return {
      instruction: 'A 200 m • Girá a la derecha',
      street: 'Av. 25 de Mayo y Fontana',
      badge: 'Inicio de viaje',
    };
  };

  const currentGuidance = getTurnByTurnGuidance();

  const getTripStatusText = () => {
    if (progressPercent >= 98) return '¡Has llegado a tu destino!';
    if (progressPercent >= 80) return 'Último tramo del recorrido';
    if (progressPercent >= 40) return 'En viaje hacia el destino';
    return 'Iniciando recorrido';
  };

  const handleTogglePlay = () => {
    triggerHaptic('medium');
    setIsPlaying(!isPlaying);
  };

  const handleCycleSpeed = () => {
    triggerHaptic('light');
    const speeds = [1, 2, 4];
    const nextIdx = (speeds.indexOf(simulationSpeedMultiplier) + 1) % speeds.length;
    setSimulationSpeedMultiplier(speeds[nextIdx]);
  };

  const handleResetSimulation = () => {
    triggerHaptic('selection');
    setProgress(5);
    progressRef.current = 5;
    setIsPlaying(true);
  };

  return (
    <div className="relative min-h-[640px] flex flex-col bg-[#081226] text-white">
      {/* Top Map Area with Live Navigation */}
      <div className="relative h-[310px] w-full overflow-hidden">
        <MapView
          origin={trip.origin}
          destination={trip.destination}
          isNavigating={true}
          progress={progress}
          interactive={false}
        />

        {/* Top Turn-by-Turn Instruction Banner with dynamic updates */}
        <div className="absolute top-3 inset-x-3 z-20">
          <div className="p-3 rounded-2xl bg-[#15213A]/95 backdrop-blur-md border border-[#F5B51B] shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5B51B] flex items-center justify-center text-[#081226] shrink-0 font-extrabold shadow-md">
              <Navigation className="w-5 h-5 transform rotate-45" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold text-[#F5B51B] uppercase tracking-wider truncate">
                  {currentGuidance.instruction}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0D1930] text-[#AEB7C8] border border-[#33405A] shrink-0 font-mono font-bold">
                  {currentGuidance.badge}
                </span>
              </div>
              <span className="text-xs font-bold text-white truncate">
                {currentGuidance.street}
              </span>
            </div>
          </div>
        </div>

        {/* Floating Speedometer, Simulation Controls & SOS Button */}
        <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {/* Speedometer */}
            <div className="px-2.5 py-1.5 rounded-xl bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] flex items-center gap-1.5 shadow-md">
              <Gauge className="w-3.5 h-3.5 text-[#59C878]" />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-black text-white">{speed}</span>
                <span className="text-[8px] text-[#AEB7C8] uppercase font-bold">km/h</span>
              </div>
            </div>

            {/* Simulation Playback & Speed Controls */}
            <div className="flex items-center gap-1 bg-[#15213A]/90 backdrop-blur-md border border-[#33405A] p-1 rounded-xl shadow-md">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-7 h-7 rounded-lg bg-[#0D1930] hover:bg-[#202D47] text-white flex items-center justify-center cursor-pointer transition-colors"
                title={isPlaying ? 'Pausar simulación' : 'Reanudar simulación'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#59C878]" />}
              </button>

              <button
                type="button"
                onClick={handleCycleSpeed}
                className="px-2 h-7 rounded-lg bg-[#0D1930] hover:bg-[#202D47] text-[10px] font-mono font-bold text-[#F5B51B] flex items-center gap-1 cursor-pointer transition-colors"
                title="Velocidad de simulación"
              >
                <FastForward className="w-3 h-3" />
                <span>{simulationSpeedMultiplier}x</span>
              </button>

              <button
                type="button"
                onClick={handleResetSimulation}
                className="w-7 h-7 rounded-lg bg-[#0D1930] hover:bg-[#202D47] text-[#AEB7C8] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Reiniciar recorrido"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('sos');
              onEmergencySOS();
            }}
            className="px-3 py-1.5 rounded-xl bg-red-900/85 hover:bg-red-800 border border-red-500/60 backdrop-blur-md flex items-center gap-1.5 text-xs font-bold text-red-100 shadow-lg active:scale-95 transition-transform cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Bottom Live Trip Status & Controls */}
      <div className="relative z-10 flex-1 px-4 py-3 flex flex-col justify-between">
        <div className="flex flex-col gap-2.5">
          {/* Visual Real-Time Trip Progress Bar Card */}
          <div className="p-3.5 rounded-2xl bg-[#15213A] border border-[#33405A] shadow-md flex flex-col gap-2.5">
            {/* Header: Dynamic Status and Real-time ETA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#59C878] animate-ping" />
                <span className="text-xs font-bold text-white">{getTripStatusText()}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0D1930] border border-[#33405A]">
                <Clock className="w-3.5 h-3.5 text-[#F5B51B]" />
                <span className="text-xs font-black text-[#F5B51B] font-mono">
                  {remainingMinutes > 0 ? `${remainingMinutes}m ${remainingSeconds}s` : `${remainingSeconds}s`}
                </span>
                <span className="text-[10px] text-[#AEB7C8]">restantes</span>
              </div>
            </div>

            {/* Smooth Real-Time Route Progress Track (Synced with requestAnimationFrame) */}
            <div className="relative pt-3 pb-1">
              {/* Background Track */}
              <div className="h-2.5 w-full bg-[#0D1930] rounded-full overflow-hidden border border-[#33405A]/70 relative">
                <div
                  className="h-full bg-gradient-to-r from-[#F5B51B] via-[#FFD66A] to-[#59C878] rounded-full transition-all duration-75 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Real-time Moving Driver Car Indicator Badge */}
              <div
                className="absolute top-0 transform -translate-x-1/2 transition-all duration-75 ease-linear z-10 flex flex-col items-center pointer-events-none"
                style={{ left: `${Math.min(96, Math.max(4, progressPercent))}%` }}
              >
                <div className="w-6 h-6 rounded-full bg-[#F5B51B] border-2 border-[#081226] text-[#081226] flex items-center justify-center shadow-lg">
                  <Car className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Origin, Dynamic Percentage & Destination Labels */}
            <div className="flex items-center justify-between text-[11px] text-[#AEB7C8] pt-0.5">
              <div className="flex items-center gap-1 truncate max-w-[35%]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5B51B] shrink-0" />
                <span className="truncate">{trip.origin.name}</span>
              </div>
              <span className="font-mono text-[10px] font-bold text-[#59C878]">
                {progressPercent}% ({remainingDistance} km restantes)
              </span>
              <div className="flex items-center gap-1 truncate max-w-[35%] justify-end">
                <span className="truncate font-medium text-white">{trip.destination.name}</span>
                <Flag className="w-3 h-3 text-[#59C878] shrink-0" />
              </div>
            </div>
          </div>

          {/* Real-time Trip Metrics Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] flex flex-col items-center text-center">
              <span className="text-[10px] text-[#AEB7C8] uppercase font-semibold">Tiempo est.</span>
              <span className="text-sm font-black text-white font-mono">
                {remainingMinutes}m {remainingSeconds}s
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] flex flex-col items-center text-center">
              <span className="text-[10px] text-[#AEB7C8] uppercase font-semibold">Distancia</span>
              <span className="text-sm font-black text-[#FFD66A]">{remainingDistance} km</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] flex flex-col items-center text-center">
              <span className="text-[10px] text-[#AEB7C8] uppercase font-semibold">Velocidad</span>
              <span className="text-sm font-black text-[#59C878]">{speed} km/h</span>
            </div>
          </div>

          {/* Driver Mini Card with Contact Actions */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1930] border border-[#33405A]">
            <div className="flex items-center gap-2.5">
              <img
                src={trip.driver.avatarUrl}
                alt={trip.driver.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border border-[#F5B51B] object-cover"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">{trip.driver.name}</span>
                <span className="text-[11px] text-[#AEB7C8]">
                  {trip.driver.vehicleModel} ({trip.driver.plate})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onOpenChat();
                }}
                className="w-9 h-9 rounded-full bg-[#15213A] border border-[#33405A] flex items-center justify-center text-[#F5B51B] active:scale-95 cursor-pointer"
                title="Mensaje"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onOpenShare();
                }}
                className="w-9 h-9 rounded-full bg-[#15213A] border border-[#33405A] flex items-center justify-center text-[#FFD66A] active:scale-95 cursor-pointer"
                title="Compartir viaje"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Complete Trip Action Button */}
        <div className="mt-2.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('success');
              onFinishTrip();
            }}
            className="w-full bg-[#59C878] hover:bg-[#4eb369] active:scale-[0.98] text-[#081226] font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(89,200,120,0.35)] transition-all cursor-pointer text-xs"
          >
            <CheckCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Completar viaje y pagar (${trip.price.toLocaleString('es-AR')})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

