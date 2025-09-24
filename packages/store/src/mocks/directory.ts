import type {
  AvailabilitySlot,
  Clinic,
  Service,
  ServiceOption,
  SpecialistSummary
} from '../types';

export const generateMockClinics = (): Clinic[] => [
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

export const generateMockServices = (): Service[] => [
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

export const generateMockServiceOptions = (): ServiceOption[] => [
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

export const generateMockSpecialists = (): SpecialistSummary[] => [
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


export const generateMockAvailabilitySlots = (): AvailabilitySlot[] => {
  const slots: AvailabilitySlot[] = [];
  const specialists = generateMockSpecialists();
  const serviceOptions = generateMockServiceOptions();
  const services = generateMockServices();

  const timeSlots = [
    '09:00', '09:45', '10:30', '11:15', '13:00', '13:45', '14:30', '15:15'
  ];

  for (let dayOffset = 0; dayOffset < 21; dayOffset++) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + dayOffset);

    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    const dateLabel = date.toISOString().split('T')[0];

    specialists.forEach((specialist, specialistIndex) => {
      specialist.clinicIds.forEach((clinicId) => {
        const clinicServices = services.filter((service) => service.clinicId === clinicId);
        const clinicServiceOptionIds = new Set(
          clinicServices.map((service) => service.id)
        );

        const clinicServiceOptions = serviceOptions.filter((option) =>
          clinicServiceOptionIds.has(option.serviceId)
        );

        clinicServiceOptions.forEach((serviceOption, optionIndex) => {
          timeSlots.forEach((timeSlot, slotIndex) => {
            const includeSlot = (dayOffset + slotIndex + specialistIndex + optionIndex) % 3 === 0;

            if (!includeSlot) {
              return;
            }

            const startTime = new Date(`${dateLabel}T${timeSlot}:00`);
            const endTime = new Date(startTime.getTime() + serviceOption.duration * 60000);

            slots.push({
              id: `slot-${clinicId}-${specialist.userId}-${serviceOption.id}-${dateLabel}-${timeSlot}`,
              clinicId,
              specialistId: specialist.userId,
              serviceOptionId: serviceOption.id,
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              mode: specialist.telehealth ? 'telehealth' : 'in-person',
            });
          });
        });
      });
    });
  }

  return slots;
};

export const mockClinics = generateMockClinics();
export const mockServices = generateMockServices();
export const mockServiceOptions = generateMockServiceOptions();
export const mockSpecialists = generateMockSpecialists();
export const mockAvailabilitySlots = generateMockAvailabilitySlots();

export const servicesByClinic = mockClinics.reduce<Record<string, Service[]>>((acc, clinic) => {
  acc[clinic.id] = mockServices.filter((service) => service.clinicId === clinic.id);
  return acc;
}, {});

export const serviceOptionsByService = mockServiceOptions.reduce<Record<string, ServiceOption[]>>(
  (acc, option) => {
    if (!acc[option.serviceId]) {
      acc[option.serviceId] = [];
    }

    acc[option.serviceId].push(option);
    return acc;
  },
  {}
);
