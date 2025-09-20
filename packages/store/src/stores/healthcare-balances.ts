import { create } from 'zustand';

export interface HealthcareBalance {
  id: string;
  type: 'massage-therapist' | 'chiropractor' | 'psychologist' | 'physiotherapist' | 'acupuncturist' | 'dietician' | 'audiologist' | 'occupational-therapist' | 'osteopath' | 'podiatrist' | 'speech-therapist' | 'naturopath' | 'other';
  name: string;
  amount: number;
  expiryDate: string;
  renewalDate: string;
  description: string;
  iconName: string;
  color: string;
  status: 'active' | 'expiring' | 'expired';
  usageHistory: {
    date: string;
    service: string;
    amount: number;
    provider: string;
  }[];
  benefits: string[];
  coverage: {
    maxPerSession: number;
    maxPerYear: number;
    copay: number;
  };
}

interface HealthcareBalancesState {
  balances: HealthcareBalance[];
  getBalanceById: (id: string) => HealthcareBalance | undefined;
  getBalancesByType: (type: HealthcareBalance['type']) => HealthcareBalance[];
}

// Mock data - paramedical services based on insurance form ($300 per practitioner)
const mockHealthcareBalances: HealthcareBalance[] = [
  {
    id: '1',
    type: 'massage-therapist',
    name: 'Massage Therapist',
    amount: 300.00,
    expiryDate: '2024-12-31',
    renewalDate: '2025-01-01',
    description: 'Therapeutic massage sessions for stress relief and muscle recovery',
    iconName: 'Waves',
    color: 'text-rose-500',
    status: 'active',
    usageHistory: [
      {
        date: '2024-01-15',
        service: 'Deep Tissue Massage',
        amount: -80.00,
        provider: 'Wellness Spa Downtown'
      },
      {
        date: '2024-01-08',
        service: 'Swedish Massage',
        amount: -75.00,
        provider: 'Relaxation Center'
      }
    ],
    benefits: [
      'Stress reduction and relaxation',
      'Muscle tension relief',
      'Improved circulation',
      'Enhanced sleep quality'
    ],
    coverage: {
      maxPerSession: 100,
      maxPerYear: 300,
      copay: 0
    }
  },
  {
    id: '2',
    type: 'chiropractor',
    name: 'Chiropractor',
    amount: 300.00,
    expiryDate: '2024-11-15',
    renewalDate: '2024-11-16',
    description: 'Spinal adjustments and musculoskeletal treatment',
    iconName: 'Activity',
    color: 'text-sky-500',
    status: 'expiring',
    usageHistory: [
      {
        date: '2024-01-10',
        service: 'Spinal Adjustment',
        amount: -65.00,
        provider: 'City Chiropractic'
      }
    ],
    benefits: [
      'Spinal alignment',
      'Pain relief',
      'Improved mobility',
      'Preventive care'
    ],
    coverage: {
      maxPerSession: 80,
      maxPerYear: 300,
      copay: 10
    }
  },
  {
    id: '3',
    type: 'psychologist',
    name: 'Psychologist',
    amount: 300.00,
    expiryDate: '2025-03-31',
    renewalDate: '2025-04-01',
    description: 'Counseling and therapy sessions for mental wellness',
    iconName: 'Brain',
    color: 'text-violet-500',
    status: 'active',
    usageHistory: [
      {
        date: '2024-01-12',
        service: 'Individual Therapy',
        amount: -120.00,
        provider: 'Mindful Counseling'
      }
    ],
    benefits: [
      'Individual counseling',
      'Group therapy sessions',
      'Crisis intervention',
      'Mental health assessments'
    ],
    coverage: {
      maxPerSession: 150,
      maxPerYear: 300,
      copay: 20
    }
  },
  {
    id: '4',
    type: 'physiotherapist',
    name: 'Physiotherapist',
    amount: 300.00,
    expiryDate: '2024-10-30',
    renewalDate: '2024-10-31',
    description: 'Rehabilitation and physical therapy services',
    iconName: 'Stethoscope',
    color: 'text-green-600',
    status: 'expired',
    usageHistory: [
      {
        date: '2024-01-20',
        service: 'Physical Therapy Session',
        amount: -85.00,
        provider: 'Rehab Center'
      }
    ],
    benefits: [
      'Injury rehabilitation',
      'Pain management',
      'Mobility improvement',
      'Strength training'
    ],
    coverage: {
      maxPerSession: 90,
      maxPerYear: 300,
      copay: 15
    }
  },
  {
    id: '5',
    type: 'acupuncturist',
    name: 'Acupuncturist',
    amount: 300.00,
    expiryDate: '2024-09-20',
    renewalDate: '2024-09-21',
    description: 'Traditional Chinese medicine acupuncture treatments',
    iconName: 'Sparkles',
    color: 'text-orange-600',
    status: 'expiring',
    usageHistory: [
      {
        date: '2024-01-18',
        service: 'Acupuncture Treatment',
        amount: -90.00,
        provider: 'Wellness Clinic'
      }
    ],
    benefits: [
      'Pain relief',
      'Stress reduction',
      'Improved energy flow',
      'Holistic healing'
    ],
    coverage: {
      maxPerSession: 100,
      maxPerYear: 300,
      copay: 25
    }
  },
  {
    id: '6',
    type: 'dietician',
    name: 'Dietician',
    amount: 300.00,
    expiryDate: '2025-01-15',
    renewalDate: '2025-01-16',
    description: 'Nutritional guidance and dietary counseling',
    iconName: 'Leaf',
    color: 'text-emerald-600',
    status: 'active',
    usageHistory: [
      {
        date: '2024-01-22',
        service: 'Nutrition Consultation',
        amount: -60.00,
        provider: 'Healthy Living Clinic'
      }
    ],
    benefits: [
      'Dietary planning',
      'Weight management',
      'Health condition support',
      'Lifestyle counseling'
    ],
    coverage: {
      maxPerSession: 80,
      maxPerYear: 300,
      copay: 20
    }
  },
  {
    id: '7',
    type: 'audiologist',
    name: 'Audiologist',
    amount: 300.00,
    expiryDate: '2024-12-31',
    renewalDate: '2025-01-01',
    description: 'Hearing assessment and auditory rehabilitation services',
    iconName: 'Activity',
    color: 'text-blue-600',
    status: 'active',
    usageHistory: [
      {
        date: '2024-01-25',
        service: 'Hearing Assessment',
        amount: -120.00,
        provider: 'Hearing Center'
      }
    ],
    benefits: [
      'Hearing assessments',
      'Hearing aid fitting',
      'Auditory rehabilitation',
      'Tinnitus management'
    ],
    coverage: {
      maxPerSession: 120,
      maxPerYear: 300,
      copay: 0
    }
  },
  {
    id: '8',
    type: 'occupational-therapist',
    name: 'Occupational Therapist',
    amount: 300.00,
    expiryDate: '2024-11-30',
    renewalDate: '2024-12-01',
    description: 'Occupational therapy for daily living skills and rehabilitation',
    iconName: 'Activity',
    color: 'text-purple-600',
    status: 'active',
    usageHistory: [
      {
        date: '2024-01-28',
        service: 'OT Assessment',
        amount: -100.00,
        provider: 'Rehabilitation Services'
      }
    ],
    benefits: [
      'Daily living skills',
      'Workplace accommodations',
      'Cognitive rehabilitation',
      'Adaptive equipment training'
    ],
    coverage: {
      maxPerSession: 100,
      maxPerYear: 300,
      copay: 10
    }
  },
  {
    id: '9',
    type: 'osteopath',
    name: 'Osteopath',
    amount: 300.00,
    expiryDate: '2025-02-28',
    renewalDate: '2025-03-01',
    description: 'Osteopathic manipulative treatment and holistic care',
    iconName: 'Activity',
    color: 'text-indigo-600',
    status: 'active',
    usageHistory: [
      {
        date: '2024-01-30',
        service: 'Osteopathic Treatment',
        amount: -110.00,
        provider: 'Osteopathic Clinic'
      }
    ],
    benefits: [
      'Manual therapy',
      'Holistic assessment',
      'Pain management',
      'Structural alignment'
    ],
    coverage: {
      maxPerSession: 110,
      maxPerYear: 300,
      copay: 15
    }
  },
  {
    id: '10',
    type: 'podiatrist',
    name: 'Podiatrist or Chiropodist',
    amount: 300.00,
    expiryDate: '2024-12-15',
    renewalDate: '2024-12-16',
    description: 'Foot and ankle care, diabetic foot care, and podiatric surgery',
    iconName: 'Activity',
    color: 'text-teal-600',
    status: 'active',
    usageHistory: [
      {
        date: '2024-02-01',
        service: 'Foot Assessment',
        amount: -95.00,
        provider: 'Foot Care Clinic'
      }
    ],
    benefits: [
      'Foot and ankle care',
      'Diabetic foot care',
      'Orthotic fitting',
      'Minor surgical procedures'
    ],
    coverage: {
      maxPerSession: 95,
      maxPerYear: 300,
      copay: 5
    }
  },
  {
    id: '11',
    type: 'speech-therapist',
    name: 'Speech Therapist',
    amount: 300.00,
    expiryDate: '2025-04-30',
    renewalDate: '2025-05-01',
    description: 'Speech, language, and communication therapy services',
    iconName: 'Activity',
    color: 'text-pink-600',
    status: 'active',
    usageHistory: [
      {
        date: '2024-02-03',
        service: 'Speech Therapy Session',
        amount: -85.00,
        provider: 'Communication Center'
      }
    ],
    benefits: [
      'Speech therapy',
      'Language development',
      'Swallowing therapy',
      'Communication aids'
    ],
    coverage: {
      maxPerSession: 85,
      maxPerYear: 300,
      copay: 15
    }
  },
  {
    id: '12',
    type: 'naturopath',
    name: 'Naturopath',
    amount: 300.00,
    expiryDate: '2024-12-31',
    renewalDate: '2025-01-01',
    description: 'Natural medicine and holistic health approaches',
    iconName: 'Leaf',
    color: 'text-green-500',
    status: 'active',
    usageHistory: [
      {
        date: '2024-02-05',
        service: 'Naturopathic Consultation',
        amount: -90.00,
        provider: 'Natural Health Clinic'
      }
    ],
    benefits: [
      'Natural medicine',
      'Holistic assessment',
      'Lifestyle counseling',
      'Preventive care'
    ],
    coverage: {
      maxPerSession: 90,
      maxPerYear: 300,
      copay: 10
    }
  },
  {
    id: '13',
    type: 'other',
    name: 'Other Services',
    amount: 300.00,
    expiryDate: '2024-12-31',
    renewalDate: '2025-01-01',
    description: 'Additional paramedical services not covered by specific categories',
    iconName: 'Grid3X3',
    color: 'text-emerald-500',
    status: 'active',
    usageHistory: [
      {
        date: '2024-01-20',
        service: 'General Consultation',
        amount: -75.00,
        provider: 'Wellness Center'
      }
    ],
    benefits: [
      'Flexible coverage',
      'Various services',
      'General wellness',
      'Additional support'
    ],
    coverage: {
      maxPerSession: 75,
      maxPerYear: 300,
      copay: 15
    }
  }
];

export const useHealthcareBalancesStore = create<HealthcareBalancesState>((_, get) => ({
  balances: mockHealthcareBalances,
  
  getBalanceById: (id: string) => {
    const { balances } = get();
    return balances.find(balance => balance.id === id);
  },
  
  getBalancesByType: (type: HealthcareBalance['type']) => {
    const { balances } = get();
    return balances.filter(balance => balance.type === type);
  }
}));
