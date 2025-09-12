import type { Meta, StoryObj } from '@storybook/nextjs';
import { Lock, Mail } from 'lucide-react';
import { FormField } from '../components/ui/form-field';
import { Input } from '../components/ui/input';
import { InputWithIcon } from '../components/ui/input-with-icon';

const meta: Meta<typeof FormField> = {
  title: 'UI/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    htmlFor: {
      control: { type: 'text' },
    },
    error: {
      control: { type: 'text' },
    },
    required: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    htmlFor: 'email',
    children: <Input id="email" placeholder="Enter your email" />,
  },
};

export const Required: Story = {
  args: {
    label: 'Password',
    htmlFor: 'password',
    required: true,
    children: <Input id="password" type="password" placeholder="Enter your password" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    htmlFor: 'email',
    error: 'Please enter a valid email address',
    children: <Input id="email" placeholder="Enter your email" />,
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Email',
    htmlFor: 'email',
    children: (
      <InputWithIcon
        id="email"
        placeholder="Enter your email"
        icon={Mail}
      />
    ),
  },
};

export const PasswordWithIcon: Story = {
  args: {
    label: 'Password',
    htmlFor: 'password',
    required: true,
    children: (
      <InputWithIcon
        id="password"
        type="password"
        placeholder="Enter your password"
        icon={Lock}
      />
    ),
  },
};

export const RequiredWithError: Story = {
  args: {
    label: 'Confirm Password',
    htmlFor: 'confirm-password',
    required: true,
    error: 'Passwords do not match',
    children: (
      <InputWithIcon
        id="confirm-password"
        type="password"
        placeholder="Confirm your password"
        icon={Lock}
      />
    ),
  },
};
