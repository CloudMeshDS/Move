import { ApiResponse } from './client';

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  walletBalance: number;
  currency: string;
  savedAddresses: Array<{
    id: string;
    label: 'Home' | 'Office' | 'Warehouse' | 'Other';
    address: string;
    area: string;
    city: string;
    x: number;
    y: number;
  }>;
}

const STORAGE_KEY_CUSTOMER = 'move_customer_profile_v1';

function getStoredProfile(): CustomerProfile {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOMER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through
      }
    }
  }

  return {
    id: 'cust-99',
    name: 'Sultan Singh',
    phone: '+91 9876777416',
    email: 'sultan.singh@porter.in',
    rating: 4.95,
    walletBalance: 240.0,
    currency: 'INR',
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home',
        address: 'B1, B2, B3, Sector 48, Gurugram, Haryana 122018, India',
        area: 'Sector 48',
        city: 'Gurugram',
        x: 48,
        y: 28,
      },
      {
        id: 'addr-2',
        label: 'Office',
        address: '505, Iris Tech Park, Sector 48, Gurugram, Haryana',
        area: 'Iris Tech Park',
        city: 'Gurugram',
        x: 52,
        y: 45,
      },
      {
        id: 'addr-3',
        label: 'Other',
        address: 'Artemis Hospital Gurgaon, Sector 51, Gurugram, Haryana, India',
        area: 'Sector 51',
        city: 'Gurugram',
        x: 60,
        y: 50,
      },
      {
        id: 'addr-4',
        label: 'Warehouse',
        address: '402, Udyog Vihar III, Sector 20, Gurugram, Haryana 122022, India',
        area: 'Udyog Vihar',
        city: 'Gurugram',
        x: 35,
        y: 65,
      },
      {
        id: 'addr-5',
        label: 'Other',
        address: 'Signature Global Synera 81, Sector 81, Gurugram, Haryana, India',
        area: 'Sector 81',
        city: 'Gurugram',
        x: 70,
        y: 80,
      }
    ],
  };
}

function saveStoredProfile(profile: CustomerProfile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(profile));
  }
}

export const customerApi = {
  /**
   * GET /api/customer/profile - Fetch active customer profile & wallet
   */
  async getProfile(): Promise<ApiResponse<CustomerProfile>> {
    const profile = getStoredProfile();
    return {
      data: profile,
      error: null,
      status: 200,
    };
  },

  /**
   * PATCH /api/customer/profile - Update customer profile details
   */
  async updateProfile(updates: Partial<CustomerProfile>): Promise<ApiResponse<CustomerProfile>> {
    const current = getStoredProfile();
    const updated = { ...current, ...updates };
    saveStoredProfile(updated);
    return {
      data: updated,
      error: null,
      status: 200,
    };
  },

  /**
   * POST /api/customer/wallet/topup - Add funds to Move Wallet
   */
  async topUpWallet(amount: number): Promise<ApiResponse<{ newBalance: number }>> {
    const current = getStoredProfile();
    const newBalance = Number((current.walletBalance + amount).toFixed(2));
    const updated = { ...current, walletBalance: newBalance };
    saveStoredProfile(updated);
    return {
      data: { newBalance },
      error: null,
      status: 200,
    };
  },

  /**
   * POST /api/customer/wallet/pay - Deduct fare payment from Move Wallet
   */
  async payWithWallet(amount: number): Promise<ApiResponse<{ success: boolean; newBalance: number }>> {
    const current = getStoredProfile();
    if (current.walletBalance < amount) {
      return {
        data: { success: false, newBalance: current.walletBalance },
        error: 'Insufficient wallet balance',
        status: 400,
      };
    }
    const newBalance = Number((current.walletBalance - amount).toFixed(2));
    const updated = { ...current, walletBalance: newBalance };
    saveStoredProfile(updated);
    return {
      data: { success: true, newBalance },
      error: null,
      status: 200,
    };
  },
};
