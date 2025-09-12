import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from '../components/ui/loading-spinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    text: {
      control: { type: 'text' },
    },
    className: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const WithText: Story = {
  args: {
    size: 'md',
    text: 'Loading your data...',
  },
};

export const LargeWithText: Story = {
  args: {
    size: 'lg',
    text: 'Please wait while we process your request',
  },
};

export const CustomStyling: Story = {
  args: {
    size: 'md',
    text: 'Custom styled spinner',
    className: 'text-primary',
  },
};
