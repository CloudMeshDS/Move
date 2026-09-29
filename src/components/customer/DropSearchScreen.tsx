import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Plus,
  Clock,
  Heart,
  MapPin,
  ChevronRight,
  User,
  Search,
  X
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { MapPoint } from '../../types/logistics';

interface DropSearchScreenProps {
  onBack: () => void;
  onSelectDropLocation: (dropPoint: MapPoint) => void;
  onOpenMapPicker: () => void;
}

export function DropSearchScreen({
  onBack,
  onSelectDropLocation,
  onOpenMapPicker
}: DropSearchScreenProps) {
  const { currentCity, customerProfile } = useLogistics();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'saved'>('all');

  const pickupPoint: MapPoint = currentCity.popularLandmarks[0] || {
    x: 48,
    y: 28,
    name: 'Sector 48, Gurugram',
    address: 'B1, B2, B3, Sector 48, Gurugram, Haryana 122018, India',
    area: 'Sector 48',
    city: currentCity.name
  };

  const sampleRecentAddresses: Array<{
    id: string;
    title: string;
    contactName: string;
    address: string;
    x: number;
    y: number;
    saved?: boolean;
  }> = [
    {
      id: 'rec-1',
      title: '505, Iris Tech Park sector -48',
      contactName: 'SULTAN SINGH',
      address: 'Iris Tech Park, Sector 48, Gurugram, Haryana, 122018',
      x: 52,
      y: 45,
      saved: true
    },
    {
      id: 'rec-2',
      title: 'Iris Tech Park',
      contactName: 'SULTAN SINGH',
      address: 'Sector 48, Gurugram, Haryana, India',
      x: 53,
      y: 46,
      saved: true
    },
    {
      id: 'rec-3',
      title: 'Artemis Hospital Gurgaon',
      contactName: 'SULTAN SINGH',
      address: 'Sector 51, Gurugram, Haryana, India',
      x: 60,
      y: 50,
      saved: false
    },
    {
      id: 'rec-4',
      title: '402, Udyog Vihar III',
      contactName: 'SULTAN SINGH',
      address: 'Sector 20, Gurugram, Haryana 122022, India',
      x: 35,
      y: 65,
      saved: false
    },
    {
      id: 'rec-5',
      title: 'Signature Global Synera 81',
      contactName: 'KIRANDEEP KA...',
      address: 'Sector 81, Gurugram, Haryana, India',
      x: 70,
      y: 80,
      saved: false
    }
  ];

  const filteredAddresses = sampleRecentAddresses.filter((item) => {
    if (activeFilter === 'saved' && !item.saved) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.contactName.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item: (typeof sampleRecentAddresses)[0]) => {
    const point: MapPoint = {
      x: item.x,
      y: item.y,
      name: item.title,
      address: item.address,
      area: item.title.split(',')[0],
      city: currentCity.name
    };
    onSelectDropLocation(point);
  };

  const handleCustomSearchEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const point: MapPoint = {
      x: 55,
      y: 55,
      name: searchTerm.trim(),
      address: `${searchTerm.trim()}, ${currentCity.name}`,
      area: currentCity.name,
      city: currentCity.name
    };
    onSelectDropLocation(point);
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F7FC] relative select-none overflow-hidden">
      {/* Top Header with Back Button */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-3 bg-white border-b border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-slate-800">Select Delivery Route</span>
      </div>

      {/* Floating Pickup & Drop Selection Card */}
      <div className="p-4 bg-white shadow-xs border-b border-slate-100">
        <div className="border border-slate-200 rounded-2xl p-3.5 space-y-3 bg-[#F8FAFC]">
          {/* Pickup Line */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {customerProfile.name} · {customerProfile.phone}
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {pickupPoint.address}
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>

          {/* Dotted Vertical Connector Line */}
          <div className="border-l-2 border-dashed border-slate-300 ml-3 h-3 my-0.5" />

          {/* Drop Location Input */}
          <form onSubmit={handleCustomSearchEnter} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>

            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Where is your Drop ?"
                className="w-full bg-white border-2 border-[#0052FF] rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-xs"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Add Stop Button */}
            <button
              type="button"
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 transition"
              title="Add Multiple Stops"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Quick Filter Actions: "Select on map" and "Saved Addresses" */}
        <div className="flex items-center justify-around pt-3 border-t border-slate-100 mt-3 text-xs font-bold text-[#0052FF]">
          <button
            type="button"
            onClick={onOpenMapPicker}
            className="flex items-center gap-1.5 py-1 px-3 hover:bg-blue-50 rounded-lg transition"
          >
            <MapPin className="w-4 h-4" />
            <span>Select on map</span>
          </button>

          <span className="text-slate-200">|</span>

          <button
            type="button"
            onClick={() => setActiveFilter(activeFilter === 'saved' ? 'all' : 'saved')}
            className={`flex items-center gap-1.5 py-1 px-3 rounded-lg transition ${
              activeFilter === 'saved' ? 'bg-blue-50 text-blue-700' : 'hover:bg-blue-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeFilter === 'saved' ? 'fill-[#0052FF]' : ''}`} />
            <span>Saved Addresses</span>
          </button>
        </div>
      </div>

      {/* Recent Searches / Address List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-slate-100 bg-white">
        {filteredAddresses.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelect(item)}
            className="py-3.5 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition active:scale-[0.99]"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                    <User className="w-2.5 h-2.5" />
                    <span>{item.contactName}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {item.address}
                </p>
              </div>
            </div>

            {/* Heart Save Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="flex flex-col items-center justify-center shrink-0 text-slate-400 hover:text-rose-500 transition"
            >
              <Heart className={`w-4 h-4 ${item.saved ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span className="text-[9px] mt-0.5">Save</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
