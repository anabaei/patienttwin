import type { Meta, StoryObj } from '@storybook/nextjs';
import { Sidebar } from '../components/layout/sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The desktop sidebar navigation with user info, main navigation, and secondary navigation items.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
        <p className="text-muted-foreground">
          This is where the main content would be displayed. The sidebar is on the left.
        </p>
      </div>
    </div>
  ),
  parameters: {
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

export const WithoutUser: Story = {
  render: () => (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
        <p className="text-muted-foreground">
          Sidebar without user information (not authenticated).
        </p>
      </div>
    </div>
  ),
  parameters: {
    zustand: {
      state: {
        auth: {
          account: null,
        },
      },
    },
  },
};

export const LongUserName: Story = {
  render: () => (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
        <p className="text-muted-foreground">
          Sidebar with a long user name to test text truncation.
        </p>
      </div>
    </div>
  ),
  parameters: {
    zustand: {
      state: {
        auth: {
          account: {
            id: 'patient-1',
            email: 'very.long.email.address@twinnlinks.com',
            firstName: 'VeryLongFirstName',
            lastName: 'VeryLongLastName',
            dateOfBirth: '1990-05-15',
            emailVerified: true,
          },
        },
      },
    },
  },
};
