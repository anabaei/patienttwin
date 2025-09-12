import type { AvailabilitySlot, BookingSettings } from '../types';
interface AvailabilityState {
    slots: AvailabilitySlot[];
    bookingSettings: Record<string, BookingSettings>;
    isLoading: boolean;
    error: string | null;
}
interface AvailabilityActions {
    generateSlots: (params: {
        clinicId: string;
        specialistId: string;
        serviceOptionId: string;
        from: string;
        to: string;
    }) => Promise<void>;
    getSlotsForSpecialist: (specialistId: string, clinicId: string, serviceOptionId: string) => AvailabilitySlot[];
    clearError: () => void;
}
type AvailabilityStore = AvailabilityState & AvailabilityActions;
export declare const useAvailabilityStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AvailabilityStore>>;
export {};
