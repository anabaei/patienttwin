import { create } from 'zustand';
import type {
    AvailabilityParams,
    AvailabilitySlot,
    Clinic,
    ClinicResult,
    ClinicSearchParams,
    Service,
    ServiceOption,
    SpecialistSummary
} from '../types';
import { calculateDistance } from '../utils/geo';

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
  getAvailability: (params: AvailabilityParams) => AvailabilitySlot[];
  clearError: () => void;
}

type DirectoryStore = DirectoryState & DirectoryActions;

// Mock data generators
const generateMockClinics = (): Clinic[] => [
  {
    id: 'clinic-001',
    organizationId: 'org-001',
    name: 'Toronto General Hospital',
    address: '200 Elizabeth St, Toronto, ON M5G 2C4',
    phone: '+1-416-340-3111',
    timezone: 'America/Toronto',
    latitude: 43.6588,
    longitude: -79.3883,
    isDeleted: false,
  },
  {
    id: 'clinic-002',
    organizationId: 'org-001',
    name: 'Sunnybrook Health Sciences Centre',
    address: '2075 Bayview Ave, Toronto, ON M4N 3M5',
    phone: '+1-416-480-6100',
    timezone: 'America/Toronto',
    latitude: 43.7225,
    longitude: -79.3733,
    isDeleted: false,
  },
  {
    id: 'clinic-003',
    organizationId: 'org-002',
    name: 'Ottawa Hospital - Civic Campus',
    address: '1053 Carling Ave, Ottawa, ON K1Y 4E9',
    phone: '+1-613-761-4141',
    timezone: 'America/Toronto',
    latitude: 45.3844,
    longitude: -75.7103,
    isDeleted: false,
  },
  {
    id: 'clinic-004',
    organizationId: 'org-003',
    name: 'Hamilton Health Sciences',
    address: '1200 Main St W, Hamilton, ON L8N 3Z5',
    phone: '+1-905-521-2100',
    timezone: 'America/Toronto',
    latitude: 43.2609,
    longitude: -79.9192,
    isDeleted: false,
  },
  {
    id: 'clinic-005',
    organizationId: 'org-004',
    name: 'London Health Sciences Centre',
    address: '800 Commissioners Rd E, London, ON N6A 5W9',
    phone: '+1-519-685-8500',
    timezone: 'America/Toronto',
    latitude: 42.9849,
    longitude: -81.2453,
    isDeleted: false,
  },
];

const generateMockServices = (): Service[] => [
  {
    id: 'service-001',
    clinicId: 'clinic-001',
    name: 'General Medicine',
  },
  {
    id: 'service-002',
    clinicId: 'clinic-001',
    name: 'Cardiology',
  },
  {
    id: 'service-003',
    clinicId: 'clinic-002',
    name: 'General Medicine',
  },
  {
    id: 'service-004',
    clinicId: 'clinic-002',
    name: 'Dermatology',
  },
  {
    id: 'service-005',
    clinicId: 'clinic-003',
    name: 'General Medicine',
  },
  {
    id: 'service-006',
    clinicId: 'clinic-003',
    name: 'Neurology',
  },
];

const generateMockServiceOptions = (): ServiceOption[] => [
  {
    id: 'service-opt-001',
    serviceId: 'service-001',
    type: 'CONSULTATION',
    price: 150,
    duration: 30,
  },
  {
    id: 'service-opt-002',
    serviceId: 'service-002',
    type: 'CONSULTATION',
    price: 200,
    duration: 45,
  },
  {
    id: 'service-opt-003',
    serviceId: 'service-003',
    type: 'CONSULTATION',
    price: 150,
    duration: 30,
  },
  {
    id: 'service-opt-004',
    serviceId: 'service-004',
    type: 'CONSULTATION',
    price: 180,
    duration: 40,
  },
  {
    id: 'service-opt-005',
    serviceId: 'service-005',
    type: 'CONSULTATION',
    price: 150,
    duration: 30,
  },
  {
    id: 'service-opt-006',
    serviceId: 'service-006',
    type: 'CONSULTATION',
    price: 250,
    duration: 60,
  },
];

