import type { Meta, StoryObj } from '@storybook/nextjs';
import ClinicsPage from '../app/(protected)/clinics/page';

const meta: Meta<typeof ClinicsPage> = {
  title: 'Pages/Clinics',
  component: ClinicsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The clinics search and discovery page with mobile-first design, filtering, and sorting capabilities.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default Clinics Page',
  parameters: {
    docs: {
      description: {
        story: 'The default clinics page showing all available clinics with search and filter functionality.',
      },
    },
  },
};

export const WithSearch: Story = {
  name: 'With Search Results',
  parameters: {
    docs: {
      description: {
        story: 'Clinics page with search functionality active, showing filtered results.',
      },
    },
  },
};

export const FilteredResults: Story = {
  name: 'Filtered by Service',
  parameters: {
    docs: {
      description: {
        story: 'Clinics page with service filter applied, showing only relevant clinics.',
      },
    },
  },
};

export const EmptyState: Story = {
  name: 'Empty State',
  parameters: {
    docs: {
      description: {
        story: 'Clinics page when no results are found, showing the empty state with clear filters option.',
      },
    },
  },
};

export const Mobile: Story = {
  name: 'Mobile View',
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Clinics page optimized for mobile viewing with responsive layout.',
      },
    },
  },
};

export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Clinics page in dark mode with proper theme colors.',
      },
    },
  },
};
