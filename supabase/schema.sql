-- ==============================================================================
-- MOVE LOGISTICS & FLEET CONTROL (NEW ZEALAND)
-- Supabase PostgreSQL Schema & Realtime Setup
-- ==============================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CREATE TABLE: city_hubs
CREATE TABLE IF NOT EXISTS public.city_hubs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    center JSONB NOT NULL DEFAULT '{"x": 50, "y": 50}'::jsonb,
    popular_landmarks JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CREATE TABLE: vehicle_options (Rate Cards & Dimensions)
CREATE TABLE IF NOT EXISTS public.vehicle_options (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sub_title TEXT,
    tagline TEXT,
    capacity_kg INTEGER NOT NULL,
    dimensions TEXT NOT NULL,
    base_fare NUMERIC(10, 2) NOT NULL,
    base_km NUMERIC(6, 2) NOT NULL,
    per_km_rate NUMERIC(10, 2) NOT NULL,
    helper_fee NUMERIC(10, 2) NOT NULL,
    eta_mins INTEGER NOT NULL DEFAULT 10,
    icon_type TEXT NOT NULL,
    popular_for TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CREATE TABLE: drivers (Driver Partner Fleet)
CREATE TABLE IF NOT EXISTS public.drivers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    photo_url TEXT,
    vehicle_type TEXT NOT NULL,
    vehicle_name TEXT NOT NULL,
    vehicle_plate TEXT NOT NULL,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.90,
    total_trips INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'online_idle' CHECK (status IN ('offline', 'online_idle', 'assigned', 'in_transit')),
    current_location JSONB NOT NULL DEFAULT '{"x": 50, "y": 50, "area": "CBD"}'::jsonb,
    heading NUMERIC NOT NULL DEFAULT 0,
    active_order_id TEXT,
    today_earnings NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    acceptance_rate INTEGER NOT NULL DEFAULT 95,
    kyc_status TEXT NOT NULL DEFAULT 'approved' CHECK (kyc_status IN ('approved', 'pending', 'rejected')),
    documents JSONB NOT NULL DEFAULT '{"drivingLicense": true, "vehicleCof": true, "vehicleRego": true, "goodsInsurance": true}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CREATE TABLE: orders (Logistics Dispatch Orders & POD)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    tracking_number TEXT UNIQUE NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    vehicle_name TEXT NOT NULL,
    pickup JSONB NOT NULL,
    drop_location JSONB NOT NULL,
    waypoints JSONB DEFAULT '[]'::jsonb,
    goods_type TEXT NOT NULL,
    goods_weight_kg NUMERIC(10, 2),
    helper_count INTEGER NOT NULL DEFAULT 0,
    fare JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'searching' CHECK (status IN ('draft', 'searching', 'driver_assigned', 'arrived_pickup', 'loading', 'in_transit', 'arrived_drop', 'unloading', 'delivered', 'cancelled')),
    otp TEXT NOT NULL,
    driver_id TEXT REFERENCES public.drivers(id) ON DELETE SET NULL,
    driver_name TEXT,
    driver_phone TEXT,
    driver_rating NUMERIC(3, 2),
    driver_vehicle_plate TEXT,
    driver_photo_url TEXT,
    progress_percent INTEGER NOT NULL DEFAULT 0,
    route_waypoints JSONB DEFAULT '[]'::jsonb,
    pod JSONB,
    estimated_arrival_mins INTEGER NOT NULL DEFAULT 15,
    payment_method TEXT NOT NULL DEFAULT 'card' CHECK (payment_method IN ('card', 'apple_pay', 'poli', 'cash')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CREATE TABLE: activity_logs (Live Dispatch Radar Telemetry Feed)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    city TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    event TEXT NOT NULL,
    badge TEXT NOT NULL,
    accent TEXT NOT NULL DEFAULT 'blue',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CREATE TABLE: app_notifications
CREATE TABLE IF NOT EXISTS public.app_notifications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'order',
    target_role TEXT NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. INDEXES FOR HIGH-THROUGHPUT DISPATCH & QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_driver_id ON public.orders(driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON public.drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_vehicle_type ON public.drivers(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- 9. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.city_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;

-- 10. POLICIES (Permissive for Client-Side Logistics App)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public full access city_hubs" ON public.city_hubs;
    CREATE POLICY "Public full access city_hubs" ON public.city_hubs FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access vehicle_options" ON public.vehicle_options;
    CREATE POLICY "Public full access vehicle_options" ON public.vehicle_options FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access drivers" ON public.drivers;
    CREATE POLICY "Public full access drivers" ON public.drivers FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access orders" ON public.orders;
    CREATE POLICY "Public full access orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access activity_logs" ON public.activity_logs;
    CREATE POLICY "Public full access activity_logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access app_notifications" ON public.app_notifications;
    CREATE POLICY "Public full access app_notifications" ON public.app_notifications FOR ALL USING (true) WITH CHECK (true);
END $$;

-- 11. ENABLE REALTIME PUBLICATION
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'drivers'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'activity_logs'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
    END IF;
END $$;

-- 12. SEED DATA: VEHICLE OPTIONS (NEW ZEALAND PRICING)
INSERT INTO public.vehicle_options (id, name, sub_title, tagline, capacity_kg, dimensions, base_fare, base_km, per_km_rate, helper_fee, eta_mins, icon_type, popular_for)
VALUES 
('courier', 'Metro Courier (Car / EV)', 'Express Doorstep Courier & Small Parcels', 'Best for urgent documents, retail orders, electronics, keys', 35, '50cm x 50cm x 50cm boot parcel', 16.50, 3.0, 2.20, 0.00, 4, 'courier', 'Fastest urban delivery in CBD'),
('cargo_van', 'Cargo Van (Toyota HiAce)', 'New Zealand''s #1 Choice for Urban Freight', 'Ideal for 15-20 cartons, small appliances, trades supplies', 1000, '3.0m (L) x 1.6m (W) x 1.4m (H)', 45.00, 4.0, 3.40, 35.00, 6, 'van', 'E-commerce, wholesale & store deliveries'),
('ute_flatdeck', 'Flat Deck Ute (Hilux / Ranger)', 'Open Wellside & Flat Deck 1-Tonne Carrier', 'Plywood, landscaping, timber, surfboards, whiteware appliances', 1100, '2.4m (L) x 1.8m (W) flat open tray', 55.00, 4.0, 3.80, 40.00, 7, 'ute', 'Building materials, tradies & hardware'),
('box_truck_2t', '2-Tonne Box Truck + Tail Lift', 'Enclosed Pantech Truck with Hydraulic Lift', 'Palletized commercial cargo, beds, bulky sofas, store stock', 2200, '4.2m (L) x 2.1m (W) x 2.2m (H)', 89.00, 5.0, 4.60, 50.00, 10, 'truck', 'Heavy retail & multi-pallet transport'),
('heavy_truck_5t', '5-Tonne Freight Truck (Curtainsider)', 'Heavy Commercial Inter-Suburban Hauler', 'Up to 10 standard CHEP pallets, machinery, industrial orders', 5000, '6.5m (L) x 2.4m (W) x 2.4m (H)', 145.00, 5.0, 6.20, 65.00, 15, 'heavy', 'Factory, warehouse and distribution'),
('packers_movers', 'Kiwi House Relocations', 'Full Home & Apartment Moving with 2 Movers', 'Moving blankets, straps, tail-lift truck, disassembly & care', 2500, 'Enclosed Truck + 2 Professional Movers', 195.00, 5.0, 5.50, 80.00, 18, 'movers', 'Stress-free home & flat shifting')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    base_fare = EXCLUDED.base_fare,
    per_km_rate = EXCLUDED.per_km_rate,
    helper_fee = EXCLUDED.helper_fee;

-- 13. SEED DATA: INITIAL DRIVER PARTNERS
INSERT INTO public.drivers (id, name, phone, photo_url, vehicle_type, vehicle_name, vehicle_plate, rating, total_trips, status, current_location, heading, today_earnings, wallet_balance, acceptance_rate, kyc_status, documents)
VALUES 
('drv-101', 'Aroha Mitchell', '+64 21 893 2144', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', 'cargo_van', 'Toyota HiAce LWB Diesel', 'KWT892', 4.92, 1140, 'online_idle', '{"x": 50, "y": 44, "area": "Penrose"}'::jsonb, 45, 285.50, 840.00, 98, 'approved', '{"drivingLicense": true, "vehicleCof": true, "vehicleRego": true, "goodsInsurance": true}'::jsonb),
('drv-102', 'Wiremu Te Kanawa', '+64 22 419 8832', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', 'ute_flatdeck', 'Ford Ranger XLT Flat Deck', 'NZR441', 4.88, 920, 'online_idle', '{"x": 49, "y": 32, "area": "Queen Street CBD"}'::jsonb, 120, 320.00, 960.50, 96, 'approved', '{"drivingLicense": true, "vehicleCof": true, "vehicleRego": true, "goodsInsurance": true}'::jsonb),
('drv-103', 'James Wilson', '+64 27 655 4910', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', 'box_truck_2t', 'Isuzu Elf 2.5T Box + Dhollandia Tail-Lift', 'ELF719', 4.95, 1480, 'online_idle', '{"x": 67, "y": 52, "area": "East Tāmaki"}'::jsonb, 260, 450.00, 1420.00, 97, 'approved', '{"drivingLicense": true, "vehicleCof": true, "vehicleRego": true, "goodsInsurance": true}'::jsonb),
('drv-104', 'Sophie Patel', '+64 21 334 7720', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'courier', 'Hyundai Ioniq EV Courier', 'EVQ801', 4.96, 760, 'online_idle', '{"x": 46, "y": 26, "area": "CBD Waterfront"}'::jsonb, 90, 195.00, 610.00, 99, 'approved', '{"drivingLicense": true, "vehicleCof": true, "vehicleRego": true, "goodsInsurance": true}'::jsonb),
('drv-105', 'Craig Morrison', '+64 21 902 4431', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80', 'heavy_truck_5t', 'Fuso Canter 5-Tonne Curtainsider', 'HVI558', 4.84, 680, 'online_idle', '{"x": 56, "y": 74, "area": "Airport Freight"}'::jsonb, 180, 580.00, 1850.00, 93, 'approved', '{"drivingLicense": true, "vehicleCof": true, "vehicleRego": true, "goodsInsurance": true}'::jsonb),
('drv-106', 'Moana & Dave (Kiwi Relocations)', '+64 22 710 3982', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80', 'packers_movers', 'Hino 300 Furniture Truck + 2 Helpers', 'MVE204', 4.98, 540, 'online_idle', '{"x": 26, "y": 35, "area": "Avondale"}'::jsonb, 300, 720.00, 2450.00, 99, 'approved', '{"drivingLicense": true, "vehicleCof": true, "vehicleRego": true, "goodsInsurance": true}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 14. SEED DATA: NEW ZEALAND CITY HUBS
INSERT INTO public.city_hubs (id, name, state, center, popular_landmarks)
VALUES 
('auckland', 'Auckland (Tāmaki Makaurau)', 'North Island', '{"x": 50, "y": 50}'::jsonb, '[
  {"x": 48, "y": 28, "name": "Auckland CBD - Queen Street", "address": "205 Queen St, Auckland Central, Auckland 1010", "area": "Auckland Central", "city": "Auckland"},
  {"x": 52, "y": 45, "name": "Penrose Industrial Freight Hub", "address": "Industry Road, Penrose, Auckland 1061", "area": "Penrose", "city": "Auckland"},
  {"x": 68, "y": 54, "name": "East Tāmaki Logistics Park", "address": "Highbrook Drive, East Tāmaki, Auckland 2013", "area": "East Tāmaki", "city": "Auckland"},
  {"x": 54, "y": 72, "name": "Auckland Airport Cargo Precinct", "address": "George Bolt Memorial Dr, Mangere, Auckland 2022", "area": "Mangere / Airport", "city": "Auckland"},
  {"x": 28, "y": 34, "name": "Rosebank Road Industrial Zone", "address": "Rosebank Rd, Avondale, Auckland 1026", "area": "Avondale / West", "city": "Auckland"}
]'::jsonb),
('wellington', 'Wellington (Te Whanganui-a-Tara)', 'North Island', '{"x": 50, "y": 50}'::jsonb, '[
  {"x": 44, "y": 35, "name": "Lambton Quay CBD & Waterfront", "address": "120 Lambton Quay, Wellington 6011", "area": "Wellington Central", "city": "Wellington"},
  {"x": 62, "y": 48, "name": "Petone Commercial & Trade Hub", "address": "Jackson Street, Petone, Lower Hutt 5012", "area": "Lower Hutt", "city": "Wellington"},
  {"x": 48, "y": 68, "name": "Wellington International Airport Cargo", "address": "Stewart Duff Dr, Rongotai, Wellington 6022", "area": "Rongotai / Kilbirnie", "city": "Wellington"}
]'::jsonb),
('christchurch', 'Christchurch (Ōtautahi)', 'South Island', '{"x": 50, "y": 50}'::jsonb, '[
  {"x": 50, "y": 42, "name": "Christchurch Central CBD (Cathedral Sq)", "address": "Colombo Street, Christchurch Central 8011", "area": "CBD Central", "city": "Christchurch"},
  {"x": 35, "y": 56, "name": "Wigram Business & Logistics Park", "address": "Vickers Crescent, Wigram, Christchurch 8025", "area": "Wigram", "city": "Christchurch"},
  {"x": 66, "y": 38, "name": "Lyttelton Port Freight Terminal", "address": "Norwich Quay, Lyttelton 8082", "area": "Port Lyttelton", "city": "Christchurch"}
]'::jsonb)
ON CONFLICT (id) DO NOTHING;
