import type { Meta, StoryObj } from '@storybook/react';
import { InsuranceProviderSelect } from '../components/insurance/insurance-provider-select';

const meta: Meta<typeof InsuranceProviderSelect> = {
  title: 'Insurance/InsuranceProviderSelect',
  component: InsuranceProviderSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for selecting insurance providers from available options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Currently selected provider ID',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback when provider selection changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
  },
};

export const WithSelection: Story = {
  args: {
    value: 'provider-1',
  },
};

export const Mobile: Story = {
  args: {
    value: '',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
