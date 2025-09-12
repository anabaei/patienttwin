import { addDays, addMinutes, endOfDay, isAfter, isBefore, startOfDay } from 'date-fns';
import type { AvailabilitySlot, BookingSettings } from '../types';

interface GenerateSlotsParams {
  clinicId: string;
  specialistId: string;
  serviceOptionId: string;
  from: string;
  to: string;
  settings: BookingSettings;
}

// Mock specialist schedules (in real app, this would come from the database)
const specialistSchedules: Record<string, {
  workingDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  workingHours: { start: string; end: string }[];
  breaks: { start: string; end: string }[];
}> = {
  'user-001': {
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    workingHours: [
      { start: '09:00', end: '12:00' },
      { start: '13:00', end: '17:00' },
    ],
    breaks: [
      { start: '12:00', end: '13:00' }, // Lunch break
    ],
  },
  'user-002': {
    workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
    workingHours: [
      { start: '08:00', end: '16:00' },
    ],
    breaks: [
      { start: '12:00', end: '13:00' }, // Lunch break
    ],
  },
  'user-003': {
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    workingHours: [
      { start: '10:00', end: '18:00' },
    ],
    breaks: [
      { start: '13:00', end: '14:00' }, // Lunch break
    ],
  },
  'user-004': {
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    workingHours: [
      { start: '09:00', end: '12:00' },
      { start: '14:00', end: '18:00' },
    ],
    breaks: [
      { start: '12:00', end: '14:00' }, // Extended lunch break
    ],
  },
};

// Mock existing appointments (in real app, this would come from the database)
const existingAppointments: Record<string, { start: string; end: string }[]> = {
  'user-001': [
    { start: '2024-01-15T10:00:00Z', end: '2024-01-15T10:30:00Z' },
    { start: '2024-01-15T14:00:00Z', end: '2024-01-15T14:45:00Z' },
  ],
  'user-002': [
    { start: '2024-01-15T09:00:00Z', end: '2024-01-15T09:30:00Z' },
  ],
  'user-003': [],
  'user-004': [
    { start: '2024-01-15T15:00:00Z', end: '2024-01-15T16:00:00Z' },
  ],
};

export function generateAvailabilitySlots(params: GenerateSlotsParams): AvailabilitySlot[] {
  const { clinicId, specialistId, serviceOptionId, from, to, settings } = params;
  
  const slots: AvailabilitySlot[] = [];
  const startDate = new Date(from);
  const endDate = new Date(to);
  
  // Get specialist schedule
  const schedule = specialistSchedules[specialistId];
  if (!schedule) {
    return slots; // No schedule found
  }
  
  // Get existing appointments for this specialist
  const appointments = existingAppointments[specialistId] || [];
  
  // Generate slots for each day in the range
  let currentDate = startOfDay(startDate);
  const finalDate = endOfDay(endDate);
  
  while (isBefore(currentDate, finalDate) || currentDate.getTime() === finalDate.getTime()) {
    const dayOfWeek = currentDate.getDay();
    
    // Check if specialist works on this day
    if (schedule.workingDays.includes(dayOfWeek)) {
      // Generate slots for each working period
      schedule.workingHours.forEach(period => {
        const periodStart = new Date(currentDate);
        const [startHour, startMinute] = period.start.split(':').map(Number);
        periodStart.setHours(startHour, startMinute, 0, 0);
        
        const periodEnd = new Date(currentDate);
        const [endHour, endMinute] = period.end.split(':').map(Number);
        periodEnd.setHours(endHour, endMinute, 0, 0);
        
        // Generate slots within this period
        let slotStart = periodStart;
        
        while (isBefore(slotStart, periodEnd)) {
          const slotEnd = addMinutes(slotStart, settings.defaultTreatmentDuration || 30);
          
          // Check if slot is within the requested time range
          if (isAfter(slotStart, new Date(from)) && isBefore(slotEnd, new Date(to))) {
            // Check if slot conflicts with breaks
            const conflictsWithBreak = schedule.breaks.some(breakPeriod => {
              const breakStart = new Date(currentDate);
              const [breakStartHour, breakStartMinute] = breakPeriod.start.split(':').map(Number);
              breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);
              
              const breakEnd = new Date(currentDate);
              const [breakEndHour, breakEndMinute] = breakPeriod.end.split(':').map(Number);
              breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);
              
              return (slotStart < breakEnd && slotEnd > breakStart);
            });
            
            // Check if slot conflicts with existing appointments
            const conflictsWithAppointment = appointments.some(appointment => {
              const apptStart = new Date(appointment.start);
              const apptEnd = new Date(appointment.end);
              return (slotStart < apptEnd && slotEnd > apptStart);
            });
            
            // Check if slot is too far in advance
            const maxAdvanceDate = addDays(new Date(), settings.maxAdvanceBookingDays);
            const isWithinAdvanceLimit = isBefore(slotStart, maxAdvanceDate);
            
            // Check if slot is too soon (minimum advance booking)
            const minAdvanceDate = addMinutes(new Date(), settings.minAdvanceBookingHours * 60);
            const isNotTooSoon = isAfter(slotStart, minAdvanceDate);
            
            if (!conflictsWithBreak && !conflictsWithAppointment && isWithinAdvanceLimit && isNotTooSoon) {
              slots.push({
                id: `slot-${specialistId}-${clinicId}-${serviceOptionId}-${slotStart.getTime()}`,
                clinicId,
                specialistId,
                serviceOptionId,
                start: slotStart.toISOString(),
                end: slotEnd.toISOString(),
                mode: 'in-person', // Default to in-person, could be made configurable
              });
            }
          }
          
          // Move to next slot
          slotStart = addMinutes(slotStart, settings.bookingInterval || 15);
        }
      });
    }
    
    // Move to next day
    currentDate = addDays(currentDate, 1);
  }
  
  return slots;
}

// Helper function to check if a time slot is available
export function isSlotAvailable(
  slot: AvailabilitySlot,
  specialistId: string,
  settings: BookingSettings
): boolean {
  const now = new Date();
  const slotStart = new Date(slot.start);
  
  // Check minimum advance booking
  const minAdvanceDate = addMinutes(now, settings.minAdvanceBookingHours * 60);
  if (isBefore(slotStart, minAdvanceDate)) {
    return false;
  }
  
  // Check maximum advance booking
  const maxAdvanceDate = addDays(now, settings.maxAdvanceBookingDays);
  if (isAfter(slotStart, maxAdvanceDate)) {
    return false;
  }
  
  // Check if slot conflicts with existing appointments
  const appointments = existingAppointments[specialistId] || [];
  const conflictsWithAppointment = appointments.some(appointment => {
    const apptStart = new Date(appointment.start);
    const apptEnd = new Date(appointment.end);
    return (slotStart < apptEnd && new Date(slot.end) > apptStart);
  });
  
  return !conflictsWithAppointment;
}

// Helper function to get next available slot
export function getNextAvailableSlot(
  specialistId: string,
  clinicId: string,
  serviceOptionId: string,
  settings: BookingSettings
): AvailabilitySlot | null {
  const from = new Date().toISOString();
  const to = addDays(new Date(), 7).toISOString(); // Look ahead 1 week
  
  const slots = generateAvailabilitySlots({
    clinicId,
    specialistId,
    serviceOptionId,
    from,
    to,
    settings,
  });
  
  return slots.length > 0 ? slots[0] : null;
}
