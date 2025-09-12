# Patient Portal Booking Flow - Requirements

## Metadata
- **Status**: Draft
- **Version**: 1.0
- **Last Updated**: 2025-09-12

## Problem Analysis
### Current State Assessment
- **Problem Description**: We need to design a complete end-to-end patient self-service booking flow in a Next.js app without a backend, using realistic mock data aligned to our Prisma backend schema. The flow includes: sign in, connect insurance provider and plan, find clinics, choose specialists, and book an appointment using insurance coverage.
- **Business Context**: TwinnLinks targets healthcare organizations and patients with a modern booking experience. The patient portal is a critical user-facing product that demonstrates the platform’s value and will evolve to connect to real backend services later.
- **User Pain Points**:
  - Fragmented insurance flows and uncertainty about coverage/costs.
  - Difficulty finding in-network clinics and available specialists.
  - Confusing multi-step booking experiences with poor feedback.
  - Lack of portability across clinics/locations/specialties.
- **Success Metrics**:
  - Time-to-complete booking < 3 minutes for happy-path.
  - Task success rate > 90% for first-time users (usability tests).
  - < 2 back-and-forth steps on average between selection pages.
  - Storybook coverage for all critical components; store unit tests passing.
  - Mobile-first responsive design with professional healthcare UI standards.
  - Theme switching (light/dark) with consistent brand colors and accessibility.

### Existing Code Review
- The current repository has no implemented code yet. We will establish patterns consistent with the stated architecture and Prisma schema alignment:
  - Next.js 15 (App Router) + React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Storybook, Zustand for client state.
  - Data will be sourced from a dedicated store package with realistic mock domain data whose shapes mirror Prisma entities (e.g., `PatientAccount`, `Patient`, `Clinic`, `Service`, `ServiceOption`, `Appointment`).
  - We will align with common Next.js conventions: server components for static shells, client components for interactive flows, and colocation of UI with routes under `app/`.
  - Security: For now, a mock sign-in (email code or passwordless) with local-only state. Real JWT/refresh token patterns will be documented but not implemented.
  - Testing: Storybook component states, unit tests for the store logic, optional Playwright e2e for the happy-path.

## Approach Analysis & Recommendations
### Alternative Approaches
#### Approach 1: Store-Centric Mock Domain Layer (separate package) with Zustand
- **Pros**:
  - Clear separation of concerns via `@twinn/store` package; UI imports typed selectors and actions.
  - Deterministic, fast, and fully offline development; no network layer needed.
  - Easy to replace with real API later by swapping implementation while preserving UI contracts.
- **Cons**:
  - Does not simulate network latency/errors; less realistic than a request/response model.
  - Risk of overfitting UI to store shapes if not careful to mirror future API contracts.
- **Technical Feasibility**: High. Straightforward to implement with Zustand slices, derived selectors, and mock data factories.
- **Implementation Complexity**: Low/Medium.
- **Risk Assessment**: Low. Primary risk is drift from future backend contracts; mitigated by typed interfaces and keeping store API close to expected endpoints.

#### Approach 2: Mock Service Layer using MSW + React Query
- **Pros**:
  - High realism: request/response patterns, latency, error cases, caching.
  - Easy to evolve to real backend by swapping MSW handlers with actual endpoints.
- **Cons**:
  - More setup complexity (MSW, handlers, React Query config) and test surface.
  - Heavier runtime and mental model for an initial no-backend iteration.
- **Technical Feasibility**: High.
- **Implementation Complexity**: Medium/High.
- **Risk Assessment**: Medium. Added moving parts without current need.

#### Approach 3: Static JSON Hydration into Local State
- **Pros**:
  - Simplest possible; low setup overhead.
  - Easy to visualize and tweak mock data.
- **Cons**:
  - Limited dynamic behavior; hard to model scheduling rules and coverage.
  - Poor alignment with future real-time availability features.
- **Technical Feasibility**: High.
- **Implementation Complexity**: Low.
- **Risk Assessment**: Medium. Likely rework when introducing dynamic behavior.

