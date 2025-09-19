import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface SettingsState {
  chatSupport: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    appointmentReminders: boolean;
    insuranceUpdates: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    dataSharing: boolean;
    analytics: boolean;
    locationTracking: boolean;
  };
  appearance: {
    compactMode: boolean;
    largeText: boolean;
    highContrast: boolean;
  };
}

interface SettingsActions {
  setChatSupport: (enabled: boolean) => void;
  setNotification: (key: keyof SettingsState['notifications'], value: boolean) => void;
  setPrivacy: (key: keyof SettingsState['privacy'], value: boolean | string) => void;
  setAppearance: (key: keyof SettingsState['appearance'], value: boolean) => void;
  resetSettings: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

const initialState: SettingsState = {
  chatSupport: true,
  notifications: {
    email: true,
    push: true,
    sms: false,
    appointmentReminders: true,
    insuranceUpdates: true,
    marketing: false,
  },
  privacy: {
    profileVisibility: 'private',
    dataSharing: false,
    analytics: true,
    locationTracking: false,
  },
  appearance: {
    compactMode: false,
    largeText: false,
    highContrast: false,
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialState,

      setChatSupport: (enabled: boolean) => {
        set({ chatSupport: enabled });
      },

      setNotification: (key: keyof SettingsState['notifications'], value: boolean) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: value,
          },
        }));
      },

      setPrivacy: (key: keyof SettingsState['privacy'], value: boolean | string) => {
        set((state) => ({
          privacy: {
            ...state.privacy,
            [key]: value,
          },
        }));
      },

      setAppearance: (key: keyof SettingsState['appearance'], value: boolean) => {
        set((state) => ({
          appearance: {
            ...state.appearance,
            [key]: value,
          },
        }));
      },

      resetSettings: () => {
        set(initialState);
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);
