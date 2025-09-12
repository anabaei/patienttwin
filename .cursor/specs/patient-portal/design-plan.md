# Patient Portal Booking Flow - Design Plan

## Architecture
- App: Next.js 15 (App Router) + React 19
- UI: Tailwind CSS (mobile-first), shadcn/ui (Radix), Framer Motion, next-themes
- Forms: React Hook Form + Zod
- State: Zustand in a separate package `@twinn/store` with slices per domain
- Storybook for isolated UI development
- Mobile-first responsive design with professional healthcare styling
- Package Manager: pnpm for workspace management and efficient dependency resolution
- Directory structure:
  - `app/(public)/sign-in/page.tsx`
  - `app/(protected)/dashboard/page.tsx`
  - `app/(protected)/insurance/page.tsx`
  - `app/(protected)/book/page.tsx` (wizard parent)
    - `app/(protected)/book/service/page.tsx`
    - `app/(protected)/book/specialist/page.tsx`
    - `app/(protected)/book/time/page.tsx`
    - `app/(protected)/book/coverage/page.tsx`
    - `app/(protected)/book/confirm/page.tsx`
  - `app/(protected)/appointments/page.tsx`
  - Shared components under `components/`
- Guards: client-side `RequireAuth` component wraps protected segments

## Data Models (Aligned with Prisma Schema)
```json
{
  "PatientAccount": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "phone": "string",
    "dateOfBirth": "string",
    "isActive": "boolean",
    "isLocked": "boolean",
    "failedLoginAttempts": "number",
    "lastLoginAt": "string?",
    "emailVerified": "boolean"
  },
  "Patient": {
    "id": "string",
    "organizationId": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string?",
    "phone": "string",
    "dateOfBirth": "string",
    "gender": "Gender",
    "address": "Json?",
    "emergencyContact": "Json?",
    "medicalHistory": "Json?",
    "insurance": "Json?",
    "avatarUrl": "string?",
    "isActive": "boolean",
    "emailVerified": "boolean"
  },
  "Organization": {
    "id": "string",
    "name": "string",
    "type": "string",
    "taxId": "string",
    "ownerId": "string",
    "avatarUrl": "string?"
  },
  "Clinic": {
    "id": "string",
    "organizationId": "string",
    "name": "string",
    "address": "string",
    "phone": "string",
    "timezone": "string",
    "avatarUrl": "string?",
    "isDeleted": "boolean",
    "latitude": "number?",
    "longitude": "number?",
    "geocodedAt": "string?",
    "geocodingAccuracy": "string?",
    "geocodingProvider": "string?"
  },
  "Location": {
    "id": "string",
    "clinicId": "string",
    "name": "string",
    "address": "string",
    "phone": "string?",
    "email": "string?"
  },
  "User": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "UserRole",
    "avatarUrl": "string?",
    "auditMetadata": "Json"
  },
  "Service": {
    "id": "string",
    "clinicId": "string",
    "name": "string"
  },
  "ServiceOption": {
    "id": "string",
    "serviceId": "string",
    "type": "ServiceType",
    "price": "number",
    "duration": "number"
  },
  "Appointment": {
    "id": "string",
    "organizationId": "string",
    "patientId": "string",
    "clinicId": "string",
    "locationId": "string?",
    "primaryResourceId": "string?",
    "specialistId": "string?",
    "serviceId": "string?",
    "serviceOptionId": "string?",
    "startTime": "string",
    "endTime": "string",
    "title": "string?",
    "status": "AppointmentStatus",
    "type": "AppointmentType",
    "notes": "string?",
    "cancellationReason": "string?",
    "remindersSent": "boolean",
    "additionalResources": "Json",
    "bookingSource": "BookingSource",
    "bookedBy": "string?",
    "fcMetadata": "Json"
  },
  "Booking": {
    "id": "string",
    "appointmentId": "string",
    "amount": "number",
    "currency": "string",
    "status": "BookingStatus",
    "paymentMethod": "PaymentMethod?",
    "paymentIntentId": "string?",
    "refundAmount": "number?",
    "refundReason": "string?",
    "metadata": "Json?"
  },
  "CoverageSummary": {
    "listPrice": "number",
    "deductibleRemaining": "number",
    "deductibleApplied": "number",
    "copay": "number",
    "coinsurance": "number",
    "totalDueNow": "number",
    "inNetwork": "boolean"
  },
  "AvailabilitySlot": {
    "id": "string",
    "clinicId": "string",
    "specialistId": "string",
    "serviceOptionId": "string",
    "start": "string",
    "end": "string",
    "mode": "in-person | telehealth"
  },
  "SpecialistSummary": {
    "userId": "string",
    "clinicIds": ["string"],
    "languages": ["string"],
    "rating": "number?",
    "serviceOptionIds": ["string"],
    "telehealth": "boolean?"
  },
  "BookingSettings": {
    "id": "string",
    "clinicId": "string",
    "requireApproval": "boolean",
    "maxAdvanceBookingDays": "number",
    "minAdvanceBookingHours": "number",
    "bufferBetweenAppts": "number",
    "bookingCutoffTime": "string?",
    "bookingInterval": "number?",
    "defaultTreatmentDuration": "number?",
    "maxAppointmentsPerDay": "number?",
    "timezone": "string"
  }
}
```

