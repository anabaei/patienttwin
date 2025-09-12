import type { Meta, StoryObj } from '@storybook/react';
import { InsuranceProviderSelector, type InsuranceProvider } from '@/components/insurance/insurance-provider-selector';
import { useState } from 'react';

const mockProviders: InsuranceProvider[] = [
  {
    id: 'sunlife',
    name: 'Sun Life',
    image: 'https://1000logos.net/wp-content/uploads/2022/09/Sun-Life-Financial-Logo.png',
    description: 'Canadian life and health insurance',
    category: 'Major Insurance',
    isPopular: true,
  },
  {
    id: 'manulife',
    name: 'Manulife',
    image: 'https://cdn.worldvectorlogo.com/logos/manulife.svg',
    description: 'Canadian financial services',
    category: 'Major Insurance',
    isPopular: true,
  },
  {
    id: 'rbc',
    name: 'RBC Insurance',
    image: 'https://dt8n8gomznf9q.cloudfront.net/null0f9545d9-00fd-41a0-8158-bc9ae63fac06/RBCInsurance_1-1312x740-trim(0,85,1312,825)-crop_w(1312)-crop_h(740)-crop_x(0)-crop_y(85).png',
    description: 'Royal Bank of Canada insurance',
    category: 'Bank Insurance',
  },
  {
    id: 'greenshield',
    name: 'Green Shield Canada',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTibcnhGTYEPgUGrwpWJoKl_WHeznPB4yYxgw&s',
    description: 'Canadian health benefits provider',
    category: 'Health Benefits',
    isPopular: true,
  },
  {
    id: 'desjardins',
    name: 'Desjardins Insurance',
    image: 'https://www.desjardins.com/etc/designs/desjardins/style/images/desjardins-logo.svg',
    description: 'Quebec-based insurance provider',
    category: 'Regional Insurance',
  },
  {
    id: 'greatwest',
    name: 'Great-West Life',
    image: 'https://www.greatwestlife.com/content/dam/gwl/about-us/media-centre/logos/GWL_Lockup_RGB.png',
    description: 'Western Canadian insurance leader',
    category: 'Major Insurance',
  },
];

const meta: Meta<typeof InsuranceProviderSelector> = {
  title: 'Insurance/InsuranceProviderSelector',
  component: InsuranceProviderSelector,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A component for selecting insurance providers with logos and descriptions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    gridCols: {
      control: { type: 'select' },
      options: ['1', '2', '3'],
      description: 'Number of columns in the grid',
    },
    showCategories: {
      control: { type: 'boolean' },
      description: 'Group providers by category',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveWrapper = ({ 
  providers, 
  gridCols = '2',
  showCategories = false 
}: { 
  providers: InsuranceProvider[];
  gridCols?: '1' | '2' | '3';
  showCategories?: boolean;
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>();

  return (
    <InsuranceProviderSelector
      providers={providers}
      selectedProviderId={selectedProvider}
      onProviderSelect={(provider) => setSelectedProvider(provider.id)}
      gridCols={gridCols}
      showCategories={showCategories}
    />
  );
};

export const Default: Story = {
  render: (args) => (
    <InteractiveWrapper
      providers={mockProviders}
      {...args}
    />
  ),
};

export const TwoColumns: Story = {
  render: (args) => (
    <InteractiveWrapper
      providers={mockProviders}
      gridCols="2"
      {...args}
    />
  ),
};

export const ThreeColumns: Story = {
  render: (args) => (
    <InteractiveWrapper
      providers={mockProviders}
      gridCols="3"
      {...args}
    />
  ),
};

export const SingleColumn: Story = {
  render: (args) => (
    <InteractiveWrapper
      providers={mockProviders}
      gridCols="1"
      {...args}
    />
  ),
};

export const WithCategories: Story = {
  render: (args) => (
    <InteractiveWrapper
      providers={mockProviders}
      showCategories={true}
      {...args}
    />
  ),
};

export const PopularProvidersOnly: Story = {
  render: (args) => (
    <InteractiveWrapper
      providers={mockProviders.filter(p => p.isPopular)}
      gridCols="3"
      {...args}
    />
  ),
};

export const EmptyState: Story = {
  render: (args) => (
    <InsuranceProviderSelector
      providers={[]}
      onProviderSelect={() => {}}
      {...args}
    />
  ),
};

export const PreSelected: Story = {
  render: (args) => (
    <InsuranceProviderSelector
      providers={mockProviders}
      selectedProviderId="sunlife"
      onProviderSelect={() => {}}
      {...args}
    />
  ),
};