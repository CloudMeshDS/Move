import React, { useState } from 'react';
import {
  Truck,
  Box,
  Clock,
  MapPin,
  ChevronDown,
  Wallet,
  Bell,
  Radio,
  Sparkles,
  Layers
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { CITY_HUBS } from '../../data/mockData';
import { BookingView } from './BookingView';
import { LiveTrackingView } from './LiveTrackingView';
import { PackersView } from './PackersView';
import { TripHistoryView } from './TripHistoryView';

export function CustomerApp() {
  const { currentCity, setCurrentCity, activeOrder, loadQuickDemoOrder, theme } = useLogistics();
  const [activeTab, setActiveTab] = useState<'book' | 'packers' | 'tracking' | 'history'>('book');
  const [selectedHistoryOrderId, setSelectedHistoryOrderId] = useState<string | null>(null);

  const isLight = theme === 'light';

  // If there's an active order and user hasn't explicitly navigated elsewhere, default to tracking
  const currentViewOrder = activeOrder;

  return (
    <div className={`flex flex-col h-full relative transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Mobile Top App Bar */}
      <header className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3 backdrop-blur-md border-b transition-colors ${
        isLight ? 'bg-white/95 border-slate-200 text-slate-800 shadow-xs' : 'bg-slate-900/95 border-slate-800 text-slate-100'
      }`}>
        {/* Brand Lockup */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-600/30">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                MOVE
              </span>
              <span className="text-[9px] bg-blue-500/20 text-blue-500 font-bold px-1.5 py-0.2 rounded border border-blue-500/30 uppercase">
                City
              </span>
            </div>
            {/* City Switcher */}
            <div className="relative inline-block">
              <select
                aria-label="Current City"
                value={currentCity.id}
                onChange={(e) => {
                  const city = CITY_HUBS.find((c) => c.id === e.target.value);
                  if (city) setCurrentCity(city);
                }}
                className={`appearance-none bg-transparent text-[11px] font-semibold pr-4 cursor-pointer focus:outline-none ${
                  isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                {CITY_HUBS.map((c) => (
                  <option key={c.id} value={c.id} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-3 h-3 absolute right-0 top-0.5 pointer-events-none ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Move Wallet */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs border ${
            isLight
              ? 'bg-blue-50 border-blue-200 text-blue-900'
              : 'bg-slate-800/80 border-slate-700/80 text-white'
          }`}>
            <Wallet className="w-3.5 h-3.5 text-blue-500" />
            <span className={`font-mono font-bold ${isLight ? 'text-blue-950' : 'text-white'}`}>$120.00</span>
          </div>

          {/* Quick Demo Trigger */}
          <button
            type="button"
            onClick={loadQuickDemoOrder}
            title="Instant Demo Booking"
            className={`p-1.5 rounded-xl border transition ${
              isLight
                ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                : 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Active Trip Sticky Alert Banner (if user navigated to another tab) */}
      {currentViewOrder &&
        currentViewOrder.status !== 'delivered' &&
        currentViewOrder.status !== 'cancelled' &&
        activeTab !== 'tracking' && (
          <div
            onClick={() => setActiveTab('tracking')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 flex items-center justify-between text-xs cursor-pointer shadow-lg animate-pulse"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold">Active Trip: {currentViewOrder.status.replace('_', ' ').toUpperCase()}</span>
            </div>
            <span className="text-[11px] font-semibold underline">Track Live →</span>
          </div>
        )}

      {/* Body Viewport */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'book' && (
          <BookingView
            onOrderCreated={(orderId) => {
              setActiveTab('tracking');
            }}
          />
        )}

        {activeTab === 'tracking' && (
          currentViewOrder ? (
            <LiveTrackingView
              order={currentViewOrder}
              onNewBookingClick={() => setActiveTab('book')}
            />
          ) : (
            <div className={`flex flex-col items-center justify-center p-8 text-center min-h-[400px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <Truck className={`w-12 h-12 mb-3 ${isLight ? 'text-slate-300' : 'text-slate-600'}`} />
              <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>No active trip in progress</h4>
              <p className="text-xs max-w-xs mt-1">
                Choose a vehicle to start your delivery or view past order history.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('book')}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20"
              >
                Book a Vehicle
              </button>
            </div>
          )
        )}

        {activeTab === 'packers' && (
          <PackersView
            onOrderCreated={() => {
              setActiveTab('tracking');
            }}
          />
        )}

        {activeTab === 'history' && (
          <TripHistoryView
            onSelectOrder={(id) => {
              setSelectedHistoryOrderId(id);
              setActiveTab('tracking');
            }}
          />
        )}
      </main>

      {/* Touch-First Bottom Tab Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 backdrop-blur-md border-t grid grid-cols-4 items-center h-16 pb-safe transition-colors ${
        isLight ? 'bg-white/95 border-slate-200 shadow-lg' : 'bg-slate-900/95 border-slate-800'
      }`}>
        <button
          type="button"
          onClick={() => setActiveTab('book')}
          className={`flex flex-col items-center justify-center h-full transition ${
            activeTab === 'book'
              ? 'text-blue-600 font-bold'
              : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">City Trucks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('packers')}
          className={`flex flex-col items-center justify-center h-full transition ${
            activeTab === 'packers'
              ? 'text-blue-600 font-bold'
              : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Box className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Movers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tracking')}
          className={`flex flex-col items-center justify-center h-full relative transition ${
            activeTab === 'tracking'
              ? 'text-blue-600 font-bold'
              : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {currentViewOrder && currentViewOrder.status !== 'delivered' && (
            <span className="absolute top-2 right-6 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
          <Radio className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Live Track</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center h-full transition ${
            activeTab === 'history'
              ? 'text-blue-600 font-bold'
              : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">History</span>
        </button>
      </nav>
    </div>
  );
}
