import { create } from 'zustand';

import type { HealthcareBalance } from '../types';
import { mockHealthcareBalances } from '../mocks/healthcare-balances';

interface HealthcareBalancesStore {
  balances: HealthcareBalance[];
  isLoading: boolean;
  error: string | null;
  getBalanceById: (id: string) => HealthcareBalance | undefined;
  getBalancesByType: (type: HealthcareBalance['type']) => HealthcareBalance[];
  fetchBalances: () => Promise<void>;
  setBalances: (balances: HealthcareBalance[]) => void;
}

export const useHealthcareBalancesStore = create<HealthcareBalancesStore>((set, get) => ({
  balances: mockHealthcareBalances,
  isLoading: false,
  error: null,
  getBalanceById: (id) => get().balances.find((balance) => balance.id === id),
  getBalancesByType: (type) => get().balances.filter((balance) => balance.type === type),
  fetchBalances: async () => {
    if (get().isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/mock-data');
      if (!response.ok) {
        throw new Error('Failed to load healthcare balances');
      }

      const data = await response.json();
      const balances: HealthcareBalance[] = data?.balances ?? [];
      set({ balances, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load healthcare balances',
      });
    }
  },
  setBalances: (balances) => set({ balances }),
}));
