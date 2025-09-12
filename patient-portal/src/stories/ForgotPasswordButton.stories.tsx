import type { Meta, StoryObj } from '@storybook/nextjs';
import { ForgotPasswordButton } from '../components/ui/forgot-password-button';

const meta: Meta<typeof ForgotPasswordButton> = {
  title: 'UI/ForgotPasswordButton',
  component: ForgotPasswordButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable forgot password button component with link and button variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['link', 'button'],
      description: 'Visual variant of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    children: {
      control: 'text',
      description: 'Custom text for the button',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function when button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const LinkVariant: Story = {
  args: {
    variant: 'link',
  },
};

export const ButtonVariant: Story = {
  args: {
    variant: 'button',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const CustomText: Story = {
  args: {
    children: 'Reset Password',
  },
};

export const CustomTextButton: Story = {
  args: {
    variant: 'button',
    children: 'Reset Password',
  },
};

// Show how it looks in a form context
export const InFormContext: Story = {
  args: {
    variant: 'link',
  },
  decorators: [
    (Story) => (
      <div className="w-80 space-y-4">
        <div className="h-10 bg-muted rounded flex items-center px-3 text-sm text-muted-foreground">
          Password Input Field
        </div>
        <div className="flex justify-end">
          <Story />
        </div>
        <div className="h-10 bg-primary rounded flex items-center justify-center text-sm text-primary-foreground">
          Sign In Button
        </div>
      </div>
    ),
  ],
};