const generateMockSpecialists = (): SpecialistSummary[] => [
  {
    userId: 'user-001',
    clinicIds: ['clinic-001', 'clinic-002'],
    languages: ['English', 'French'],
    rating: 4.8,
    serviceOptionIds: ['service-opt-001', 'service-opt-002'],
    telehealth: true,
  },
  {
    userId: 'user-002',
    clinicIds: ['clinic-001'],
    languages: ['English'],
    rating: 4.6,
    serviceOptionIds: ['service-opt-001'],
    telehealth: false,
  },
  {
    userId: 'user-003',
    clinicIds: ['clinic-002', 'clinic-003'],
    languages: ['English', 'Spanish'],
    rating: 4.9,
    serviceOptionIds: ['service-opt-003', 'service-opt-004'],
    telehealth: true,
  },
  {
    userId: 'user-004',
    clinicIds: ['clinic-003'],
    languages: ['English', 'French'],
    rating: 4.7,
    serviceOptionIds: ['service-opt-005', 'service-opt-006'],
    telehealth: true,
  },
];

export const useDirectoryStore = create<DirectoryStore>()((set, get) => ({
  // State
  clinics: generateMockClinics(),
  servicesByClinic: {
    'clinic-001': generateMockServices().filter(s => s.clinicId === 'clinic-001'),
    'clinic-002': generateMockServices().filter(s => s.clinicId === 'clinic-002'),
    'clinic-003': generateMockServices().filter(s => s.clinicId === 'clinic-003'),
    'clinic-004': generateMockServices().filter(s => s.clinicId === 'clinic-004'),
    'clinic-005': generateMockServices().filter(s => s.clinicId === 'clinic-005'),
  },
  serviceOptionsByService: {
    'service-001': generateMockServiceOptions().filter(so => so.serviceId === 'service-001'),
    'service-002': generateMockServiceOptions().filter(so => so.serviceId === 'service-002'),
    'service-003': generateMockServiceOptions().filter(so => so.serviceId === 'service-003'),
    'service-004': generateMockServiceOptions().filter(so => so.serviceId === 'service-004'),
    'service-005': generateMockServiceOptions().filter(so => so.serviceId === 'service-005'),
    'service-006': generateMockServiceOptions().filter(so => so.serviceId === 'service-006'),
  },
  specialists: generateMockSpecialists(),
  availabilitySlots: [],
  isLoading: false,
  error: null,

  // Actions
  searchClinics: (params: ClinicSearchParams): ClinicResult[] => {
    const { clinics } = get();
    let results = clinics.filter(clinic => !clinic.isDeleted);

    // Filter by service if specified
    if (params.serviceOptionId) {
      const { serviceOptionsByService } = get();
      const serviceOption = Object.values(serviceOptionsByService)
        .flat()
        .find(so => so.id === params.serviceOptionId);
      
      if (serviceOption) {
        results = results.filter(clinic => 
          get().servicesByClinic[clinic.id]?.some(service => service.id === serviceOption.serviceId)
        );
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

    return results as ClinicResult[];
  },

  getSpecialistsForClinic: (clinicId: string, serviceOptionId: string): SpecialistSummary[] => {
    const { specialists } = get();
    
    return specialists.filter(specialist => 
      specialist.clinicIds.includes(clinicId) && 
      specialist.serviceOptionIds.includes(serviceOptionId)
    );
  },

  getAvailability: (params: AvailabilityParams): AvailabilitySlot[] => {
    const { availabilitySlots } = get();
    
    // Filter slots by the provided parameters
    return availabilitySlots.filter(slot => 
      slot.clinicId === params.clinicId &&
      slot.specialistId === params.specialistId &&
      slot.serviceOptionId === params.serviceOptionId &&
      slot.start >= params.from &&
      slot.end <= params.to
    );
  },

  clearError: () => {
    set({ error: null });
  },
}));
