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
  getSpecialistsByClinic: (clinicId: string) => SpecialistSummary[];
  getAvailability: (params: AvailabilityParams) => AvailabilitySlot[];
  clearError: () => void;
}

type DirectoryStore = DirectoryState & DirectoryActions;

// Mock data generators - Paramedical focused clinics
const generateMockClinics = (): Clinic[] => [
  {
    id: 'clinic-001',
    organizationId: 'org-001',
    name: 'Toronto Wellness Center',
    address: '200 Elizabeth St, Toronto, ON M5G 2C4',
    phone: '+1-416-340-3111',
    timezone: 'America/Toronto',
    latitude: 43.6588,
    longitude: -79.3883,
    avatarUrl: 'https://images.unsplash.com/photo-1631507623112-0092cef9c70d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isDeleted: false,
  },
  {
    id: 'clinic-002',
    organizationId: 'org-001',
    name: 'Sunnybrook Paramedical Services',
    address: '2075 Bayview Ave, Toronto, ON M4N 3M5',
    phone: '+1-416-480-6100',
    timezone: 'America/Toronto',
    latitude: 43.7225,
    longitude: -79.3733,
    avatarUrl: 'https://images.unsplash.com/photo-1642844613096-7b743b7d9915?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    avatarUrl: 'https://images.unsplash.com/photo-1669930605340-801a0be1f5a3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    avatarUrl: 'https://plus.unsplash.com/premium_photo-1753267731393-dd5785991e5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isDeleted: false,
  },
];

const generateMockServices = (): Service[] => [
  {
    id: 'service-001',
    clinicId: 'clinic-001',
    name: 'Massage Therapy',
  },
  {
    id: 'service-002',
    clinicId: 'clinic-001',
    name: 'Chiropractic Care',
  },
  {
    id: 'service-003',
    clinicId: 'clinic-001',
    name: 'Physiotherapy',
  },
  {
    id: 'service-004',
    clinicId: 'clinic-002',
    name: 'Psychology & Social Work',
  },
  {
    id: 'service-005',
    clinicId: 'clinic-002',
    name: 'Acupuncture',
  },
  {
    id: 'service-006',
    clinicId: 'clinic-002',
    name: 'Dietician Services',
  },
  {
    id: 'service-007',
    clinicId: 'clinic-003',
    name: 'Audiologist Services',
  },
  {
    id: 'service-008',
    clinicId: 'clinic-003',
    name: 'Occupational Therapy',
  },
  {
    id: 'service-009',
    clinicId: 'clinic-004',
    name: 'Osteopathy',
  },
  {
    id: 'service-010',
    clinicId: 'clinic-004',
    name: 'Podiatry',
  },
  {
    id: 'service-011',
    clinicId: 'clinic-005',
    name: 'Speech Therapy',
  },
  {
    id: 'service-012',
    clinicId: 'clinic-005',
    name: 'Naturopathy',
  },
];

const generateMockServiceOptions = (): ServiceOption[] => [
  {
    id: 'service-opt-001',
    serviceId: 'service-001',
    type: 'CONSULTATION',
    price: 100,
    duration: 60,
  },
  {
    id: 'service-opt-002',
    serviceId: 'service-002',
    type: 'CONSULTATION',
    price: 80,
    duration: 45,
  },
  {
    id: 'service-opt-003',
    serviceId: 'service-003',
    type: 'CONSULTATION',
    price: 90,
    duration: 60,
  },
  {
    id: 'service-opt-004',
    serviceId: 'service-004',
    type: 'CONSULTATION',
    price: 150,
    duration: 50,
  },
  {
    id: 'service-opt-005',
    serviceId: 'service-005',
    type: 'CONSULTATION',
    price: 100,
    duration: 60,
  },
  {
    id: 'service-opt-006',
    serviceId: 'service-006',
    type: 'CONSULTATION',
    price: 80,
    duration: 45,
  },
  {
    id: 'service-opt-007',
    serviceId: 'service-007',
    type: 'CONSULTATION',
    price: 120,
    duration: 60,
  },
  {
    id: 'service-opt-008',
    serviceId: 'service-008',
    type: 'CONSULTATION',
    price: 100,
    duration: 60,
  },
  {
    id: 'service-opt-009',
    serviceId: 'service-009',
    type: 'CONSULTATION',
    price: 110,
    duration: 60,
  },
  {
    id: 'service-opt-010',
    serviceId: 'service-010',
    type: 'CONSULTATION',
    price: 95,
    duration: 45,
  },
  {
    id: 'service-opt-011',
    serviceId: 'service-011',
    type: 'CONSULTATION',
    price: 85,
    duration: 45,
  },
  {
    id: 'service-opt-012',
    serviceId: 'service-012',
    type: 'CONSULTATION',
    price: 90,
    duration: 60,
  },
];

