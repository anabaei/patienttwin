import type { Meta, StoryObj } from '@storybook/react';
import { DashboardPage } from '../app/(protected)/dashboard/page';

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/Dashboard',
  component: DashboardPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main dashboard page with priority-based layout focusing on account balances and healthcare actions.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default Dashboard',
  parameters: {
    docs: {
      description: {
        story: 'The default dashboard view with account balances prominently displayed at the top, followed by next appointment and quick stats.',
      },
    },
  },
};

export const WithUpcomingAppointment: Story = {
  name: 'With Upcoming Appointment',
  parameters: {
    docs: {
      description: {
        story: 'Dashboard view when user has an upcoming appointment scheduled.',
      },
    },
  },
};

export const NoUpcomingAppointments: Story = {
  name: 'No Upcoming Appointments',
  parameters: {
    docs: {
      description: {
        story: 'Dashboard view when user has no upcoming appointments scheduled.',
      },
    },
  },
};

export const HighBalance: Story = {
  name: 'High Account Balance',
  parameters: {
    docs: {
      description: {
        story: 'Dashboard view with higher account balances to showcase the balance-focused design.',
      },
    },
  },
};

export const LowBalance: Story = {
  name: 'Low Account Balance',
  parameters: {
    docs: {
      description: {
        story: 'Dashboard view with lower account balances.',
      },
    },
  },
};

export const Mobile: Story = {
  name: 'Mobile View',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Dashboard optimized for mobile viewing with responsive layout.',
      },
    },
  },
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Dashboard in dark mode with proper theme colors.',
      },
    },
  },
};
