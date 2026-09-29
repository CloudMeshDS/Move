import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  Clock,
  Weight,
  Users,
  ChevronRight,
  Shield,
  Tag,
  ArrowRight,
  CheckCircle2,
  Info,
  Truck,
  Package,
  CreditCard
} from 'lucide-react';
import { useLogistics } from '../../context/LogisticsContext';
import { MapPoint, VehicleCategoryId } from '../../types/logistics';
import { catalogApi } from '../../api';
import { InteractiveCityMap } from '../map/InteractiveCityMap';

interface BookingViewProps {
  onOrderCreated: (orderId: string) => void;
}

export function BookingView({ onOrderCreated }: BookingViewProps) {
  const {
    currentCity,
    vehicleOptions,
    calculateFare,
    createBooking,
    goodsCategories,
    drivers,
    theme
  } = useLogistics();

  const isLight = theme === 'light';

  // Selected points
  const [pickup, setPickup] = useState<MapPoint>(currentCity.popularLandmarks[0]);
  const [drop, setDrop] = useState<MapPoint>(currentCity.popularLandmarks[1] || currentCity.popularLandmarks[0]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategoryId>('cargo_van');
  const [helperCount, setHelperCount] = useState<number>(1);
  const [goodsType, setGoodsType] = useState<string>('Carton Boxes & Retail Parcels');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'poli' | 'cash'>('card');
  const [promoCode, setPromoCode] = useState<string>('KIWI10');
  const [promoDiscountAmount, setPromoDiscountAmount] = useState<number>(10);
  const [promoMessage, setPromoMessage] = useState<string>('$10 Off Welcome Kiwi Discount');
  const [promoApplied, setPromoApplied] = useState<boolean>(true);
  const [showFareDetails, setShowFareDetails] = useState<boolean>(false);
  const [pickingLocationType, setPickingLocationType] = useState<'pickup' | 'drop' | null>(null);

  const discountAmount = promoApplied ? promoDiscountAmount : 0;
  const currentFare = calculateFare(selectedVehicle, pickup, drop, helperCount, discountAmount);
  const activeVehicleConfig = vehicleOptions.find((v) => v.id === selectedVehicle) || vehicleOptions[0];

  const handleApplyPromo = async () => {
    const res = await catalogApi.validatePromo(promoCode, currentFare.baseFare + currentFare.distanceFare);
    if (res.data?.valid) {
      setPromoApplied(true);
      setPromoDiscountAmount(res.data.discountValue);
      setPromoMessage(res.data.description);
    } else {
      alert(res.error || 'Invalid promo code. Try KIWI10 or NZFREIGHT');
      setPromoApplied(false);
      setPromoDiscountAmount(0);
    }
  };

  const handleCoordinateSelected = (coord: { x: number; y: number; name: string }) => {
    const point: MapPoint = {
      x: coord.x,
      y: coord.y,
      name: `${pickingLocationType === 'drop' ? 'Destination' : 'Pickup Point'} (${coord.x}, ${coord.y})`,
      address: `Industrial Road, ${currentCity.name}`,
      area: `${currentCity.name} Hub`,
      city: currentCity.name
    };

    if (pickingLocationType === 'pickup') {
      setPickup(point);
    } else {
      setDrop(point);
    }
    setPickingLocationType(null);
  };

  const handleConfirmBooking = () => {
    const newOrder = createBooking({
      vehicleType: selectedVehicle,
      pickup,
      drop,
      goodsType,
      helperCount,
      paymentMethod,
      promoDiscount: discountAmount
    });
    onOrderCreated(newOrder.id);
  };

  return (
    <div className={`flex flex-col h-full overflow-y-auto pb-28 transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Map Preview with route line */}
      <div className="relative">
        <InteractiveCityMap
          order={{
            id: 'draft',
            trackingNumber: 'DRAFT',
            customerId: 'cust',
            customerName: '',
            customerPhone: '',
            vehicleType: selectedVehicle,
            vehicleName: activeVehicleConfig.name,
            pickup,
            drop,
            goodsType,
            helperCount,
            fare: currentFare,
            status: 'draft',
            otp: '0000',
            createdAt: '',
            progressPercent: 0,
            routeWaypoints: [
              { x: pickup.x, y: pickup.y },
              { x: (pickup.x + drop.x) / 2, y: (pickup.y + drop.y) / 2 },
              { x: drop.x, y: drop.y }
            ],
            estimatedArrivalMins: activeVehicleConfig.etaMins,
            paymentMethod,
            paymentStatus: 'pending'
          }}
          drivers={drivers}
          interactiveSelection={pickingLocationType !== null}
          selectionMode={pickingLocationType}
          onSelectCoordinate={handleCoordinateSelected}
          heightClass="h-56"
          compact
        />

        {/* Floating City & Distance Pill */}
        <div className={`absolute top-3 left-3 backdrop-blur-md px-3 py-1.5 rounded-xl border text-xs shadow-md flex items-center gap-2 ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-800'
            : 'bg-slate-900/90 border-slate-700/80 text-white'
        }`}>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{currentCity.name.split(' ')[0]}</span>
          <span className={isLight ? 'text-slate-300' : 'text-slate-500'}>·</span>
          <span className={`font-mono font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{currentFare.distanceKm} km</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Pickup & Drop Selection Card */}
        <div className={`p-3.5 border rounded-2xl shadow-sm space-y-3 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          {/* Pickup Input */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center mt-1">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-md shadow-emerald-500/30" />
              <span className={`w-0.5 h-7 my-0.5 ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Pickup Address</span>
                <button
                  type="button"
                  onClick={() => setPickingLocationType('pickup')}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Pin on Map
                </button>
              </div>
              <select
                aria-label="Select Pickup Location"
                value={pickup.name}
                onChange={(e) => {
                  const found = currentCity.popularLandmarks.find((l) => l.name === e.target.value);
                  if (found) setPickup(found);
                }}
                className={`w-full border rounded-xl px-2.5 py-1.5 text-xs mt-1 focus:outline-none focus:border-blue-500 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-slate-800/80 border-slate-700 text-white'
                }`}
              >
                {currentCity.popularLandmarks.map((lm) => (
                  <option key={lm.name} value={lm.name} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>
                    {lm.name} ({lm.area})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drop Input */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow-md shadow-rose-500/30" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">Delivery Destination</span>
                <button
                  type="button"
                  onClick={() => setPickingLocationType('drop')}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Pin on Map
                </button>
              </div>
              <select
                aria-label="Select Drop Location"
                value={drop.name}
                onChange={(e) => {
                  const found = currentCity.popularLandmarks.find((l) => l.name === e.target.value);
                  if (found) setDrop(found);
                }}
                className={`w-full border rounded-xl px-2.5 py-1.5 text-xs mt-1 focus:outline-none focus:border-blue-500 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-slate-800/80 border-slate-700 text-white'
                }`}
              >
                {currentCity.popularLandmarks.map((lm) => (
                  <option key={lm.name} value={lm.name} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>
                    {lm.name} ({lm.area})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vehicle Selection Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Select Vehicle Fleet (NZ)</h3>
            <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>15% GST Included</span>
          </div>

          {/* Vehicle List */}
          <div className="grid grid-cols-1 gap-2.5">
            {vehicleOptions.map((v) => {
              const fare = calculateFare(v.id, pickup, drop, helperCount, discountAmount);
              const isSelected = selectedVehicle === v.id;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? isLight
                        ? 'bg-blue-50/90 border-2 border-blue-600 shadow-sm text-slate-900'
                        : 'bg-blue-950/40 border-2 border-blue-500 shadow-lg shadow-blue-600/10 text-white'
                      : isLight
                      ? 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : isLight
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {v.iconType === 'courier' ? <Package className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold ${
                            isSelected
                              ? isLight ? 'text-blue-950' : 'text-white'
                              : isLight ? 'text-slate-900' : 'text-white'
                          }`}>{v.name}</h4>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {v.etaMins} mins away
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{v.tagline}</p>
                        <div className={`flex items-center gap-3 text-[11px] mt-1 font-mono ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          <span>Payload {v.capacityKg} kg</span>
                          <span>·</span>
                          <span>{v.dimensions}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Column */}
                    <div className="text-right">
                      <div className={`text-base font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        ${fare.totalFare.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        Instant Dispatch
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading / Helper Assistance */}
        {selectedVehicle !== 'courier' && (
          <div className={`p-3.5 border rounded-2xl space-y-2.5 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Loading & Lifting Assistance
                </h4>
              </div>
              <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Driver lifting help</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setHelperCount(0)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                  helperCount === 0
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                No Helper
                <span className="block text-[10px] opacity-75 font-normal">Self Load ($0)</span>
              </button>
              <button
                type="button"
                onClick={() => setHelperCount(1)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                  helperCount === 1
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                1 Helper
                <span className="block text-[10px] opacity-75 font-normal">+${activeVehicleConfig.helperFee.toFixed(2)}</span>
              </button>
              <button
                type="button"
                onClick={() => setHelperCount(2)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                  helperCount === 2
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300'
                }`}
              >
                2 Helpers
                <span className="block text-[10px] opacity-75 font-normal">+${(activeVehicleConfig.helperFee * 2).toFixed(2)}</span>
              </button>
            </div>
          </div>
        )}

        {/* Goods Type Selection */}
        <div className={`p-3.5 border rounded-2xl space-y-2 shadow-sm ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <label className={`text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <span>Cargo Category</span>
            <span className={`text-[11px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>For safe tie-down & transport</span>
          </label>
          <select
            value={goodsType}
            onChange={(e) => setGoodsType(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700 text-white'
            }`}
          >
            {(goodsCategories && goodsCategories.length > 0 ? goodsCategories : [
              { id: 'cartons', label: 'Carton Boxes & Retail Parcels', icon: 'Package' },
              { id: 'furniture', label: 'Furniture (Bed, Lounge Suite, Table)', icon: 'Armchair' },
              { id: 'whiteware', label: 'Whiteware (Fridge, Washing Machine, Dryer)', icon: 'Tv' },
              { id: 'pallets', label: 'Commercial CHEP Pallets & Freight', icon: 'Truck' },
              { id: 'tradie', label: 'Tradie Supplies & Timber / Hardware', icon: 'Wrench' },
              { id: 'urgent', label: 'Urgent Documents / Legal Pack', icon: 'FileText' }
            ]).map((g) => (
              <option key={g.id} value={g.label} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Selector (NZ) */}
        <div className={`p-3.5 border rounded-2xl space-y-2 shadow-sm ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <label className={`text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <span>Payment Method</span>
            <span className={`text-[11px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>NZD Secure Gateway</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'card', label: 'Credit Card', icon: '💳' },
              { id: 'apple_pay', label: 'Apple Pay', icon: '🍎' },
              { id: 'poli', label: 'POLi Pay', icon: '🏦' },
              { id: 'cash', label: 'Cash on Drop', icon: '💵' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPaymentMethod(p.id as any)}
                className={`p-2 rounded-xl border text-center transition text-xs ${
                  paymentMethod === p.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : isLight
                    ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <span className="block text-sm mb-0.5">{p.icon}</span>
                <span className="font-semibold text-[10px]">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Promo Voucher Card */}
        <div className={`p-3.5 border rounded-2xl flex items-center justify-between shadow-sm ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <Tag className="w-4 h-4 text-emerald-500" />
            <div>
              <span className={`text-xs font-bold uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>KIWI10 Applied</span>
              <p className="text-[11px] text-emerald-600 font-medium">Flat $10.00 NZD discount on freight</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPromoApplied(!promoApplied)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            {promoApplied ? 'Remove' : 'Apply'}
          </button>
        </div>

        {/* Fare Summary & Breakdown Trigger */}
        <div className={`p-3.5 border rounded-2xl space-y-2 text-xs shadow-sm ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Total Price (incl. 15% GST)</span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>${currentFare.totalFare.toFixed(2)} NZD</span>
              <button
                type="button"
                onClick={() => setShowFareDetails(!showFareDetails)}
                className="text-blue-600 hover:text-blue-700 text-[11px] font-semibold flex items-center gap-0.5"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Details</span>
              </button>
            </div>
          </div>

          {showFareDetails && (
            <div className={`pt-2 border-t space-y-1.5 text-[11px] font-mono ${
              isLight ? 'border-slate-100 text-slate-600' : 'border-slate-800 text-slate-400'
            }`}>
              <div className="flex justify-between">
                <span>Base Charge (First {activeVehicleConfig.baseKm}km)</span>
                <span>${currentFare.baseFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance Charge ({currentFare.distanceKm}km)</span>
                <span>${currentFare.distanceFare.toFixed(2)}</span>
              </div>
              {helperCount > 0 && (
                <div className="flex justify-between">
                  <span>Helper Lifting Assistance ({helperCount}x)</span>
                  <span>${currentFare.helperFare.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>NZ GST (15%)</span>
                <span>${currentFare.gstTax.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Voucher Discount</span>
                  <span>-$10.00</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Confirmation Bar */}
      <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 backdrop-blur-md border-t z-30 flex items-center gap-3 transition-colors ${
        isLight ? 'bg-white/95 border-slate-200 shadow-lg' : 'bg-slate-950/95 border-slate-800'
      }`}>
        <div className="flex-1">
          <span className={`text-[10px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total NZD (incl GST)</span>
          <span className={`text-xl font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>${currentFare.totalFare.toFixed(2)}</span>
        </div>
        <button
          type="button"
          onClick={handleConfirmBooking}
          className="flex-2 py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition"
        >
          <span>Book {activeVehicleConfig.name.split(' ')[0]}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
