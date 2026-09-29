import { getSupabaseClient } from '../lib/supabase';
import { DriverPartner, LogisticsOrder, VehicleOption, CityHub } from '../types/logistics';
import { INITIAL_DRIVERS, VEHICLE_OPTIONS, CITY_HUBS } from '../data/mockData';

// DB mapping helpers
export function mapDbDriverToDriver(row: any): DriverPartner {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    photoUrl: row.photo_url || '',
    vehicleType: row.vehicle_type,
    vehicleName: row.vehicle_name,
    vehiclePlate: row.vehicle_plate,
    rating: Number(row.rating) || 4.9,
    totalTrips: Number(row.total_trips) || 0,
    status: row.status,
    currentLocation: row.current_location || { x: 50, y: 50, area: 'CBD' },
    heading: Number(row.heading) || 0,
    activeOrderId: row.active_order_id,
    todayEarnings: Number(row.today_earnings) || 0,
    walletBalance: Number(row.wallet_balance) || 0,
    acceptanceRate: Number(row.acceptance_rate) || 95,
    kycStatus: row.kyc_status || 'approved',
    documents: row.documents || {
      drivingLicense: true,
      vehicleCof: true,
      vehicleRego: true,
      goodsInsurance: true,
    },
  };
}

export function mapDriverToDbDriver(driver: DriverPartner) {
  return {
    id: driver.id,
    name: driver.name,
    phone: driver.phone,
    photo_url: driver.photoUrl,
    vehicle_type: driver.vehicleType,
    vehicle_name: driver.vehicleName,
    vehicle_plate: driver.vehiclePlate,
    rating: driver.rating,
    total_trips: driver.totalTrips,
    status: driver.status,
    current_location: driver.currentLocation,
    heading: driver.heading,
    active_order_id: driver.activeOrderId || null,
    today_earnings: driver.todayEarnings,
    wallet_balance: driver.walletBalance,
    acceptance_rate: driver.acceptanceRate,
    kyc_status: driver.kycStatus,
    documents: driver.documents,
    updated_at: new Date().toISOString(),
  };
}

export function mapDbOrderToOrder(row: any): LogisticsOrder {
  return {
    id: row.id,
    trackingNumber: row.tracking_number,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    vehicleType: row.vehicle_type,
    vehicleName: row.vehicle_name,
    pickup: row.pickup,
    drop: row.drop_location,
    waypoints: row.waypoints || [],
    goodsType: row.goods_type,
    goodsWeightKg: row.goods_weight_kg ? Number(row.goods_weight_kg) : undefined,
    helperCount: Number(row.helper_count) || 0,
    fare: row.fare,
    status: row.status,
    otp: row.otp,
    createdAt: row.created_at,
    driverId: row.driver_id || undefined,
    driverName: row.driver_name || undefined,
    driverPhone: row.driver_phone || undefined,
    driverRating: row.driver_rating ? Number(row.driver_rating) : undefined,
    driverVehiclePlate: row.driver_vehicle_plate || undefined,
    driverPhotoUrl: row.driver_photo_url || undefined,
    progressPercent: Number(row.progress_percent) || 0,
    routeWaypoints: row.route_waypoints || [],
    pod: row.pod || undefined,
    estimatedArrivalMins: Number(row.estimated_arrival_mins) || 15,
    paymentMethod: row.payment_method || 'card',
    paymentStatus: row.payment_status || 'pending',
  };
}

export function mapOrderToDbOrder(order: LogisticsOrder) {
  return {
    id: order.id,
    tracking_number: order.trackingNumber,
    customer_id: order.customerId,
    customer_name: order.customerName,
    customer_phone: order.customerPhone,
    vehicle_type: order.vehicleType,
    vehicle_name: order.vehicleName,
    pickup: order.pickup,
    drop_location: order.drop,
    waypoints: order.waypoints || [],
    goods_type: order.goodsType,
    goods_weight_kg: order.goodsWeightKg || null,
    helper_count: order.helperCount,
    fare: order.fare,
    status: order.status,
    otp: order.otp,
    driver_id: order.driverId || null,
    driver_name: order.driverName || null,
    driver_phone: order.driverPhone || null,
    driver_rating: order.driverRating || null,
    driver_vehicle_plate: order.driverVehiclePlate || null,
    driver_photo_url: order.driverPhotoUrl || null,
    progress_percent: order.progressPercent,
    route_waypoints: order.routeWaypoints || [],
    pod: order.pod || null,
    estimated_arrival_mins: order.estimatedArrivalMins,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    updated_at: new Date().toISOString(),
  };
}

