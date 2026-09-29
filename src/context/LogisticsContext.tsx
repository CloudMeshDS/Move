import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CITY_HUBS, INITIAL_DRIVERS, VEHICLE_OPTIONS } from '../data/mockData';
import {
  CityHub,
  DriverPartner,
  FareBreakdown,
  LogisticsOrder,
  MapPoint,
  OrderStatus,
  ProofOfDelivery,
  VehicleCategoryId,
  VehicleOption,
  LiveThemeMode,
  ThemeMode,
  LiveTelemetry,
  LiveActivityFeedItem
} from '../types/logistics';
import { sound } from '../utils/audio';
import { getStoredSupabaseConfig, testSupabaseConnection } from '../lib/supabase';
import {
  fetchDriversFromSupabase,
  fetchOrdersFromSupabase,
  saveDriverToSupabase,
  saveOrderToSupabase,
  subscribeToRealtimeDrivers,
  subscribeToRealtimeOrders
} from '../services/supabaseService';

export type UserRole = 'customer' | 'driver' | 'admin';

interface CreateBookingParams {
  vehicleType: VehicleCategoryId;
  pickup: MapPoint;
  drop: MapPoint;
  waypoints?: MapPoint[];
  goodsType: string;
  helperCount: number;
  paymentMethod: 'card' | 'apple_pay' | 'poli' | 'cash';
  promoDiscount?: number;
}

interface LogisticsContextType {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  currentCity: CityHub;
  setCurrentCity: (city: CityHub) => void;
  vehicleOptions: VehicleOption[];
  drivers: DriverPartner[];
  currentDriver: DriverPartner;
  setCurrentDriverId: (id: string) => void;
  orders: LogisticsOrder[];
  activeOrder: LogisticsOrder | null;
  driverIncomingOrder: LogisticsOrder | null;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  splitView: boolean;
  setSplitView: (split: boolean) => void;
  isSimulatingDrive: boolean;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  liveTheme: LiveThemeMode;
  setLiveTheme: (mode: LiveThemeMode) => void;
  liveRadarActive: boolean;
  setLiveRadarActive: (active: boolean) => void;
  liveTelemetry: LiveTelemetry;
  liveActivityFeed: LiveActivityFeedItem[];
  addLiveFeedEvent: (event: string, city: string, vehicleType: string, accent?: 'blue' | 'emerald' | 'amber' | 'purple') => void;
  liveTrafficTicker: string[];
  calculateFare: (
    vehicleType: VehicleCategoryId,
    pickup: MapPoint,
    drop: MapPoint,
    helperCount: number,
    discount?: number
  ) => FareBreakdown;
  createBooking: (params: CreateBookingParams) => LogisticsOrder;
  acceptIncomingOrder: (orderId: string) => void;
  rejectIncomingOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  advanceOrderStage: (orderId: string) => void;
  completeDelivery: (orderId: string, pod: ProofOfDelivery) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  toggleDriverOnline: (driverId: string) => void;
  updateRateCard: (vehicleId: VehicleCategoryId, updates: Partial<VehicleOption>) => void;
  approveDriverKYC: (driverId: string, approved: boolean) => void;
  simulateFullDrive: (orderId: string) => void;
  pauseDriveSimulation: () => void;
  resumeDriveSimulation: () => void;
  resetAllData: () => void;
  loadQuickDemoOrder: () => void;
  // Supabase cloud database integration
  isSupabaseLive: boolean;
  refreshFromSupabase: () => Promise<void>;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export function LogisticsProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [splitView, setSplitView] = useState<boolean>(false);
  const [currentCity, setCurrentCity] = useState<CityHub>(CITY_HUBS[0]);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>(VEHICLE_OPTIONS);
  const [drivers, setDrivers] = useState<DriverPartner[]>(() => {
    const saved = localStorage.getItem('move_drivers_v1') || localStorage.getItem('porter_drivers_v1');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });
  const [currentDriverId, setCurrentDriverId] = useState<string>('drv-101');
  const [orders, setOrders] = useState<LogisticsOrder[]>(() => {
    const saved = localStorage.getItem('move_orders_v1') || localStorage.getItem('porter_orders_v1');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [isSimulatingDrive, setIsSimulatingDrive] = useState<boolean>(false);
  const simulationIntervalRef = useRef<number | null>(null);

  // Supabase Cloud State
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  // Primary App Theme State ('light' | 'dark') - default is explicitly 'light'
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('move_theme_v2') || localStorage.getItem('porter_theme_v2');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('move_theme_v2', mode);
    sound.playTap();
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', theme);
  }, [theme]);