const generateMockSpecialists = (): SpecialistSummary[] => [
  // Clinic-001 specialists
  {
    userId: 'user-001',
    clinicIds: ['clinic-001'],
    languages: ['English', 'Mandarin'],
    rating: 4.8,
    serviceOptionIds: ['service-opt-001'],
    telehealth: false,
    name: 'Dr. Sarah Chen',
    specialty: 'Massage Therapy',
    image: 'https://i.pravatar.cc/100?img=1',
    nextAvailable: 'Tomorrow, 2:00 PM',
    experience: '8 years',
    education: 'RMT, Canadian College of Massage Therapy',
  },
  {
    userId: 'user-002',
    clinicIds: ['clinic-001'],
    languages: ['English', 'Spanish'],
    rating: 4.7,
    serviceOptionIds: ['service-opt-002'],
    telehealth: true,
    name: 'Dr. Michael Rodriguez',
    specialty: 'Chiropractic Care',
    image: 'https://i.pravatar.cc/100?img=2',
    nextAvailable: 'Today, 4:30 PM',
    experience: '12 years',
    education: 'DC, Canadian Memorial Chiropractic College',
  },
  {
    userId: 'user-003',
    clinicIds: ['clinic-001'],
    languages: ['English', 'Korean'],
    rating: 4.9,
    serviceOptionIds: ['service-opt-003'],
    telehealth: true,
    name: 'Dr. Jennifer Lee',
    specialty: 'Physiotherapy',
    image: 'https://i.pravatar.cc/100?img=3',
    nextAvailable: 'Monday, 10:00 AM',
    experience: '6 years',
    education: 'MScPT, University of Toronto',
  },
  // Clinic-002 specialists
  {
    userId: 'user-004',
    clinicIds: ['clinic-002'],
    languages: ['English', 'French'],
    rating: 4.6,
    serviceOptionIds: ['service-opt-004'],
    telehealth: true,
    name: 'Dr. Robert Kim',
    specialty: 'Psychology & Social Work',
    image: 'https://i.pravatar.cc/100?img=4',
    nextAvailable: 'Wednesday, 11:00 AM',
    experience: '10 years',
    education: 'PhD, University of Ottawa',
  },
  {
    userId: 'user-005',
    clinicIds: ['clinic-002'],
    languages: ['English'],
    rating: 4.8,
    serviceOptionIds: ['service-opt-005'],
    telehealth: false,
    name: 'Dr. Emily Watson',
    specialty: 'Acupuncture',
    image: 'https://i.pravatar.cc/100?img=5',
    nextAvailable: 'Friday, 3:00 PM',
    experience: '7 years',
    education: 'R.Ac, Canadian College of Acupuncture',
  },
  // Clinic-003 specialists
  {
    userId: 'user-006',
    clinicIds: ['clinic-003'],
    languages: ['English', 'French'],
    rating: 4.5,
    serviceOptionIds: ['service-opt-006'],
    telehealth: true,
    name: 'Dr. David Wilson',
    specialty: 'Dietician Services',
    image: 'https://i.pravatar.cc/100?img=6',
    nextAvailable: 'Thursday, 1:30 PM',
    experience: '9 years',
    education: 'RD, University of Guelph',
  },
  {
    userId: 'user-007',
    clinicIds: ['clinic-003'],
    languages: ['English', 'Mandarin'],
    rating: 4.7,
    serviceOptionIds: ['service-opt-007'],
    telehealth: false,
    name: 'Dr. Lisa Chen',
    specialty: 'Audiologist Services',
    image: 'https://i.pravatar.cc/100?img=7',
    nextAvailable: 'Next week, Tuesday',
    experience: '11 years',
    education: 'AuD, University of Western Ontario',
  },
  // Clinic-004 specialists
  {
    userId: 'user-008',
    clinicIds: ['clinic-004'],
    languages: ['English', 'Spanish'],
    rating: 4.8,
    serviceOptionIds: ['service-opt-008'],
    telehealth: true,
    name: 'Dr. Maria Garcia',
    specialty: 'Occupational Therapy',
    image: 'https://i.pravatar.cc/100?img=8',
    nextAvailable: 'Today, 5:00 PM',
    experience: '9 years',
    education: 'MOT, University of Western Ontario',
  },
  {
    userId: 'user-009',
    clinicIds: ['clinic-004'],
    languages: ['English'],
    rating: 4.6,
    serviceOptionIds: ['service-opt-009'],
    telehealth: false,
    name: 'Dr. James Thompson',
    specialty: 'Osteopathy',
    image: 'https://i.pravatar.cc/100?img=9',
    nextAvailable: 'Tomorrow, 10:00 AM',
    experience: '11 years',
    education: 'DO, Canadian College of Osteopathy',
  },
  // Clinic-005 specialists
  {
    userId: 'user-010',
    clinicIds: ['clinic-005'],
    languages: ['English', 'French'],
    rating: 4.4,
    serviceOptionIds: ['service-opt-010'],
    telehealth: false,
    name: 'Dr. Patricia Brown',
    specialty: 'Podiatry',
    image: 'https://i.pravatar.cc/100?img=10',
    nextAvailable: 'Wednesday, 2:00 PM',
    experience: '16 years',
    education: 'DPM, University of Toronto',
  },
  {
    userId: 'user-011',
    clinicIds: ['clinic-005'],
    languages: ['English', 'Korean'],
    rating: 4.9,
    serviceOptionIds: ['service-opt-011'],
    telehealth: true,
    name: 'Dr. Kevin Lee',
    specialty: 'Speech Therapy',
    image: 'https://i.pravatar.cc/100?img=11',
    nextAvailable: 'Friday, 11:00 AM',
    experience: '7 years',
    education: 'MSc SLP, University of Toronto',
  },
  {
    userId: 'user-012',
    clinicIds: ['clinic-005'],
    languages: ['English'],
    rating: 4.7,
    serviceOptionIds: ['service-opt-012'],
    telehealth: true,
    name: 'Dr. Amanda Johnson',
    specialty: 'Naturopathy',
    image: 'https://i.pravatar.cc/100?img=12',
    nextAvailable: 'Monday, 9:00 AM',
    experience: '5 years',
    education: 'ND, Canadian College of Naturopathic Medicine',
  },
];

