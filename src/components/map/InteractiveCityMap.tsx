import React, { useState, useMemo } from 'react';
import {
  Navigation,
  MapPin,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Truck,
  Package,
  Radio,
  Wifi,
  Gauge
} from 'lucide-react';
import { DriverPartner, LogisticsOrder, MapPoint, VehicleCategoryId } from '../../types/logistics';
import { useLogistics } from '../../context/LogisticsContext';

interface InteractiveCityMapProps {
  order?: LogisticsOrder | null;
  drivers?: DriverPartner[];
  interactiveSelection?: boolean;
  onSelectCoordinate?: (point: { x: number; y: number; name: string }) => void;
  selectionMode?: 'pickup' | 'drop' | null;
  heightClass?: string;
  showAllDrivers?: boolean;
  onSelectDriver?: (driver: DriverPartner) => void;
  selectedDriverId?: string;
  compact?: boolean;
}

export function InteractiveCityMap({
  order,
  drivers = [],
  interactiveSelection = false,
  onSelectCoordinate,
  selectionMode,
  heightClass = 'h-96',
  showAllDrivers = false,
  onSelectDriver,
  selectedDriverId,
  compact = false
}: InteractiveCityMapProps) {
  const {
    theme,
    liveTheme,
    liveRadarActive,
    setLiveRadarActive,
    liveTelemetry,
    currentCity
  } = useLogistics();

  const isLight = theme === 'light';

  const [zoom, setZoom] = useState<number>(1);
  const [trafficEnabled, setTrafficEnabled] = useState<boolean>(true);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  // Compute animated vehicle position along the route waypoints
  const vehiclePos = useMemo(() => {
    if (!order || !order.routeWaypoints || order.routeWaypoints.length < 2) {
      if (order?.pickup) {
        return { x: order.pickup.x, y: order.pickup.y, angle: 45 };
      }
      return { x: 50, y: 50, angle: 0 };
    }

    const waypoints = order.routeWaypoints;
    const progress = Math.min(100, Math.max(0, order.progressPercent || 0)) / 100;
    const totalSegments = waypoints.length - 1;
    const rawIdx = progress * totalSegments;
    const currentIdx = Math.min(totalSegments - 1, Math.floor(rawIdx));
    const nextIdx = Math.min(totalSegments, currentIdx + 1);
    const subProgress = rawIdx - currentIdx;

    const p1 = waypoints[currentIdx];
    const p2 = waypoints[nextIdx];

    const x = p1.x + (p2.x - p1.x) * subProgress;
    const y = p1.y + (p2.y - p1.y) * subProgress;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return { x, y, angle };
  }, [order?.routeWaypoints, order?.progressPercent, order?.pickup]);

  // Handle map click for location picking
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactiveSelection || !onSelectCoordinate) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const roundedX = Math.round(clickX * 10) / 10;
    const roundedY = Math.round(clickY * 10) / 10;

    onSelectCoordinate({
      x: roundedX,
      y: roundedY,
      name: `Point (${roundedX}%, ${roundedY}%)`
    });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((((e.clientX - rect.left) / rect.width) * 100) * 10) / 10;
    const y = Math.round((((e.clientY - rect.top) / rect.height) * 100) * 10) / 10;
    setHoverCoords({ x, y });
  };

  // Live theme color configurations
  const themeColors = useMemo(() => {
    if (isLight) {
      return {
        bg: '#f1f5f9',
        gridFill: '#f8fafc',
        gridBlock: '#e2e8f0',
        roadMajor: '#cbd5e1',
        roadMinor: '#e2e8f0',
        water: '#bae6fd',
        parks: '#bbf7d0',
        radarStroke: '#0284c7',
        radarSweepFill: 'rgba(2, 132, 199, 0.08)',
        accentGlow: 'rgba(2, 132, 199, 0.25)'
      };
    }
    switch (liveTheme) {
      case 'kiwi_emerald':
        return {
          bg: '#051611',
          gridFill: '#08211b',
          gridBlock: '#0c2e26',
          roadMajor: '#124738',
          roadMinor: '#0d362a',
          water: '#0a1d30',
          parks: '#0d2e24',
          radarStroke: '#10b981',
          radarSweepFill: 'rgba(16, 185, 129, 0.12)',
          accentGlow: 'rgba(16, 185, 129, 0.4)'
        };
      case 'alert_amber':
        return {
          bg: '#140c06',
          gridFill: '#1f1309',
          gridBlock: '#2b1b0d',
          roadMajor: '#4d2d14',
          roadMinor: '#38200e',
          water: '#0a1d30',
          parks: '#0d2e24',
          radarStroke: '#f59e0b',
          radarSweepFill: 'rgba(245, 158, 11, 0.12)',
          accentGlow: 'rgba(245, 158, 11, 0.4)'
        };
      case 'daylight_live':
        return {
          bg: '#0a1628',
          gridFill: '#0f2038',
          gridBlock: '#142a47',
          roadMajor: '#1d3d66',
          roadMinor: '#162f52',
          water: '#0a1d30',
          parks: '#0d2e24',
          radarStroke: '#38bdf8',
          radarSweepFill: 'rgba(56, 189, 248, 0.12)',
          accentGlow: 'rgba(56, 189, 248, 0.4)'
        };
      case 'neon_radar':
      default:
        return {
          bg: '#070d18',
          gridFill: '#0b1424',
          gridBlock: '#0e1b30',
          roadMajor: '#1b3259',
          roadMinor: '#132440',
          water: '#0a1d30',
          parks: '#0d2e24',
          radarStroke: '#06b6d4',
          radarSweepFill: 'rgba(6, 182, 212, 0.14)',
          accentGlow: 'rgba(6, 182, 212, 0.4)'
        };
    }
  }, [liveTheme, isLight]);

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden rounded-2xl border border-slate-700/60 bg-[${themeColors.bg}] select-none`}
      style={{ backgroundColor: themeColors.bg }}
    >
      {/* SVG Map Canvas */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverCoords(null)}
        className={`w-full h-full cursor-${interactiveSelection ? 'crosshair' : 'default'} transition-transform duration-300`}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        {/* Background Grid & Water bodies / Parks */}
        <defs>
          <pattern id="live-city-blocks" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill={themeColors.gridFill} />
            <rect x="0.8" y="0.8" width="8.4" height="8.4" rx="0.5" fill={themeColors.gridBlock} />
          </pattern>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="liveGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Radar Sweep Gradient Wedge */}
          <linearGradient id="radarSweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={themeColors.radarStroke} stopOpacity="0.4" />
            <stop offset="80%" stopColor={themeColors.radarStroke} stopOpacity="0.03" />
            <stop offset="100%" stopColor={themeColors.radarStroke} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base urban land */}
        <rect width="100" height="100" fill="url(#live-city-blocks)" />

        {/* River / Coastline feature (Waitemata Harbour / Avon River) */}
        <path
          d="M -5 30 Q 25 25, 45 42 T 95 38 T 105 50 L 105 60 Q 75 48, 48 50 T -5 40 Z"
          fill={themeColors.water}
          opacity="0.85"
        />

        {/* Green Parks / Reserve Zones */}
        <rect x="6" y="8" width="14" height="12" rx="2" fill={themeColors.parks} opacity="0.85" />
        <rect x="72" y="65" width="20" height="16" rx="3" fill={themeColors.parks} opacity="0.85" />
        <rect x="30" y="70" width="15" height="12" rx="2" fill={themeColors.parks} opacity="0.85" />

        {/* Secondary Grid Roads */}
        <g stroke={themeColors.roadMinor} strokeWidth="0.8" strokeLinecap="round">
          <line x1="0" y1="15" x2="100" y2="15" />
          <line x1="0" y1="35" x2="100" y2="35" />
          <line x1="0" y1="55" x2="100" y2="55" />
          <line x1="0" y1="75" x2="100" y2="75" />
          <line x1="0" y1="90" x2="100" y2="90" />

          <line x1="15" y1="0" x2="15" y2="100" />
          <line x1="35" y1="0" x2="35" y2="100" />
          <line x1="55" y1="0" x2="55" y2="100" />
          <line x1="75" y1="0" x2="75" y2="100" />
          <line x1="90" y1="0" x2="90" y2="100" />
        </g>

        {/* Major Expressways / Arterial Highways (SH1 / SH16 / SH20) */}
        <g stroke={themeColors.roadMajor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Ring Road */}
          <path
            d="M 12 12 Q 50 4, 88 12 Q 96 50, 88 88 Q 50 96, 12 88 Q 4 50, 12 12 Z"
            fill="none"
          />
          {/* Diagonal Arterials */}
          <line x1="0" y1="0" x2="100" y2="100" />
          <line x1="10" y1="90" x2="90" y2="10" />
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="0" y1="50" x2="100" y2="50" />
        </g>

        {/* Live Traffic Overlay */}
        {trafficEnabled && (
          <g strokeLinecap="round" opacity="0.85">
            <line x1="0" y1="50" x2="35" y2="50" stroke="#10b981" strokeWidth="1.2" />
            <line x1="35" y1="50" x2="65" y2="50" stroke="#f59e0b" strokeWidth="1.2" />
            <line x1="65" y1="50" x2="100" y2="50" stroke="#10b981" strokeWidth="1.2" />
            <line x1="50" y1="20" x2="50" y2="45" stroke="#ef4444" strokeWidth="1.2" />
            <line x1="50" y1="45" x2="50" y2="80" stroke="#10b981" strokeWidth="1.2" />
            <line x1="10" y1="90" x2="45" y2="55" stroke="#f59e0b" strokeWidth="1.2" />
          </g>
        )}

        {/* Live Radar Concentric Range Rings */}
        <g stroke={themeColors.radarStroke} strokeOpacity="0.2" fill="none" strokeWidth="0.4">
          <circle cx="50" cy="50" r="16" strokeDasharray="1.5 1.5" />
          <circle cx="50" cy="50" r="32" strokeDasharray="1.5 1.5" />
          <circle cx="50" cy="50" r="48" strokeDasharray="1.5 1.5" />
          <line x1="50" y1="2" x2="50" y2="98" strokeDasharray="1 2" strokeOpacity="0.15" />
          <line x1="2" y1="50" x2="98" y2="50" strokeDasharray="1 2" strokeOpacity="0.15" />
        </g>

        {/* Range Ring Labels */}
        <g fill={themeColors.radarStroke} fillOpacity="0.4" fontSize="1.6" fontFamily="monospace">
          <text x="51" y="34.5">5km</text>
          <text x="51" y="18.5">10km</text>
          <text x="51" y="3.5">15km</text>
        </g>

        {/* Live Sweeping Radar Cone Animation */}
        {liveRadarActive && (
          <g className="animate-radar-sweep" style={{ transformOrigin: '50% 50%' }}>
            {/* Radar Sweep Wedge */}
            <path
              d="M 50 50 L 50 2 A 48 48 0 0 1 84 16 Z"
              fill="url(#radarSweepGradient)"
              opacity="0.75"
            />
            {/* Leading scanning line with glow */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="2"
              stroke={themeColors.radarStroke}
              strokeWidth="0.7"
              strokeOpacity="0.9"
              filter="url(#liveGlow)"
            />
          </g>
        )}

        {/* District Zone Labels */}
        <g fill="#475569" fontSize="2.2" fontFamily="sans-serif" fontWeight="600">
          <text x="16" y="24">West Freight</text>
          <text x="44" y="20">Central CBD</text>
          <text x="70" y="32">Commercial Park</text>
          <text x="20" y="62">Industrial Hub</text>
          <text x="50" y="58">Logistics Gateway</text>
          <text x="70" y="78">Airport Cargo</text>
        </g>

        {/* Active Route Path Polyline */}
        {order && order.routeWaypoints && order.routeWaypoints.length > 1 && (
          <g>
            {/* Background Glow */}
            <path
              d={order.routeWaypoints.reduce(
                (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`,
                ''
              )}
              fill="none"
              stroke={liveTheme === 'kiwi_emerald' ? '#059669' : '#2563eb'}
              strokeWidth="2.8"
              strokeOpacity="0.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Animated Dashed Delivery Line */}
            <path
              d={order.routeWaypoints.reduce(
                (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`,
                ''
              )}
              fill="none"
              stroke={liveTheme === 'alert_amber' ? '#f59e0b' : '#00D26A'}
              strokeWidth="1.4"
              strokeDasharray="2 1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-map-dash"
            />
          </g>
        )}

        {/* Pickup Pin Marker */}
        {order?.pickup && (
          <g transform={`translate(${order.pickup.x}, ${order.pickup.y})`}>
            {/* Pulse */}
            <circle r="3.2" fill="#22c55e" opacity="0.3" className="animate-radar-ping" />
            <circle r="1.6" fill="#22c55e" />
            <circle r="0.8" fill="#ffffff" />
            {/* Label */}
            <rect
              x="-6.5"
              y="-6.8"
              width="13"
              height="3.6"
              rx="1"
              fill="#064e3b"
              stroke="#22c55e"
              strokeWidth="0.3"
            />
            <text
              x="0"
              y="-4.4"
              fill="#ffffff"
              fontSize="1.7"
              fontWeight="bold"
              textAnchor="middle"
            >
              PICKUP
            </text>
          </g>
        )}

        {/* Drop Destination Pin Marker */}
        {order?.drop && (
          <g transform={`translate(${order.drop.x}, ${order.drop.y})`}>
            {/* Pulse */}
            <circle r="3.2" fill="#ef4444" opacity="0.25" className="animate-radar-ping" />
            <circle r="1.6" fill="#ef4444" />
            <circle r="0.8" fill="#ffffff" />
            {/* Label */}
            <rect
              x="-6"
              y="-6.8"
              width="12"
              height="3.6"
              rx="1"
              fill="#7f1d1d"
              stroke="#ef4444"
              strokeWidth="0.3"
            />
            <text
              x="0"
              y="-4.4"
              fill="#ffffff"
              fontSize="1.7"
              fontWeight="bold"
              textAnchor="middle"
            >
              DROP
            </text>
          </g>
        )}

        {/* All Fleet Drivers (For Admin Control Tower or Idle Map) */}
        {showAllDrivers &&
          drivers.map((drv) => {
            const isSelected = drv.id === selectedDriverId;
            const isDriverOnTrip = drv.status === 'assigned' || drv.status === 'in_transit';
            const color =
              drv.status === 'offline'
                ? '#64748b'
                : isDriverOnTrip
                ? '#38bdf8'
                : '#10b981';

            return (
              <g
                key={drv.id}
                transform={`translate(${drv.currentLocation.x}, ${drv.currentLocation.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDriver?.(drv);
                }}
                className="cursor-pointer transition-transform hover:scale-125"
              >
                {/* Continuous Live Radar Wave around online drivers */}
                {drv.status !== 'offline' && (
                  <circle
                    r="4.2"
                    fill={color}
                    opacity="0.2"
                    className="animate-radar-ping"
                  />
                )}
                {isSelected && (
                  <circle r="5" fill="#38bdf8" opacity="0.35" className="animate-radar-ping" />
                )}
                <circle
                  r="2.2"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
                <circle r="0.8" fill="#ffffff" />
                <text
                  x="0"
                  y="4.2"
                  fill="#94a3b8"
                  fontSize="1.6"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {drv.name.split(' ')[0]}
                </text>
              </g>
            );
          })}

        {/* Active Order Vehicle Marker (Animated) with Real-Time Speed Telemetry */}
        {order && (order.status === 'driver_assigned' || order.status === 'in_transit' || order.status === 'arrived_pickup' || order.status === 'loading') && (
          <g
            transform={`translate(${vehiclePos.x}, ${vehiclePos.y})`}
            className="transition-transform duration-500 ease-linear"
          >
            {/* Multiple Radar Waves around moving vehicle */}
            <circle r="5.5" fill="#00e5ff" opacity="0.2" className="animate-radar-ping" />
            <circle r="3.2" fill="#0284c7" stroke="#ffffff" strokeWidth="0.6" filter="url(#liveGlow)" />
            {/* Direction Arrow */}
            <g transform={`rotate(${vehiclePos.angle})`}>
              <polygon points="0,-2.2 1.4,1.8 -1.4,1.8" fill="#ffffff" />
            </g>
            {/* Floating Live Telemetry Badge with Speed */}
            <g transform="translate(0, -5.2)">
              <rect
                x="-11"
                y="-3.2"
                width="22"
                height="4.2"
                rx="1.2"
                fill="#021631"
                stroke="#38bdf8"
                strokeWidth="0.35"
              />
              <text
                x="0"
                y="-0.4"
                fill="#38bdf8"
                fontSize="1.7"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                ● 52 km/h · {order.driverVehiclePlate || 'TRUCK'}
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Live Radar Header HUD Overlay (Top-Left) */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 z-20 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-live-glow" />
          <span className="font-bold tracking-wider">LIVE RADAR</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">{currentCity.name.toUpperCase()}</span>
          {hoverCoords && (
            <>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400 font-semibold">{hoverCoords.x}%, {hoverCoords.y}%</span>
            </>
          )}
        </div>
      </div>

      {/* Floating HUD Controls (Top-Right) */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
        <button
          type="button"
          onClick={() => setLiveRadarActive(!liveRadarActive)}
          title={liveRadarActive ? 'Pause Radar Sweep' : 'Activate Radar Sweep'}
          className={`p-2 rounded-xl border backdrop-blur shadow-md active:scale-95 transition ${
            liveRadarActive
              ? isLight
                ? 'bg-sky-100 text-sky-700 border-sky-300'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
              : isLight
              ? 'bg-white/90 text-slate-400 border-slate-200'
              : 'bg-slate-800/90 text-slate-500 border-slate-700'
          }`}
        >
          <Radio className={`w-4 h-4 ${liveRadarActive ? 'animate-pulse' : ''}`} />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2.2, z + 0.25))}
          title="Zoom In"
          className={`p-2 rounded-xl border backdrop-blur shadow-md active:scale-95 transition ${
            isLight
              ? 'bg-white/95 hover:bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.9, z - 0.25))}
          title="Zoom Out"
          className={`p-2 rounded-xl border backdrop-blur shadow-md active:scale-95 transition ${
            isLight
              ? 'bg-white/95 hover:bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setTrafficEnabled(!trafficEnabled)}
          title="Toggle Traffic Density"
          className={`p-2 rounded-xl border backdrop-blur shadow-md active:scale-95 transition ${
            trafficEnabled
              ? isLight
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-emerald-600/30 text-emerald-400 border-emerald-500/50'
              : isLight
              ? 'bg-white/90 text-slate-400 border-slate-200'
              : 'bg-slate-800/90 text-slate-400 border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Selection Notification Bar */}
      {interactiveSelection && (
        <div className="absolute top-12 left-3 bg-blue-600/90 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 border border-blue-400/40 z-20">
          <Crosshair className="w-3.5 h-3.5 animate-spin" />
          <span>Click anywhere on the map to pin {selectionMode === 'drop' ? 'Destination' : 'Pickup'}</span>
        </div>
      )}

      {/* Live Map Telemetry & Legend Bar (Bottom) */}
      {!compact && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
          {/* Legend */}
          <div className={`flex items-center gap-2 backdrop-blur-md px-3 py-1.5 rounded-xl border text-[11px] ${
            isLight
              ? 'bg-white/90 border-slate-200 text-slate-700 shadow-sm'
              : 'bg-slate-950/85 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Pickup</span>
            </div>
            <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>·</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Drop</span>
            </div>
            <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>·</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Moving Vehicle</span>
            </div>
          </div>

          {/* Real-Time GPS Telemetry Readout */}
          <div className={`hidden sm:flex items-center gap-2 backdrop-blur-md px-3 py-1.5 rounded-xl border text-[11px] font-mono ${
            isLight
              ? 'bg-white/90 border-slate-200 text-slate-700 shadow-sm'
              : 'bg-slate-950/85 border-cyan-500/30 text-cyan-400'
          }`}>
            <Wifi className="w-3 h-3 text-emerald-500" />
            <span>{liveTelemetry.satellitesLocked} SATS</span>
            <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>·</span>
            <span>{liveTelemetry.latencyMs}ms</span>
            <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>·</span>
            <span className="text-emerald-500 font-semibold">{liveTelemetry.rtkAccuracy}</span>
          </div>
        </div>
      )}
    </div>
  );
}
