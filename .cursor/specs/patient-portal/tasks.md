# Patient Portal Booking Flow - Implementation Tasks

## Setup (20%)
- [x] **[SET-001]** Initialize Next.js 15 app with TS, Tailwind, shadcn/ui, Framer Motion, Storybook
  - [x] Ontario dataset scaffold (addresses, lat/lng, postal codes)
  - [x] Mobile-first Tailwind config with healthcare color palette
  - [x] Theme switching setup (next-themes, light/dark modes)
  - [x] Professional button styles and mobile touch targets (44px min)
  - **Estimate**: M
  - **Dependencies**: None
  - **Acceptance**: App runs, Tailwind configured, shadcn installed, Storybook starts, theme switching works
- [x] **[SET-002]** Create `packages/store` workspace and wiring
  - **Estimate**: S
  - **Dependencies**: SET-001
  - **Acceptance**: Store package builds and can be imported from app

## Store (40%)
- [x] **[ST-001]** Define domain types and interfaces (User, Insurance, Directory, Appointment)
  - **Estimate**: S
  - **Dependencies**: SET-002
  - **Acceptance**: Types exported; used in app
- [x] **[ST-002]** Implement Auth slice (mock sign-in/out with persistence)
  - **Estimate**: S
  - **Dependencies**: ST-001
  - **Acceptance**: User session persists and clears
- [x] **[ST-003]** Implement Insurance slice (providers/plans/mock connection)
  - **Estimate**: M
  - **Dependencies**: ST-001
  - **Acceptance**: Plan selection and benefits summary works
- [x] **[ST-004]** Implement Directory slice (clinics, specialists, services, serviceOptions, search)
  - **Estimate**: M
  - **Dependencies**: ST-001
  - **Acceptance**: Search by location/service/in-network
- [x] **[ST-005]** Implement Availability and slot generation utilities
  - **Estimate**: M
  - **Dependencies**: ST-004
  - **Acceptance**: 2-week window slots available per specialist+clinic+serviceOption
- [x] **[ST-006]** Implement Appointments slice (book/cancel/reschedule) with coverage calculation
  - **Estimate**: M
  - **Dependencies**: ST-003, ST-005
  - **Acceptance**: Booking updates `Appointment` (Prisma-aligned fields) and pricing breakdown correct; create `Booking` record in store
- [ ] **[ST-007]** Add unit tests for coverage, search, and slot conflicts (Vitest)
  - **Estimate**: S
  - **Dependencies**: ST-003, ST-004, ST-006
  - **Acceptance**: Tests pass

## App UI (30%)
- [x] **[UI-001]** Auth pages/components (SignInForm, RequireAuth)
  - **Estimate**: S
  - **Dependencies**: ST-002
  - **Acceptance**: Can sign in/out; protected routes enforced
- [x] **[UI-002]** Insurance connection page (provider/plan selection, benefits summary)
  - **Estimate**: M
  - **Dependencies**: ST-003
  - **Acceptance**: Connect plan and display coverage
- [x] **[UI-003]** Responsive navigation layout (sidebar for desktop, bottom nav for mobile)
  - **Estimate**: M
  - **Dependencies**: ST-002
  - **Acceptance**: Navigation adapts to screen size, active states work, mobile menu functions
- [x] **[UI-003.5]** Dashboard page with priority-based layout (balances first, appointments, notifications)
  - **Estimate**: M
  - **Dependencies**: ST-002, ST-003, ST-006
  - **Acceptance**: Account balances prominently displayed, next appointment shown, mock data integrated, mobile-responsive
- [x] **[UI-004]** Clinic search page (filters, results, sorting)
  - **Estimate**: M
  - **Dependencies**: ST-004
  - **Acceptance**: Filtered list with badges and distance, mobile-first design, animations, Ontario data integration
- [ ] **[UI-005]** Specialist selection and availability calendar
  - **Estimate**: M
  - **Dependencies**: ST-005
  - **Acceptance**: Select specialist and slot (keyed by clinicId + specialistId + serviceOptionId)
- [ ] **[UI-006]** Booking wizard steps and stepper
  - **Estimate**: M
  - **Dependencies**: UI-002, UI-003, UI-004, ST-006
  - **Acceptance**: Complete flow to confirmation (Appointment created with serviceId + serviceOptionId, Coverage shown)
- [ ] **[UI-007]** Appointments list with reschedule/cancel dialogs
  - **Estimate**: M
  - **Dependencies**: ST-006
  - **Acceptance**: Manage appointments

## Storybook (5%)
- [ ] **[SB-001]** Stories for core components (forms, cards, list items)
  - **Estimate**: S
  - **Dependencies**: UI components
  - **Acceptance**: Stories render with controls, mobile responsive views, theme switching
- [ ] **[SB-002]** Ontario dataset showcase stories (clinics map/list, availability variations)
  - **Estimate**: S
  - **Dependencies**: ST-004, ST-005
  - **Acceptance**: Stories display realistic Ontario locations and slots

## E2E (5%)
- [ ] **[E2E-001]** Happy-path flow test (Playwright/Cypress)
  - **Estimate**: S
  - **Dependencies**: UI-005, UI-006
  - **Acceptance**: Test passes CI

## Status
- Requirements: in-progress
- Design: in-progress
- Tasks: draft
