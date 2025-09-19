// Prisma-aligned type definitions for the patient portal store

// Enums (mirrored from Prisma schema)
export type UserRole = 'OWNER' | 'SUPER_ADMIN' | 'CLINIC_ADMIN' | 'SPECIALIST' | 'FRONT_DESK' | 'EQUIPMENT_MANAGER' | 'FACILITY_MANAGER' | 'CLIENT';
export type ServiceType = 'INITIAL' | 'FOLLOW_UP' | 'CONSULTATION';
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type AppointmentType = 'CONSULTATION' | 'FOLLOW_UP' | 'PROCEDURE' | 'EMERGENCY' | 'VIRTUAL' | 'MAINTENANCE' | 'CLEANING' | 'SETUP' | 'INITIAL';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type BookingSource = 'MANUAL' | 'ONLINE' | 'API' | 'IMPORT';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'REFUNDED' | 'CANCELLED';
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CASH' | 'INSURANCE';
// Core entities (aligned with Prisma models)
export interface PatientAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  isActive: boolean;
  isLocked: boolean;
  failedLoginAttempts: number;
  lastLoginAt?: string;
  emailVerified: boolean;
}

export interface Patient {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  address?: Record<string, any>;
  emergencyContact?: Record<string, any>;
  medicalHistory?: Record<string, any>;
  insurance?: Record<string, any>;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  taxId: string;
  ownerId: string;
  avatarUrl?: string;
}

export interface Clinic {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  phone: string;
  timezone: string;
  avatarUrl?: string;
  isDeleted: boolean;
  latitude?: number;
  longitude?: number;
  geocodedAt?: string;
  geocodingAccuracy?: string;
  geocodingProvider?: string;
}

export interface Location {
  id: string;
  clinicId: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  auditMetadata: Record<string, any>;
}

export interface Service {
  id: string;
  clinicId: string;
  name: string;
}

export interface ServiceOption {
  id: string;
  serviceId: string;
  type: ServiceType;
  price: number;
  duration: number;
}

export interface Appointment {
  id: string;
  organizationId: string;
  patientId: string;
  clinicId: string;
  locationId?: string;
  primaryResourceId?: string;
  specialistId?: string;
  serviceId?: string;
  serviceOptionId?: string;
  startTime: string;
  endTime: string;
  title?: string;
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  cancellationReason?: string;
  remindersSent: boolean;
  additionalResources: Record<string, any>;
  bookingSource: BookingSource;
  bookedBy?: string;
  fcMetadata: Record<string, any>;
}

export interface Booking {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: BookingStatus;
  paymentMethod?: PaymentMethod;
  paymentIntentId?: string;
  refundAmount?: number;
  refundReason?: string;
  metadata?: Record<string, any>;
}

// Store-specific types
export interface InsuranceProvider {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface InsurancePlan {
  id: string;
  providerId: string;
  name: string;
  type: 'HMO' | 'PPO' | 'EPO' | 'POS';
  copayByServiceOptionId?: Record<string, number>;
  coinsurancePercent?: number;
  deductibleAnnual?: number;
  deductibleRemaining?: number;
  outOfPocketMaxAnnual?: number;
  networkClinicIds?: string[];
}

export interface CoverageSummary {
  listPrice: number;
  deductibleRemaining: number;
  deductibleApplied: number;
  copay: number;
  coinsurance: number;
  totalDueNow: number;
  inNetwork: boolean;
}

export interface AvailabilitySlot {
  id: string;
  clinicId: string;
  specialistId: string;
  serviceOptionId: string;
  start: string;
  end: string;
  mode: 'in-person' | 'telehealth';
}

export interface SpecialistSummary {
  userId: string;
  clinicIds: string[];
  languages: string[];
  rating?: number;
  serviceOptionIds: string[];
  telehealth: boolean;
  // UI-specific fields
  name: string;
  specialty: string;
  image: string;
  nextAvailable: string;
  experience: string;
  education: string;
}

export interface BookingSettings {
  id: string;
  clinicId: string;
  requireApproval: boolean;
  maxAdvanceBookingDays: number;
  minAdvanceBookingHours: number;
  bufferBetweenAppts: number;
  bookingCutoffTime?: string;
  bookingInterval?: number;
  defaultTreatmentDuration?: number;
  maxAppointmentsPerDay?: number;
  timezone: string;
}

// Search and filter types
export interface ClinicSearchParams {
  zip?: string;
  radiusMiles?: number;
  serviceOptionId?: string;
  inNetworkOnly?: boolean;
}

export interface ClinicResult extends Clinic {
  distanceMiles: number;
  earliestAvailability?: string;
}

export interface AvailabilityParams {
  clinicId: string;
  specialistId: string;
  serviceOptionId: string;
  from: string;
  to: string;
}

// Insurance connection types
export interface InsuranceConnectionInput {
  providerId: string;
  planId: string;
  memberId: string;
  dob: string;
}

export interface ConnectedPlan {
  providerId: string;
  planId: string;
  memberId: string;
  effectiveDate: string;
}

// Booking types
export interface BookingPayload {
  clinicId: string;
  specialistId: string;
  serviceId: string;
  serviceOptionId: string;
  slotId: string;
}
