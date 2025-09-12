import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import ClinicDetailsPage from '../app/(protected)/clinics/[id]/page';

const meta: Meta<typeof ClinicDetailsPage> = {
  title: 'Pages/ClinicDetailsPage',
  component: ClinicDetailsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/clinics/1',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clinics/1',
      },
    },
  },
};

export const FamilyWellnessClinic: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clinics/2',
      },
    },
  },
};

export const CommunityMedicalGroup: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clinics/3',
      },
    },
  },
};

export const DowntownMedicalCenter: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clinics/4',
      },
    },
  },
};

export const KitchenerHealthHub: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clinics/5',
      },
    },
  },
};

export const WindsorMedicalPlaza: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clinics/6',
      },
    },
  },
};

export const LoadingState: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clinics/1',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // The loading state should show skeletons initially
    // This is handled by the component's internal loading state
  },
};

export const NotFound: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clinics/999',
      },
    },
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      navigation: {
        pathname: '/clinics/1',
      },
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    nextjs: {
      navigation: {
        pathname: '/clinics/1',
      },
    },
  },
};

export const Interactive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/clinics/1',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test back button
    const backButton = canvas.getByRole('button', { name: /back/i });
    await userEvent.click(backButton);
    
    // Test book appointment button
    const bookButton = canvas.getByRole('button', { name: /book appointment/i });
    await expect(bookButton).toBeInTheDocument();
    
    // Test specialist book buttons
    const specialistBookButtons = canvas.getAllByRole('button', { name: /book now/i });
    await expect(specialistBookButtons.length).toBeGreaterThan(0);
  },
};
