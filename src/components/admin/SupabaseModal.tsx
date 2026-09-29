import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  X,
  Server,
  Key,
  ShieldCheck,
  Radio,
  Zap,
  Layers,
  Code
} from 'lucide-react';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  testSupabaseConnection
} from '../../lib/supabase';
import { seedInitialDataToSupabase } from '../../services/supabaseService';
import { sound } from '../../utils/audio';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLight: boolean;
  onConnectionChange?: () => void;
}

export function SupabaseModal({ isOpen, onClose, isLight, onConnectionChange }: SupabaseModalProps) {
  const [url, setUrl] = useState<string>('');
  const [anonKey, setAnonKey] = useState<string>('');
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; tablesFound?: string[] } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'connect' | 'schema' | 'instructions'>('connect');

  useEffect(() => {
    if (isOpen) {
      const config = getStoredSupabaseConfig();
      setUrl(config.url);
      setAnonKey(config.anonKey);
      if (config.isConfigured) {
        handleTest(config.url, config.anonKey);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async (testUrl?: string, testKey?: string) => {
    setTesting(true);
    setTestResult(null);
    sound.playTap();
    const result = await testSupabaseConnection(testUrl || url, testKey || anonKey);
    setTesting(false);
    setTestResult(result);
    if (result.success) {
      sound.playSuccessChime();
    } else {
      sound.playDispatchPing();
    }
  };

  const handleSave = () => {
    saveStoredSupabaseConfig(url, anonKey);
    sound.playSuccessChime();
    handleTest(url, anonKey);
    if (onConnectionChange) onConnectionChange();
  };

  const handleDisconnect = () => {
    saveStoredSupabaseConfig('', '');
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    sound.playTap();
    if (onConnectionChange) onConnectionChange();
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    const res = await seedInitialDataToSupabase();
    setSeeding(false);
    setSeedResult(res);
    if (res.success) {
      sound.playSuccessChime();
      if (onConnectionChange) onConnectionChange();
    }
  };

  const fullSqlScript = `-- ==============================================================================
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

-- 6. CREATE TABLE: activity_logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    city TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    event TEXT NOT NULL,
    badge TEXT NOT NULL,
    accent TEXT NOT NULL DEFAULT 'blue',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY & POLICIES
ALTER TABLE public.city_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

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
END $$;

-- 8. ENABLE REALTIME
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'orders') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'drivers') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'activity_logs') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
    END IF;
END $$;`;

  const copySql = () => {
    navigator.clipboard.writeText(fullSqlScript);
    setCopiedSql(true);
    sound.playSuccessChime();
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const isConfigured = Boolean(url && anonKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-slate-950/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Supabase Cloud Database & Tables
                </h3>
                {testResult?.success ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                    LOCAL STANDBY
                  </span>
                )}
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Connect PostgreSQL tables, realtime live sync, and fleet persistence
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-full transition ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className={`flex items-center border-b px-6 py-2 gap-2 text-xs font-semibold ${
          isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800 bg-slate-950/40'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('connect')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'connect'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Connection Settings
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            SQL Schema & Tables
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'instructions'
                ? 'bg-emerald-600 text-white shadow-xs'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Setup Guide
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'connect' && (
            <div className="space-y-4">
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                testResult?.success
                  ? isLight
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                  : isLight
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200'
              }`}>
                {testResult?.success ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Radio className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                )}
                <div className="text-xs">
                  <div className="font-bold mb-1">
                    {testResult?.success ? 'Supabase Connection Verified' : 'Supabase Client Configuration'}
                  </div>
                  <p className="opacity-90">
                    {testResult
                      ? testResult.message
                      : isConfigured
                      ? 'Credentials saved. Click "Test Connection" to ping your database.'
                      : 'Enter your Supabase Project URL and Anon Public Key below, or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.'}
                  </p>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-bold mb-1 flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <Server className="w-3.5 h-3.5 text-blue-500" />
                    Project URL (VITE_SUPABASE_URL)
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-project-ref.supabase.co"
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    <Key className="w-3.5 h-3.5 text-amber-500" />
                    Anon Public Key (VITE_SUPABASE_ANON_KEY)
                  </label>
                  <input
                    type="password"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Save & Connect
                </button>

                <button
                  type="button"
                  disabled={testing || !url || !anonKey}
                  onClick={() => handleTest()}
                  className={`px-4 py-2 border text-xs font-bold rounded-xl transition flex items-center gap-2 ${
                    testing
                      ? 'opacity-60 cursor-not-allowed'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  {testing ? 'Testing...' : 'Test Connection'}
                </button>

                {isConfigured && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="px-3 py-2 text-xs text-rose-500 hover:text-rose-600 hover:underline font-semibold ml-auto"
                  >
                    Clear Credentials
                  </button>
                )}
              </div>

              {/* Direct Seed Action when connected */}
              {testResult?.success && (
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Seed Default Platform Data
                      </div>
                      <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Populate 6 New Zealand city hubs, vehicle rate cards, and initial active driver fleet.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={seeding}
                      onClick={handleSeed}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      <Database className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
                      {seeding ? 'Seeding...' : 'Seed Data'}
                    </button>
                  </div>
                  {seedResult && (
                    <p className={`text-xs font-semibold ${seedResult.success ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {seedResult.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">PostgreSQL Schema & Tables</h4>
                  <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Creates <code className="text-blue-500 font-mono">orders</code>, <code className="text-blue-500 font-mono">drivers</code>, <code className="text-blue-500 font-mono">vehicle_options</code>, <code className="text-blue-500 font-mono">city_hubs</code>, and <code className="text-blue-500 font-mono">activity_logs</code> with RLS policies and Realtime replication.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copySql}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}
                </button>
              </div>

              {/* Code Preview */}
              <div className={`p-3 rounded-2xl border font-mono text-[11px] max-h-72 overflow-y-auto leading-relaxed ${
                isLight ? 'bg-slate-900 text-slate-100 border-slate-700' : 'bg-black text-slate-200 border-slate-800'
              }`}>
                <pre>{fullSqlScript}</pre>
              </div>

              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
              }`}>
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  The complete SQL script has also been saved to <strong className="font-mono">supabase/schema.sql</strong> in your repository.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4 text-xs">
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Quick 3-Step Supabase Setup
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className={isLight ? 'text-slate-900' : 'text-white'}>Create a Supabase Project:</strong>
                      <p className="opacity-90 mt-0.5">
                        Log in to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline inline-flex items-center gap-1 font-semibold">Supabase Dashboard <ExternalLink className="w-3 h-3" /></a> and create a new project (e.g., <em>"move-logistics"</em>).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className={isLight ? 'text-slate-900' : 'text-white'}>Run the SQL Schema:</strong>
                      <p className="opacity-90 mt-0.5">
                        Go to the <strong>SQL Editor</strong> tab in your Supabase dashboard, click <strong>"New query"</strong>, paste the script from the <strong>SQL Schema</strong> tab (or from <code className="font-mono text-emerald-500">supabase/schema.sql</code>), and click <strong>"Run"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className={isLight ? 'text-slate-900' : 'text-white'}>Connect Move Platform:</strong>
                      <p className="opacity-90 mt-0.5">
                        Copy your <strong>Project URL</strong> and <strong>Anon Public Key</strong> from <em>Project Settings &gt; API</em> and paste them in the <strong>Connection Settings</strong> tab above, or save in <code className="font-mono text-emerald-500">.env.local</code>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Reference Checklist */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs">Included Tables in Move Schema:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <div>
                      <strong className="font-mono">orders</strong>: Realtime dispatch & tracking
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <div>
                      <strong className="font-mono">drivers</strong>: Driver fleet, GPS coords & KYC
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <div>
                      <strong className="font-mono">vehicle_options</strong>: Dynamic vehicle rate cards
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <div>
                      <strong className="font-mono">city_hubs</strong>: New Zealand regional hubs
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <div>
                      <strong className="font-mono">activity_logs</strong>: Realtime telemetry event logs
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <div>
                      <strong className="font-mono">app_notifications</strong>: Customer & driver push alerts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-slate-950/60'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${testResult?.success ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Status: {testResult?.success ? 'Connected & Synced' : isConfigured ? 'Connecting...' : 'Local Storage Mode'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl font-bold transition border ${
              isLight
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
