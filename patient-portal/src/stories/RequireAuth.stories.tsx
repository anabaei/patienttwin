import type { Meta, StoryObj } from '@storybook/nextjs';
import { RequireAuth } from '../components/auth/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const meta: Meta<typeof RequireAuth> = {
  title: 'Auth/RequireAuth',
  component: RequireAuth,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component that protects routes by requiring authentication. Shows loading state and redirects unauthenticated users.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ProtectedContent = () => (
  <Card className="w-96">
    <CardHeader>
      <CardTitle>Protected Content</CardTitle>
    </CardHeader>
    <CardContent>
      <p>This content is only visible to authenticated users.</p>
    </CardContent>
  </Card>
);

export const Default: Story = {
  args: {
    children: <ProtectedContent />,
  },
};

export const WithCustomFallback: Story = {
  args: {
    children: <ProtectedContent />,
    fallback: (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Custom Loading...</h2>
        <p className="text-muted-foreground">Please wait while we verify your identity.</p>
      </div>
    ),
  },
};
