import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import BookPage from '../app/(protected)/book/page';

const meta: Meta<typeof BookPage> = {
  title: 'Pages/BookPage',
  component: BookPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/book',
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
        pathname: '/book',
      },
    },
  },
};

export const WithClinicPreSelected: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/book',
        searchParams: {
          clinicId: '1',
        },
      },
    },
  },
};

export const WithClinicAndSpecialistPreSelected: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/book',
        searchParams: {
          clinicId: '1',
          specialistId: '1',
        },
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
        pathname: '/book',
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
        pathname: '/book',
      },
    },
  },
};

export const InteractiveBookingFlow: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/book',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test clinic selection
    const clinicCard = canvas.getByText('City Health Center');
    await userEvent.click(clinicCard);
    
    // Test next button
    const nextButton = canvas.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    
    // Test specialist selection
    const specialistCard = canvas.getByText('Dr. Amelia Chen');
    await userEvent.click(specialistCard);
    
    // Continue through the flow
    await userEvent.click(nextButton);
    
    // Test service selection
    const serviceCard = canvas.getByText('General Consultation');
    await userEvent.click(serviceCard);
    
    await userEvent.click(nextButton);
    
    // Test date and time selection
    const dateCard = canvas.getByText('Monday, January 20');
    await userEvent.click(dateCard);
    
    const timeSlot = canvas.getByText('09:00');
    await userEvent.click(timeSlot);
    
    await userEvent.click(nextButton);
    
    // Verify confirmation page
    await expect(canvas.getByText('Confirm Your Appointment')).toBeInTheDocument();
  },
};

export const LoadingState: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/book',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // The loading state should show skeletons initially
    // This is handled by the component's internal loading state
  },
};
