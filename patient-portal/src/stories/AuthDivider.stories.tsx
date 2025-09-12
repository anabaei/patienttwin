import type { Meta, StoryObj } from '@storybook/react';
import { AuthDivider } from '../components/ui/auth-divider';

const meta: Meta<typeof AuthDivider> = {
  title: 'UI/AuthDivider',
  component: AuthDivider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A divider component for authentication forms with customizable text.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text to display in the center of the divider',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomText: Story = {
  args: {
    text: 'OR',
  },
};

export const AlternativeText: Story = {
  args: {
    text: 'AND',
  },
};

export const LongText: Story = {
  args: {
    text: 'CONTINUE WITH',
  },
};

export const WithCustomStyling: Story = {
  args: {
    text: 'OR',
    className: 'my-8',
  },
};

// Show how it looks in a form context
export const InFormContext: Story = {
  args: {
    text: 'OR',
  },
  decorators: [
    (Story) => (
      <div className="w-80 space-y-4">
        <div className="h-10 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
          Google Sign-In Button
        </div>
        <Story />
        <div className="h-10 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
          Email/Password Form
        </div>
      </div>
    ),
  ],
};
