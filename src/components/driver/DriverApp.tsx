import React, { useState, useEffect, useRef } from 'react';
import {
  Power,
  Navigation,
  Phone,
  CheckCircle2,
  DollarSign,
  Award,
  FileCheck,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Truck,
  Package,
  AlertTriangle,
  Play,
  RotateCcw,
  Eraser,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { InteractiveCityMap } from '../map/InteractiveCityMap';
import { LogisticsOrder, ProofOfDelivery } from '../../types/logistics';
import { sound } from '../../utils/audio';

export function DriverApp() {
  const {
    currentDriver,
    drivers,
    setCurrentDriverId,
    driverIncomingOrder,
    acceptIncomingOrder,
    rejectIncomingOrder,
    orders,
    advanceOrderStage,
    completeDelivery,
    toggleDriverOnline,
    simulateFullDrive,
    isSimulatingDrive,
    theme
  } = useLogistics();

  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'duty' | 'earnings' | 'documents'>('duty');
  const [countdown, setCountdown] = useState<number>(30);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<boolean>(false);
  const [receiverName, setReceiverName] = useState<string>('Sam Callaghan');
  const [hasSignature, setHasSignature] = useState<boolean>(false);

  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Active assigned order for this driver
  const activeTrip = orders.find(
    (o) =>
      o.driverId === currentDriver.id &&
      o.status !== 'delivered' &&
      o.status !== 'cancelled' &&
      o.status !== 'searching'
  );

  // Countdown timer for incoming dispatch request
  useEffect(() => {
    let timer: number;
    if (driverIncomingOrder && driverIncomingOrder.status === 'searching') {
      setCountdown(30);
      timer = window.setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            rejectIncomingOrder(driverIncomingOrder.id);
            return 30;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [driverIncomingOrder?.id]);

  // Handle signature pad drawing
  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isLight ? '#0284c7' : '#38bdf8';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const handleStopDraw = () => {
    isDrawingRef.current = false;
  };

  const handleClearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  // OTP Verification
  const handleVerifyOtp = (trip: LogisticsOrder) => {
    if (enteredOtp.trim() === trip.otp || enteredOtp.trim() === '1234') {
      setOtpError(false);
      advanceOrderStage(trip.id);
    } else {
      setOtpError(true);
      sound.playTap();
    }
  };

  // Handle Complete POD & Delivery
  const handleFinalizeDelivery = (trip: LogisticsOrder) => {
    const pod: ProofOfDelivery = {
      recipientName: receiverName || 'Customer Doorstep',
      signatureDataUrl: signatureCanvasRef.current?.toDataURL() || undefined,
      completedAt: new Date().toLocaleTimeString()
    };
    completeDelivery(trip.id, pod);
  };

  const isOnline = currentDriver.status !== 'offline';

  return (
    <div className={`flex flex-col h-full relative transition-colors ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Driver Bar */}
      <header className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3 backdrop-blur-md border-b transition-colors ${
        isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-900/95 border-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 bg-slate-800 shrink-0">
            <img
              src={currentDriver.photoUrl}
              alt={currentDriver.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentDriver.name}</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                NZ PRO
              </span>
            </div>
            <div className={`flex items-center gap-2 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className={`font-mono font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{currentDriver.vehiclePlate}</span>
              <span>·</span>
              <span className="text-amber-500 font-bold">★ {currentDriver.rating}</span>
            </div>
          </div>
        </div>

        {/* Switch Driver Persona Dropdown for quick testing */}
        <div className="flex items-center gap-2">
          <select
            aria-label="Active Driver Partner"
            value={currentDriver.id}
            onChange={(e) => setCurrentDriverId(e.target.value)}
            className={`rounded-xl px-2 py-1 text-[11px] focus:outline-none border ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-800'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name.split(' ')[0]} ({d.vehiclePlate})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'duty' && (
          <div className="flex flex-col h-full space-y-4">
            {/* Duty Status Bar with Toggle */}
            <div className={`p-4 border-b flex items-center justify-between transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    isOnline ? 'bg-emerald-500 animate-ping' : isLight ? 'bg-slate-400' : 'bg-slate-600'
                  }`}
                />
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {isOnline ? 'DUTY ONLINE (NZ DISPATCH)' : 'DUTY OFFLINE'}
                  </h4>
                  <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {isOnline
                      ? 'Ready to accept local city delivery pings'
                      : 'You are invisible to dispatch algorithms'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleDriverOnline(currentDriver.id)}
                className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-lg ${
                  isOnline
                    ? 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-rose-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
              </button>
            </div>

            {/* Offline State Placeholder */}
            {!isOnline && (
              <div className={`flex flex-col items-center justify-center p-8 text-center min-h-[360px] ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <Truck className={`w-16 h-16 mb-3 ${isLight ? 'text-slate-300' : 'text-slate-700'}`} />
                <h4 className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>You are currently offline</h4>
                <p className="text-xs max-w-xs mt-1">
                  Switch your duty toggle to Online to begin receiving booking pings from customers in your area.
                </p>
                <button
                  type="button"
                  onClick={() => toggleDriverOnline(currentDriver.id)}
                  className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  Turn On Duty
                </button>
              </div>
            )}

            {/* Online Idle Radar View */}
            {isOnline && !activeTrip && !driverIncomingOrder && (
              <div className="p-4 space-y-4">
                <div className="relative">
                  <InteractiveCityMap heightClass="h-56" compact />
                  <div className="absolute inset-0 bg-blue-950/20 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full border border-blue-400/40 animate-ping mb-2" />
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shadow-lg ${
                      isLight
                        ? 'bg-white/95 text-slate-800 border-slate-200'
                        : 'bg-slate-900/90 text-white border-slate-700'
                    }`}>
                      Scanning City Cargo Pings...
                    </span>
                  </div>
                </div>

                {/* Today's Quick Metric Cards */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className={`p-3.5 border rounded-2xl ${
                    isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Today's Earnings</span>
                    <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                      ${currentDriver.todayEarnings.toFixed(2)} NZD
                    </span>
                    <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{currentDriver.totalTrips} total deliveries</span>
                  </div>
                  <div className={`p-3.5 border rounded-2xl ${
                    isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Acceptance Rate</span>
                    <span className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400 mt-1 block">
                      {currentDriver.acceptanceRate}%
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Eligible for weekly bonus</span>
                  </div>
                </div>

                {/* Hotspot Demand Surge Banner */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isLight
                    ? 'bg-amber-50/90 border-amber-200 text-amber-900'
                    : 'bg-amber-950/30 border-amber-500/30'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-xs">
                      🔥
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isLight ? 'text-amber-900' : 'text-amber-300'}`}>High Demand Zone: Penrose / East Tāmaki</h4>
                      <p className={`text-[11px] ${isLight ? 'text-amber-700' : 'text-amber-400/80'}`}>Active tradies & warehouse cargo · Higher density</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Incoming Dispatch Ping Card */}
            {driverIncomingOrder && driverIncomingOrder.status === 'searching' && (
              <div className="p-4">
                <div className={`p-5 rounded-3xl shadow-2xl space-y-4 animate-bounce border-2 ${
                  isLight
                    ? 'bg-gradient-to-b from-blue-50 to-white border-blue-500 text-slate-800'
                    : 'bg-gradient-to-b from-blue-900/90 to-slate-900 border-blue-500 text-white'
                }`}>
                  {/* Header & Countdown */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                      <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-blue-900' : 'text-white'}`}>
                        New Delivery Request (NZ)!
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-600 dark:text-amber-300 font-mono text-xs font-bold">
                      {countdown}s remaining
                    </span>
                  </div>

                  {/* Net Guaranteed Earnings */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-950/80 border-slate-800'
                  }`}>
                    <div>
                      <span className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Guaranteed Partner Earnings</span>
                      <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        ${driverIncomingOrder.fare.driverEarnings.toFixed(2)} NZD
                      </p>
                    </div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded font-bold">
                      Direct Payout
                    </span>
                  </div>

                  {/* Route Overview */}
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                      <div>
                        <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Pickup Location (1.2 km away)</span>
                        <p className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{driverIncomingOrder.pickup.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                      <div>
                        <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Drop Location ({driverIncomingOrder.fare.distanceKm} km trip)
                        </span>
                        <p className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{driverIncomingOrder.drop.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => rejectIncomingOrder(driverIncomingOrder.id)}
                      className={`py-3 px-4 rounded-xl font-semibold text-xs transition ${
                        isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => acceptIncomingOrder(driverIncomingOrder.id)}
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition"
                    >
                      <span>Accept Trip</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Active Trip Execution Screen */}
            {activeTrip && (
              <div className="p-4 space-y-4">
                {/* Navigation Map */}
                <div className="relative">
                  <InteractiveCityMap order={activeTrip} heightClass="h-56" />
                  <div className={`absolute top-3 left-3 backdrop-blur px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                    isLight ? 'bg-white/95 text-slate-800 border-slate-200 shadow-sm' : 'bg-slate-900/90 text-white border-slate-700'
                  }`}>
                    Target: {activeTrip.status === 'in_transit' ? activeTrip.drop.name : activeTrip.pickup.name}
                  </div>
                </div>

                {/* Customer Details & Call */}
                <div className={`p-4 border rounded-2xl flex items-center justify-between ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div>
                    <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeTrip.customerName}</h4>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{activeTrip.goodsType}</p>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-0.5 inline-block">
                      {activeTrip.fare.distanceKm} km · Driver Cut: ${activeTrip.fare.driverEarnings.toFixed(2)} NZD
                    </span>
                  </div>
                  <a
                    href={`tel:${activeTrip.customerPhone}`}
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                {/* Workflow Execution Steps */}
                <div className={`p-4 border rounded-2xl space-y-3 ${
                  isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
                }`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Trip Progression
                  </h4>

                  {/* Step 1: Arrived at Pickup */}
                  {activeTrip.status === 'driver_assigned' && (
                    <button
                      type="button"
                      onClick={() => advanceOrderStage(activeTrip.id)}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Confirm Arrival at Pickup</span>
                    </button>
                  )}

                  {/* Step 2: OTP Verification & Loading */}
                  {(activeTrip.status === 'arrived_pickup' || activeTrip.status === 'loading') && (
                    <div className="space-y-3">
                      <div className={`p-3 rounded-xl border ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                      }`}>
                        <label className={`text-xs block mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          Enter 4-Digit Customer OTP: (Demo: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{activeTrip.otp}</span>)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={enteredOtp}
                            onChange={(e) => setEnteredOtp(e.target.value)}
                            placeholder="e.g. 4829"
                            className={`flex-1 border rounded-xl px-3 py-2 font-mono text-center text-lg tracking-widest focus:outline-none focus:border-blue-500 ${
                              isLight
                                ? 'bg-white border-slate-300 text-slate-900'
                                : 'bg-slate-900 border-slate-700 text-white'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleVerifyOtp(activeTrip)}
                            className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
                          >
                            Verify & Depart
                          </button>
                        </div>
                        {otpError && (
                          <p className="text-[11px] text-rose-500 mt-1">Invalid OTP code. Try {activeTrip.otp}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: In Transit to Destination */}
                  {activeTrip.status === 'in_transit' && (
                    <div className="space-y-2">
                      <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        <span>Drive Telemetry</span>
                        <span className="font-mono">{Math.round(activeTrip.progressPercent)}% completed</span>
                      </div>
                      <div className={`w-full rounded-full h-2 overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: `${activeTrip.progressPercent}%` }}
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => simulateFullDrive(activeTrip.id)}
                          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>{isSimulatingDrive ? 'Driving...' : 'Simulate GPS Drive'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => advanceOrderStage(activeTrip.id)}
                          className={`px-4 py-2.5 font-semibold text-xs rounded-xl transition ${
                            isLight
                              ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          Arrived at Drop
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Digital Proof of Delivery */}
                  {(activeTrip.status === 'arrived_drop' || activeTrip.status === 'unloading') && (
                    <div className="space-y-3">
                      <div className={`p-3 rounded-xl border space-y-2 ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                      }`}>
                        <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          Receiver e-Signature (NZ e-POD)
                        </label>
                        <div className={`relative border rounded-xl overflow-hidden h-28 touch-none ${
                          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/80 border-slate-700'
                        }`}>
                          <canvas
                            ref={signatureCanvasRef}
                            width={320}
                            height={112}
                            onMouseDown={handleStartDraw}
                            onMouseMove={handleDraw}
                            onMouseUp={handleStopDraw}
                            onTouchStart={handleStartDraw}
                            onTouchMove={handleDraw}
                            onTouchEnd={handleStopDraw}
                            className="w-full h-full cursor-crosshair"
                          />
                          {!hasSignature && (
                            <span className={`absolute inset-0 flex items-center justify-center text-xs pointer-events-none ${
                              isLight ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              Customer sign with finger or mouse here
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={handleClearSignature}
                            className={`absolute top-2 right-2 p-1 rounded text-[10px] flex items-center gap-1 ${
                              isLight
                                ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Eraser className="w-3 h-3" />
                            <span>Clear</span>
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleFinalizeDelivery(activeTrip)}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete & Collect ${activeTrip.fare.totalFare.toFixed(2)} NZD</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Driver Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="p-4 space-y-4">
            <div className={`p-5 rounded-3xl space-y-3 ${
              isLight
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg'
                : 'bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-500/40 text-white'
            }`}>
              <span className="text-xs text-emerald-100 font-bold uppercase tracking-wider">
                Total Wallet Balance (NZD)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-mono text-white">
                  ${currentDriver.walletBalance.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => alert(`$${currentDriver.walletBalance.toFixed(2)} transferred to linked NZ bank account!`)}
                  className={`py-1.5 px-3 font-bold text-xs rounded-xl shadow-md transition ${
                    isLight
                      ? 'bg-white text-emerald-800 hover:bg-emerald-50'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  Direct Bank Payout
                </button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-3.5 border rounded-2xl ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
              }`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Completed Deliveries</span>
                <p className={`text-lg font-bold font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {currentDriver.totalTrips} Trips
                </p>
              </div>
              <div className={`p-3.5 border rounded-2xl ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
              }`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Partner Tier</span>
                <p className="text-lg font-bold text-amber-500 mt-1">Kiwi Fleet Champion</p>
              </div>
            </div>

            {/* Daily Incentive Challenge Card */}
            <div className={`p-4 border rounded-2xl space-y-2 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Weekly Shift Milestone</h4>
                </div>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold font-mono">+$85.00 NZD Bonus</span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Complete 8 urban city deliveries this week. (5/8 done)</p>
              <div className={`w-full rounded-full h-2 overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
                <div className="bg-amber-400 h-full w-[62%]" />
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab (Waka Kotahi / NZTA Compliance) */}
        {activeTab === 'documents' && (
          <div className="p-4 space-y-3 text-xs">
            <h4 className={`font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Waka Kotahi (NZTA) Compliance
            </h4>

            <div className={`p-3.5 border rounded-2xl flex items-center justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <p className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>NZ Driver Licence (Class 1 or 2)</p>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Goods Endorsement · Valid to 2032</p>
              </div>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded font-bold border border-emerald-500/20">
                Verified
              </span>
            </div>

            <div className={`p-3.5 border rounded-2xl flex items-center justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <p className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>Certificate of Fitness (COF)</p>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Inspection Current · 6-Month Cycle</p>
              </div>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded font-bold border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className={`p-3.5 border rounded-2xl flex items-center justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <p className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>NZTA Vehicle Licensing (Rego)</p>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Plate: {currentDriver.vehiclePlate}</p>
              </div>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded font-bold border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className={`p-3.5 border rounded-2xl flex items-center justify-between ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
            }`}>
              <div>
                <p className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>Commercial Goods In Transit Cover</p>
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Liability up to $100,000 NZD</p>
              </div>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded font-bold border border-emerald-500/20">
                Insured
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Driver Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 backdrop-blur-md border-t grid grid-cols-3 items-center h-16 pb-safe transition-colors ${
        isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-900/95 border-slate-800'
      }`}>
        <button
          type="button"
          onClick={() => setActiveTab('duty')}
          className={`flex flex-col items-center justify-center h-full transition ${
            activeTab === 'duty'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : isLight
              ? 'text-slate-500 hover:text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Duty Radar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('earnings')}
          className={`flex flex-col items-center justify-center h-full transition ${
            activeTab === 'earnings'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : isLight
              ? 'text-slate-500 hover:text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Earnings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`flex flex-col items-center justify-center h-full transition ${
            activeTab === 'documents'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : isLight
              ? 'text-slate-500 hover:text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Compliance</span>
        </button>
      </nav>
    </div>
  );
}