const generateMockAvailabilitySlots = (): AvailabilitySlot[] => {
  const slots: AvailabilitySlot[] = [];
  const specialists = generateMockSpecialists();
  const serviceOptions = generateMockServiceOptions();
  
  // Generate availability for the next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Skip weekends for most specialists
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Generate slots for each specialist
    specialists.forEach(specialist => {
      specialist.clinicIds.forEach(clinicId => {
        // Get all service options for this clinic (not just specialist-specific ones)
        const clinicServices = generateMockServices().filter(s => s.clinicId === clinicId);
        const clinicServiceOptions = serviceOptions.filter(so => 
          clinicServices.some(service => service.id === so.serviceId)
        );
        
        clinicServiceOptions.forEach(serviceOption => {
          // Generate time slots (9 AM to 5 PM, every 30 minutes)
          const timeSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30'
          ];
          
          timeSlots.forEach(time => {
            // Randomly make some slots unavailable (20% chance)
            const isAvailable = Math.random() > 0.2;
            
            if (isAvailable) {
              const startTime = new Date(`${dateStr}T${time}:00`);
              const endTime = new Date(startTime.getTime() + serviceOption.duration * 60000);
              
              slots.push({
                id: `slot-${clinicId}-${specialist.userId}-${serviceOption.id}-${dateStr}-${time}`,
                clinicId,
                specialistId: specialist.userId,
                serviceOptionId: serviceOption.id,
                start: startTime.toISOString(),
                end: endTime.toISOString(),
                mode: 'in-person' as const,
              });
            }
          });
        });
      });
    });
  }
  
  return slots;
};

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
    'service-007': generateMockServiceOptions().filter(so => so.serviceId === 'service-007'),
    'service-008': generateMockServiceOptions().filter(so => so.serviceId === 'service-008'),
    'service-009': generateMockServiceOptions().filter(so => so.serviceId === 'service-009'),
    'service-010': generateMockServiceOptions().filter(so => so.serviceId === 'service-010'),
    'service-011': generateMockServiceOptions().filter(so => so.serviceId === 'service-011'),
    'service-012': generateMockServiceOptions().filter(so => so.serviceId === 'service-012'),
  },
  specialists: generateMockSpecialists(),
  availabilitySlots: generateMockAvailabilitySlots(),
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

  getSpecialistsByClinic: (clinicId: string): SpecialistSummary[] => {
    const { specialists } = get();
    
    return specialists.filter(specialist => 
      specialist.clinicIds.includes(clinicId)
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