### Scheduling and Availability Modeling Approaches
#### A: Precomputed Availability Slots per Specialist+Clinic+ServiceOption
- **Pros**: Simple, fast, deterministic. Easy to filter by insurance and service option.
- **Cons**: Less flexible for rule changes and exceptions.
- **Feasibility**: High. Works well for mocks and UX development.

#### B: Template-based Generation (ScheduleTemplate → computed slots)
- **Pros**: Closer to real engine; supports rules like buffers and breaks.
- **Cons**: More logic to implement and test.
- **Feasibility**: High, but more effort.

#### C: On-demand Algorithmic Generation per Search Query
- **Pros**: Most realistic; scalable patterns.
- **Cons**: Overkill for this stage.
- **Feasibility**: Medium.

### Recommended Approach
- **Chosen Approach**: Approach 1 (Store-centric mock domain layer) + Scheduling Approach A initially, with a thin utility to generate slot matrices from simple templates for realism.
- **Primary Rationale**: Fast to implement, supports all required flows offline, and sets clean boundaries to swap in real APIs later.
- **Alignment with Codebase**: Mirrors planned layered architecture (domain store separate from UI). UI consumes typed interfaces similar to future endpoints and aligned with Prisma models.
- **Risk Mitigation**: Define interfaces and DTOs to match expected API shapes; include failure modes in the store (e.g., simulated conflicts) and a toggleable latency simulator for testing.
- **Alternatives Considered**: MSW-backed service layer and static JSON hydration; deferred to future milestones to reduce initial complexity.

## User Stories
- **UR-001**: As a patient, I want to sign in so that I can access my appointments and insurance. [Priority: High] [Estimate: S]
  - **Approach Alignment**: Mock sign-in stored in Zustand; session persisted in localStorage using `PatientAccount` shape.
- **UR-002**: As a patient, I want to connect my insurance provider and plan so that I see accurate coverage and costs. [Priority: High] [Estimate: M]
  - **Approach Alignment**: Store maintains providers, plans, and coverage rules; UI forms validate with Zod. Patient insurance is persisted in `Patient.insurance` JSON shape.
- **UR-003**: As a patient, I want to search clinics by location, specialty, and insurance acceptance so that I find suitable care. [Priority: High] [Estimate: M]
  - **Approach Alignment**: Store selectors filter `Clinic` and `User` (role SPECIALIST) by distance, `Service`/`ServiceOption`, and in-network status.
- **UR-004**: As a patient, I want to choose a specialist with available times so that I can schedule quickly. [Priority: High] [Estimate: M]
  - **Approach Alignment**: Store exposes availability slots keyed by `clinicId + specialistId + serviceOptionId`.
- **UR-005**: As a patient, I want to book an appointment using my insurance so that I understand my out-of-pocket cost. [Priority: High] [Estimate: M]
  - **Approach Alignment**: Store calculates coverage and constructs an `Appointment` aligned to Prisma fields (including `serviceId` and `serviceOptionId`).
- **UR-006**: As a patient, I want to view, reschedule, or cancel appointments. [Priority: Medium] [Estimate: M]
  - **Approach Alignment**: Store updates `Appointment.status` and frees underlying `AvailabilitySlot`.
- **UR-007**: As a patient, I want notifications and reminders (mock) so that I feel confident in the booking. [Priority: Low] [Estimate: S]
  - **Approach Alignment**: Simulated notifications in UI; no external delivery.

## Functional Requirements
1. Authentication (Mock)
   - **Acceptance Criteria**:
     - [ ] AC1: Email-based mock sign-in; validation via code entry or simple passwordless.
     - [ ] AC2: Persisted session in localStorage; sign-out clears state.
   - **Implementation Notes**: Client-only; gate protected routes using a `RequireAuth` wrapper. Uses `PatientAccount` shape.

2. Insurance Connection
   - **Acceptance Criteria**:
     - [ ] AC1: Select provider from list; select plan; capture member ID and DOB.
     - [ ] AC2: Show benefits summary (copay, deductible, coinsurance) for selected `ServiceOption`.
     - [ ] AC3: Indicate in-network clinics based on plan `networkClinicIds`.
   - **Implementation Notes**: Store has `InsuranceProvider`, `InsurancePlan` (store-only projections). Patient insurance saved as JSON under `Patient.insurance`-like shape.

