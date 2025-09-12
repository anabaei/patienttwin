import type { Meta, StoryObj } from '@storybook/nextjs';
import {
    ClinicCardSkeleton,
    ClinicsSearchSkeleton,
    DashboardAppointmentSkeleton,
    DashboardBalanceSkeleton,
    DashboardNotificationsSkeleton,
    DashboardQuickActionsSkeleton,
    DashboardStatsSkeleton,
    InsuranceCardSkeleton,
    InsuranceConnectionSkeleton,
    InsurancePageSkeleton,
    InsuranceProviderCardSkeleton,
    PageSkeleton
} from '../components/ui/skeletons';

const meta: Meta = {
  title: 'UI/Skeletons',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Loading skeleton components for different page sections and states.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

// Dashboard Skeletons
export const DashboardBalance: StoryObj = {
  name: 'Dashboard Balance Skeleton',
  render: () => <DashboardBalanceSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton for the account balances section on the dashboard.',
      },
    },
  },
};

export const DashboardAppointment: StoryObj = {
  name: 'Dashboard Appointment Skeleton',
  render: () => <DashboardAppointmentSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton for the next appointment section on the dashboard.',
      },
    },
  },
};

export const DashboardStats: StoryObj = {
  name: 'Dashboard Stats Skeleton',
  render: () => <DashboardStatsSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton for the quick stats grid on the dashboard.',
      },
    },
  },
};

export const DashboardNotifications: StoryObj = {
  name: 'Dashboard Notifications Skeleton',
  render: () => <DashboardNotificationsSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton for the notifications section on the dashboard.',
      },
    },
  },
};

export const DashboardQuickActions: StoryObj = {
  name: 'Dashboard Quick Actions Skeleton',
  render: () => <DashboardQuickActionsSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton for the quick actions section on the dashboard.',
      },
    },
  },
};

// Clinics Skeletons
export const ClinicsSearch: StoryObj = {
  name: 'Clinics Search Skeleton',
  render: () => <ClinicsSearchSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton for the search and filter section on the clinics page.',
      },
    },
  },
};

export const ClinicCard: StoryObj = {
  name: 'Clinic Card Skeleton',
  render: () => <ClinicCardSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton for individual clinic cards on the clinics page.',
      },
    },
  },
};

// Insurance Skeletons
export const InsurancePage: StoryObj = {
  name: 'Insurance Page Skeleton',
  render: () => <InsurancePageSkeleton />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Complete skeleton for the insurance management page with header, connected plans, popular providers, and help section.',
      },
    },
  },
};

export const InsuranceCard: StoryObj = {
  name: 'Insurance Card Skeleton',
  render: () => <InsuranceCardSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton for individual insurance plan cards showing policy details.',
      },
    },
  },
};

export const InsuranceProviderCard: StoryObj = {
  name: 'Insurance Provider Card Skeleton',
  render: () => <InsuranceProviderCardSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton for popular insurance provider cards with logo placeholders.',
      },
    },
  },
};

export const InsuranceConnection: StoryObj = {
  name: 'Insurance Connection Skeleton (Legacy)',
  render: () => <InsuranceConnectionSkeleton />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Legacy insurance skeleton - now redirects to the full InsurancePageSkeleton.',
      },
    },
  },
};

// General Skeletons
export const Page: StoryObj = {
  name: 'General Page Skeleton',
  render: () => <PageSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'General skeleton for any page loading state.',
      },
    },
  },
};

// Combined Dashboard Skeleton
export const FullDashboard: StoryObj = {
  name: 'Full Dashboard Skeleton',
  render: () => (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-80 bg-muted animate-pulse rounded" />
      </div>
      <DashboardBalanceSkeleton />
      <DashboardAppointmentSkeleton />
      <DashboardStatsSkeleton />
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardNotificationsSkeleton />
        <DashboardQuickActionsSkeleton />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete dashboard skeleton showing all sections loading.',
      },
    },
  },
};

// Combined Clinics Skeleton
export const FullClinics: StoryObj = {
  name: 'Full Clinics Skeleton',
  render: () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <ClinicsSearchSkeleton />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <ClinicCardSkeleton key={i} />
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete clinics page skeleton showing search and multiple clinic cards loading.',
      },
    },
  },
};
