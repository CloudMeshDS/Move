import { apiClient, ApiResponse } from './client';
import { DriverPartner, DriverStatus } from '../types/logistics';
import { mapDbDriverToDriver, mapDriverToDbDriver } from '../services/supabaseService';
import { INITIAL_DRIVERS } from '../data/mockData';

export const driversApi = {
  /**
   * GET /api/drivers - Fetch all driver partners with live duty statuses and GPS
   */
  async getAll(): Promise<ApiResponse<DriverPartner[]>> {
    const res = await apiClient<any[]>(
      (client) => client.from('drivers').select('*').order('name'),
      INITIAL_DRIVERS.map(mapDriverToDbDriver)
    );

    if (res.data && res.data.length > 0) {
      return {
        ...res,
        data: res.data.map(mapDbDriverToDriver),
      };
    }
    return {
      ...res,
      data: INITIAL_DRIVERS,
    };
  },

  /**
   * GET /api/drivers/:id - Fetch single driver partner
   */
  async getById(id: string): Promise<ApiResponse<DriverPartner | null>> {
    const res = await apiClient<any>(
      (client) => client.from('drivers').select('*').eq('id', id).single(),
      null
    );
    return {
      ...res,
      data: res.data ? mapDbDriverToDriver(res.data) : null,
    };
  },

  /**
   * PATCH /api/drivers/:id/status - Toggle or set online/offline duty status
   */
  async updateStatus(id: string, status: DriverStatus): Promise<ApiResponse<boolean>> {
    const res = await apiClient(
      (client) => client.from('drivers').update({ status, updated_at: new Date().toISOString() }).eq('id', id),
      true
    );
    return {
      ...res,
      data: res.error === null,
    };
  },

  /**
   * PATCH /api/drivers/:id/location - Update live GPS coordinates & heading
   */
  async updateLocation(
    id: string,
    location: { x: number; y: number; area: string },
    heading?: number
  ): Promise<ApiResponse<boolean>> {
    const res = await apiClient(
      (client) =>
        client
          .from('drivers')
          .update({
            current_location: location,
            ...(heading !== undefined ? { heading } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq('id', id),
      true
    );
    return {
      ...res,
      data: res.error === null,
    };
  },

  /**
   * PATCH /api/drivers/:id/kyc - Approve or reject driver compliance documents
   */
  async updateKYC(id: string, kycStatus: 'approved' | 'pending' | 'rejected'): Promise<ApiResponse<boolean>> {
    const res = await apiClient(
      (client) => client.from('drivers').update({ kyc_status: kycStatus, updated_at: new Date().toISOString() }).eq('id', id),
      true
    );
    return {
      ...res,
      data: res.error === null,
    };
  },

  /**
   * POST /api/drivers/:id/payout - Withdraw driver balance
   */
  async withdrawEarnings(id: string, amount: number): Promise<ApiResponse<{ remainingBalance: number }>> {
    const current = await this.getById(id);
    const newBalance = Math.max(0, (current.data?.walletBalance || 0) - amount);

    await apiClient(
      (client) => client.from('drivers').update({ wallet_balance: newBalance, updated_at: new Date().toISOString() }).eq('id', id),
      true
    );

    return {
      data: { remainingBalance: newBalance },
      error: null,
      status: 200,
    };
  },

  /**
   * POST /api/drivers/:id/credit - Credit earnings to driver wallet upon trip completion
   */
  async creditEarnings(id: string, amount: number): Promise<ApiResponse<{ todayEarnings: number; walletBalance: number }>> {
    const current = await this.getById(id);
    const todayEarnings = Number(((current.data?.todayEarnings || 0) + amount).toFixed(2));
    const walletBalance = Number(((current.data?.walletBalance || 0) + amount).toFixed(2));
    const totalTrips = (current.data?.totalTrips || 0) + 1;

    await apiClient(
      (client) =>
        client
          .from('drivers')
          .update({
            today_earnings: todayEarnings,
            wallet_balance: walletBalance,
            total_trips: totalTrips,
            status: 'online_idle',
            updated_at: new Date().toISOString(),
          })
          .eq('id', id),
      true
    );

    return {
      data: { todayEarnings, walletBalance },
      error: null,
      status: 200,
    };
  },
};

