import type { AvailabilityParams, AvailabilitySlot, Clinic, ClinicResult, ClinicSearchParams, Service, ServiceOption, SpecialistSummary } from '../types';
interface DirectoryState {
    clinics: Clinic[];
    servicesByClinic: Record<string, Service[]>;
    serviceOptionsByService: Record<string, ServiceOption[]>;
    specialists: SpecialistSummary[];
    availabilitySlots: AvailabilitySlot[];
    isLoading: boolean;
    error: string | null;
}
interface DirectoryActions {
    searchClinics: (params: ClinicSearchParams) => ClinicResult[];
    getSpecialistsForClinic: (clinicId: string, serviceOptionId: string) => SpecialistSummary[];
    getSpecialistsByClinic: (clinicId: string) => SpecialistSummary[];
    getAvailability: (params: AvailabilityParams) => AvailabilitySlot[];
    clearError: () => void;
    fetchDirectory: () => Promise<void>;
}
type DirectoryStore = DirectoryState & DirectoryActions;
export declare const useDirectoryStore: import("zustand").UseBoundStore<import("zustand").StoreApi<DirectoryStore>>;
export {};
