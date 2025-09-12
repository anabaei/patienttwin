import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useInsuranceStore } from './insurance';
export const useAppointmentsStore = create()(persist((set, get) => ({
    // State
    appointments: [],
    bookings: [],
    isLoading: false,
    error: null,
    // Actions
    bookAppointment: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            const { clinicId, specialistId, serviceId, serviceOptionId, slotId } = payload;
            // Get coverage information from insurance store
            const insuranceStore = useInsuranceStore.getState();
            const coverage = insuranceStore.getBenefitsForServiceOption(serviceOptionId);
            // Generate appointment ID
            const appointmentId = `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            // Create appointment
            const appointment = {
                id: appointmentId,
                organizationId: 'org-001', // Mock organization
                patientId: 'patient-001', // Mock patient ID
                clinicId,
                locationId: undefined,
                primaryResourceId: specialistId,
                specialistId,
                serviceId,
                serviceOptionId,
                startTime: new Date().toISOString(), // In real app, this would come from the slot
                endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes later
                title: 'Medical Consultation',
                status: 'SCHEDULED',
                type: 'CONSULTATION',
                notes: undefined,
                cancellationReason: undefined,
                remindersSent: false,
                additionalResources: {},
                bookingSource: 'ONLINE',
                bookedBy: 'patient-001',
                fcMetadata: {},
            };
            // Create booking
            const booking = {
                id: bookingId,
                appointmentId,
                amount: coverage.totalDueNow,
                currency: 'CAD',
                status: 'PENDING',
                paymentMethod: 'INSURANCE',
                paymentIntentId: undefined,
                refundAmount: undefined,
                refundReason: undefined,
                metadata: {
                    coverage,
                    slotId,
                },
            };
            // Add to state
            set(state => ({
                appointments: [...state.appointments, appointment],
                bookings: [...state.bookings, booking],
                isLoading: false,
                error: null,
            }));
            return { appointment, booking };
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to book appointment',
                isLoading: false
            });
            throw error;
        }
    },
    cancelAppointment: async (appointmentId, reason) => {
        set({ isLoading: true, error: null });
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            set(state => ({
                appointments: state.appointments.map(apt => apt.id === appointmentId
                    ? {
                        ...apt,
                        status: 'CANCELLED',
                        cancellationReason: reason,
                    }
                    : apt),
                isLoading: false,
                error: null,
            }));
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to cancel appointment',
                isLoading: false
            });
        }
    },
    rescheduleAppointment: async (appointmentId, _newSlotId) => {
        set({ isLoading: true, error: null });
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));
            // In a real app, this would fetch the new slot details
            const newStartTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Tomorrow
            const newEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString();
            set(state => ({
                appointments: state.appointments.map(apt => apt.id === appointmentId
                    ? {
                        ...apt,
                        startTime: newStartTime,
                        endTime: newEndTime,
                        status: 'SCHEDULED',
                    }
                    : apt),
                isLoading: false,
                error: null,
            }));
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to reschedule appointment',
                isLoading: false
            });
        }
    },
    getAppointmentsForPatient: (patientId) => {
        const { appointments } = get();
        return appointments.filter(apt => apt.patientId === patientId);
    },
    getUpcomingAppointments: (patientId) => {
        const { appointments } = get();
        const now = new Date();
        return appointments
            .filter(apt => apt.patientId === patientId &&
            new Date(apt.startTime) > now &&
            apt.status !== 'CANCELLED')
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    },
    clearError: () => {
        set({ error: null });
    },
}), {
    name: 'twinn-appointments-storage',
    partialize: (state) => ({
        appointments: state.appointments,
        bookings: state.bookings,
    }),
}));
