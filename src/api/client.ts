import { getSupabaseClient } from '../lib/supabase';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Universal API Client with automatic Supabase PostgreSQL connectivity
 * and transparent local fallback if offline or during network interruptions.
 */
export async function apiClient<T>(
  queryFn: (client: ReturnType<typeof getSupabaseClient>) => Promise<{ data: any; error: any }>,
  fallbackData?: T
): Promise<ApiResponse<T>> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      data: fallbackData ?? null,
      error: 'API client not initialized. Operating in local mode.',
      status: 200,
    };
  }

  try {
    const { data, error } = await queryFn(client);
    if (error) {
      console.warn('API Query Warning:', error.message);
      return {
        data: fallbackData ?? null,
        error: error.message,
        status: error.code ? 400 : 500,
      };
    }
    return {
      data: data as T,
      error: null,
      status: 200,
    };
  } catch (err: any) {
    console.error('API Network Exception:', err);
    return {
      data: fallbackData ?? null,
      error: err.message || 'Unknown network error',
      status: 500,
    };
  }
}
