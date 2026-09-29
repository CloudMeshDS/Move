import React, { useState } from 'react';
import {
  Smartphone,
  Truck,
  LayoutDashboard,
  Columns,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  Radio,
  Code,
  Layers,
  Cpu,
  Wifi,
  Activity,
  Zap,
  Globe,
  Sun,
  Moon,
  Database
} from 'lucide-react';
import { LogisticsProvider, useLogistics, UserRole } from './context/LogisticsContext';
import { CustomerApp } from './components/customer/CustomerApp';
import { DriverApp } from './components/driver/DriverApp';
import { AdminPortal } from './components/admin/AdminPortal';
import { RNCustomerApp } from './components/native/RNCustomerApp';
import { RNDriverApp } from './components/native/RNDriverApp';
import { RNCodeExporter } from './components/native/RNCodeExporter';
import { SupabaseModal } from './components/admin/SupabaseModal';
import { sound } from './utils/audio';

function MainLayout() {
  const {
    activeRole,
    setActiveRole,
    soundEnabled,
    setSoundEnabled,
    splitView,
    setSplitView,
    resetAllData,
    loadQuickDemoOrder,
    activeOrder,
    currentCity,
    theme,
    toggleTheme,
    liveTheme,
    setLiveTheme,
    liveRadarActive,
    setLiveRadarActive,
    liveTelemetry,
    liveTrafficTicker,
    isSupabaseLive,
    refreshFromSupabase,
    isSupabaseModalOpen,
    setIsSupabaseModalOpen
  } = useLogistics();

  const [deviceFrame, setDeviceFrame] = useState<boolean>(true);
  const [useReactNativeEngine, setUseReactNativeEngine] = useState<boolean>(true);
  const [showExporter, setShowExporter] = useState<boolean>(false);

  // Dedicated App Mode ('customer' | 'driver' | 'admin' | 'omni')
  const getInitialAppMode = (): 'customer' | 'driver' | 'admin' | 'omni' => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get('app');
      if (appParam === 'customer' || appParam === 'driver' || appParam === 'admin' || appParam === 'omni') {
        return appParam;
      }
    }
    const envTarget = (import.meta as any).env?.VITE_APP_TARGET;
    if (envTarget === 'customer' || envTarget === 'driver' || envTarget === 'admin') {
      return envTarget;
    }
    return 'omni';
  };

  const [appMode, setAppMode] = useState<'customer' | 'driver' | 'admin' | 'omni'>(getInitialAppMode);

  const isLight = theme === 'light';

  // Dynamic glow border for mobile frame according to live theme
  const liveFrameGlowClass =
    isLight
      ? 'border-slate-300 shadow-slate-300/40'
      : liveTheme === 'kiwi_emerald'
      ? 'border-emerald-500/50 shadow-emerald-950/60 live-glow-emerald'
      : liveTheme === 'alert_amber'
      ? 'border-amber-500/50 shadow-amber-950/60 live-glow-amber'
      : liveTheme === 'daylight_live'
      ? 'border-sky-500/50 shadow-sky-950/60'
      : 'border-cyan-500/50 shadow-cyan-950/60 live-glow-cyan';

  const mobileFrameClass = isLight
    ? 'bg-slate-100 border-[6px] border-slate-300 shadow-2xl shadow-slate-400/20'
    : `bg-slate-950 border-[6px] shadow-2xl ${liveFrameGlowClass}`;

  // 1. PURE CUSTOMER APP FULLSCREEN
  if (appMode === 'customer') {
    return (
      <div className={`h-screen w-screen overflow-hidden relative ${isLight ? 'bg-slate-50' : 'bg-slate-950'}`}>
        {useReactNativeEngine ? <RNCustomerApp /> : <CustomerApp />}
        {!(import.meta as any).env?.VITE_APP_TARGET && (
          <button
            type="button"
            onClick={() => setAppMode('omni')}
            className="fixed bottom-3 right-3 z-50 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 backdrop-blur-md transition flex items-center gap-1.5 opacity-60 hover:opacity-100"
            title="Switch back to Multi-App Showcase"
          >
            <Columns className="w-3 h-3" />
            <span>Showcase Mode</span>
          </button>
        )}
      </div>
    );
  }

  // 2. PURE DRIVER PARTNER APP FULLSCREEN
  if (appMode === 'driver') {
    return (
      <div className={`h-screen w-screen overflow-hidden relative ${isLight ? 'bg-slate-50' : 'bg-slate-950'}`}>
        {useReactNativeEngine ? <RNDriverApp /> : <DriverApp />}
        {!(import.meta as any).env?.VITE_APP_TARGET && (
          <button
            type="button"
            onClick={() => setAppMode('omni')}
            className="fixed bottom-3 right-3 z-50 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 backdrop-blur-md transition flex items-center gap-1.5 opacity-60 hover:opacity-100"
            title="Switch back to Multi-App Showcase"
          >
            <Columns className="w-3 h-3" />
            <span>Showcase Mode</span>
          </button>
        )}
      </div>
    );
  }

  // 3. PURE OPERATIONS CONTROL TOWER FULLSCREEN
  if (appMode === 'admin') {
    return (
      <div className={`h-screen w-screen overflow-hidden relative ${isLight ? 'bg-slate-50' : 'bg-slate-950'}`}>
        <AdminPortal />
        {!(import.meta as any).env?.VITE_APP_TARGET && (
          <button
            type="button"
            onClick={() => setAppMode('omni')}
            className="fixed bottom-3 right-3 z-50 bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 backdrop-blur-md transition flex items-center gap-1.5 opacity-60 hover:opacity-100"
            title="Switch back to Multi-App Showcase"
          >
            <Columns className="w-3 h-3" />
            <span>Showcase Mode</span>
          </button>
        )}
      </div>
    );
  }

  // 4. OMNI-ROLE SHOWCASE MODE (Default on Desktop)
  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden select-none transition-colors duration-300 ${
      isLight
        ? 'bg-slate-100 text-slate-800'
        : liveTheme === 'kiwi_emerald'
        ? 'bg-[#03110d] text-slate-100'
        : liveTheme === 'alert_amber'
        ? 'bg-[#100904] text-slate-100'
        : liveTheme === 'daylight_live'
        ? 'bg-[#091322] text-slate-100'
        : 'bg-[#050a14] text-slate-100'
    }`}>
      {/* Real-time Global Live Operations Ticker & Telemetry Bar */}
      <div
        className={`h-8 border-b text-[11px] font-mono flex items-center justify-between px-3 z-50 shrink-0 backdrop-blur-md transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-700 shadow-xs'
            : liveTheme === 'kiwi_emerald'
            ? 'bg-emerald-950/80 border-emerald-900/60 text-emerald-300'
            : liveTheme === 'alert_amber'
            ? 'bg-amber-950/80 border-amber-900/60 text-amber-300'
            : liveTheme === 'daylight_live'
            ? 'bg-slate-900/90 border-sky-900/60 text-sky-200'
            : 'bg-[#050a14]/90 border-cyan-900/40 text-cyan-300'
        }`}
      >
        {/* Left: Live Pulse Status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-ping absolute opacity-75" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          </div>
          <span className="font-bold tracking-wider">LIVE NZ OPS</span>
          <span className="opacity-50">|</span>
          <span className={`font-sans font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            {currentCity.name} Hub
          </span>
        </div>

        {/* Center: Live Road & Ferry Marquee Ticker */}
        <div className="hidden md:flex flex-1 overflow-hidden mx-4 relative">
          <div className="animate-marquee whitespace-nowrap opacity-90 hover:opacity-100 cursor-pointer">
            {liveTrafficTicker.map((item, idx) => (
              <span key={idx} className="mx-6 inline-flex items-center gap-1.5">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Live Telemetry & Quick Theme Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 opacity-80">
            <Wifi className="w-3 h-3 text-emerald-500" />
            <span>{liveTelemetry.satellitesLocked} SATS</span>
            <span className="opacity-40">·</span>
            <span>{liveTelemetry.latencyMs}ms</span>
          </div>

          <div className={`px-2 py-0.5 rounded font-bold tracking-wider ${
            isLight
              ? 'bg-slate-100 border border-slate-200 text-slate-800'
              : 'bg-black/40 border border-white/10 text-white'
          }`}>
            {liveTelemetry.nzTimeStr}
          </div>

          {/* Quick Theme Switcher Pill Buttons */}
          <div className={`flex items-center p-0.5 rounded-lg border text-[10px] ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-black/50 border-white/10'
          }`}>
            <button
              type="button"
              onClick={() => setLiveTheme('neon_radar')}
              title="Live Cyber Radar Theme"
              className={`px-2 py-0.5 rounded font-bold transition ${
                liveTheme === 'neon_radar'
                  ? 'bg-cyan-500 text-black shadow-sm'
                  : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              RADAR
            </button>
            <button
              type="button"
              onClick={() => setLiveTheme('kiwi_emerald')}
              title="Kiwi Emerald Live Theme"
              className={`px-2 py-0.5 rounded font-bold transition ${
                liveTheme === 'kiwi_emerald'
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              KIWI
            </button>
            <button
              type="button"
              onClick={() => setLiveTheme('alert_amber')}
              title="High Alert Live Theme"
              className={`px-2 py-0.5 rounded font-bold transition ${
                liveTheme === 'alert_amber'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              ALERT
            </button>
            <button
              type="button"
              onClick={() => setLiveTheme('daylight_live')}
              title="Daylight Operations Theme"
              className={`px-2 py-0.5 rounded font-bold transition ${
                liveTheme === 'daylight_live'
                  ? 'bg-sky-400 text-black shadow-sm'
                  : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              DAY
            </button>
          </div>
        </div>
      </div>

      {/* Omni-Role Header & Showcase Navigation */}
      <header className={`h-14 px-4 flex items-center justify-between z-40 backdrop-blur-md shrink-0 border-b transition-colors duration-300 ${
        isLight
          ? 'bg-white/95 border-slate-200 text-slate-800 shadow-xs'
          : 'bg-slate-900/90 border-slate-800 text-slate-100'
      }`}>
        {/* Left: Brand Identity & RN Engine Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-600/30">
              M
            </div>
            <div className="hidden sm:flex flex-col">
              <span className={`font-extrabold text-sm tracking-tight leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                MOVE <span className="text-blue-500 font-semibold">NZ</span>
              </span>
              <span className={`text-[10px] font-medium leading-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Urban Logistics
              </span>
            </div>
          </div>

          {/* Role Switcher Tabs */}
          <div className={`flex items-center p-1 rounded-xl text-xs border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <button
              type="button"
              onClick={() => {
                setSplitView(false);
                setActiveRole('customer');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                !splitView && activeRole === 'customer'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSplitView(false);
                setActiveRole('driver');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                !splitView && activeRole === 'driver'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Driver Partner</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSplitView(false);
                setActiveRole('admin');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                !splitView && activeRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Owner Control Tower</span>
              <span className="md:hidden">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setSplitView(!splitView)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition border ${
                splitView
                  ? isLight
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
                  : 'text-slate-400 hover:text-slate-200 border-transparent'
              }`}
              title="Side-by-Side Customer + Driver View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Split View</span>
            </button>
          </div>

          {/* Dedicated Standalone App Launchers */}
          <div className="hidden 2xl:flex items-center gap-1 border-l pl-2 border-slate-300 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setAppMode('customer')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition border ${
                isLight ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : 'bg-blue-950/40 text-blue-300 border-blue-500/30 hover:bg-blue-900/60'
              }`}
              title="Launch Pure Customer Mobile App (Fullscreen)"
            >
              <Smartphone className="w-3 h-3" />
              <span>Pure Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setAppMode('driver')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition border ${
                isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
              }`}
              title="Launch Pure Driver Partner App (Fullscreen)"
            >
              <Truck className="w-3 h-3" />
              <span>Pure Driver</span>
            </button>

            <button
              type="button"
              onClick={() => setAppMode('admin')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition border ${
                isLight ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' : 'bg-indigo-950/40 text-indigo-300 border-indigo-500/30 hover:bg-indigo-900/60'
              }`}
              title="Launch Pure Operations Tower (Fullscreen)"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Pure Admin</span>
            </button>
          </div>
        </div>

        {/* Center: React Native Technology Mode Switcher */}
        <div className={`hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-400'
        }`}>
          <Cpu className="w-4 h-4 text-sky-500" />
          <span className="font-medium">Engine:</span>
          <button
            type="button"
            onClick={() => setUseReactNativeEngine(true)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
              useReactNativeEngine
                ? isLight
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            React Native (Native Primitives)
          </button>
          <button
            type="button"
            onClick={() => setUseReactNativeEngine(false)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
              !useReactNativeEngine
                ? isLight
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-800 text-white border border-slate-700'
                : isLight
                ? 'text-slate-500 hover:text-slate-700'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Web HTML
          </button>
        </div>

        {/* Right: Quick Demo Actions, Theme Switcher & RN Code Export */}
        <div className="flex items-center gap-2">
          {/* THEME TOGGLE: Default Light, Switch to Dark */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300/80'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span className="hidden sm:inline">Theme:</span>
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span className="hidden sm:inline">Theme:</span>
                <span>Dark</span>
              </>
            )}
          </button>

          {/* React Native Code & Export Hub */}
          <button
            type="button"
            onClick={() => setShowExporter(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs border ${
              isLight
                ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                : 'bg-sky-500/10 text-sky-400 border-sky-500/30 hover:bg-sky-500/20 hover:text-sky-300'
            }`}
            title="View & Export Full React Native / Expo Codebase"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden md:inline">React Native Code</span>
            <span className="md:hidden">RN Code</span>
          </button>

          {/* Supabase Cloud DB & Tables */}
          <button
            type="button"
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs border ${
              isSupabaseLive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-600'
                : isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Configure Supabase Database, Tables & Realtime Sync"
          >
            <Database className={`w-3.5 h-3.5 ${isSupabaseLive ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Supabase DB</span>
            {isSupabaseLive ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Quick Demo Booking */}
          <button
            type="button"
            onClick={loadQuickDemoOrder}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs border ${
              isLight
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600 hover:text-white'
            }`}
            title="Pre-seed an instant sample delivery order"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instant Order</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs transition ${
              soundEnabled
                ? isLight
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-slate-800 text-blue-400 border-slate-700'
                : isLight
                ? 'bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Mute Dispatch Audio' : 'Unmute Dispatch Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Phone Frame Toggle (for single mobile views) */}
          {(activeRole === 'customer' || activeRole === 'driver') && !splitView && (
            <button
              type="button"
              onClick={() => setDeviceFrame(!deviceFrame)}
              className={`p-2 rounded-xl border transition ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={deviceFrame ? 'Expand to Full Screen' : 'View in Mobile Phone Frame'}
            >
              {deviceFrame ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          )}

          {/* Reset Demo */}
          <button
            type="button"
            onClick={resetAllData}
            className={`p-2 rounded-xl border transition ${
              isLight
                ? 'bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-200'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
            }`}
            title="Reset All Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className={`flex-1 overflow-hidden relative flex items-center justify-center transition-colors duration-300 ${
        isLight ? 'bg-slate-100' : 'bg-slate-950'
      }`}>
        {/* Split Screen Mode (Side-by-side Customer App + Driver App) */}
        {splitView ? (
          <div className={`w-full h-full p-4 flex flex-col md:flex-row items-center justify-center gap-6 overflow-y-auto ${
            isLight ? 'bg-slate-100' : 'bg-slate-950'
          }`}>
            {/* Left: Customer App in Mobile Frame */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold text-blue-600 mb-2 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>
                  CUSTOMER FACING APP {useReactNativeEngine && '(REACT NATIVE)'}
                </span>
              </div>
              <div className={`w-[390px] h-[780px] rounded-[44px] p-3 border-[6px] relative overflow-hidden flex flex-col transition-all duration-300 ${
                isLight
                  ? 'bg-white border-slate-300 shadow-2xl shadow-slate-400/25'
                  : `bg-slate-950 ${liveFrameGlowClass}`
              }`}>
                {/* Dynamic Island Pill */}
                <div className={`w-28 h-5 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center ${
                  isLight ? 'bg-slate-800' : 'bg-black'
                }`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    isLight ? 'bg-slate-700 border border-slate-600' : 'bg-slate-900 border border-slate-800'
                  }`} />
                </div>
                <div className={`flex-1 rounded-[32px] overflow-hidden flex flex-col ${
                  isLight ? 'bg-slate-50 border border-slate-200/80 shadow-inner' : ''
                }`}>
                  {useReactNativeEngine ? <RNCustomerApp /> : <CustomerApp />}
                </div>
              </div>
            </div>

            {/* Right: Driver Partner App in Mobile Frame */}
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold text-emerald-600 mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>
                  MOVE PARTNER (DRIVER APP) {useReactNativeEngine && '(REACT NATIVE)'}
                </span>
              </div>
              <div className={`w-[390px] h-[780px] rounded-[44px] p-3 border-[6px] relative overflow-hidden flex flex-col transition-all duration-300 ${
                isLight
                  ? 'bg-white border-slate-300 shadow-2xl shadow-slate-400/25'
                  : `bg-slate-950 ${liveFrameGlowClass}`
              }`}>
                {/* Dynamic Island Pill */}
                <div className={`w-28 h-5 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center ${
                  isLight ? 'bg-slate-800' : 'bg-black'
                }`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    isLight ? 'bg-slate-700 border border-slate-600' : 'bg-slate-900 border border-slate-800'
                  }`} />
                </div>
                <div className={`flex-1 rounded-[32px] overflow-hidden flex flex-col ${
                  isLight ? 'bg-slate-50 border border-slate-200/80 shadow-inner' : ''
                }`}>
                  {useReactNativeEngine ? <RNDriverApp /> : <DriverApp />}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Single Role View Mode */
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            {activeRole === 'customer' && (
              deviceFrame ? (
                <div className={`w-full max-w-[420px] h-[92vh] max-h-[840px] rounded-[44px] p-3 border-[6px] relative overflow-hidden flex flex-col my-auto transition-all duration-300 ${
                  isLight
                    ? 'bg-white border-slate-300 shadow-2xl shadow-slate-400/25'
                    : `bg-slate-950 ${liveFrameGlowClass}`
                }`}>
                  {/* Speaker & Camera notch */}
                  <div className={`w-28 h-5 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center ${
                    isLight ? 'bg-slate-800' : 'bg-black'
                  }`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      isLight ? 'bg-slate-700 border border-slate-600' : 'bg-slate-900 border border-slate-800'
                    }`} />
                  </div>
                  <div className={`flex-1 rounded-[32px] overflow-hidden flex flex-col ${
                    isLight ? 'bg-slate-50 border border-slate-200/80 shadow-inner' : ''
                  }`}>
                    {useReactNativeEngine ? <RNCustomerApp /> : <CustomerApp />}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full max-w-xl mx-auto overflow-hidden">
                  {useReactNativeEngine ? <RNCustomerApp /> : <CustomerApp />}
                </div>
              )
            )}

            {activeRole === 'driver' && (
              deviceFrame ? (
                <div className={`w-full max-w-[420px] h-[92vh] max-h-[840px] rounded-[44px] p-3 border-[6px] relative overflow-hidden flex flex-col my-auto transition-all duration-300 ${
                  isLight
                    ? 'bg-white border-slate-300 shadow-2xl shadow-slate-400/25'
                    : `bg-slate-950 ${liveFrameGlowClass}`
                }`}>
                  {/* Speaker notch */}
                  <div className={`w-28 h-5 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center ${
                    isLight ? 'bg-slate-800' : 'bg-black'
                  }`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      isLight ? 'bg-slate-700 border border-slate-600' : 'bg-slate-900 border border-slate-800'
                    }`} />
                  </div>
                  <div className={`flex-1 rounded-[32px] overflow-hidden flex flex-col ${
                    isLight ? 'bg-slate-50 border border-slate-200/80 shadow-inner' : ''
                  }`}>
                    {useReactNativeEngine ? <RNDriverApp /> : <DriverApp />}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full max-w-xl mx-auto overflow-hidden">
                  {useReactNativeEngine ? <RNDriverApp /> : <DriverApp />}
                </div>
              )
            )}

            {activeRole === 'admin' && (
              <div className="w-full h-full overflow-hidden">
                <AdminPortal />
              </div>
            )}
          </div>
        )}
      </div>

      {/* React Native Code & Export Hub Modal */}
      <RNCodeExporter isOpen={showExporter} onClose={() => setShowExporter(false)} />

      {/* Supabase Cloud Database & Tables Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        isLight={isLight}
        onConnectionChange={refreshFromSupabase}
      />
    </div>
  );
}

export default function App() {
  return (
    <LogisticsProvider>
      <MainLayout />
    </LogisticsProvider>
  );
}
