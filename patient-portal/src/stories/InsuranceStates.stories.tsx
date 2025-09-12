import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { BenefitsSummaryCard } from '../components/insurance/benefits-summary-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const meta: Meta = {
  title: 'Insurance/States',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Different states of insurance connection and coverage display.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

// Not Connected State
export const NotConnected: StoryObj = {
  render: () => (
    <div className="w-96 space-y-4">
      <Card className="border-warning bg-warning/5">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <CardTitle className="text-warning">
              No Insurance Connected
            </CardTitle>
          </div>
          <CardDescription className="text-warning/80">
            Connect your insurance to see coverage and book appointments with in-network providers
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
};

// Connected State
export const Connected: StoryObj = {
  render: () => (
    <div className="w-96 space-y-4">
      <Card className="border-success bg-success/5">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <CardTitle className="text-success">
              Insurance Connected
            </CardTitle>
          </div>
          <CardDescription className="text-success/80">
            Your insurance is connected and ready for booking appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BenefitsSummaryCard />
        </CardContent>
      </Card>
    </div>
  ),
};

// Benefits Preview State
export const BenefitsPreview: StoryObj = {
  render: () => (
    <div className="w-96 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Coverage Preview</CardTitle>
          </div>
          <CardDescription>
            Here's what your Premium Health Plan covers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BenefitsSummaryCard planId="plan-1" />
        </CardContent>
      </Card>
    </div>
  ),
};

// Mobile States
export const MobileNotConnected: StoryObj = {
  render: () => (
    <div className="w-80 space-y-4">
      <Card className="border-warning bg-warning/5">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <CardTitle className="text-sm text-warning">
              No Insurance Connected
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-warning/80">
            Connect your insurance to see coverage
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileConnected: StoryObj = {
  render: () => (
    <div className="w-80 space-y-4">
      <Card className="border-success bg-success/5">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <CardTitle className="text-sm text-success">
              Insurance Connected
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-success/80">
            Ready for booking appointments
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <BenefitsSummaryCard />
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Dark Mode States
export const DarkModeNotConnected: StoryObj = {
  render: () => (
    <div className="w-96 space-y-4">
      <Card className="border-warning bg-warning/5">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <CardTitle className="text-warning">
              No Insurance Connected
            </CardTitle>
          </div>
          <CardDescription className="text-warning/80">
            Connect your insurance to see coverage and book appointments with in-network providers
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const DarkModeConnected: StoryObj = {
  render: () => (
    <div className="w-96 space-y-4">
      <Card className="border-success bg-success/5">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <CardTitle className="text-success">
              Insurance Connected
            </CardTitle>
          </div>
          <CardDescription className="text-success/80">
            Your insurance is connected and ready for booking appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BenefitsSummaryCard />
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
