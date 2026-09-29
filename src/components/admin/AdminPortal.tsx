import React, { useState } from 'react';
import {
  Activity,
  Truck,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Settings,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  Sliders,
  ChevronDown,
  Radio,
  Wifi,
  Volume2,
  Database
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { DriverPartner, LogisticsOrder, VehicleCategoryId, VehicleOption } from '../../types/logistics';
import { InteractiveCityMap } from '../map/InteractiveCityMap';
import { InvoiceModal } from '../customer/InvoiceModal';
import { sound } from '../../utils/audio';

export function AdminPortal() {
  const {
    currentCity,
    orders,
    drivers,
    vehicleOptions,
    updateRateCard,
    approveDriverKYC,
    cancelOrder,
    loadQuickDemoOrder,
    liveTheme,
    liveTelemetry,
    liveActivityFeed,
    liveRadarActive,
    setLiveRadarActive,
    theme,
    isSupabaseLive,
    setIsSupabaseModalOpen
  } = useLogistics();

  const isLight = theme === 'light';

  const [activeAdminTab, setActiveAdminTab] = useState<'control' | 'orders' | 'fleet' | 'pricing' | 'kyc'>('control');
  const [selectedDriver, setSelectedDriver] = useState<DriverPartner | null>(drivers[0]);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<LogisticsOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Compute Platform Executive KPI metrics in NZD
  const totalGmv = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.fare.totalFare : 0), 4250.0);
  const platformRevenue = Math.round(totalGmv * 0.20 * 10) / 10;
  const totalCompletedTrips = orders.filter((o) => o.status === 'delivered').length + 38;
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;
  const activeDriversOnline = drivers.filter((d) => d.status !== 'offline').length;

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <div className={`flex flex-col h-full overflow-y-auto transition-colors ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#090e17] text-slate-100'
    }`}>
      {/* Control Tower Header */}
      <header className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 transition-colors ${
        isLight ? 'bg-white/95 border-slate-200' : 'bg-[#0d1522] border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-600/30">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-base font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Move Operations Control Tower (New Zealand)
              </h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                NZ DISPATCH ACTIVE
              </span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Regional Hub: <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{currentCity.name}</span> · Live GPS Fleet Telemetry
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sonar Ping Audio Test */}
          <button
            type="button"
            onClick={() => sound.playRadarSonarPing()}
            className={`py-1.5 px-3 border text-xs font-bold rounded-xl flex items-center gap-1.5 transition ${
              isLight
                ? 'bg-cyan-50 text-cyan-700 border-cyan-300 hover:bg-cyan-100'
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
            }`}
            title="Test Sonar Dispatch Chime"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sonar Ping</span>
          </button>

          {/* Supabase Cloud DB & Tables */}
          <button
            type="button"
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`py-1.5 px-3 border text-xs font-bold rounded-xl flex items-center gap-1.5 transition ${
              isSupabaseLive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-600'
                : isLight
                ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Configure Supabase Cloud Database & Tables"
          >
            <Database className={`w-3.5 h-3.5 ${isSupabaseLive ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Supabase DB</span>
            {isSupabaseLive ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <div className={`flex items-center border rounded-xl p-1 ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-700/80'
          }`}>
            <button
              type="button"
              onClick={() => setActiveAdminTab('control')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeAdminTab === 'control'
                  ? 'bg-blue-600 text-white shadow'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Control Tower
            </button>
            <button
              type="button"
              onClick={() => setActiveAdminTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeAdminTab === 'orders'
                  ? 'bg-blue-600 text-white shadow'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveAdminTab('fleet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeAdminTab === 'fleet'
                  ? 'bg-blue-600 text-white shadow'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fleet Drivers ({drivers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveAdminTab('pricing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeAdminTab === 'pricing'
                  ? 'bg-blue-600 text-white shadow'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rate Cards (NZD)
            </button>
            <button
              type="button"
              onClick={() => setActiveAdminTab('kyc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeAdminTab === 'kyc'
                  ? 'bg-blue-600 text-white shadow'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              NZTA Compliance
            </button>
          </div>

          <button
            type="button"
            onClick={loadQuickDemoOrder}
            className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate NZ Test Order</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="p-6 space-y-6 flex-1">
        {/* Top Executive KPI Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0f1827] border-slate-800'}`}>
            <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Gross Merchandise Value</span>
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className={`text-xl font-bold font-mono mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>${totalGmv.toFixed(2)} NZD</p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">↑ +14.2% this week</span>
          </div>

          <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0f1827] border-slate-800'}`}>
            <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Platform Cut (20% Net)</span>
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-2">${platformRevenue.toFixed(2)} NZD</p>
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Owner commission earnings</span>
          </div>

          <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0f1827] border-slate-800'}`}>
            <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Active Orders In-Flight</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-2">{activeOrdersCount} live</p>
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Across {currentCity.name.split(' ')[0]}</span>
          </div>

          <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0f1827] border-slate-800'}`}>
            <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Fleet Online</span>
              <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className={`text-xl font-bold font-mono mt-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeDriversOnline} / {drivers.length}</p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">94% active duty</span>
          </div>

          <div className={`p-4 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0f1827] border-slate-800'}`}>
            <div className={`flex items-center justify-between text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Avg Match Latency</span>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-xl font-bold font-mono text-purple-600 dark:text-purple-300 mt-2">12.5s</p>
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>&lt; 3.5 km search radius</span>
          </div>
        </div>

        {/* Tab 1: Control Tower Overview */}
        {activeAdminTab === 'control' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Map Telemetry (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Live Urban Fleet Radar Map ({currentCity.name})
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Click any vehicle marker to inspect</span>
              </div>

              <InteractiveCityMap
                drivers={drivers}
                showAllDrivers
                onSelectDriver={(d) => setSelectedDriver(d)}
                selectedDriverId={selectedDriver?.id}
                heightClass="h-[440px]"
              />
            </div>

            {/* Selected Driver Telemetry Inspector (1 Col) */}
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0f1827] border-slate-800'
              }`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Partner Telemetry Inspector
                </h3>

                {selectedDriver ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full overflow-hidden border shrink-0 ${
                        isLight ? 'border-slate-300 bg-slate-100' : 'border-slate-700 bg-slate-800'
                      }`}>
                        <img
                          src={selectedDriver.photoUrl}
                          alt={selectedDriver.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedDriver.name}</h4>
                        <p className={isLight ? 'text-slate-500' : 'text-slate-400'}>{selectedDriver.vehicleName}</p>
                        <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{selectedDriver.vehiclePlate}</span>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border space-y-1.5 font-mono ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/80 border-slate-800 text-slate-300'
                    }`}>
                      <div className="flex justify-between">
                        <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Duty Status</span>
                        <span className={`font-bold ${selectedDriver.status === 'offline' ? (isLight ? 'text-slate-400' : 'text-slate-500') : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {selectedDriver.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Current Sector</span>
                        <span className={isLight ? 'text-slate-900' : 'text-white'}>{selectedDriver.currentLocation.area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Customer Rating</span>
                        <span className="text-amber-500 font-bold">★ {selectedDriver.rating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Total Deliveries</span>
                        <span className={isLight ? 'text-slate-900' : 'text-white'}>{selectedDriver.totalTrips}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Today's Earnings</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">${selectedDriver.todayEarnings.toFixed(2)} NZD</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <a
                        href={`tel:${selectedDriver.phone}`}
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-center transition"
                      >
                        Call Partner
                      </a>
                      <button
                        type="button"
                        onClick={() => alert(`Priority dispatch ping sent to ${selectedDriver.name}'s mobile device.`)}
                        className={`py-2 px-3 rounded-xl font-semibold transition ${
                          isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        Send Ping
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Select a vehicle from the map to inspect.</p>
                )}
              </div>

              {/* Safety & SOS Feed */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      NZ Safety & Compliance Desk
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    All Clear
                  </span>
                </div>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  All active urban shipments comply with Waka Kotahi work-time rest hours and COF standards.
                </p>
              </div>

              {/* Live Real-Time Dispatch Event Stream */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Live Telemetry Stream
                    </h4>
                  </div>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    ● ACTIVE
                  </span>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {liveActivityFeed.map((item) => (
                    <div key={item.id} className={`p-2.5 rounded-xl border text-[11px] space-y-1 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800/80'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.vehicleType}</span>
                        <span className={`font-mono text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{item.timestamp}</span>
                      </div>
                      <p className={isLight ? 'text-slate-600' : 'text-slate-300'}>{item.event}</p>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{item.city}</span>
                        <span className="text-[9px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
                          {item.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Orders Management Board */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Live Dispatch Order Queue ({filteredOrders.length})
              </h3>

              {/* Filter Tabs */}
              <div className={`flex gap-1 border p-1 rounded-xl text-xs ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                {['all', 'searching', 'driver_assigned', 'in_transit', 'delivered'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      statusFilter === st
                        ? 'bg-blue-600 text-white'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className={`border rounded-2xl overflow-hidden shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0f1827] border-slate-800 shadow-xl'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`uppercase font-semibold text-[10px] border-b tracking-wider ${
                    isLight ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    <tr>
                      <th className="px-4 py-3">Order / ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Vehicle</th>
                      <th className="px-4 py-3">Pickup → Drop</th>
                      <th className="px-4 py-3">Assigned Partner</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Gross (NZD)</th>
                      <th className="px-4 py-3">Owner Cut</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-normal ${
                    isLight ? 'divide-slate-200 text-slate-700' : 'divide-slate-800/80 text-slate-300'
                  }`}>
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className={isLight ? 'hover:bg-slate-50 transition' : 'hover:bg-slate-800/30 transition'}>
                        <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {ord.trackingNumber}
                          <span className={`block text-[10px] font-normal ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{ord.createdAt}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{ord.customerName}</p>
                          <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>{ord.customerPhone}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{ord.vehicleName}</span>
                          <span className={`block text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{ord.goodsType}</span>
                        </td>
                        <td className="px-4 py-3 max-w-[200px] truncate">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">{ord.pickup.name}</span>
                          <span className="block text-rose-500 truncate">{ord.drop.name}</span>
                        </td>
                        <td className="px-4 py-3">
                          {ord.driverName ? (
                            <div>
                              <p className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{ord.driverName}</p>
                              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{ord.driverVehiclePlate}</span>
                            </div>
                          ) : (
                            <span className="text-amber-500 text-[11px] font-semibold">Matching...</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : ord.status === 'in_transit'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                : ord.status === 'cancelled'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {ord.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className={`px-4 py-3 font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          ${ord.fare.totalFare.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                          ${ord.fare.platformCut.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {ord.status === 'delivered' && (
                              <button
                                type="button"
                                onClick={() => setSelectedOrderForInvoice(ord)}
                                className="p-1.5 rounded-lg bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                title="View e-POD & Invoice"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {ord.status !== 'delivered' && ord.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => cancelOrder(ord.id, 'Admin Override')}
                                className="p-1.5 rounded-lg bg-rose-600/10 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                                title="Cancel Order"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Fleet Drivers Directory */}
        {activeAdminTab === 'fleet' && (
          <div className="space-y-4">
            <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Registered New Zealand Commercial Drivers ({drivers.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drivers.map((drv) => (
                <div
                  key={drv.id}
                  className={`p-4 border rounded-2xl space-y-3 ${
                    isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0f1827] border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full overflow-hidden border ${
                        isLight ? 'border-slate-300 bg-slate-100' : 'border-slate-700 bg-slate-800'
                      }`}>
                        <img src={drv.photoUrl} alt={drv.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>{drv.name}</h4>
                        <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{drv.vehicleName}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        drv.status === 'offline'
                          ? isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-500'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {drv.status.toUpperCase()}
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl text-[11px] font-mono space-y-1 ${
                    isLight ? 'bg-slate-50 text-slate-600' : 'bg-slate-900 text-slate-400'
                  }`}>
                    <div className="flex justify-between">
                      <span>NZ Plate Number</span>
                      <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{drv.vehiclePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating</span>
                      <span className="text-amber-500 font-bold">★ {drv.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wallet Balance</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">${drv.walletBalance.toFixed(2)} NZD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Dynamic Rate Card (NZD) */}
        {activeAdminTab === 'pricing' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Dynamic Fare Engine & Rate Cards (NZD)
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Update base flagfall, per-km rates, and lifting fees per vehicle category. All prices subject to 15% NZ GST.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicleOptions.map((v) => (
                <div
                  key={v.id}
                  className={`p-4 border rounded-2xl space-y-3 ${
                    isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0f1827] border-slate-800'
                  }`}
                >
                  <div className={`flex items-center justify-between pb-2 border-b ${
                    isLight ? 'border-slate-100' : 'border-slate-800'
                  }`}>
                    <div>
                      <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{v.name}</h4>
                      <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{v.dimensions}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      ${v.baseFare.toFixed(2)} Base
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Base Fare (First {v.baseKm}km):</span>
                      <input
                        type="number"
                        step="0.5"
                        value={v.baseFare}
                        onChange={(e) => updateRateCard(v.id, { baseFare: Number(e.target.value) })}
                        className={`w-20 border rounded-lg px-2 py-1 text-right font-mono text-xs ${
                          isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-900'
                            : 'bg-slate-900 border-slate-700 text-white'
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Per Km Rate ($NZ):</span>
                      <input
                        type="number"
                        step="0.1"
                        value={v.perKmRate}
                        onChange={(e) => updateRateCard(v.id, { perKmRate: Number(e.target.value) })}
                        className={`w-20 border rounded-lg px-2 py-1 text-right font-mono text-xs ${
                          isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-900'
                            : 'bg-slate-900 border-slate-700 text-white'
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Lifting / Helper Fee:</span>
                      <input
                        type="number"
                        step="5"
                        value={v.helperFee}
                        onChange={(e) => updateRateCard(v.id, { helperFee: Number(e.target.value) })}
                        className={`w-20 border rounded-lg px-2 py-1 text-right font-mono text-xs ${
                          isLight
                            ? 'bg-slate-50 border-slate-300 text-slate-900'
                            : 'bg-slate-900 border-slate-700 text-white'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Driver KYC & Waka Kotahi Compliance Desk */}
        {activeAdminTab === 'kyc' && (
          <div className="space-y-4">
            <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Waka Kotahi (NZTA) & Transport Compliance Desk
            </h3>

            <div className="space-y-3">
              {drivers.map((drv) => (
                <div
                  key={drv.id}
                  className={`p-4 border rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs ${
                    isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0f1827] border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full overflow-hidden border ${
                      isLight ? 'border-slate-300 bg-slate-100' : 'border-slate-700 bg-slate-800'
                    }`}>
                      <img src={drv.photoUrl} alt={drv.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>{drv.name}</h4>
                      <p className={isLight ? 'text-slate-500' : 'text-slate-400'}>{drv.phone} · NZ Plate: {drv.vehiclePlate}</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Class 1/2 Licenced</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>COF Current</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>NZTA Rego Active</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => approveDriverKYC(drv.id, true)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition ${
                        drv.kycStatus === 'approved'
                          ? 'bg-emerald-600 text-white'
                          : isLight
                          ? 'bg-slate-100 text-slate-700 hover:bg-emerald-600 hover:text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {drv.kycStatus === 'approved' ? '✓ NZTA Approved' : 'Approve Compliance'}
                    </button>
                    <button
                      type="button"
                      onClick={() => approveDriverKYC(drv.id, false)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition ${
                        isLight
                          ? 'bg-slate-100 hover:bg-rose-600 text-slate-700 hover:text-white'
                          : 'bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white'
                      }`}
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal Preview */}
      {selectedOrderForInvoice && (
        <InvoiceModal
          order={selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}
    </div>
  );
}