// Data Fetchers
export async function fetchDriversFromSupabase(): Promise<DriverPartner[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('drivers').select('*').order('name');
    if (error) {
      console.warn('Error fetching drivers from Supabase:', error.message);
      return null;
    }
    if (data && data.length > 0) {
      return data.map(mapDbDriverToDriver);
    }
    return [];
  } catch (err) {
    console.warn('Supabase fetchDrivers error:', err);
    return null;
  }
}

export async function fetchOrdersFromSupabase(): Promise<LogisticsOrder[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Error fetching orders from Supabase:', error.message);
      return null;
    }
    if (data) {
      return data.map(mapDbOrderToOrder);
    }
    return [];
  } catch (err) {
    console.warn('Supabase fetchOrders error:', err);
    return null;
  }
}

export async function saveOrderToSupabase(order: LogisticsOrder): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const dbPayload = mapOrderToDbOrder(order);
    const { error } = await client.from('orders').upsert(dbPayload, { onConflict: 'id' });
    if (error) {
      console.warn('Failed to upsert order in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase saveOrder exception:', err);
    return false;
  }
}

export async function saveDriverToSupabase(driver: DriverPartner): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const dbPayload = mapDriverToDbDriver(driver);
    const { error } = await client.from('drivers').upsert(dbPayload, { onConflict: 'id' });
    if (error) {
      console.warn('Failed to upsert driver in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase saveDriver exception:', err);
    return false;
  }
}

// Realtime subscriptions
export function subscribeToRealtimeOrders(
  onInsert: (order: LogisticsOrder) => void,
  onUpdate: (order: LogisticsOrder) => void
) {
  const client = getSupabaseClient();
  if (!client) return () => {};

  const channel = client
    .channel('move_orders_realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        if (payload.new) {
          onInsert(mapDbOrderToOrder(payload.new));
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders' },
      (payload) => {
        if (payload.new) {
          onUpdate(mapDbOrderToOrder(payload.new));
        }
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

export function subscribeToRealtimeDrivers(onUpdate: (driver: DriverPartner) => void) {
  const client = getSupabaseClient();
  if (!client) return () => {};

  const channel = client
    .channel('move_drivers_realtime')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'drivers' },
      (payload) => {
        if (payload.new) {
          onUpdate(mapDbDriverToDriver(payload.new));
        }
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

// Seed helper to populate tables if they exist but are empty
export async function seedInitialDataToSupabase(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) return { success: false, message: 'Supabase client is not configured.' };

  try {
    // 1. Seed Vehicle Options
    const vehiclePayload = VEHICLE_OPTIONS.map((v) => ({
      id: v.id,
      name: v.name,
      sub_title: v.subTitle,
      tagline: v.tagline,
      capacity_kg: v.capacityKg,
      dimensions: v.dimensions,
      base_fare: v.baseFare,
      base_km: v.baseKm,
      per_km_rate: v.perKmRate,
      helper_fee: v.helperFee,
      eta_mins: v.etaMins,
      icon_type: v.iconType,
      popular_for: v.popularFor,
    }));
    await client.from('vehicle_options').upsert(vehiclePayload, { onConflict: 'id' });

    // 2. Seed Drivers
    const driversPayload = INITIAL_DRIVERS.map(mapDriverToDbDriver);
    await client.from('drivers').upsert(driversPayload, { onConflict: 'id' });

    // 3. Seed City Hubs
    const hubsPayload = CITY_HUBS.map((c) => ({
      id: c.id,
      name: c.name,
      state: c.state,
      center: c.center,
      popular_landmarks: c.popularLandmarks,
    }));
    await client.from('city_hubs').upsert(hubsPayload, { onConflict: 'id' });

    return { success: true, message: 'Successfully seeded vehicle options, city hubs, and drivers into Supabase!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Seeding failed' };
  }
}
