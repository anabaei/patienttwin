import type { Meta, StoryObj } from '@storybook/nextjs';
import { InsuranceConnectionPage } from '../components/insurance/insurance-connection-page';

const meta: Meta<typeof InsuranceConnectionPage> = {
  title: 'Pages/InsuranceConnectionPage',
  component: InsuranceConnectionPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The insurance connection page allows users to connect their insurance providers and view coverage benefits.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const DarkMode: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const WithConnectedInsurance: Story = {
  args: {},
  parameters: {
    zustand: {
      state: {
        insurance: {
          connectedPlan: {
            providerId: 'provider-1',
            planId: 'plan-1',
            memberId: 'MEMBER123',
            effectiveDate: '2024-01-01',
          },
        },
      },
    },
  },
};
