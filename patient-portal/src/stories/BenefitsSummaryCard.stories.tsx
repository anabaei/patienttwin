import type { Meta, StoryObj } from '@storybook/react';
import { BenefitsSummaryCard } from '../components/insurance/benefits-summary-card';

const meta: Meta<typeof BenefitsSummaryCard> = {
  title: 'Insurance/BenefitsSummaryCard',
  component: BenefitsSummaryCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component that displays insurance benefits and coverage information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    planId: {
      control: 'text',
      description: 'Optional plan ID to preview benefits for a specific plan',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithPlanPreview: Story = {
  args: {
    planId: 'plan-1',
  },
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
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
