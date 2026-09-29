import { apiClient, ApiResponse } from './client';
import { LogisticsOrder, OrderStatus, ProofOfDelivery } from '../types/logistics';
import { mapDbOrderToOrder, mapOrderToDbOrder } from '../services/supabaseService';

export const ordersApi = {
  /**
   * GET /api/orders - Fetch all orders (with optional status filtering)
   */
  async getAll(statusFilter?: string): Promise<ApiResponse<LogisticsOrder[]>> {
    const res = await apiClient<any[]>((client) => {
      let query = client.from('orders').select('*').order('created_at', { ascending: false });
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      return query;
    }, []);

    if (res.data) {
      return {
        ...res,
        data: res.data.map(mapDbOrderToOrder),
      };
    }
    return { ...res, data: [] };
  },

  /**
   * GET /api/orders/:id - Fetch single order by ID
   */
  async getById(id: string): Promise<ApiResponse<LogisticsOrder | null>> {
    const res = await apiClient<any>(
      (client) => client.from('orders').select('*').eq('id', id).single(),
      null
    );
    return {
      ...res,
      data: res.data ? mapDbOrderToOrder(res.data) : null,
    };
  },

  /**
   * POST /api/orders - Create a new on-demand dispatch booking
   */
  async create(order: LogisticsOrder): Promise<ApiResponse<LogisticsOrder>> {
    const dbPayload = mapOrderToDbOrder(order);
    const res = await apiClient(
      (client) => client.from('orders').insert(dbPayload).select().single(),
      dbPayload
    );

    return {
      ...res,
      data: res.data ? mapDbOrderToOrder(res.data) : order,
    };
  },

  /**
   * PATCH /api/orders/:id/status - Update order workflow status and progress percentage
   */
  async updateStatus(
    id: string,
    status: OrderStatus,
    progressPercent?: number
  ): Promise<ApiResponse<boolean>> {
    const payload: any = { status, updated_at: new Date().toISOString() };
    if (progressPercent !== undefined) payload.progress_percent = progressPercent;

    const res = await apiClient(
      (client) => client.from('orders').update(payload).eq('id', id),
      true
    );
    return {
      ...res,
      data: res.error === null,
    };
  },

  /**
   * POST /api/orders/:id/assign - Assign matching driver partner to order
   */
  async assignDriver(
    orderId: string,
    driver: {
      id: string;
      name: string;
      phone: string;
      rating: number;
      vehiclePlate: string;
      photoUrl?: string;
    }
  ): Promise<ApiResponse<boolean>> {
    const res = await apiClient(
      (client) =>
        client
          .from('orders')
          .update({
            status: 'driver_assigned',
            driver_id: driver.id,
            driver_name: driver.name,
            driver_phone: driver.phone,
            driver_rating: driver.rating,
            driver_vehicle_plate: driver.vehiclePlate,
            driver_photo_url: driver.photoUrl || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId),
      true
    );
    return {
      ...res,
      data: res.error === null,
    };
  },

  /**
   * POST /api/orders/:id/verify-otp - Verify delivery OTP
   */
  async verifyOtp(orderId: string, enteredOtp: string): Promise<ApiResponse<{ verified: boolean }>> {
    const orderRes = await this.getById(orderId);
    if (!orderRes.data) {
      return { data: { verified: false }, error: 'Order not found', status: 404 };
    }

    const verified = orderRes.data.otp === enteredOtp.trim();
    return {
      data: { verified },
      error: verified ? null : 'Invalid OTP code',
      status: verified ? 200 : 400,
    };
  },

  /**
   * POST /api/orders/:id/complete - Submit e-signature POD and mark completed
   */
  async complete(orderId: string, pod: ProofOfDelivery): Promise<ApiResponse<boolean>> {
    const res = await apiClient(
      (client) =>
        client
          .from('orders')
          .update({
            status: 'delivered',
            progress_percent: 100,
            payment_status: 'paid',
            pod,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId),
      true
    );
    return {
      ...res,
      data: res.error === null,
    };
  },

  /**
   * POST /api/orders/:id/cancel - Cancel active order
   */
  async cancel(orderId: string, reason?: string): Promise<ApiResponse<boolean>> {
    const res = await apiClient(
      (client) =>
        client
          .from('orders')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId),
      true
    );
    return {
      ...res,
      data: res.error === null,
    };
  },
};