  // Live Palette Accent ('neon_radar' | 'kiwi_emerald' | 'alert_amber' | 'daylight_live')
  const [liveTheme, setLiveThemeState] = useState<LiveThemeMode>(() => {
    const saved = localStorage.getItem('move_live_theme_v1') || localStorage.getItem('porter_live_theme_v1');
    return (saved as LiveThemeMode) || 'daylight_live';
  });
  const [liveRadarActive, setLiveRadarActive] = useState<boolean>(true);

  const setLiveTheme = (mode: LiveThemeMode) => {
    setLiveThemeState(mode);
    localStorage.setItem('move_live_theme_v1', mode);
    sound.playTap();
  };

  // Live New Zealand Time formatted ticking clock
  const [nzTimeStr, setNzTimeStr] = useState<string>(() => {
    try {
      return new Date().toLocaleTimeString('en-NZ', { timeZone: 'Pacific/Auckland', hour12: false }) + ' NZDT';
    } catch {
      return new Date().toLocaleTimeString() + ' NZDT';
    }
  });

  const [latencyMs, setLatencyMs] = useState<number>(11);

  // Live traffic ticker messages across New Zealand hubs
  const liveTrafficTicker = [
    '🟢 SH1 Auckland Harbour Bridge: Free flowing 84 km/h northbound & southbound',
    '🟡 Wellington Ngauranga Gorge: Moderate flow 68 km/h',
    '🟢 Christchurch Brougham St / Port Lyttelton: Heavy freight route clear',
    '🔵 Tauranga Kaimai Ranges SH29: Wet road surface, advisory speed 70 km/h',
    '🟢 Hamilton Expressway (SH1): Free flow 108 km/h',
    '🚢 Interislander / Bluebridge Cook Strait: Kaiarahi freight sailing on schedule',
    '⚡ Live Dispatch Telemetry: 18 Drivers active across Auckland, Wellington & Canterbury'
  ];

  // Initial live activity feed events
  const [liveActivityFeed, setLiveActivityFeed] = useState<LiveActivityFeedItem[]>([
    {
      id: 'lf-1',
      timestamp: 'Just now',
      city: 'Auckland',
      vehicleType: 'Toyota HiAce Van',
      event: 'Consignment collected in Penrose Industrial Estate',
      badge: 'DISPATCH',
      accent: 'blue'
    },
    {
      id: 'lf-2',
      timestamp: '1m ago',
      city: 'Auckland',
      vehicleType: '2T Box Truck',
      event: 'Proof of Delivery signed at Albany Distribution Hub',
      badge: 'DELIVERED',
      accent: 'emerald'
    },
    {
      id: 'lf-3',
      timestamp: '3m ago',
      city: 'Christchurch',
      vehicleType: 'Metro Courier',
      event: 'Express medical consignment picked up in Riccarton',
      badge: 'IN TRANSIT',
      accent: 'purple'
    },
    {
      id: 'lf-4',
      timestamp: '5m ago',
      city: 'Wellington',
      vehicleType: 'Flat Deck Ute',
      event: 'Timber framing delivery en route to Lower Hutt',
      badge: 'EN ROUTE',
      accent: 'amber'
    }
  ]);

  const addLiveFeedEvent = (
    event: string,
    city: string,
    vehicleType: string,
    accent: 'blue' | 'emerald' | 'amber' | 'purple' = 'blue'
  ) => {
    const newItem: LiveActivityFeedItem = {
      id: `lf-${Date.now()}`,
      timestamp: 'Just now',
      city,
      vehicleType,
      event,
      badge: 'LIVE DISPATCH',
      accent
    };
    setLiveActivityFeed((prev) => [newItem, ...prev.slice(0, 19)]);
  };

