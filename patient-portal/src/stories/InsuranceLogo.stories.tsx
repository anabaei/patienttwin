import { InsuranceLogo } from '@/components/ui/insurance-logo';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof InsuranceLogo> = {
  title: 'UI/InsuranceLogo',
  component: InsuranceLogo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A robust insurance logo component with fallback mechanisms and error handling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    providerId: {
      control: { type: 'select' },
      options: ['sunlife', 'manulife', 'rbc', 'greenshield', 'desjardins', 'greatwest', 'bluecross', 'chambers'],
      description: 'Insurance provider ID',
    },
    providerName: {
      control: { type: 'text' },
      description: 'Insurance provider display name',
    },
    size: {
      control: { type: 'number', min: 24, max: 200, step: 8 },
      description: 'Logo size in pixels',
    },
    preferAPI: {
      control: { type: 'boolean' },
      description: 'Prefer API-based logos (e.g., Clearbit) over static URLs',
    },
    priority: {
      control: { type: 'boolean' },
      description: 'Next.js Image priority loading',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    providerId: 'sunlife',
    providerName: 'Sun Life',
    size: 64,
    preferAPI: false,
    priority: false,
  },
};

export const AllProviders: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <div className="text-center">
        <InsuranceLogo providerId="sunlife" providerName="Sun Life" size={64} />
        <p className="mt-2 text-sm">Sun Life</p>
      </div>
      <div className="text-center">
        <InsuranceLogo providerId="manulife" providerName="Manulife" size={64} />
        <p className="mt-2 text-sm">Manulife</p>
      </div>
      <div className="text-center">
        <InsuranceLogo providerId="rbc" providerName="RBC Insurance" size={64} />
        <p className="mt-2 text-sm">RBC Insurance</p>
      </div>
      <div className="text-center">
        <InsuranceLogo providerId="greenshield" providerName="Green Shield Canada" size={64} />
        <p className="mt-2 text-sm">Green Shield Canada</p>
      </div>
      <div className="text-center">
        <InsuranceLogo providerId="desjardins" providerName="Desjardins Insurance" size={64} />
        <p className="mt-2 text-sm">Desjardins Insurance</p>
      </div>
      <div className="text-center">
        <InsuranceLogo providerId="greatwest" providerName="Great-West Life" size={64} />
        <p className="mt-2 text-sm">Great-West Life</p>
      </div>
      <div className="text-center">
        <InsuranceLogo providerId="bluecross" providerName="Blue Cross" size={64} />
        <p className="mt-2 text-sm">Blue Cross</p>
      </div>
      <div className="text-center">
        <InsuranceLogo providerId="chambers" providerName="Chambers of Commerce" size={64} />
        <p className="mt-2 text-sm">Chambers of Commerce</p>
      </div>
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="text-center">
        <InsuranceLogo providerId="sunlife" providerName="Sun Life" size={32} />
        <p className="mt-2 text-xs">32px</p>
      </div>
      <div className="text-center">
        <InsuranceLogo providerId="sunlife" providerName="Sun Life" size={48} />
        <p className="mt-2 text-xs">48px</p>
      </div>
      <div className="text-center">
        <InsuranceLogo providerId="sunlife" providerName="Sun Life" size={64} />
        <p className="mt-2 text-xs">64px</p>
      </div>
      <div className="text-center">
        <InsuranceLogo providerId="sunlife" providerName="Sun Life" size={96} />
        <p className="mt-2 text-xs">96px</p>
      </div>
      <div className="text-center">
        <InsuranceLogo providerId="sunlife" providerName="Sun Life" size={128} />
        <p className="mt-2 text-xs">128px</p>
      </div>
    </div>
  ),
};

export const WithAPIPreference: Story = {
  args: {
    providerId: 'manulife',
    providerName: 'Manulife',
    size: 64,
    preferAPI: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses API-based logo sources (like Clearbit) when available.',
      },
    },
  },
};

export const UnknownProvider: Story = {
  args: {
    providerId: 'unknown-provider',
    providerName: 'Unknown Insurance Co',
    size: 64,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows initials fallback for unknown providers.',
      },
    },
  },
};

export const FallbackDemo: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        These examples demonstrate fallback behavior:
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <InsuranceLogo providerId="unknown1" providerName="Test Insurance" size={64} />
          <p className="mt-2 text-sm">Unknown Provider</p>
        </div>
        <div className="text-center">
          <InsuranceLogo providerId="unknown2" providerName="ABC Health Co" size={64} />
          <p className="mt-2 text-sm">Initials: AH</p>
        </div>
        <div className="text-center">
          <InsuranceLogo providerId="unknown3" providerName="X" size={64} />
          <p className="mt-2 text-sm">Single Letter</p>
        </div>
      </div>
    </div>
  ),
};

export const InCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {['sunlife', 'manulife', 'greenshield'].map((providerId) => {
        const names: Record<string, string> = {
          sunlife: 'Sun Life',
          manulife: 'Manulife', 
          greenshield: 'Green Shield Canada',
        };
        
        return (
          <div 
            key={providerId}
            className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="mb-3">
              <InsuranceLogo
                providerId={providerId}
                providerName={names[providerId]}
                size={64}
                className="mx-auto"
              />
            </div>
            <p className="text-sm font-medium group-hover:text-primary">
              {names[providerId]}
            </p>
          </div>
        );
      })}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Insurance logos displayed in card layouts, matching the real application design.',
      },
    },
  },
};