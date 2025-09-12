import { create } from 'zustand';
import type { AvailabilitySlot, BookingSettings } from '../types';
import { generateAvailabilitySlots } from '../utils/availability';

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

// Mock booking settings for each clinic
const mockBookingSettings: Record<string, BookingSettings> = {
  'clinic-001': {
    id: 'settings-001',
    clinicId: 'clinic-001',
    requireApproval: false,
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 2,
    bufferBetweenAppts: 15,
    bookingCutoffTime: '17:00',
    bookingInterval: 15,
    defaultTreatmentDuration: 30,
    maxAppointmentsPerDay: 20,
    timezone: 'America/Toronto',
  },
  'clinic-002': {
    id: 'settings-002',
    clinicId: 'clinic-002',
    requireApproval: true,
    maxAdvanceBookingDays: 14,
    minAdvanceBookingHours: 4,
    bufferBetweenAppts: 10,
    bookingCutoffTime: '16:00',
    bookingInterval: 30,
    defaultTreatmentDuration: 45,
    maxAppointmentsPerDay: 15,
    timezone: 'America/Toronto',
  },
  'clinic-003': {
    id: 'settings-003',
    clinicId: 'clinic-003',
    requireApproval: false,
    maxAdvanceBookingDays: 21,
    minAdvanceBookingHours: 1,
    bufferBetweenAppts: 5,
    bookingCutoffTime: '18:00',
    bookingInterval: 15,
    defaultTreatmentDuration: 30,
    maxAppointmentsPerDay: 25,
    timezone: 'America/Toronto',
  },
  'clinic-004': {
    id: 'settings-004',
    clinicId: 'clinic-004',
    requireApproval: false,
    maxAdvanceBookingDays: 28,
    minAdvanceBookingHours: 3,
    bufferBetweenAppts: 20,
    bookingCutoffTime: '17:30',
    bookingInterval: 20,
    defaultTreatmentDuration: 40,
    maxAppointmentsPerDay: 18,
    timezone: 'America/Toronto',
  },
  'clinic-005': {
    id: 'settings-005',
    clinicId: 'clinic-005',
    requireApproval: true,
    maxAdvanceBookingDays: 35,
    minAdvanceBookingHours: 6,
    bufferBetweenAppts: 30,
    bookingCutoffTime: '15:00',
    bookingInterval: 30,
    defaultTreatmentDuration: 60,
    maxAppointmentsPerDay: 12,
    timezone: 'America/Toronto',
  },
};

export const useAvailabilityStore = create<AvailabilityStore>()((set, get) => ({
  // State
  slots: [],
  bookingSettings: mockBookingSettings,
  isLoading: false,
  error: null,

  // Actions
  generateSlots: async (params) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { clinicId, specialistId, serviceOptionId, from, to } = params;
      const settings = get().bookingSettings[clinicId];
      
      if (!settings) {
        throw new Error('Booking settings not found for clinic');
      }
      
      // Generate availability slots
      const newSlots = generateAvailabilitySlots({
        clinicId,
        specialistId,
        serviceOptionId,
        from,
        to,
        settings,
      });
      
      // Merge with existing slots, avoiding duplicates
      const existingSlots = get().slots;
      const mergedSlots = [...existingSlots];
      
      newSlots.forEach(newSlot => {
        const exists = existingSlots.some(existing => 
          existing.id === newSlot.id
        );
        if (!exists) {
          mergedSlots.push(newSlot);
        }
      });
      
      set({ 
        slots: mergedSlots,
        isLoading: false,
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate availability slots',
        isLoading: false 
      });
    }
  },

  getSlotsForSpecialist: (specialistId: string, clinicId: string, serviceOptionId: string): AvailabilitySlot[] => {
    const { slots } = get();
    
    return slots.filter(slot => 
      slot.specialistId === specialistId &&
      slot.clinicId === clinicId &&
      slot.serviceOptionId === serviceOptionId
    );
  },

  clearError: () => {
    set({ error: null });
  },
}));
