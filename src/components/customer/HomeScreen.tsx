import React, { useState } from 'react';
import {
  MapPin,
  ChevronDown,
  ArrowRight,
  Clock,
  Coins,
  Wallet,
  User,
  Home,
  Megaphone,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';

interface HomeScreenProps {
  onSelectCategory: (category: 'trucks' | '2_wheeler' | 'packers_movers') => void;
  onOpenLocationPicker: () => void;
  onNavigateTab: (tab: 'home' | 'orders' | 'coins' | 'payments' | 'account') => void;
  activeTab: 'home' | 'orders' | 'coins' | 'payments' | 'account';
}

export function HomeScreen({
  onSelectCategory,
  onOpenLocationPicker,
  onNavigateTab,
  activeTab
}: HomeScreenProps) {
  const { currentCity, customerProfile } = useLogistics();
  const [announcementIndex, setAnnouncementIndex] = useState<number>(0);

  const announcements = [
    { title: 'Professional house shifting', badge: 2 },
    { title: 'Flat 20% off on first 2-Wheeler delivery', badge: 1 },
    { title: 'Express intra-city courier now live 24/7', badge: 3 }
  ];

  const currentPickupAddress =
    customerProfile.savedAddresses[0]?.address ||
    'B1, B2, B3, Sector 48, Gurugram, Haryana 122018, India';

  return (
    <div className="flex flex-col h-full bg-[#F4F7FC] relative select-none overflow-hidden justify-between">
      {/* Scrollable Content Viewport */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Top Floating Location Header Bar */}
        <div className="bg-[#0040CC] px-4 pt-4 pb-14 text-white">
          {/* Pickup Address Dropdown Pill */}
          <button
            type="button"
            onClick={onOpenLocationPicker}
            className="w-full bg-white rounded-2xl px-3.5 py-2.5 shadow-md flex items-center justify-between text-left transition hover:shadow-lg active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {/* Green Pin */}
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                  Pick up from
                </span>
                <span className="text-xs font-bold text-slate-800 truncate mt-0.5 leading-snug">
                  {currentPickupAddress}
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          </button>
        </div>

        {/* 3 Main Service Category Cards (Elevated overlap on top bar) */}
        <div className="px-4 -mt-10">
          <div className="grid grid-cols-3 gap-3">
            {/* 1. Trucks */}
            <button
              type="button"
              onClick={() => onSelectCategory('trucks')}
              className="bg-white rounded-2xl p-3 shadow-md hover:shadow-lg transition flex flex-col items-center justify-between h-32 active:scale-95 group border border-slate-100/80"
            >
              {/* 3D Trucks Illustration */}
              <div className="w-16 h-16 flex items-center justify-center transition-transform group-hover:scale-105">
                <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                  {/* Background Truck */}
                  <rect x="6" y="24" width="22" height="24" rx="3" fill="#2563EB" />
                  <path d="M 6,36 L 2,44 L 2,48 L 6,48 Z" fill="#1D4ED8" />
                  <circle cx="10" cy="48" r="4" fill="#1E293B" />
                  {/* Front White Mini Truck */}
                  <rect x="18" y="16" width="38" height="26" rx="4" fill="#3B82F6" />
                  <rect x="40" y="22" width="18" height="22" rx="3" fill="#FFFFFF" />
                  <rect x="46" y="26" width="10" height="9" rx="2" fill="#93C5FD" />
                  <circle cx="28" cy="46" r="6" fill="#1E293B" />
                  <circle cx="28" cy="46" r="2.5" fill="#E2E8F0" />
                  <circle cx="48" cy="46" r="6" fill="#1E293B" />
                  <circle cx="48" cy="46" r="2.5" fill="#E2E8F0" />
                  {/* Headlight */}
                  <circle cx="56" cy="38" r="2" fill="#FACC15" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-800">Trucks</span>
            </button>

            {/* 2. 2 Wheeler */}
            <button
              type="button"
              onClick={() => onSelectCategory('2_wheeler')}
              className="bg-white rounded-2xl p-3 shadow-md hover:shadow-lg transition flex flex-col items-center justify-between h-32 active:scale-95 group border border-slate-100/80"
            >
              {/* 3D 2 Wheeler Illustration */}
              <div className="w-16 h-16 flex items-center justify-center transition-transform group-hover:scale-105">
                <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                  {/* Rear Wheel */}
                  <circle cx="16" cy="44" r="8" stroke="#1E293B" strokeWidth="3.5" fill="#FFFFFF" />
                  {/* Front Wheel */}
                  <circle cx="48" cy="44" r="8" stroke="#1E293B" strokeWidth="3.5" fill="#FFFFFF" />
                  {/* Bike Chassis */}
                  <path d="M 16,44 L 28,44 L 38,28 L 48,44" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  {/* Handlebar */}
                  <path d="M 38,28 L 34,18 L 42,18" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
                  {/* Blue Carrier Delivery Box */}
                  <rect x="8" y="22" width="14" height="14" rx="2.5" fill="#0052FF" stroke="#003DB8" strokeWidth="1" />
                  {/* Headlight */}
                  <circle cx="44" cy="22" r="2.5" fill="#FACC15" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-800">2 Wheeler</span>
            </button>

            {/* 3. Packers & Movers */}
            <button
              type="button"
              onClick={() => onSelectCategory('packers_movers')}
              className="bg-white rounded-2xl p-3 shadow-md hover:shadow-lg transition flex flex-col items-center justify-between h-32 active:scale-95 group border border-slate-100/80"
            >
              {/* 3D Packers & Movers Illustration */}
              <div className="w-16 h-16 flex items-center justify-center transition-transform group-hover:scale-105">
                <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                  {/* Washing Machine */}
                  <rect x="6" y="24" width="20" height="26" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
                  <circle cx="16" cy="38" r="6" stroke="#64748B" strokeWidth="2" fill="#38BDF8" opacity="0.6" />
                  {/* Moving Carton Box */}
                  <rect x="22" y="16" width="24" height="28" rx="2.5" fill="#DFA067" stroke="#BA7738" strokeWidth="1.5" />
                  <rect x="31" y="16" width="6" height="28" fill="#B3753E" />
                  {/* Mover Figure */}
                  <circle cx="50" cy="18" r="4.5" fill="#F9B387" />
                  <path d="M 46,26 L 54,26 L 52,48 L 48,48 Z" fill="#2563EB" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-800 text-center leading-tight">
                Packers & Movers
              </span>
            </button>
          </div>
        </div>

        {/* Explore Porter Rewards Gradient Banner */}
        <div className="px-4 mt-4">
          <button
            type="button"
            onClick={() => onNavigateTab('coins')}
            className="w-full bg-gradient-to-r from-[#3B197A] via-[#1E258F] to-[#0D47A1] rounded-2xl p-3.5 shadow-md flex items-center justify-between text-white text-left transition hover:opacity-95 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              {/* Gold Coin Icon */}
              <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
                <span className="text-lg">🪙</span>
              </div>
              <div>
                <h4 className="text-xs font-extrabold tracking-wide text-white">
                  Explore Porter Rewards
                </h4>
                <p className="text-[11px] text-blue-200 mt-0.5">
                  Earn 2 coins for every 100 spent
                </p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </button>
        </div>

        {/* Announcements Section */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">Announcements</span>
          </div>

          <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Megaphone with Notification Badge */}
              <div className="relative w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Megaphone className="w-4 h-4 text-[#0052FF]" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-white">
                  {announcements[announcementIndex].badge}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {announcements[announcementIndex].title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
              }}
              className="text-xs font-bold text-[#0052FF] bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition"
            >
              View all
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {announcements.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === announcementIndex ? 'bg-slate-400 w-3' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Cityscape & Flyover 3D Vector Artwork */}
        <div className="mt-4 px-2 overflow-hidden">
          <svg
            viewBox="0 0 380 180"
            className="w-full h-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background City Skyline Buildings */}
            <rect x="20" y="80" width="30" height="100" fill="#E2EDFC" />
            <rect x="60" y="50" width="40" height="130" fill="#D6E5FA" />
            <rect x="110" y="70" width="35" height="110" fill="#E2EDFC" />
            <rect x="155" y="90" width="28" height="90" fill="#EBF3FD" />

            {/* Floating Soft Blue Map Pin */}
            <g transform="translate(45, 60)">
              <path
                d="M 18,0 C 8.05,0 0,8.05 0,18 C 0,31.5 18,48 18,48 C 18,48 36,31.5 36,18 C 36,8.05 27.95,0 18,0 Z"
                fill="#C6DEFC"
              />
              <circle cx="18" cy="18" r="8" fill="#FFFFFF" />
            </g>

            {/* Modern Elevated Curved Flyover Highway Bridge */}
            <path
              d="M 140,110 Q 200,125 280,135 T 390,140 L 390,180 L 140,180 Z"
              fill="#D4E4FC"
            />
            {/* Bridge Pillars */}
            <path d="M 180,120 L 180,180 M 260,130 L 260,180" stroke="#BDD8FA" strokeWidth="8" />

            {/* Upper Highway Deck */}
            <path
              d="M 145,110 C 180,95 240,110 390,130"
              stroke="#A8CEFC"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />

            {/* 3D Delivery Truck on Flyover */}
            <g transform="translate(180, 75)">
              <rect x="0" y="6" width="34" height="22" rx="3" fill="#60A5FA" />
              <rect x="32" y="12" width="18" height="16" rx="2.5" fill="#DBEAFE" />
              <circle cx="10" cy="30" r="5" fill="#334155" />
              <circle cx="40" cy="30" r="5" fill="#334155" />
            </g>

            {/* 2-Wheeler Courier on Ground Road */}
            <g transform="translate(260, 138)">
              <circle cx="6" cy="16" r="4.5" stroke="#334155" strokeWidth="2" fill="#FFFFFF" />
              <circle cx="22" cy="16" r="4.5" stroke="#334155" strokeWidth="2" fill="#FFFFFF" />
              <path d="M 6,16 L 14,16 L 18,8 L 22,16" stroke="#2563EB" strokeWidth="2" fill="none" />
              <circle cx="14" cy="5" r="3" fill="#0052FF" />
              <rect x="2" y="8" width="6" height="6" fill="#0052FF" />
            </g>
          </svg>
        </div>
      </div>

      {/* Porter Bottom 5-Tab Navigation Bar */}
      <nav className="h-16 bg-white border-t border-slate-200 px-3 flex items-center justify-around shrink-0 z-30 shadow-lg">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onNavigateTab('home')}
          className={`flex flex-col items-center justify-center transition ${
            activeTab === 'home' ? 'text-[#0052FF]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-5 h-5 fill-current" />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </button>

        {/* 2. Orders */}
        <button
          type="button"
          onClick={() => onNavigateTab('orders')}
          className={`flex flex-col items-center justify-center transition ${
            activeTab === 'orders' ? 'text-[#0052FF]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Orders</span>
        </button>

        {/* 3. Coins */}
        <button
          type="button"
          onClick={() => onNavigateTab('coins')}
          className={`flex flex-col items-center justify-center transition ${
            activeTab === 'coins' ? 'text-[#0052FF]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Coins className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Coins</span>
        </button>

        {/* 4. Payments */}
        <button
          type="button"
          onClick={() => onNavigateTab('payments')}
          className={`flex flex-col items-center justify-center transition ${
            activeTab === 'payments' ? 'text-[#0052FF]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Payments</span>
        </button>

        {/* 5. Account */}
        <button
          type="button"
          onClick={() => onNavigateTab('account')}
          className={`flex flex-col items-center justify-center transition ${
            activeTab === 'account' ? 'text-[#0052FF]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Account</span>
        </button>
      </nav>
    </div>
  );
}
