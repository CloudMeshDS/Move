import React, { useState } from 'react';
import { Box, Home, Truck, ShieldCheck, Check, Plus, Minus, ArrowRight } from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { catalogApi } from '../../api';

interface PackersViewProps {
  onOrderCreated: (orderId: string) => void;
}

export function PackersView({ onOrderCreated }: PackersViewProps) {
  const { currentCity, createBooking, theme } = useLogistics();
  const isLight = theme === 'light';

  const [houseSize, setHouseSize] = useState<'1 Bed Flat' | '2 Bed Flat' | '3-4 Bed House' | 'Commercial Office'>('2 Bed Flat');
  const [items, setItems] = useState<Record<string, number>>(() => catalogApi.getMovingInventory());
  const [hasLiftPickup, setHasLiftPickup] = useState<boolean>(true);
  const [hasLiftDrop, setHasLiftDrop] = useState<boolean>(true);
  const [packingTier, setPackingTier] = useState<'standard' | 'premium'>('premium');

  const updateItemCount = (name: string, delta: number) => {
    setItems((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta)
    }));
  };

  const totalItemCount = Object.values(items).reduce((a, b) => a + b, 0);

  // Dynamic quote calculation from catalogApi
  const quote = catalogApi.calculateRelocationQuote({
    houseSize,
    packingTier,
    hasLiftPickup,
    hasLiftDrop
  });
  const { baseShiftCost, packingAddon, stairsAddon, totalCost } = quote;

  const handleBook = () => {
    const pickup = currentCity.popularLandmarks[0];
    const drop = currentCity.popularLandmarks[1] || currentCity.popularLandmarks[0];

    const order = createBooking({
      vehicleType: 'packers_movers',
      pickup,
      drop,
      goodsType: `Kiwi Relocation (${houseSize} - ${totalItemCount} items, ${packingTier} packing)`,
      helperCount: 2,
      paymentMethod: 'card',
      promoDiscount: 25
    });
    onOrderCreated(order.id);
  };

  return (
    <div className={`flex flex-col h-full overflow-y-auto p-4 space-y-4 pb-28 transition-colors ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Banner */}
      <div className={`p-4 rounded-2xl border ${
        isLight
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
          : 'bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-blue-500/30'
      }`}>
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Truck className="w-4 h-4" />
          <span>Move Kiwi Relocations (NZ)</span>
        </div>
        <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Stress-Free Home & Flat Moving</h3>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Pantech truck with tail-lift, moving blankets, heavy tie-downs, and 2 experienced movers.
        </p>
      </div>

      {/* House Configuration */}
      <div className={`p-4 border rounded-2xl space-y-3 ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
      }`}>
        <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Dwelling Size
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['1 Bed Flat', '2 Bed Flat', '3-4 Bed House', 'Commercial Office'] as const).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setHouseSize(size)}
              className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition ${
                houseSize === size
                  ? 'bg-blue-600 text-white border border-blue-400'
                  : isLight
                  ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Item Counter */}
      <div className={`p-4 border rounded-2xl space-y-3 ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center justify-between">
          <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Household Inventory Breakdown
          </label>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold">{totalItemCount} items selected</span>
        </div>

        <div className="space-y-2 text-xs">
          {Object.entries(items).map(([name, count]) => (
            <div
              key={name}
              className={`flex items-center justify-between p-2 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-800'
              }`}
            >
              <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{name}</span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => updateItemCount(name, -1)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold ${
                    isLight
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className={`w-5 text-center font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{count}</span>
                <button
                  type="button"
                  onClick={() => updateItemCount(name, 1)}
                  className="w-6 h-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packaging Tier */}
      <div className={`p-4 border rounded-2xl space-y-3 ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
      }`}>
        <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Furniture Protection Standard
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div
            onClick={() => setPackingTier('standard')}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              packingTier === 'standard'
                ? isLight
                  ? 'bg-blue-50 border-blue-500 text-blue-950'
                  : 'bg-blue-950/40 border-blue-500 text-white'
                : isLight
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : 'bg-slate-800/60 border-slate-800 text-slate-400'
            }`}
          >
            <p className="font-bold">Standard Moving</p>
            <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Moving blankets + heavy ratchet straps</p>
          </div>
          <div
            onClick={() => setPackingTier('premium')}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              packingTier === 'premium'
                ? isLight
                  ? 'bg-blue-50 border-blue-500 text-blue-950'
                  : 'bg-blue-950/40 border-blue-500 text-white'
                : isLight
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : 'bg-slate-800/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-bold">Full White-Glove</p>
              <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">Recommended</span>
            </div>
            <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Mattress covers, bubble wrap, corner protectors</p>
          </div>
        </div>
      </div>

      {/* Lift Accessibility Check */}
      <div className={`p-4 border rounded-2xl space-y-2.5 text-xs ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'
      }`}>
        <label className={`font-bold uppercase tracking-wider block ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Lift / Elevator Accessibility
        </label>
        <div className="flex items-center justify-between">
          <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Origin has elevator access</span>
          <button
            type="button"
            onClick={() => setHasLiftPickup(!hasLiftPickup)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              hasLiftPickup
                ? 'bg-emerald-600 text-white'
                : isLight
                ? 'bg-slate-100 text-slate-600'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {hasLiftPickup ? 'Yes (Lift)' : 'No (Stairs Only)'}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Destination has elevator access</span>
          <button
            type="button"
            onClick={() => setHasLiftDrop(!hasLiftDrop)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              hasLiftDrop
                ? 'bg-emerald-600 text-white'
                : isLight
                ? 'bg-slate-100 text-slate-600'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {hasLiftDrop ? 'Yes (Lift)' : 'No (Stairs Only)'}
          </button>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 backdrop-blur-md border-t z-30 flex items-center justify-between transition-colors ${
        isLight ? 'bg-white/95 border-slate-200 shadow-lg' : 'bg-slate-950/95 border-slate-800'
      }`}>
        <div>
          <span className={`text-[10px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>All-Inclusive Quote (NZD)</span>
          <span className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>${totalCost.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={handleBook}
          className="py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition"
        >
          <span>Book Relocation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