3. Clinic Search & Discovery
   - **Acceptance Criteria**:
     - [ ] AC1: Filter by location (zip/radius), `Service`/`ServiceOption`, and in-network status.
     - [ ] AC2: Show clinics with badges for services, facilities, and insurance acceptance.
     - [ ] AC3: Sort by distance and earliest availability.
   - **Implementation Notes**: Geodistance on `Clinic.latitude/longitude`.

4. Specialist Selection & Availability
   - **Acceptance Criteria**:
     - [ ] AC1: Display specialist (Users with `role = SPECIALIST`) profiles with languages, ratings, services.
     - [ ] AC2: Show availability slots for chosen `clinicId + serviceOptionId` within a 2-week window.
     - [ ] AC3: Indicate telehealth vs in-person and slot duration.
   - **Implementation Notes**: Slots are precomputed against `ServiceOption.duration`.

5. Booking & Pricing with Insurance
   - **Acceptance Criteria**:
     - [ ] AC1: Booking wizard steps: Service → Specialist → Time → Coverage & Price → Confirmation.
     - [ ] AC2: Coverage calculation shows list price, deductible remaining impact, copay/coinsurance, and total due now.
     - [ ] AC3: Confirmation uses `Appointment` with `serviceId`, `serviceOptionId`, `specialistId`, `clinicId`, `startTime`, `endTime`.
   - **Implementation Notes**: Deterministic coverage computation; handle deductible-first vs copay-first plans.

6. Appointment Management
   - **Acceptance Criteria**:
     - [ ] AC1: View upcoming and past appointments.
     - [ ] AC2: Reschedule by selecting a new slot; prior slot becomes free.
     - [ ] AC3: Cancel with reason; `Appointment.status` updated and slot freed.
   - **Implementation Notes**: Store updates and emits events for UI to refresh.

## Non-Functional Requirements
- **Performance**: Initial page load LCP < 2.5s; interactions < 100ms for local actions.
- **Security**: No PHI persistence beyond session for this iteration; mock-only.
- **Accessibility**: WCAG 2.1 AA; keyboard navigability; ARIA for interactive components (shadcn/ui + Radix help); mobile touch targets minimum 44px; high contrast mode support.
- **Scalability**: Data shapes and interfaces mirror Prisma models; store designed to be replaceable by API layer.

## Dependencies & Constraints
- Dependencies: Next.js 15, React 19, Tailwind, shadcn/ui, Framer Motion, React Hook Form, Zod, Zustand, Storybook.
- Constraints: No backend; all data must be deterministic and realistic. Geographic data will use Ontario, Canada (Toronto, Ottawa, Hamilton, London, Kitchener, Windsor, Sudbury, Thunder Bay) with realistic postal codes and coordinates.

## Implementation Considerations
### Codebase Integration
- **Existing Patterns**: Establish App Router pages under `app/` with nested layouts.
- **Required Changes**: Create `packages/store` with Zustand slices and mock data aligned to Prisma shapes. Set up Tailwind, shadcn/ui, Framer Motion, Storybook.
- **New Dependencies**: `zustand`, `zod`, `react-hook-form`, `framer-motion`, `classnames`, `date-fns`, `@radix-ui/react-*`, `storybook`, `next-themes`, `tailwindcss-animate`, `lucide-react` stack.
- **Migration Path**: Later, replace `@twinn/store` with `@twinn/api`/React Query backed by Prisma models and services.

### Testing Strategy
- **Unit Tests**: Store logic (coverage calculation, slot conflict resolution, filtering selectors) via Vitest.
- **Integration Tests**: Booking wizard happy-path with Playwright or Cypress.
- **Performance Tests**: Lighthouse on key routes; Storybook performance checks.

## Decision Documentation
- [2025-09-12] Decision: Align mock store models with Prisma schema and use precomputed availability.
  - **Context**: No backend for this stage; need realistic UX quickly and future compatibility.
  - **Options Considered**: MSW+React Query; static JSON.
  - **Chosen Option**: Zustand store + mock generators aligned to Prisma entities.
  - **Evidence**: Smooth migration path to backend, reduces refactor risk.
  - **Impact**: Clean boundary for swapping to real services later.
