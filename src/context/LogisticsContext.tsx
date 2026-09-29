import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CITY_HUBS, INITIAL_DRIVERS, VEHICLE_OPTIONS } from '../data/mockData';
import {
  CityHub,
  DriverPartner,
  DriverStatus,
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
import { testSupabaseConnection } from '../lib/supabase';
import {
  subscribeToRealtimeDrivers,
  subscribeToRealtimeOrders
} from '../services/supabaseService';
import {
  vehiclesApi,
  hubsApi,
  driversApi,
  ordersApi,
  telemetryApi,
  customerApi,
  catalogApi,
  geoApi,
  CustomerProfile,
  GoodsCategory
} from '../api';

export type UserRole = 'customer' | 'driver' | 'admin';

export interface CreateBookingParams {
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
  cityHubs: CityHub[];
  currentCity: CityHub;
  setCurrentCity: (city: CityHub) => void;
  vehicleOptions: VehicleOption[];
  drivers: DriverPartner[];
  currentDriver: DriverPartner;
  setCurrentDriverId: (id: string) => void;
  orders: LogisticsOrder[];
  activeOrder: LogisticsOrder | null;
  driverIncomingOrder: LogisticsOrder | null;
  customerProfile: CustomerProfile;
  updateCustomerProfile: (updates: Partial<CustomerProfile>) => Promise<void>;
  topUpWallet: (amount: number) => Promise<void>;
  goodsCategories: GoodsCategory[];
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
  
  // Dynamic API state
  const [cityHubs, setCityHubs] = useState<CityHub[]>(CITY_HUBS);
  const [currentCity, setCurrentCity] = useState<CityHub>(CITY_HUBS[0]);
  const [vehicleOptions, setVehicleOptions] = useState<VehicleOption[]>(VEHICLE_OPTIONS);
  const [goodsCategories, setGoodsCategories] = useState<GoodsCategory[]>([]);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>({
    id: 'cust-99',
    name: 'Sam Callaghan',
    phone: '+64 21 784 9912',
    email: 'sam.callaghan@nzbusiness.co.nz',
    rating: 4.95,
    walletBalance: 120.0,
    currency: 'NZD',
    savedAddresses: [],
  });

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

  // Primary App Theme State ('light' | 'dark')
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

  // Dynamic traffic alerts ticker for the active city
  const [liveTrafficTicker, setLiveTrafficTicker] = useState<string[]>(() =>
    telemetryApi.getTrafficAlerts(CITY_HUBS[0].id)
  );

  useEffect(() => {
    setLiveTrafficTicker(telemetryApi.getTrafficAlerts(currentCity.id));
  }, [currentCity.id]);

  // Dynamic live activity feed from API
  const [liveActivityFeed, setLiveActivityFeed] = useState<LiveActivityFeedItem[]>([]);

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
    telemetryApi.postEvent({
      city,
      vehicleType,
      event,
      badge: 'LIVE DISPATCH',
      accent
    });
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

  // Master API Hydration & Handshake
  const refreshFromSupabase = async () => {
    try {
      const [hubsRes, vehRes, drvRes, ordRes, custRes, goodsRes, feedRes] = await Promise.all([
        hubsApi.getAll(),
        vehiclesApi.getAll(),
        driversApi.getAll(),
        ordersApi.getAll(),
        customerApi.getProfile(),
        catalogApi.getGoodsTypes(),
        telemetryApi.getActivityFeed()
      ]);

      if (hubsRes.data && hubsRes.data.length > 0) {
        setCityHubs(hubsRes.data);
        setCurrentCity((curr) => hubsRes.data!.find((c) => c.id === curr.id) || hubsRes.data![0]);
      }
      if (vehRes.data && vehRes.data.length > 0) {
        setVehicleOptions(vehRes.data);
      }
      if (drvRes.data && drvRes.data.length > 0) {
        setDrivers(drvRes.data);
      }
      if (ordRes.data && ordRes.data.length > 0) {
        setOrders(ordRes.data);
      }
      if (custRes.data) {
        setCustomerProfile(custRes.data);
      }
      if (goodsRes.data) {
        setGoodsCategories(goodsRes.data);
      }
      if (feedRes.data && feedRes.data.length > 0) {
        setLiveActivityFeed(feedRes.data);
      }

      const ping = await testSupabaseConnection();
      setIsSupabaseLive(ping.success);
    } catch (err) {
      console.warn('API Sync initial error:', err);
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

  // Customer Profile API Mutators
  const updateCustomerProfile = async (updates: Partial<CustomerProfile>) => {
    const res = await customerApi.updateProfile(updates);
    if (res.data) {
      setCustomerProfile(res.data);
    }
  };

  const topUpWallet = async (amount: number) => {
    const res = await customerApi.topUpWallet(amount);
    if (res.data) {
      setCustomerProfile((prev) => ({ ...prev, walletBalance: res.data!.newBalance }));
      sound.playSuccessChime();
    }
  };

  // Calculate fare using dynamic vehicle rate card & geographic distance calculation
  const calculateFare = (
    vehicleType: VehicleCategoryId,
    pickup: MapPoint,
    drop: MapPoint,
    helperCount: number,
    discount = 0
  ): FareBreakdown => {
    const vehicle = vehicleOptions.find((v) => v.id === vehicleType) || vehicleOptions[0];
    const distanceKm = geoApi.calculateDistanceKm(pickup, drop);
    const billableKm = Math.max(0, distanceKm - vehicle.baseKm);
    const distanceFare = Math.round(billableKm * vehicle.perKmRate * 10) / 10;
    const helperFare = helperCount * vehicle.helperFee;
    const surgeMultiplier = 1.0;
    const surgeFee = Math.round((vehicle.baseFare + distanceFare) * (surgeMultiplier - 1.0) * 10) / 10;
    const subtotal = vehicle.baseFare + distanceFare + helperFare + surgeFee;
    const gstTax = Math.round(subtotal * 0.15 * 10) / 10; // 15% NZ GST
    const totalFare = Math.max(15, Math.round((subtotal + gstTax - discount) * 10) / 10);
    const platformCut = Math.round(totalFare * 0.20 * 10) / 10; // 20% commission
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

  // Create customer booking via ordersApi
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
    const route = geoApi.generateRoutePoints(params.pickup, params.drop);

    const newOrder: LogisticsOrder = {
      id: `ord-${Date.now().toString().slice(-6)}`,
      trackingNumber: `MOV-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: customerProfile.id,
      customerName: customerProfile.name,
      customerPhone: customerProfile.phone,
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

    // Call API to persist order in Supabase
    ordersApi.create(newOrder);

    // Publish telemetry activity
    telemetryApi.postEvent({
      city: currentCity.name,
      vehicleType: vehicle.name,
      event: `Booking placed for ${vehicle.name}: ${params.pickup.name} → ${params.drop.name}`,
      badge: 'DISPATCH',
      accent: 'blue'
    });

    // Auto simulate driver assignment if not manually claimed
    setTimeout(() => {
      setOrders((prevOrders) => {
        const ord = prevOrders.find((o) => o.id === newOrder.id);
        if (ord && ord.status === 'searching') {
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

          ordersApi.assignDriver(assignedOrder.id, matchingDriver);
          return prevOrders.map((o) => (o.id === newOrder.id ? assignedOrder : o));
        }
        return prevOrders;
      });
    }, 4500);

    return newOrder;
  };

  // Driver accepts order
  const acceptIncomingOrder = async (orderId: string) => {
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

    // Call APIs
    await ordersApi.assignDriver(orderId, currentDriver);
    await driversApi.updateStatus(currentDriver.id, 'assigned');
    telemetryApi.postEvent({
      city: currentCity.name,
      vehicleType: currentDriver.vehicleName,
      event: `Partner ${currentDriver.name} accepted trip dispatch`,
      badge: 'ASSIGNED',
      accent: 'purple'
    });
  };

  // Driver rejects order
  const rejectIncomingOrder = (orderId: string) => {
    sound.playTap();
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

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    sound.playTap();
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    await ordersApi.updateStatus(orderId, status);
  };

  // Advance delivery workflow through real stages
  const advanceOrderStage = async (orderId: string) => {
    let nextStatus: OrderStatus | null = null;
    let nextProgress = 0;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        let status: OrderStatus = ord.status;
        let progress = ord.progressPercent;

        if (ord.status === 'driver_assigned') {
          status = 'arrived_pickup';
          progress = 15;
          sound.playTap();
        } else if (ord.status === 'arrived_pickup') {
          status = 'loading';
          progress = 25;
          sound.playTap();
        } else if (ord.status === 'loading') {
          status = 'in_transit';
          progress = 35;
          sound.playSuccessChime();
        } else if (ord.status === 'in_transit') {
          status = 'arrived_drop';
          progress = 90;
          sound.playTap();
        } else if (ord.status === 'arrived_drop') {
          status = 'unloading';
          progress = 95;
          sound.playTap();
        }

        nextStatus = status;
        nextProgress = progress;
        return { ...ord, status, progressPercent: progress };
      })
    );

    if (nextStatus) {
      await ordersApi.updateStatus(orderId, nextStatus, nextProgress);
    }
  };

  // Complete delivery with digital signature POD
  const completeDelivery = async (orderId: string, pod: ProofOfDelivery) => {
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

      // Invoke APIs
      await ordersApi.complete(orderId, pod);
      await driversApi.creditEarnings(targetOrder.driverId, targetOrder.fare.driverEarnings);
      telemetryApi.postEvent({
        city: currentCity.name,
        vehicleType: targetOrder.vehicleName,
        event: `POD signed for shipment ${targetOrder.trackingNumber} at ${targetOrder.drop.name}`,
        badge: 'DELIVERED',
        accent: 'emerald'
      });
    }
  };

  const cancelOrder = async (orderId: string, reason = 'User cancelled') => {
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
      driversApi.updateStatus(targetOrder.driverId, 'online_idle');
    }
    pauseDriveSimulation();
    await ordersApi.cancel(orderId, reason);
  };

  // Toggle driver partner availability
  const toggleDriverOnline = async (driverId: string) => {
    sound.playTap();
    let nextStatus: DriverStatus = 'offline';
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          nextStatus = d.status === 'offline' ? 'online_idle' : 'offline';
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
    await driversApi.updateStatus(driverId, nextStatus);
  };

  // Admin updates vehicle fare card
  const updateRateCard = async (vehicleId: VehicleCategoryId, updates: Partial<VehicleOption>) => {
    sound.playTap();
    setVehicleOptions((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, ...updates } : v))
    );
    await vehiclesApi.updateRateCard(vehicleId, updates);
  };

  // Admin approves KYC
  const approveDriverKYC = async (driverId: string, approved: boolean) => {
    sound.playTap();
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, kycStatus: approved ? 'approved' : 'rejected' } : d))
    );
    await driversApi.updateKYC(driverId, approved ? 'approved' : 'rejected');
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
          ordersApi.updateStatus(orderId, 'arrived_drop', 90);
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
    refreshFromSupabase();
    sound.playTap();
  };

  // Pre-seed an instant sample order for immediate demonstration
  const loadQuickDemoOrder = () => {
    const pickup = currentCity.popularLandmarks[0] || {
      x: 45,
      y: 30,
      name: 'Port of Auckland Freight Hub',
      address: 'Quay Street, CBD',
      area: 'CBD Waterfront',
      city: currentCity.name
    };
    const drop = currentCity.popularLandmarks[1] || {
      x: 52,
      y: 45,
      name: 'Penrose Industrial Distribution Center',
      address: 'Great South Road',
      area: 'Penrose',
      city: currentCity.name
    };
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
        cityHubs,
        currentCity,
        setCurrentCity,
        vehicleOptions,
        drivers,
        currentDriver,
        setCurrentDriverId,
        orders,
        activeOrder,
        driverIncomingOrder,
        customerProfile,
        updateCustomerProfile,
        topUpWallet,
        goodsCategories,
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
