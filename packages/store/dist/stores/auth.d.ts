import type { PatientAccount } from '../types';
interface AuthState {
    account: PatientAccount | null;
    isLoading: boolean;
    error: string | null;
}
interface AuthActions {
    signIn: (email: string, code: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    signOut: () => void;
    clearError: () => void;
}
type AuthStore = AuthState & AuthActions;
export declare const useAuthStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AuthStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AuthStore, {
            account: PatientAccount | null;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AuthStore) => void) => () => void;
        onFinishHydration: (fn: (state: AuthStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AuthStore, {
            account: PatientAccount | null;
        }>>;
    };
}>;
export {};
