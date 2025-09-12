interface NavigationState {
    currentPath: string;
    isMobileMenuOpen: boolean;
    previousPath: string | null;
}
interface NavigationActions {
    setCurrentPath: (path: string) => void;
    setMobileMenuOpen: (isOpen: boolean) => void;
    navigateBack: () => void;
    reset: () => void;
}
type NavigationStore = NavigationState & NavigationActions;
export declare const useNavigationStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<NavigationStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<NavigationStore, {
            currentPath: string;
            previousPath: string | null;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: NavigationStore) => void) => () => void;
        onFinishHydration: (fn: (state: NavigationStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<NavigationStore, {
            currentPath: string;
            previousPath: string | null;
        }>>;
    };
}>;
export {};
