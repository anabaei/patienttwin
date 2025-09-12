import type { Meta, StoryObj } from '@storybook/react';
import { BottomNavigation } from '../components/layout/bottom-navigation';

const meta: Meta<typeof BottomNavigation> = {
  title: 'Layout/BottomNavigation',
  component: BottomNavigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The mobile bottom navigation with 4 main navigation items and active state indicators.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-screen bg-background">
      <div className="h-full pb-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Mobile Content</h1>
        <p className="text-muted-foreground mb-4">
          This is the main content area. The bottom navigation is fixed at the bottom.
        </p>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">Content Card 1</div>
          <div className="p-4 border rounded-lg">Content Card 2</div>
          <div className="p-4 border rounded-lg">Content Card 3</div>
          <div className="p-4 border rounded-lg">Content Card 4</div>
          <div className="p-4 border rounded-lg">Content Card 5</div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const ActiveDashboard: Story = {
  render: () => (
    <div className="h-screen bg-background">
      <div className="h-full pb-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard Active</h1>
        <p className="text-muted-foreground">
          The Dashboard tab is highlighted as active.
        </p>
      </div>
      <BottomNavigation />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      router: {
        pathname: '/dashboard',
      },
    },
  },
};

export const ActiveClinics: Story = {
  render: () => (
    <div className="h-screen bg-background">
      <div className="h-full pb-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Clinics Active</h1>
        <p className="text-muted-foreground">
          The Clinics tab is highlighted as active.
        </p>
      </div>
      <BottomNavigation />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      router: {
        pathname: '/clinics',
      },
    },
  },
};

export const ActiveBook: Story = {
  render: () => (
    <div className="h-screen bg-background">
      <div className="h-full pb-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Book Active</h1>
        <p className="text-muted-foreground">
          The Book tab is highlighted as active.
        </p>
      </div>
      <BottomNavigation />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      router: {
        pathname: '/book',
      },
    },
  },
};

export const ActiveInsurance: Story = {
  render: () => (
    <div className="h-screen bg-background">
      <div className="h-full pb-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Insurance Active</h1>
        <p className="text-muted-foreground">
          The Insurance tab is highlighted as active.
        </p>
      </div>
      <BottomNavigation />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      router: {
        pathname: '/insurance',
      },
    },
  },
};