  // Clock tick every 1s and periodic telemetry jitter
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        setNzTimeStr(new Date().toLocaleTimeString('en-NZ', { timeZone: 'Pacific/Auckland', hour12: false }) + ' NZDT');
      } catch {
        setNzTimeStr(new Date().toLocaleTimeString() + ' NZDT');
      }
      setLatencyMs(10 + Math.floor(Math.random() * 4));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const liveTelemetry: LiveTelemetry = {
    satellitesLocked: 14,
    latencyMs,
    rtkAccuracy: '±0.12m RTK-FIX',
    networkOperator: 'Spark 5G NZ',
    currentSpeedKmh: isSimulatingDrive ? 54 : 0,
    nzTimeStr,
    activeDriversCount: drivers.filter((d) => d.status !== 'offline').length,
    liveTripsCount: orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length
  };

  // Sync sound utility state
  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sound.enabled = enabled;
  };

  // Persist state to local storage
  useEffect(() => {
    localStorage.setItem('move_drivers_v1', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('move_orders_v1', JSON.stringify(orders));
  }, [orders]);

  // Supabase Initial Handshake & Hydration
  const refreshFromSupabase = async () => {
    const config = getStoredSupabaseConfig();
    if (!config.isConfigured) {
      setIsSupabaseLive(false);
      return;
    }

    try {
      const ping = await testSupabaseConnection();
      if (ping.success) {
        setIsSupabaseLive(true);
        const remoteDrivers = await fetchDriversFromSupabase();
        if (remoteDrivers && remoteDrivers.length > 0) {
          setDrivers(remoteDrivers);
        }
        const remoteOrders = await fetchOrdersFromSupabase();
        if (remoteOrders && remoteOrders.length > 0) {
          setOrders(remoteOrders);
        }
      } else {
        setIsSupabaseLive(false);
      }
    } catch {
      setIsSupabaseLive(false);
    }
  };

  useEffect(() => {
    refreshFromSupabase();

    // Subscribe to Realtime Postgres Changes
    const unsubOrders = subscribeToRealtimeOrders(
      (newOrder) => {
        setOrders((prev) => {
          if (prev.some((o) => o.id === newOrder.id)) return prev;
          return [newOrder, ...prev];
        });
      },
      (updatedOrder) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
        );
      }
    );

    const unsubDrivers = subscribeToRealtimeDrivers((updatedDriver) => {
      setDrivers((prev) =>
        prev.map((d) => (d.id === updatedDriver.id ? updatedDriver : d))
      );
    });

    return () => {
      unsubOrders();
      unsubDrivers();
    };
  }, []);

  const currentDriver = drivers.find((d) => d.id === currentDriverId) || drivers[0];
  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders.find(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  ) || null;

  // Driver incoming order is an order assigned or matching this driver that is pending
  const driverIncomingOrder = orders.find(
    (o) =>
      (o.status === 'searching' && o.vehicleType === currentDriver.vehicleType && currentDriver.status === 'online_idle') ||
      (o.status === 'driver_assigned' && o.driverId === currentDriver.id)
  ) || null;

  // Sound ping on driver incoming order
  useEffect(() => {
    if (driverIncomingOrder && driverIncomingOrder.status === 'searching' && currentDriver.status === 'online_idle') {
      sound.playDispatchPing();
    }
  }, [driverIncomingOrder?.id, currentDriver.status]);

  // Utility to calculate distance between map percentage points
  const calculateDistanceKm = (p1: MapPoint, p2: MapPoint): number => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    // Map is roughly 25km x 25km representation
    const distPercentage = Math.sqrt(dx * dx + dy * dy);
    const km = Math.max(1.8, Math.round((distPercentage * 0.35) * 10) / 10);
    return km;
  };

  // Calculate fare with transparent breakdown
  const calculateFare = (
    vehicleType: VehicleCategoryId,
    pickup: MapPoint,
    drop: MapPoint,
    helperCount: number,
    discount = 0
  ): FareBreakdown => {
    const vehicle = vehicleOptions.find((v) => v.id === vehicleType) || vehicleOptions[0];
    const distanceKm = calculateDistanceKm(pickup, drop);
    const billableKm = Math.max(0, distanceKm - vehicle.baseKm);
    const distanceFare = Math.round(billableKm * vehicle.perKmRate * 10) / 10;
    const helperFare = helperCount * vehicle.helperFee;
    const surgeMultiplier = 1.0;
    const surgeFee = Math.round((vehicle.baseFare + distanceFare) * (surgeMultiplier - 1.0) * 10) / 10;
    const subtotal = vehicle.baseFare + distanceFare + helperFare + surgeFee;
    const gstTax = Math.round(subtotal * 0.15 * 10) / 10; // 15% New Zealand GST
    const totalFare = Math.max(15, Math.round((subtotal + gstTax - discount) * 10) / 10);
    const platformCut = Math.round(totalFare * 0.20 * 10) / 10; // 20% platform commission
    const driverEarnings = Math.round((totalFare - platformCut) * 10) / 10;

    return {
      baseFare: vehicle.baseFare,
      distanceKm,
      distanceFare,
      helperCount,
      helperFare,
      surgeMultiplier,
      surgeFee,
      gstTax,
      discount,
      totalFare,
      driverEarnings,
      platformCut
    };
  };

  // Generate intermediate waypoint route points for smooth vehicle animation
  const generateRoutePoints = (start: MapPoint, end: MapPoint): Array<{ x: number; y: number }> => {
    const points: Array<{ x: number; y: number }> = [];
    const steps = 25;
    // Add realistic Manhattan-like city street bends
    const midX = start.x;
    const midY = end.y;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      if (t < 0.5) {
        const subT = t * 2;
        // Travel horizontally first
        points.push({
          x: Number((start.x + (midX - start.x) * subT + Math.sin(subT * Math.PI) * 1.2).toFixed(2)),
          y: Number((start.y + (midY - start.y) * subT).toFixed(2))
        });
      } else {
        const subT = (t - 0.5) * 2;
        // Travel vertically to destination
        points.push({
          x: Number((midX + (end.x - midX) * subT).toFixed(2)),
          y: Number((midY + (end.y - midY) * subT + Math.sin(subT * Math.PI) * 1.2).toFixed(2))
        });
      }
    }
    return points;
  };

  // Create customer booking
  const createBooking = (params: CreateBookingParams): LogisticsOrder => {
    const vehicle = vehicleOptions.find((v) => v.id === params.vehicleType) || vehicleOptions[0];
    const fare = calculateFare(
      params.vehicleType,
      params.pickup,
      params.drop,
      params.helperCount,
      params.promoDiscount || 0
    );

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const route = generateRoutePoints(params.pickup, params.drop);

    const newOrder: LogisticsOrder = {
      id: `ord-${Date.now().toString().slice(-6)}`,
      trackingNumber: `MOV-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: 'cust-99',
      customerName: 'Sam Callaghan',
      customerPhone: '+64 21 784 9912',
      vehicleType: params.vehicleType,
      vehicleName: vehicle.name,
      pickup: params.pickup,
      drop: params.drop,
      waypoints: params.waypoints || [],
      goodsType: params.goodsType,
      helperCount: params.helperCount,
      fare,
      status: 'searching',
      otp: randomOtp,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      progressPercent: 0,
      routeWaypoints: route,
      estimatedArrivalMins: vehicle.etaMins + Math.round(fare.distanceKm * 2.5),
      paymentMethod: params.paymentMethod,
      paymentStatus: 'pending'
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    sound.playTap();

    // Sync to Supabase
    saveOrderToSupabase(newOrder);

    // Auto simulate driver acceptance after 4 seconds if not on driver screen
    setTimeout(() => {
      setOrders((prevOrders) => {
        const ord = prevOrders.find((o) => o.id === newOrder.id);
        if (ord && ord.status === 'searching') {
          // Find matching driver
          const matchingDriver = drivers.find(
            (d) => d.vehicleType === ord.vehicleType && d.status === 'online_idle'
          ) || drivers[0];

          sound.playSuccessChime();
          const assignedOrder: LogisticsOrder = {
            ...ord,
            status: 'driver_assigned',
            driverId: matchingDriver.id,
            driverName: matchingDriver.name,
            driverPhone: matchingDriver.phone,
            driverRating: matchingDriver.rating,
            driverVehiclePlate: matchingDriver.vehiclePlate,
            driverPhotoUrl: matchingDriver.photoUrl
          };
          saveOrderToSupabase(assignedOrder);

          return prevOrders.map((o) => (o.id === newOrder.id ? assignedOrder : o));
        }
        return prevOrders;
      });
    }, 4500);

    return newOrder;
  };

  // Driver accepts order
  const acceptIncomingOrder = (orderId: string) => {
    sound.playSuccessChime();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'driver_assigned',
              driverId: currentDriver.id,
              driverName: currentDriver.name,
              driverPhone: currentDriver.phone,
              driverRating: currentDriver.rating,
              driverVehiclePlate: currentDriver.vehiclePlate,
              driverPhotoUrl: currentDriver.photoUrl
            }
          : o
      )
    );
    setDrivers((prev) =>
      prev.map((d) => (d.id === currentDriver.id ? { ...d, status: 'assigned', activeOrderId: orderId } : d))
    );
    setActiveOrderId(orderId);
  };

  // Driver rejects order
  const rejectIncomingOrder = (orderId: string) => {
    sound.playTap();
    // Re-route to next driver or keep in searching queue
    const alternateDriver = drivers.find(
      (d) => d.id !== currentDriver.id && d.status === 'online_idle'
    );
    if (alternateDriver) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                driverId: alternateDriver.id,
                driverName: alternateDriver.name,
                driverPhone: alternateDriver.phone,
                driverRating: alternateDriver.rating,
                driverVehiclePlate: alternateDriver.vehiclePlate
              }
            : o
        )
      );
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    sound.playTap();
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // Advance delivery workflow through real stages
  const advanceOrderStage = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        let nextStatus: OrderStatus = ord.status;
        let nextProgress = ord.progressPercent;

        if (ord.status === 'driver_assigned') {
          nextStatus = 'arrived_pickup';
          nextProgress = 15;
          sound.playTap();
        } else if (ord.status === 'arrived_pickup') {
          nextStatus = 'loading';
          nextProgress = 25;
          sound.playTap();
        } else if (ord.status === 'loading') {
          nextStatus = 'in_transit';
          nextProgress = 35;
          sound.playSuccessChime();
        } else if (ord.status === 'in_transit') {
          nextStatus = 'arrived_drop';
          nextProgress = 90;
          sound.playTap();
        } else if (ord.status === 'arrived_drop') {
          nextStatus = 'unloading';
          nextProgress = 95;
          sound.playTap();
        }

        return { ...ord, status: nextStatus, progressPercent: nextProgress };
      })
    );
  };

  // Complete delivery with digital signature POD
  const completeDelivery = (orderId: string, pod: ProofOfDelivery) => {
    sound.playSuccessChime();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: 'delivered',
          progressPercent: 100,
          paymentStatus: 'paid',
          pod
        };
      })
    );

    // Credit driver wallet and increment trip count
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder && targetOrder.driverId) {
      setDrivers((prev) =>
        prev.map((d) => {
          if (d.id === targetOrder.driverId) {
            return {
              ...d,
              status: 'online_idle',
              activeOrderId: undefined,
              todayEarnings: d.todayEarnings + targetOrder.fare.driverEarnings,
              walletBalance: d.walletBalance + targetOrder.fare.driverEarnings,
              totalTrips: d.totalTrips + 1
            };
          }
          return d;
        })
      );
    }
  };

  const cancelOrder = (orderId: string, reason = 'User cancelled') => {
    sound.playTap();
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' } : o))
    );
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder?.driverId) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === targetOrder.driverId ? { ...d, status: 'online_idle', activeOrderId: undefined } : d
        )
      );
    }
    pauseDriveSimulation();
  };

  // Toggle driver partner availability
  const toggleDriverOnline = (driverId: string) => {
    sound.playTap();
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          const newStatus = d.status === 'offline' ? 'online_idle' : 'offline';
          return { ...d, status: newStatus };
        }
        return d;
      })
    );
  };

  // Admin updates vehicle fare card
  const updateRateCard = (vehicleId: VehicleCategoryId, updates: Partial<VehicleOption>) => {
    sound.playTap();
    setVehicleOptions((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, ...updates } : v))
    );
  };

  // Admin approves KYC
  const approveDriverKYC = (driverId: string, approved: boolean) => {
    sound.playTap();
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, kycStatus: approved ? 'approved' : 'rejected' } : d))
    );
  };

  // Drive simulation runner
  const pauseDriveSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsSimulatingDrive(false);
  };

  const resumeDriveSimulation = () => {
    if (activeOrder && activeOrder.status === 'in_transit') {
      simulateFullDrive(activeOrder.id);
    }
  };

  const simulateFullDrive = (orderId: string) => {
    pauseDriveSimulation();
    setIsSimulatingDrive(true);

    simulationIntervalRef.current = window.setInterval(() => {
      setOrders((prev) => {
        const ord = prev.find((o) => o.id === orderId);
        if (!ord || ord.status !== 'in_transit') {
          pauseDriveSimulation();
          return prev;
        }

        const nextProgress = Math.min(92, ord.progressPercent + 3.5);
        if (nextProgress >= 90) {
          pauseDriveSimulation();
          return prev.map((o) =>
            o.id === orderId ? { ...o, progressPercent: 90, status: 'arrived_drop' } : o
          );
        }

        return prev.map((o) =>
          o.id === orderId ? { ...o, progressPercent: nextProgress } : o
        );
      });
    }, 700);
  };

  // Reset to initial clean state
  const resetAllData = () => {
    pauseDriveSimulation();
    setDrivers(INITIAL_DRIVERS);
    setOrders([]);
    setActiveOrderId(null);
    localStorage.removeItem('move_orders_v1');
    localStorage.removeItem('move_drivers_v1');
    localStorage.removeItem('porter_orders_v1');
    localStorage.removeItem('porter_drivers_v1');
    sound.playTap();
  };

  // Pre-seed an instant sample order for immediate demonstration
  const loadQuickDemoOrder = () => {
    const pickup = currentCity.popularLandmarks[0];
    const drop = currentCity.popularLandmarks[1];
    createBooking({
      vehicleType: 'cargo_van',
      pickup,
      drop,
      goodsType: 'Carton Boxes & Retail Parcels (8 cartons)',
      helperCount: 1,
      paymentMethod: 'card',
      promoDiscount: 10
    });
  };

  return (
    <LogisticsContext.Provider
      value={{
        activeRole,
        setActiveRole,
        currentCity,
        setCurrentCity,
        vehicleOptions,
        drivers,
        currentDriver,
        setCurrentDriverId,
        orders,
        activeOrder,
        driverIncomingOrder,
        soundEnabled,
        setSoundEnabled,
        splitView,
        setSplitView,
        isSimulatingDrive,
        theme,
        setTheme,
        toggleTheme,
        liveTheme,
        setLiveTheme,
        liveRadarActive,
        setLiveRadarActive,
        liveTelemetry,
        liveActivityFeed,
        addLiveFeedEvent,
        liveTrafficTicker,
        calculateFare,
        createBooking,
        acceptIncomingOrder,
        rejectIncomingOrder,
        updateOrderStatus,
        advanceOrderStage,
        completeDelivery,
        cancelOrder,
        toggleDriverOnline,
        updateRateCard,
        approveDriverKYC,
        simulateFullDrive,
        pauseDriveSimulation,
        resumeDriveSimulation,
        resetAllData,
        loadQuickDemoOrder,
        isSupabaseLive,
        refreshFromSupabase,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
}

export function useLogistics() {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
}
