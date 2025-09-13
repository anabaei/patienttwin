export interface HealthcareBalance {
    id: string;
    type: 'massage' | 'chiro' | 'mental-health' | 'physical-therapy' | 'acupuncture' | 'nutrition' | 'other';
    name: string;
    amount: number;
    expiryDate: string;
    renewalDate: string;
    description: string;
    iconName: string;
    color: string;
    status: 'active' | 'expiring' | 'expired';
    usageHistory: {
        date: string;
        service: string;
        amount: number;
        provider: string;
    }[];
    benefits: string[];
    coverage: {
        maxPerSession: number;
        maxPerYear: number;
        copay: number;
    };
}
interface HealthcareBalancesState {
    balances: HealthcareBalance[];
    getBalanceById: (id: string) => HealthcareBalance | undefined;
    getBalancesByType: (type: HealthcareBalance['type']) => HealthcareBalance[];
}
export declare const useHealthcareBalancesStore: import("zustand").UseBoundStore<import("zustand").StoreApi<HealthcareBalancesState>>;
export {};
