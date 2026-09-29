import { ApiResponse } from './client';
import { GOODS_TYPES } from '../data/mockData';

export interface GoodsCategory {
  id: string;
  label: string;
  icon: string;
  recommendedVehicle?: string;
}

export interface PromoValidationResult {
  valid: boolean;
  code: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  description: string;
}

const PROMO_CODES: Record<string, { type: 'flat' | 'percentage'; value: number; desc: string }> = {
  KIWI10: { type: 'flat', value: 10, desc: '$10 Off Welcome Kiwi Discount' },
  NZFREIGHT: { type: 'flat', value: 15, desc: '$15 Off Commercial Freight' },
  FIRSTMOVE: { type: 'flat', value: 20, desc: '$20 Off First Booking' },
  SUPABASE: { type: 'flat', value: 15, desc: '$15 Cloud Database Launch Credit' },
};

export const catalogApi = {
  /**
   * GET /api/catalog/goods-types - Fetch all supported freight and consignment categories
   */
  async getGoodsTypes(): Promise<ApiResponse<GoodsCategory[]>> {
    return {
      data: GOODS_TYPES,
      error: null,
      status: 200,
    };
  },

  /**
   * POST /api/promos/validate - Dynamically validate a customer promo voucher
   */
  async validatePromo(code: string, fareSubtotal = 0): Promise<ApiResponse<PromoValidationResult>> {
    const cleanCode = (code || '').trim().toUpperCase();
    const promo = PROMO_CODES[cleanCode];

    if (!promo) {
      return {
        data: {
          valid: false,
          code: cleanCode,
          discountType: 'flat',
          discountValue: 0,
          description: 'Invalid promotional voucher code',
        },
        error: 'Invalid promo code',
        status: 400,
      };
    }

    const calculatedDiscount =
      promo.type === 'flat'
        ? promo.value
        : Math.round(fareSubtotal * (promo.value / 100) * 10) / 10;

    return {
      data: {
        valid: true,
        code: cleanCode,
        discountType: promo.type,
        discountValue: calculatedDiscount,
        description: promo.desc,
      },
      error: null,
      status: 200,
    };
  },

  /**
   * GET /api/catalog/moving-inventory - Fetch default item catalog for household shifting
   */
  getMovingInventory(): Record<string, number> {
    return {
      'Queen / King Bed & Mattress': 2,
      'Lounge Suite (3+2 Seater)': 1,
      'Dining Table + 6 Chairs': 1,
      'Double Door Refrigerator': 1,
      'Front-Load Washing Machine': 1,
      'Smart TV (65 Inch)': 1,
      'Chest of Drawers / Wardrobe': 2,
      'Heavy-Duty Moving Cartons': 15,
    };
  },

  /**
   * POST /api/catalog/relocation-quote - Compute dynamic quote for home relocation
   */
  calculateRelocationQuote(params: {
    houseSize: '1 Bed Flat' | '2 Bed Flat' | '3-4 Bed House' | 'Commercial Office';
    packingTier: 'standard' | 'premium';
    hasLiftPickup: boolean;
    hasLiftDrop: boolean;
  }) {
    const rateMatrix: Record<string, number> = {
      '1 Bed Flat': 240.0,
      '2 Bed Flat': 380.0,
      '3-4 Bed House': 560.0,
      'Commercial Office': 750.0,
    };
    const baseShiftCost = rateMatrix[params.houseSize] || 380.0;
    const packingAddon = params.packingTier === 'premium' ? 95.0 : 45.0;
    const stairsAddon = (!params.hasLiftPickup ? 30.0 : 0) + (!params.hasLiftDrop ? 30.0 : 0);
    const subtotal = baseShiftCost + packingAddon + stairsAddon;

    return {
      baseShiftCost,
      packingAddon,
      stairsAddon,
      totalCost: subtotal,
    };
  },
};

