import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { AuthScreen } from './AuthScreen';
import { OtpScreen } from './OtpScreen';
import { HomeScreen } from './HomeScreen';
import { DropSearchScreen } from './DropSearchScreen';
import { VehicleSelectScreen } from './VehicleSelectScreen';
import { LiveTrackingView } from './LiveTrackingView';
import { PackersView } from './PackersView';
import { TripHistoryView } from './TripHistoryView';
import { CoinsScreen } from './CoinsScreen';
import { PaymentsScreen } from './PaymentsScreen';
import { AccountScreen } from './AccountScreen';
import { MapPoint, VehicleCategoryId } from '../../types/logistics';

export type CustomerScreenId =
  | 'auth'
  | 'otp'
  | 'home'
  | 'drop_search'
  | 'vehicle_select'
  | 'tracking'
  | 'packers'
  | 'orders'
  | 'coins'
  | 'payments'
  | 'account';

export function CustomerApp() {
  const {
    currentCity,
    customerProfile,
    activeOrder,
    createBooking
  } = useLogistics();

  // Screen state
  const [currentScreen, setCurrentScreen] = useState<CustomerScreenId>('home');
  const [pendingPhone, setPendingPhone] = useState<string>('9876777416');

  // Route selection state
  const [pickupPoint, setPickupPoint] = useState<MapPoint>(
    currentCity.popularLandmarks[0] || {
      x: 48,
      y: 28,
      name: 'Sector 48, Gurugram',
      address: 'B1, B2, B3, Sector 48, Gurugram, Haryana 122018, India',
      area: 'Sector 48',
      city: currentCity.name
    }
  );

  const [dropPoint, setDropPoint] = useState<MapPoint>(
    currentCity.popularLandmarks[1] || {
      x: 52,
      y: 45,
      name: '505, Iris Tech Park',
      address: 'Iris Tech Park, Sector 48, Gurugram, Haryana, India',
      area: 'Iris Tech Park',
      city: currentCity.name
    }
  );

  // Transition handlers
  const handleAuthSuccess = (phone: string) => {
    setPendingPhone(phone);
    setCurrentScreen('otp');
  };

  const handleOtpSuccess = () => {
    setCurrentScreen('home');
  };

  const handleSelectCategory = (cat: 'trucks' | '2_wheeler' | 'packers_movers') => {
    if (cat === 'packers_movers') {
      setCurrentScreen('packers');
    } else {
      setCurrentScreen('drop_search');
    }
  };

  const handleSelectDropLocation = (drop: MapPoint) => {
    setDropPoint(drop);
    setCurrentScreen('vehicle_select');
  };

  const handleProceedWithVehicle = (vehicleId: VehicleCategoryId) => {
    const order = createBooking({
      vehicleType: vehicleId,
      pickup: pickupPoint,
      drop: dropPoint,
      goodsType: 'Parcels & Commercial Consignment',
      helperCount: 0,
      paymentMethod: 'card'
    });
    setCurrentScreen('tracking');
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative overflow-hidden">
      {/* Reference Screen Quick Navigator Bar (Floating on top-right for paired review) */}
      <div className="absolute top-2 right-2 z-50 flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-1 rounded-full shadow-lg border border-white/20 text-[10px] text-white">
        <span className="font-bold text-slate-400 mr-1 hidden sm:inline">Reference Screens:</span>
        <button
          type="button"
          onClick={() => setCurrentScreen('auth')}
          className={`px-1.5 py-0.5 rounded-full font-bold transition ${
            currentScreen === 'auth' ? 'bg-[#0052FF] text-white' : 'hover:bg-white/20'
          }`}
          title="Screenshot 1: Phone Login"
        >
          1:Login
        </button>
        <button
          type="button"
          onClick={() => setCurrentScreen('otp')}
          className={`px-1.5 py-0.5 rounded-full font-bold transition ${
            currentScreen === 'otp' ? 'bg-[#0052FF] text-white' : 'hover:bg-white/20'
          }`}
          title="Screenshot 2: OTP Verification"
        >
          2:OTP
        </button>
        <button
          type="button"
          onClick={() => setCurrentScreen('home')}
          className={`px-1.5 py-0.5 rounded-full font-bold transition ${
            currentScreen === 'home' ? 'bg-[#0052FF] text-white' : 'hover:bg-white/20'
          }`}
          title="Screenshot 3: Home Dashboard"
        >
          3:Home
        </button>
        <button
          type="button"
          onClick={() => setCurrentScreen('drop_search')}
          className={`px-1.5 py-0.5 rounded-full font-bold transition ${
            currentScreen === 'drop_search' ? 'bg-[#0052FF] text-white' : 'hover:bg-white/20'
          }`}
          title="Screenshot 4: Drop Location Search"
        >
          4:Drop
        </button>
        <button
          type="button"
          onClick={() => setCurrentScreen('vehicle_select')}
          className={`px-1.5 py-0.5 rounded-full font-bold transition ${
            currentScreen === 'vehicle_select' ? 'bg-[#0052FF] text-white' : 'hover:bg-white/20'
          }`}
          title="Screenshot 5: Select Vehicle"
        >
          5:Vehicle
        </button>
        {activeOrder && (
          <button
            type="button"
            onClick={() => setCurrentScreen('tracking')}
            className={`px-1.5 py-0.5 rounded-full font-bold transition ${
              currentScreen === 'tracking' ? 'bg-emerald-600 text-white' : 'hover:bg-white/20'
            }`}
            title="Live Order Tracking"
          >
            Live
          </button>
        )}
      </div>

      {/* Screen 1: Login / Phone Number (Screenshot 1) */}
      {currentScreen === 'auth' && (
        <AuthScreen
          initialPhone={pendingPhone}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Screen 2: OTP Verification (Screenshot 2) */}
      {currentScreen === 'otp' && (
        <OtpScreen
          phoneNumber={pendingPhone}
          onChangeNumber={() => setCurrentScreen('auth')}
          onVerifySuccess={handleOtpSuccess}
        />
      )}

      {/* Screen 3: Home Dashboard (Screenshot 3) */}
      {currentScreen === 'home' && (
        <HomeScreen
          activeTab="home"
          onSelectCategory={handleSelectCategory}
          onOpenLocationPicker={() => setCurrentScreen('drop_search')}
          onNavigateTab={(tab) => {
            if (tab === 'orders') setCurrentScreen('orders');
            else if (tab === 'coins') setCurrentScreen('coins');
            else if (tab === 'payments') setCurrentScreen('payments');
            else if (tab === 'account') setCurrentScreen('account');
            else setCurrentScreen('home');
          }}
        />
      )}

      {/* Screen 4: Drop Location Search (Screenshot 4) */}
      {currentScreen === 'drop_search' && (
        <DropSearchScreen
          onBack={() => setCurrentScreen('home')}
          onSelectDropLocation={handleSelectDropLocation}
          onOpenMapPicker={() => setCurrentScreen('vehicle_select')}
        />
      )}

      {/* Screen 5: Vehicle Selection & Fare Cards (Screenshot 5) */}
      {currentScreen === 'vehicle_select' && (
        <VehicleSelectScreen
          pickup={pickupPoint}
          drop={dropPoint}
          onBack={() => setCurrentScreen('drop_search')}
          onProceedToBooking={handleProceedWithVehicle}
          onEditLocations={() => setCurrentScreen('drop_search')}
        />
      )}

      {/* Screen 6: Live Tracking & Proof of Delivery */}
      {currentScreen === 'tracking' && activeOrder && (
        <LiveTrackingView
          order={activeOrder}
          onNewBookingClick={() => setCurrentScreen('home')}
        />
      )}

      {/* Screen 7: Packers & Movers House Shifting View */}
      {currentScreen === 'packers' && (
        <div className="flex flex-col h-full">
          <div className="px-4 py-3 bg-white border-b flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentScreen('home')}
              className="text-xs font-bold text-[#0052FF]"
            >
              ← Back to Home
            </button>
            <span className="text-xs font-bold text-slate-800">Packers & Movers</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PackersView
              onOrderCreated={() => setCurrentScreen('tracking')}
            />
          </div>
        </div>
      )}

      {/* Screen 8: Orders History */}
      {currentScreen === 'orders' && (
        <div className="flex flex-col h-full">
          <div className="px-4 py-3 bg-white border-b flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentScreen('home')}
              className="text-xs font-bold text-[#0052FF]"
            >
              ← Back to Home
            </button>
            <span className="text-xs font-bold text-slate-800">Your Orders</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <TripHistoryView onSelectOrder={() => setCurrentScreen('tracking')} />
          </div>
        </div>
      )}

      {/* Screen 9: Coins / Rewards */}
      {currentScreen === 'coins' && (
        <CoinsScreen onBack={() => setCurrentScreen('home')} />
      )}

      {/* Screen 10: Payments & Wallet */}
      {currentScreen === 'payments' && (
        <PaymentsScreen onBack={() => setCurrentScreen('home')} />
      )}

      {/* Screen 11: Account Profile */}
      {currentScreen === 'account' && (
        <AccountScreen
          onBack={() => setCurrentScreen('home')}
          onLogout={() => setCurrentScreen('auth')}
          onManageAddresses={() => setCurrentScreen('drop_search')}
        />
      )}
    </div>
  );
}
