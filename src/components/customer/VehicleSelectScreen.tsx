import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpDown,
  Plus,
  Edit2,
  Info,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { MapPoint, VehicleCategoryId, VehicleOption } from '../../types/logistics';

interface VehicleSelectScreenProps {
  pickup: MapPoint;
  drop: MapPoint;
  onBack: () => void;
  onProceedToBooking: (vehicleId: VehicleCategoryId) => void;
  onEditLocations: () => void;
}

export function VehicleSelectScreen({
  pickup,
  drop,
  onBack,
  onProceedToBooking,
  onEditLocations
}: VehicleSelectScreenProps) {
  const { vehicleOptions, customerProfile, calculateFare } = useLogistics();
  const [selectedVehicleId, setSelectedVehicleId] = useState<VehicleCategoryId>('2_wheeler');
  const [showInfoModal, setShowInfoModal] = useState<VehicleOption | null>(null);

  // Fallback vehicle list matching Screenshot 5 exactly if vehicleOptions are loading
  const fallbackPorterVehicles = [
    {
      id: '2_wheeler',
      name: '2 Wheeler',
      capacityKg: 20,
      etaMins: 1,
      baseFare: 41,
      dimensionTag: '40 CM',
      iconType: 'bike'
    },
    {
      id: 'scooter',
      name: 'Scooter',
      capacityKg: 20,
      etaMins: 3,
      baseFare: 75,
      badge: 'New',
      iconType: 'scooter'
    },
    {
      id: '10ft',
      name: '10ft',
      capacityKg: 1700,
      etaMins: 11,
      baseFare: 862,
      badge: 'New',
      iconType: 'truck'
    },
    {
      id: 'e_loader',
      name: 'E Loader',
      capacityKg: 310,
      etaMins: 8,
      baseFare: 266,
      iconType: 'eloader'
    },
    {
      id: '3_wheeler',
      name: '3 Wheeler',
      capacityKg: 500,
      etaMins: 1,
      baseFare: 337,
      iconType: '3wheeler'
    },
    {
      id: 'tata_ace',
      name: 'Tata Ace',
      capacityKg: 750,
      etaMins: 5,
      baseFare: 450,
      iconType: 'truck'
    }
  ];

  const vehiclesToDisplay =
    vehicleOptions.length > 0 ? vehicleOptions : (fallbackPorterVehicles as any);

  const activeVehicle =
    vehiclesToDisplay.find((v: any) => v.id === selectedVehicleId) || vehiclesToDisplay[0];

  return (
    <div className="flex flex-col h-full bg-[#F4F7FC] relative select-none overflow-hidden justify-between">
      {/* Scrollable Viewport */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Top Header */}
        <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-3 sticky top-0 z-20">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-slate-700 hover:text-slate-900 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Select Vehicle
          </h2>
        </div>

        {/* Route Summary Card */}
        <div className="p-4 bg-white border-b border-slate-100 shadow-2xs">
          <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-3.5 relative">
            {/* Route Points */}
            <div className="space-y-3 pr-10">
              {/* Pickup Point */}
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {customerProfile.name} · {customerProfile.phone}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {pickup.address}
                  </p>
                </div>
              </div>

              {/* Dotted Vertical Connector */}
              <div className="border-l-2 border-dashed border-slate-300 ml-1 h-3.5 my-0.5" />

              {/* Drop Point */}
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {customerProfile.name} · 9818041427
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {drop.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Swap Button (Right aligned) */}
            <button
              type="button"
              className="absolute right-3.5 top-7 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
              title="Swap Locations"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            {/* Quick Action Pills: Add Stop & Edit Locations */}
            <div className="flex items-center justify-around pt-3 border-t border-slate-200/70 mt-3 text-xs font-bold text-[#0052FF]">
              <button
                type="button"
                className="flex items-center gap-1.5 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stop</span>
              </button>

              <span className="text-slate-300">|</span>

              <button
                type="button"
                onClick={onEditLocations}
                className="flex items-center gap-1.5 hover:underline"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Locations</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Selection List */}
        <div className="p-4 space-y-3">
          {vehiclesToDisplay.map((v: any) => {
            const isSelected = selectedVehicleId === v.id;

            return (
              <div
                key={v.id}
                onClick={() => setSelectedVehicleId(v.id)}
                className={`rounded-2xl p-4 transition-all duration-200 cursor-pointer relative ${
                  isSelected
                    ? 'border-2 border-[#0052FF] bg-[#F2F7FF] shadow-sm'
                    : 'border border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Vehicle Illustration & Dimension */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-16 h-14 flex items-center justify-center shrink-0">
                      {/* Dimension marker if 2 wheeler */}
                      {v.dimensionTag && (
                        <span className="absolute -top-1 left-0 text-[9px] font-bold text-[#0052FF]">
                          {v.dimensionTag} ↕
                        </span>
                      )}

                      {/* Vehicle SVG Graphics */}
                      {v.iconType === 'bike' ? (
                        <svg viewBox="0 0 64 48" className="w-full h-full" fill="none">
                          <circle cx="14" cy="34" r="7" stroke="#1E293B" strokeWidth="3" fill="#FFF" />
                          <circle cx="48" cy="34" r="7" stroke="#1E293B" strokeWidth="3" fill="#FFF" />
                          <path d="M 14,34 L 26,34 L 36,20 L 48,34" stroke="#0052FF" strokeWidth="3.5" strokeLinecap="round" />
                          <rect x="6" y="16" width="14" height="13" rx="2" fill="#0052FF" stroke="#003DB8" strokeWidth="1" />
                        </svg>
                      ) : v.iconType === 'scooter' ? (
                        <svg viewBox="0 0 64 48" className="w-full h-full" fill="none">
                          <circle cx="14" cy="34" r="6" stroke="#1E293B" strokeWidth="3" fill="#FFF" />
                          <circle cx="46" cy="34" r="6" stroke="#1E293B" strokeWidth="3" fill="#FFF" />
                          <path d="M 14,34 L 32,34 L 40,16 L 46,34" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
                          <rect x="18" y="24" width="10" height="10" rx="2" fill="#E2E8F0" />
                        </svg>
                      ) : v.iconType === '3wheeler' ? (
                        <svg viewBox="0 0 64 48" className="w-full h-full" fill="none">
                          <rect x="6" y="12" width="40" height="24" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
                          <path d="M 46,18 L 56,26 L 56,36 L 46,36 Z" fill="#FACC15" />
                          <circle cx="16" cy="36" r="5" fill="#1E293B" />
                          <circle cx="50" cy="36" r="5" fill="#1E293B" />
                        </svg>
                      ) : v.iconType === 'eloader' ? (
                        <svg viewBox="0 0 64 48" className="w-full h-full" fill="none">
                          <rect x="6" y="16" width="36" height="20" rx="2.5" fill="#0284C7" />
                          <circle cx="14" cy="36" r="5" fill="#1E293B" />
                          <circle cx="48" cy="36" r="5" fill="#1E293B" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 64 48" className="w-full h-full" fill="none">
                          <rect x="6" y="10" width="34" height="26" rx="3" fill="#3B82F6" />
                          <rect x="40" y="18" width="16" height="18" rx="2" fill="#E2E8F0" />
                          <circle cx="16" cy="36" r="5" fill="#1E293B" />
                          <circle cx="46" cy="36" r="5" fill="#1E293B" />
                        </svg>
                      )}
                    </div>

                    {/* Name & Specs */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900">{v.name}</h4>
                        {v.badge && (
                          <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.2 rounded font-mono uppercase">
                            {v.badge}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowInfoModal(v);
                          }}
                          className="text-slate-400 hover:text-slate-600 ml-0.5"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {v.capacityKg} kg • {v.etaMins} mins
                      </p>
                    </div>
                  </div>

                  {/* Right: Transparent Fare in Rupees */}
                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold text-slate-900 font-mono">
                      ₹{v.baseFare}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed Sticky Bottom Action Button */}
      <div className="p-4 bg-white border-t border-slate-200/80 shadow-lg shrink-0">
        <button
          type="button"
          onClick={() => onProceedToBooking(selectedVehicleId)}
          className="w-full py-3.5 bg-[#0052FF] hover:bg-[#0042D0] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
        >
          <span>Proceed with {activeVehicle.name}</span>
        </button>
      </div>

      {/* Vehicle Info Specs Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">{showInfoModal.name} Specifications</h3>
              <button
                type="button"
                onClick={() => setShowInfoModal(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Max Carrying Capacity</span>
                <span className="font-bold text-slate-800">{showInfoModal.capacityKg} kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Dimensions</span>
                <span className="font-bold text-slate-800">{showInfoModal.dimensions || 'Standard parcel box'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Base Fare Included</span>
                <span className="font-bold text-slate-800">₹{showInfoModal.baseFare}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Ideal For</span>
                <span className="font-medium text-slate-800 text-right">{showInfoModal.popularFor || 'Parcels & commerce'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInfoModal(null)}
              className="w-full py-2.5 bg-blue-50 text-[#0052FF] font-bold rounded-xl text-xs hover:bg-blue-100 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
