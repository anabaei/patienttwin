import { mockHealthcareBalances } from './healthcare-balances';
import {
  generateMockAvailabilitySlots,
  generateMockClinics,
  generateMockServiceOptions,
  generateMockServices,
  generateMockSpecialists,
  mockAvailabilitySlots,
  mockClinics,
  mockServiceOptions,
  mockServices,
  mockSpecialists,
  serviceOptionsByService,
  servicesByClinic,
} from './directory';

export { mockHealthcareBalances } from './healthcare-balances';
export {
  generateMockAvailabilitySlots,
  generateMockClinics,
  generateMockServiceOptions,
  generateMockServices,
  generateMockSpecialists,
  mockAvailabilitySlots,
  mockClinics,
  mockServiceOptions,
  mockServices,
  mockSpecialists,
  serviceOptionsByService,
  servicesByClinic,
};

export const mockPatientDataset = {
  balances: mockHealthcareBalances,
  clinics: mockClinics,
  services: mockServices,
  serviceOptions: mockServiceOptions,
  specialists: mockSpecialists,
  availability: mockAvailabilitySlots,
  servicesByClinic,
  serviceOptionsByService,
};
