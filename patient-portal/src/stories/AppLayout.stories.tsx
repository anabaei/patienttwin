import type { Meta, StoryObj } from '@storybook/nextjs';
import { AppLayout } from '../components/layout/app-layout';

const meta: Meta<typeof AppLayout> = {
  title: 'Layout/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main application layout with responsive navigation - sidebar for desktop, bottom nav for mobile.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopLayout: Story = {
  render: () => (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard Content</h1>
        <p className="text-muted-foreground">
          This is the main content area. The sidebar navigation is visible on the left.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">Card 1</div>
          <div className="p-4 border rounded-lg">Card 2</div>
          <div className="p-4 border rounded-lg">Card 3</div>
        </div>
      </div>
    </AppLayout>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    zustand: {
      state: {
        auth: {
          account: {
            id: 'patient-1',
            email: 'demo@twinnlinks.com',
            firstName: 'Demo',
            lastName: 'User',
            dateOfBirth: '1990-05-15',
            emailVerified: true,
          },
        },
      },
    },
  },
};

export const MobileLayout: Story = {
  render: () => (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Mobile Dashboard</h1>
        <p className="text-muted-foreground">
          This is the mobile view with bottom navigation and hamburger menu.
        </p>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">Mobile Card 1</div>
          <div className="p-4 border rounded-lg">Mobile Card 2</div>
          <div className="p-4 border rounded-lg">Mobile Card 3</div>
        </div>
      </div>
    </AppLayout>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    zustand: {
      state: {
        auth: {
          account: {
            id: 'patient-1',
            email: 'demo@twinnlinks.com',
            firstName: 'Demo',
            lastName: 'User',
            dateOfBirth: '1990-05-15',
            emailVerified: true,
          },
        },
      },
    },
  },
};

export const TabletLayout: Story = {
  render: () => (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Tablet Dashboard</h1>
        <p className="text-muted-foreground">
          This is the tablet view with sidebar navigation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">Tablet Card 1</div>
          <div className="p-4 border rounded-lg">Tablet Card 2</div>
        </div>
      </div>
    </AppLayout>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    zustand: {
      state: {
        auth: {
          account: {
            id: 'patient-1',
            email: 'demo@twinnlinks.com',
            firstName: 'Demo',
            lastName: 'User',
            dateOfBirth: '1990-05-15',
            emailVerified: true,
          },
        },
      },
    },
  },
};
