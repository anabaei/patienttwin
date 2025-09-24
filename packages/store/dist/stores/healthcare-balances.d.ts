import type { HealthcareBalance } from '../types';
interface HealthcareBalancesStore {
    balances: HealthcareBalance[];
    isLoading: boolean;
    error: string | null;
    getBalanceById: (id: string) => HealthcareBalance | undefined;
    getBalancesByType: (type: HealthcareBalance['type']) => HealthcareBalance[];
    fetchBalances: () => Promise<void>;
    setBalances: (balances: HealthcareBalance[]) => void;
}
export declare const useHealthcareBalancesStore: import("zustand").UseBoundStore<import("zustand").StoreApi<HealthcareBalancesStore>>;
export {};