## API Specifications (Store Contracts)
```typescript
// Auth (Patient-facing)
interface PatientAuthStore {
  account: PatientAccount | null;
  signIn(email: string, code: string): Promise<void>; // mock success
  signOut(): void;
}

// Insurance (stored under Patient.insurance JSON)
interface InsuranceProvider { id: string; name: string; logoUrl?: string }
interface InsurancePlan { id: string; providerId: string; name: string; type: 'HMO' | 'PPO' | 'EPO' | 'POS'; copayByServiceOptionId?: Record<string, number>; coinsurancePercent?: number; deductibleAnnual?: number; deductibleRemaining?: number; outOfPocketMaxAnnual?: number; networkClinicIds?: string[] }

interface InsuranceStore {
  providers: InsuranceProvider[]; // store-only
  plans: InsurancePlan[]; // store-only
  connectedPlan: { providerId: string; planId: string; memberId: string; effectiveDate: string } | null;
  connectInsurance(input: { providerId: string; planId: string; memberId: string; dob: string }): Promise<void>;
  getBenefitsForServiceOption(serviceOptionId: string): CoverageSummary;
}

// Directory
interface DirectoryStore {
  clinics: Clinic[];
  servicesByClinic: Record<string, Service[]>;
  serviceOptionsByService: Record<string, ServiceOption[]>;
  specialists: SpecialistSummary[]; // projection of Users with role SPECIALIST
  searchClinics(params: { zip?: string; radiusMiles?: number; serviceOptionId?: string; inNetworkOnly?: boolean }): Array<Clinic & { distanceMiles: number; earliestAvailability?: string }>;
  getSpecialistsForClinic(clinicId: string, serviceOptionId: string): SpecialistSummary[];
  getAvailability(params: { clinicId: string; specialistId: string; serviceOptionId: string; from: string; to: string }): AvailabilitySlot[];
}

// Appointments
interface AppointmentStore {
  appointments: Appointment[];
  book(payload: { clinicId: string; specialistId: string; serviceId: string; serviceOptionId: string; slotId: string }): Promise<Appointment>;
  cancel(appointmentId: string, reason?: string): Promise<void>;
  reschedule(appointmentId: string, newSlotId: string): Promise<Appointment>;
}

// Enums mirrored from Prisma (subset for UI typing)
type UserRole = 'OWNER' | 'SUPER_ADMIN' | 'CLINIC_ADMIN' | 'SPECIALIST' | 'FRONT_DESK' | 'EQUIPMENT_MANAGER' | 'FACILITY_MANAGER' | 'CLIENT';
type ServiceType = 'INITIAL' | 'FOLLOW_UP' | 'CONSULTATION';
type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
type AppointmentType = 'CONSULTATION' | 'FOLLOW_UP' | 'PROCEDURE' | 'EMERGENCY' | 'VIRTUAL' | 'MAINTENANCE' | 'CLEANING' | 'SETUP' | 'INITIAL';
type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
type BookingSource = 'MANUAL' | 'ONLINE' | 'API' | 'IMPORT';
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'REFUNDED' | 'CANCELLED';
type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CASH' | 'INSURANCE';
```

## Geographic Data
- **Region**: Ontario, Canada
- **Sample Cities**: Toronto, Ottawa, Hamilton, London, Kitchener, Windsor, Sudbury, Thunder Bay
- **Coordinate Ranges**: 
  - Latitude: 41.7°N to 56.9°N (Windsor to Hudson Bay)
  - Longitude: 74.4°W to 95.2°W (Ottawa to Manitoba border)
- **Mock Data**: Realistic addresses, postal codes (K, L, M, N, P prefixes), and healthcare facility locations

## UI/UX Components
- Shell/Layout: AppHeader (mobile-optimized), AppSidebar (collapsible), PageContainer (mobile-first)
- Auth: SignInForm (email + code), RequireAuth
- Insurance: InsuranceProviderSelect, InsurancePlanSelect, InsuranceConnectForm, BenefitsSummaryCard
- Directory: ClinicSearchFilters, ClinicCard (mobile cards), SpecialistCard, AvailabilityCalendar (mobile-friendly)
- Booking Wizard: Stepper (mobile stepper), ServiceSelectGrid, SpecialistPicker, SlotPicker, CoverageBreakdownCard, ConfirmationCard
- Appointments: AppointmentList (mobile list), AppointmentCard, AppointmentActions (Reschedule/Cancel)
- Shared: Badge, Button (mobile touch targets), Input, Select, Dialog/Sheet (mobile sheets), Toast/Toaster
- Theme: ThemeToggle, ThemeProvider, CSS variables for light/dark modes

User Flow
1) Sign-In → 2) Connect Insurance → 3) Search Clinics → 4) Choose Specialist → 5) Pick Time → 6) Coverage & Price → 7) Confirm → 8) Manage Appointments

## Testing Strategy
- Component stories for each UI state (empty, loading, success, error) in Storybook
- Mobile responsive testing across breakpoints (320px, 375px, 414px, 768px, 1024px)
- Theme switching testing (light/dark mode transitions)
- Unit tests for:
  - Coverage calculation matrix (copay-first vs deductible-first)
  - In-network filtering and distance sorting
  - Slot conflict resolution on booking/cancel/reschedule
- E2E happy-path: sign in → connect insurance → book appointment → see confirmation
- Mobile E2E testing with touch interactions and viewport changes