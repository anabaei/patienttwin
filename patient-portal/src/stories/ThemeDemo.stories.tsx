import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleSignInButton } from '@/components/ui/google-signin-button';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const ThemeDemo = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider attribute="class" defaultTheme={theme} enableSystem={false}>
      <div className={theme}>
        <div className="bg-background text-foreground p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Theme Demo</h2>
            <Button onClick={toggleTheme} variant="outline">
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
            </Button>
          </div>
          
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Choose your preferred sign-in method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GoogleSignInButton />
              <Button className="w-full" variant="default">
                Continue with Email
              </Button>
              <Button className="w-full" variant="secondary">
                Secondary Button
              </Button>
              <Button className="w-full" variant="outline">
                Outline Button
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-medium text-card-foreground">Card Background</h3>
              <p className="text-sm text-muted-foreground">Uses theme colors</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-muted-foreground">Muted Background</h3>
              <p className="text-sm text-muted-foreground">Subtle backgrounds</p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Current theme: <span className="text-foreground font-medium">{theme}</span>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

const meta: Meta<typeof ThemeDemo> = {
  title: 'Demo/ThemeDemo',
  component: ThemeDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Demonstrates theme switching with all components using theme-based colors.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};