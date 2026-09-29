import { apiClient, ApiResponse } from './client';
import { CityHub } from '../types/logistics';
import { CITY_HUBS } from '../data/mockData';

export const hubsApi = {
  /**
   * GET /api/hubs - Fetch all regional city hubs & dynamic popular landmarks
   */
  async getAll(): Promise<ApiResponse<CityHub[]>> {
    const res = await apiClient<any[]>(
      (client) => client.from('city_hubs').select('*').order('name'),
      CITY_HUBS
    );

    if (res.data && res.data.length > 0) {
      const hubs: CityHub[] = res.data.map((row) => ({
        id: row.id,
        name: row.name,
        state: row.state,
        center: row.center || { x: 50, y: 50 },
        popularLandmarks: row.popular_landmarks || [],
      }));
      return {
        ...res,
        data: hubs,
      };
    }
    return {
      ...res,
      data: CITY_HUBS,
    };
  },

  /**
   * GET /api/hubs/:id - Fetch single city hub and its landmarks
   */
  async getById(id: string): Promise<ApiResponse<CityHub | null>> {
    const res = await apiClient<any>(
      (client) => client.from('city_hubs').select('*').eq('id', id).single(),
      null
    );

    if (res.data) {
      return {
        ...res,
        data: {
          id: res.data.id,
          name: res.data.name,
          state: res.data.state,
          center: res.data.center,
          popularLandmarks: res.data.popular_landmarks || [],
        },
      };
    }
    return { ...res, data: null };
  },
};
