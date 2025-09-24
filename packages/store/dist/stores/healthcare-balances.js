import { create } from 'zustand';
import { mockHealthcareBalances } from '../mocks/healthcare-balances';
export const useHealthcareBalancesStore = create((set, get) => ({
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
            const balances = data?.balances ?? [];
            set({ balances, isLoading: false, error: null });
        }
        catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to load healthcare balances',
            });
        }
    },
    setBalances: (balances) => set({ balances }),
}));
