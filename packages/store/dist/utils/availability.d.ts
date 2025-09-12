import type { AvailabilitySlot, BookingSettings } from '../types';
interface GenerateSlotsParams {
    clinicId: string;
    specialistId: string;
    serviceOptionId: string;
    from: string;
    to: string;
    settings: BookingSettings;
}
export declare function generateAvailabilitySlots(params: GenerateSlotsParams): AvailabilitySlot[];
export declare function isSlotAvailable(slot: AvailabilitySlot, specialistId: string, settings: BookingSettings): boolean;
export declare function getNextAvailableSlot(specialistId: string, clinicId: string, serviceOptionId: string, settings: BookingSettings): AvailabilitySlot | null;
export {};
