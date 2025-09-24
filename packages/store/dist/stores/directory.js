import { create } from 'zustand';
import { mockAvailabilitySlots, mockClinics, mockSpecialists, serviceOptionsByService as mockServiceOptionsByService, servicesByClinic as mockServicesByClinic, } from '../mocks/directory';
import { calculateDistance } from '../utils/geo';
export const useDirectoryStore = create()((set, get) => ({
    // State
    clinics: mockClinics,
    servicesByClinic: mockServicesByClinic,
    serviceOptionsByService: mockServiceOptionsByService,
    specialists: mockSpecialists,
    availabilitySlots: mockAvailabilitySlots,
    isLoading: false,
    error: null,
    fetchDirectory: async () => {
        if (get().isLoading) {
            return;
        }
        set({ isLoading: true, error: null });
        try {
            const response = await fetch('/api/mock-data');
            if (!response.ok) {
                throw new Error('Failed to load directory data');
            }
            const data = await response.json();
            const directory = data?.directory ?? {};
            set({
                clinics: directory.clinics ?? mockClinics,
                servicesByClinic: directory.servicesByClinic ?? mockServicesByClinic,
                serviceOptionsByService: directory.serviceOptionsByService ?? mockServiceOptionsByService,
                specialists: directory.specialists ?? mockSpecialists,
                availabilitySlots: directory.availability ?? mockAvailabilitySlots,
                isLoading: false,
                error: null,
            });
        }
        catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to load directory data',
            });
        }
    },
    // Actions
    searchClinics: (params) => {
        const { clinics } = get();
        let results = clinics.filter(clinic => !clinic.isDeleted);
        // Filter by service if specified
        if (params.serviceOptionId) {
            const { serviceOptionsByService } = get();
            const serviceOption = Object.values(serviceOptionsByService)
                .flat()
                .find(so => so.id === params.serviceOptionId);
            if (serviceOption) {
                results = results.filter(clinic => get().servicesByClinic[clinic.id]?.some(service => service.id === serviceOption.serviceId));
            }
        }
        // Filter by in-network if specified
        if (params.inNetworkOnly) {
            // In a real app, this would check against the user's insurance plan
            // For demo, assume all clinics are in-network
            results = results;
        }
        // Calculate distances if location is provided
        if (params.zip && params.radiusMiles) {
            // Mock coordinates for the search location
            const searchLat = 43.6532; // Toronto coordinates as default
            const searchLng = -79.3832;
            results = results
                .map(clinic => ({
                ...clinic,
                distanceMiles: clinic.latitude && clinic.longitude
                    ? calculateDistance(searchLat, searchLng, clinic.latitude, clinic.longitude)
                    : 0,
            }))
                .filter(clinic => clinic.distanceMiles <= (params.radiusMiles || 50))
                .sort((a, b) => a.distanceMiles - b.distanceMiles);
        }
        return results;
    },
    getSpecialistsForClinic: (clinicId, serviceOptionId) => {
        const { specialists } = get();
        return specialists.filter(specialist => specialist.clinicIds.includes(clinicId) &&
            specialist.serviceOptionIds.includes(serviceOptionId));
    },
    getSpecialistsByClinic: (clinicId) => {
        const { specialists } = get();
        return specialists.filter(specialist => specialist.clinicIds.includes(clinicId));
    },
    getAvailability: (params) => {
        const { availabilitySlots } = get();
        // Filter slots by the provided parameters
        return availabilitySlots.filter(slot => slot.clinicId === params.clinicId &&
            slot.specialistId === params.specialistId &&
            slot.serviceOptionId === params.serviceOptionId &&
            slot.start >= params.from &&
            slot.end <= params.to);
    },
    clearError: () => {
        set({ error: null });
    },
}));
