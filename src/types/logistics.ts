export type VehicleCategoryId = 
  | 'courier' 
  | 'cargo_van' 
  | 'ute_flatdeck' 
  | 'box_truck_2t' 
  | 'heavy_truck_5t' 
  | 'packers_movers';

export interface VehicleOption {
  id: VehicleCategoryId;
  name: string;
  subTitle: string;
  tagline: string;
  capacityKg: number;
  dimensions: string; // e.g., "3.0m x 1.7m x 1.6m"
  baseFare: number;
  baseKm: number;
  perKmRate: number;
  helperFee: number;
  etaMins: number;
  iconType: 'courier' | 'van' | 'ute' | 'truck' | 'heavy' | 'movers';
  popularFor: string;
}

export type OrderStatus =
  | 'draft'
  | 'searching'
  | 'driver_assigned'
  | 'arrived_pickup'
  | 'loading'
  | 'in_transit'
  | 'arrived_drop'
  | 'unloading'
  | 'delivered'
  | 'cancelled';

export interface MapPoint {
  x: number; // 0 to 100 percentage inside vector city map
  y: number; // 0 to 100 percentage inside vector city map
  name: string;
  address: string;
  area: string;
  city: string;
}

export interface FareBreakdown {
  baseFare: number;
  distanceKm: number;
  distanceFare: number;
  helperCount: number;
  helperFare: number;
  surgeMultiplier: number;
  surgeFee: number;
  gstTax: number;
  discount: number;
  totalFare: number;
  driverEarnings: number;
  platformCut: number;
}

export interface ProofOfDelivery {
  recipientName: string;
  signatureDataUrl?: string;
  podPhotoUrl?: string;
  notes?: string;
  completedAt: string;
}

export interface LogisticsOrder {
  id: string;
  trackingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleType: VehicleCategoryId;
  vehicleName: string;
  pickup: MapPoint;
  drop: MapPoint;
  waypoints?: MapPoint[];
  goodsType: string;
  goodsWeightKg?: number;
  helperCount: number;
  fare: FareBreakdown;
  status: OrderStatus;
  otp: string; // 4-digit code e.g., "4829"
  createdAt: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  driverVehiclePlate?: string;
  driverPhotoUrl?: string;
  progressPercent: number; // 0 to 100
  routeWaypoints: Array<{ x: number; y: number }>;
  pod?: ProofOfDelivery;
  estimatedArrivalMins: number;
  paymentMethod: 'card' | 'apple_pay' | 'poli' | 'cash';
  paymentStatus: 'pending' | 'paid';
}

export type DriverStatus = 'offline' | 'online_idle' | 'assigned' | 'in_transit';

export interface DriverPartner {
  id: string;
  name: string;
  phone: string;
  photoUrl: string;
  vehicleType: VehicleCategoryId;
  vehicleName: string;
  vehiclePlate: string; // e.g. "KWT892" (NZ Plate)
  rating: number;
  totalTrips: number;
  status: DriverStatus;
  currentLocation: { x: number; y: number; area: string };
  heading: number; // degrees
  activeOrderId?: string;
  todayEarnings: number;
  walletBalance: number;
  acceptanceRate: number;
  kycStatus: 'approved' | 'pending' | 'rejected';
  documents: {
    drivingLicense: boolean; // NZ Driver Licence (Class 1 or 2 with P/Goods)
    vehicleCof: boolean; // Certificate of Fitness (COF)
    vehicleRego: boolean; // NZTA Current Vehicle Licence (Rego)
    goodsInsurance: boolean; // Goods In Transit Insurance
  };
}

export interface CityHub {
  id: string;
  name: string;
  state: string;
  center: { x: number; y: number };
  popularLandmarks: MapPoint[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'dispatch' | 'payment' | 'system';
  targetRole: 'customer' | 'driver' | 'admin';
}

export type ThemeMode = 'light' | 'dark';

export type LiveThemeMode = 'neon_radar' | 'kiwi_emerald' | 'alert_amber' | 'daylight_live';

export interface LiveTelemetry {
  satellitesLocked: number;
  latencyMs: number;
  rtkAccuracy: string;
  networkOperator: string;
  currentSpeedKmh: number;
  nzTimeStr: string;
  activeDriversCount: number;
  liveTripsCount: number;
}

export interface LiveActivityFeedItem {
  id: string;
  timestamp: string;
  city: string;
  vehicleType: string;
  event: string;
  badge: string;
  accent: 'blue' | 'emerald' | 'amber' | 'purple';
}
