import type { Meta, StoryObj } from '@storybook/nextjs';
import { Eye, EyeOff, Lock, Mail, Search, X } from 'lucide-react';
import { useState } from 'react';
import { InputWithIcon } from '../components/ui/input-with-icon';

const meta: Meta<typeof InputWithIcon> = {
  title: 'UI/InputWithIcon',
  component: InputWithIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'search'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Enter your email',
    icon: Mail,
    iconPosition: 'left',
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: 'Search...',
    icon: Search,
    iconPosition: 'right',
  },
};

export const PasswordWithToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <InputWithIcon
        placeholder="Enter your password"
        type={showPassword ? 'text' : 'password'}
        icon={Lock}
        actionIcon={showPassword ? EyeOff : Eye}
        onActionClick={() => setShowPassword(!showPassword)}
      />
    );
  },
};

export const SearchWithClear: Story = {
  render: () => {
    const [value, setValue] = useState('');
    
    return (
      <InputWithIcon
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        icon={Search}
        actionIcon={X}
        onActionClick={() => setValue('')}
        actionDisabled={!value}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    icon: Mail,
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Enter your email',
    icon: Mail,
    defaultValue: 'user@example.com',
  },
};

export const EmailInput: Story = {
  args: {
    placeholder: 'Enter your email',
    icon: Mail,
    type: 'email',
  },
};

export const SearchInput: Story = {
  args: {
    placeholder: 'Search clinics...',
    icon: Search,
    type: 'search',
  },
};
