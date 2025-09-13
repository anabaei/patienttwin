import { create } from 'zustand';
// Mock data - centralized source of truth
const mockHealthcareBalances = [
    {
        id: '1',
        type: 'massage',
        name: 'Massage Therapy',
        amount: 450.00,
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
            maxPerYear: 1000,
            copay: 0
        }
    },
    {
        id: '2',
        type: 'chiro',
        name: 'Chiropractic Care',
        amount: 320.00,
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
            maxPerYear: 800,
            copay: 10
        }
    },
    {
        id: '3',
        type: 'mental-health',
        name: 'Mental Health Services',
        amount: 600.00,
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
            maxPerYear: 2000,
            copay: 20
        }
    },
    {
        id: '4',
        type: 'physical-therapy',
        name: 'Physical Therapy',
        amount: 280.00,
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
            maxPerYear: 900,
            copay: 15
        }
    },
    {
        id: '5',
        type: 'acupuncture',
        name: 'Acupuncture',
        amount: 180.00,
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
            maxPerSession: 95,
            maxPerYear: 950,
            copay: 12
        }
    },
    {
        id: '6',
        type: 'nutrition',
        name: 'Nutrition Counseling',
        amount: 150.00,
        expiryDate: '2025-02-28',
        renewalDate: '2025-03-01',
        description: 'Nutritional guidance and dietary counseling',
        iconName: 'Leaf',
        color: 'text-teal-600',
        status: 'active',
        usageHistory: [
            {
                date: '2024-01-15',
                service: 'Nutrition Consultation',
                amount: -75.00,
                provider: 'Health & Wellness'
            }
        ],
        benefits: [
            'Dietary planning',
            'Nutritional education',
            'Weight management',
            'Health optimization'
        ],
        coverage: {
            maxPerSession: 80,
            maxPerYear: 800,
            copay: 10
        }
    },
    {
        id: '7',
        type: 'other',
        name: 'Other Services',
        amount: 610.00, // 280 + 180 + 150 (Physical Therapy + Acupuncture + Nutrition)
        expiryDate: '2025-02-28',
        renewalDate: '2025-03-01',
        description: 'Combined balance for Physical Therapy, Acupuncture, and Nutrition Counseling services',
        iconName: 'Grid3X3',
        color: 'text-slate-600',
        status: 'active',
        usageHistory: [
            {
                date: '2024-01-20',
                service: 'Physical Therapy Session',
                amount: -85.00,
                provider: 'Rehab Center'
            },
            {
                date: '2024-01-18',
                service: 'Acupuncture Treatment',
                amount: -90.00,
                provider: 'Wellness Clinic'
            },
            {
                date: '2024-01-15',
                service: 'Nutrition Consultation',
                amount: -75.00,
                provider: 'Health & Wellness'
            }
        ],
        benefits: [
            'Physical therapy sessions',
            'Acupuncture treatments',
            'Nutrition counseling',
            'Comprehensive wellness care'
        ],
        coverage: {
            maxPerSession: 100,
            maxPerYear: 1500,
            copay: 15
        }
    }
];
export const useHealthcareBalancesStore = create((_, get) => ({
    balances: mockHealthcareBalances,
    getBalanceById: (id) => {
        const { balances } = get();
        return balances.find(balance => balance.id === id);
    },
    getBalancesByType: (type) => {
        const { balances } = get();
        return balances.filter(balance => balance.type === type);
    }
}));
