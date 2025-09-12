import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const initialState = {
    currentPath: '/dashboard',
    isMobileMenuOpen: false,
    previousPath: null,
};
export const useNavigationStore = create()(persist((set, get) => ({
    ...initialState,
    setCurrentPath: (path) => {
        const currentPath = get().currentPath;
        set((state) => ({
            currentPath: path,
            previousPath: state.currentPath !== path ? currentPath : state.previousPath,
        }));
    },
    setMobileMenuOpen: (isOpen) => {
        set({ isMobileMenuOpen: isOpen });
    },
    navigateBack: () => {
        const { previousPath } = get();
        if (previousPath) {
            set((state) => ({
                currentPath: previousPath,
                previousPath: state.currentPath,
            }));
        }
    },
    reset: () => {
        set(initialState);
    },
}), {
    name: 'navigation-storage',
    partialize: (state) => ({
        currentPath: state.currentPath,
        previousPath: state.previousPath,
    }),
}));
