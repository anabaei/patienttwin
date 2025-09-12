import type { Appointment, Booking, BookingPayload } from '../types';
interface AppointmentsState {
    appointments: Appointment[];
    bookings: Booking[];
    isLoading: boolean;
    error: string | null;
}
interface AppointmentsActions {
    bookAppointment: (payload: BookingPayload) => Promise<{
        appointment: Appointment;
        booking: Booking;
    }>;
    cancelAppointment: (appointmentId: string, reason?: string) => Promise<void>;
    rescheduleAppointment: (appointmentId: string, newSlotId: string) => Promise<void>;
    getAppointmentsForPatient: (patientId: string) => Appointment[];
    getUpcomingAppointments: (patientId: string) => Appointment[];
    clearError: () => void;
}
type AppointmentsStore = AppointmentsState & AppointmentsActions;
export declare const useAppointmentsStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AppointmentsStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AppointmentsStore, {
            appointments: Appointment[];
            bookings: Booking[];
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AppointmentsStore) => void) => () => void;
        onFinishHydration: (fn: (state: AppointmentsStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AppointmentsStore, {
            appointments: Appointment[];
            bookings: Booking[];
        }>>;
    };
}>;
export {};
