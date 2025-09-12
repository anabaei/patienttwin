import type { ConnectedPlan, CoverageSummary, InsuranceConnectionInput, InsurancePlan, InsuranceProvider } from '../types';
interface InsuranceState {
    providers: InsuranceProvider[];
    plans: InsurancePlan[];
    connectedPlan: ConnectedPlan | null;
    isLoading: boolean;
    error: string | null;
}
interface InsuranceActions {
    connectInsurance: (input: InsuranceConnectionInput) => Promise<void>;
    getBenefitsForServiceOption: (serviceOptionId: string) => CoverageSummary;
    clearError: () => void;
}
type InsuranceStore = InsuranceState & InsuranceActions;
export declare const useInsuranceStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<InsuranceStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<InsuranceStore, {
            connectedPlan: ConnectedPlan | null;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: InsuranceStore) => void) => () => void;
        onFinishHydration: (fn: (state: InsuranceStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<InsuranceStore, {
            connectedPlan: ConnectedPlan | null;
        }>>;
    };
}>;
export {};
