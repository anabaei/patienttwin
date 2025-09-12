import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

const initialState: NavigationState = {
  currentPath: '/dashboard',
  isMobileMenuOpen: false,
  previousPath: null,
};

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentPath: (path: string) => {
        const currentPath = get().currentPath;
        set((state) => ({
          currentPath: path,
          previousPath: state.currentPath !== path ? currentPath : state.previousPath,
        }));
      },

      setMobileMenuOpen: (isOpen: boolean) => {
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
    }),
    {
      name: 'navigation-storage',
      partialize: (state) => ({
        currentPath: state.currentPath,
        previousPath: state.previousPath,
      }),
    }
  )
);
