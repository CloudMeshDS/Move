import { apiClient, ApiResponse } from './client';
import { VehicleOption, VehicleCategoryId } from '../types/logistics';
import { VEHICLE_OPTIONS } from '../data/mockData';

export function mapDbToVehicle(row: any): VehicleOption {
  return {
    id: row.id as VehicleCategoryId,
    name: row.name,
    subTitle: row.sub_title || '',
    tagline: row.tagline || '',
    capacityKg: Number(row.capacity_kg) || 0,
    dimensions: row.dimensions || '',
    baseFare: Number(row.base_fare) || 0,
    baseKm: Number(row.base_km) || 0,
    perKmRate: Number(row.per_km_rate) || 0,
    helperFee: Number(row.helper_fee) || 0,
    etaMins: Number(row.eta_mins) || 10,
    iconType: row.icon_type || 'van',
    popularFor: row.popular_for || '',
  };
}

export function mapVehicleToDb(v: VehicleOption) {
  return {
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
  };
}

export const vehiclesApi = {
  /**
   * GET /api/vehicles - Fetch all vehicle categories & dynamic rate cards
   */
  async getAll(): Promise<ApiResponse<VehicleOption[]>> {
    const res = await apiClient<any[]>(
      (client) => client.from('vehicle_options').select('*').order('base_fare', { ascending: true }),
      VEHICLE_OPTIONS.map(mapVehicleToDb)
    );

    if (res.data && res.data.length > 0) {
      return {
        ...res,
        data: res.data.map(mapDbToVehicle),
      };
    }
    return {
      ...res,
      data: VEHICLE_OPTIONS,
    };
  },

  /**
   * GET /api/vehicles/:id - Fetch single vehicle category details
   */
  async getById(id: VehicleCategoryId): Promise<ApiResponse<VehicleOption | null>> {
    const res = await apiClient<any>(
      (client) => client.from('vehicle_options').select('*').eq('id', id).single(),
      null
    );
    return {
      ...res,
      data: res.data ? mapDbToVehicle(res.data) : null,
    };
  },

  /**
   * PATCH /api/vehicles/:id/rates - Update dynamic rate card (pricing, helper fees)
   */
  async updateRateCard(
    id: VehicleCategoryId,
    updates: Partial<VehicleOption>
  ): Promise<ApiResponse<boolean>> {
    const dbPayload: any = {};
    if (updates.baseFare !== undefined) dbPayload.base_fare = updates.baseFare;
    if (updates.perKmRate !== undefined) dbPayload.per_km_rate = updates.perKmRate;
    if (updates.helperFee !== undefined) dbPayload.helper_fee = updates.helperFee;
    if (updates.etaMins !== undefined) dbPayload.eta_mins = updates.etaMins;

    const res = await apiClient(
      (client) => client.from('vehicle_options').update(dbPayload).eq('id', id),
      true
    );
    return {
      ...res,
      data: res.error === null,
    };
  },
};
