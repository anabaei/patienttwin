import type { Meta, StoryObj } from '@storybook/nextjs';
import { GoogleSignInButton } from '../components/ui/google-signin-button';

const meta: Meta<typeof GoogleSignInButton> = {
  title: 'UI/GoogleSignInButton',
  component: GoogleSignInButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A professional Google Sign-In button component with loading states and proper styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    children: {
      control: 'text',
      description: 'Custom text for the button (defaults to "Continue with Google")',
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

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const CustomText: Story = {
  args: {
    children: 'Sign in with Google',
  },
};

export const LongText: Story = {
  args: {
    children: 'Continue with your Google account',
  },
};

export const LoadingWithCustomText: Story = {
  args: {
    isLoading: true,
    children: 'Signing in with Google...',
  },
};
