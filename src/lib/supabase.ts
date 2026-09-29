import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Keys stored in localStorage for in-browser configuration without restarting Vite
const STORAGE_KEY_URL = 'move_supabase_url';
const STORAGE_KEY_ANON = 'move_supabase_anon_key';

export function getStoredSupabaseConfig() {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envAnon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  
  const savedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  const savedAnon = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ANON) : null;

  const url = (savedUrl || envUrl || '').trim();
  const anonKey = (savedAnon || envAnon || '').trim();

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http'))
  };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (anonKey) localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEY_ANON);
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUrl = '';
let lastAnon = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getStoredSupabaseConfig();
  if (!isConfigured) return null;

  if (cachedClient && lastUrl === url && lastAnon === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    lastUrl = url;
    lastAnon = anonKey;
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string; tablesFound?: string[] }> {
  const targetUrl = url || getStoredSupabaseConfig().url;
  const targetKey = anonKey || getStoredSupabaseConfig().anonKey;

  if (!targetUrl || !targetKey) {
    return { success: false, message: 'Missing Supabase URL or Anon Public Key.' };
  }

  try {
    const client = createClient(targetUrl, targetKey);
    // Attempt a light read to check connectivity
    const { error: driversError, data: driversData } = await client.from('drivers').select('id').limit(1);

    if (driversError) {
      // Check if it's a table-does-not-exist error (PGRST205 / 42P01)
      if (driversError.code === '42P01' || driversError.message?.includes('does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase project! However, tables are not created yet. Run the SQL schema to create them.',
          tablesFound: []
        };
      }
      return { success: false, message: `Supabase Error: ${driversError.message} (${driversError.code || 'code'})` };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase and verified database tables!',
      tablesFound: ['drivers']
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network connection failed.' };
  }
}
