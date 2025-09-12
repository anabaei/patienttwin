import type { Meta, StoryObj } from '@storybook/react';
import { InsuranceReview, type InsuranceReviewData } from '@/components/insurance/insurance-review';

const meta: Meta<typeof InsuranceReview> = {
  title: 'Insurance/InsuranceReview',
  component: InsuranceReview,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A review component that displays all collected insurance information in a summary format before submission.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Complete insurance data to review',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockProvider = {
  id: 'sunlife',
  name: 'Sun Life',
  image: 'https://1000logos.net/wp-content/uploads/2022/09/Sun-Life-Financial-Logo.png',
  description: 'Canadian life and health insurance',
  isPopular: true,
};

export const Default: Story = {
  args: {
    data: {
      provider: mockProvider,
      policyNumber: 'SL-123456789',
      groupNumber: 'GRP-001',
      memberId: 'MB-987654321',
      subscriberName: 'John Doe',
      subscriberDob: '1985-06-15',
      relationship: 'self',
      effectiveDate: '2024-01-01',
      expirationDate: '2024-12-31',
      copayAmount: '25',
      deductible: '500',
      outOfPocketMax: '2000',
      phoneNumber: '1-800-555-0199',
      address: '123 Insurance Way, Toronto, ON M5V 1A1',
      notes: 'Primary insurance with comprehensive coverage',
      isPrimary: true,
    },
  },
};

export const MinimalData: Story = {
  args: {
    data: {
      provider: {
        id: 'greenshield',
        name: 'Green Shield Canada',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTibcnhGTYEPgUGrwpWJoKl_WHeznPB4yYxgw&s',
        description: 'Canadian health benefits provider',
        isPopular: true,
      },
      policyNumber: 'GS-456789123',
      groupNumber: '',
      memberId: 'GM-123456789',
      subscriberName: 'Jane Smith',
      subscriberDob: '1990-03-22',
      relationship: 'self',
      effectiveDate: '2024-01-01',
      expirationDate: '',
      copayAmount: '',
      deductible: '',
      outOfPocketMax: '',
      phoneNumber: '1-800-555-0123',
      address: '',
      notes: '',
      isPrimary: false,
    },
  },
};

export const SecondaryInsurance: Story = {
  args: {
    data: {
      provider: {
        id: 'manulife',
        name: 'Manulife',
        image: 'https://cdn.worldvectorlogo.com/logos/manulife.svg',
        description: 'Canadian financial services',
        isPopular: true,
      },
      policyNumber: 'ML-789123456',
      groupNumber: 'GRP-005',
      memberId: 'ML-456789123',
      subscriberName: 'Alice Johnson',
      subscriberDob: '1988-11-10',
      relationship: 'spouse',
      effectiveDate: '2024-01-01',
      expirationDate: '2025-01-01',
      copayAmount: '0',
      deductible: '0',
      outOfPocketMax: '0',
      phoneNumber: '1-800-555-0150',
      address: '789 Benefits Street, Suite 200, Calgary, AB T2P 1A1',
      notes: 'Secondary coverage - covers remaining costs after primary insurance',
      isPrimary: false,
    },
  },
};

export const ComprehensiveData: Story = {
  args: {
    data: {
      provider: {
        id: 'rbc',
        name: 'RBC Insurance',
        image: 'https://dt8n8gomznf9q.cloudfront.net/null0f9545d9-00fd-41a0-8158-bc9ae63fac06/RBCInsurance_1-1312x740-trim(0,85,1312,825)-crop_w(1312)-crop_h(740)-crop_x(0)-crop_y(85).png',
        description: 'Royal Bank of Canada insurance',
      },
      policyNumber: 'RBC-001234567',
      groupNumber: 'GRP-RBC-100',
      memberId: 'RBC-MB-789',
      subscriberName: 'Michael Brown',
      subscriberDob: '1982-07-30',
      relationship: 'self',
      effectiveDate: '2024-01-01',
      expirationDate: '2024-12-31',
      copayAmount: '15',
      deductible: '200',
      outOfPocketMax: '1000',
      phoneNumber: '1-800-769-2511',
      address: 'RBC Centre, 155 Wellington Street West, Toronto, ON M5V 3L3',
      notes: 'Premium health insurance plan with low deductible and comprehensive coverage including dental, vision, prescription drugs, physiotherapy, and mental health services. Includes coverage for dependents.',
      isPrimary: true,
    },
  },
};

export const DependentCoverage: Story = {
  args: {
    data: {
      provider: {
        id: 'desjardins',
        name: 'Desjardins Insurance',
        image: 'https://www.desjardins.com/etc/designs/desjardins/style/images/desjardins-logo.svg',
        description: 'Quebec-based insurance provider',
      },
      policyNumber: 'DJ-555666777',
      groupNumber: 'DJ-GRP-200',
      memberId: 'DJ-DEP-888',
      subscriberName: 'Robert Martin',
      subscriberDob: '1975-12-05',
      relationship: 'child',
      effectiveDate: '2024-01-01',
      expirationDate: '2024-12-31',
      copayAmount: '20',
      deductible: '300',
      outOfPocketMax: '1500',
      phoneNumber: '1-800-224-7737',
      address: '100 Rue des Commandeurs, Lévis, QC G6V 7N5',
      notes: 'Dependent coverage under parent policy',
      isPrimary: false,
    },
  },
};