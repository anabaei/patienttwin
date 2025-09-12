import type { Meta, StoryObj } from '@storybook/react';
import { SignInForm } from '../components/auth/sign-in-form';

const meta: Meta<typeof SignInForm> = {
  title: 'Auth/SignInForm',
  component: SignInForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A professional sign-in form for the TwinnLinks patient portal with demo credentials.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
