import type { Meta, StoryObj } from '@storybook/nextjs';
import { SignInForm } from '../components/auth/sign-in-form';

const meta: Meta<typeof SignInForm> = {
  title: 'Auth/SignInForm',
  component: SignInForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A professional sign-in form for the TwinnLinks patient portal with Google Sign-In and demo credentials.',
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

export const WithError: Story = {
  args: {},
  parameters: {
    zustand: {
      state: {
        auth: {
          error: 'Invalid email or password. Please try again.',
          isLoading: false,
        },
      },
    },
  },
};

export const LoadingState: Story = {
  args: {},
  parameters: {
    zustand: {
      state: {
        auth: {
          isLoading: true,
          error: null,
        },
      },
    },
  },
};
