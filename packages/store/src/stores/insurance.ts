import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    ConnectedPlan,
    CoverageSummary,
    InsuranceConnectionInput,
    InsurancePlan,
    InsuranceProvider
} from '../types';

interface InsuranceState {
  providers: InsuranceProvider[];
  plans: InsurancePlan[];
  connectedPlan: ConnectedPlan | null;
  isLoading: boolean;
  error: string | null;
}

interface InsuranceActions {
  connectInsurance: (input: InsuranceConnectionInput) => Promise<void>;
  getBenefitsForServiceOption: (serviceOptionId: string) => CoverageSummary;
  clearError: () => void;
}

type InsuranceStore = InsuranceState & InsuranceActions;

// Mock insurance data
const mockProviders: InsuranceProvider[] = [
  {
    id: 'provider-001',
    name: 'Ontario Health Insurance Plan (OHIP)',
    logoUrl: '/logos/ohip.png',
  },
  {
    id: 'provider-002',
    name: 'Sun Life Financial',
    logoUrl: '/logos/sunlife.png',
  },
  {
    id: 'provider-003',
    name: 'Manulife',
    logoUrl: '/logos/manulife.png',
  },
  {
    id: 'provider-004',
    name: 'Great-West Life',
    logoUrl: '/logos/gwl.png',
  },
];

const mockPlans: InsurancePlan[] = [
  {
    id: 'plan-001',
    providerId: 'provider-001',
    name: 'OHIP Basic Coverage',
    type: 'HMO',
    copayByServiceOptionId: {
      'service-opt-001': 0, // General consultation
      'service-opt-002': 0, // Specialist consultation
      'service-opt-003': 0, // Emergency visit
    },
    coinsurancePercent: 0,
    deductibleAnnual: 0,
    deductibleRemaining: 0,
    outOfPocketMaxAnnual: 0,
    networkClinicIds: ['clinic-001', 'clinic-002', 'clinic-003'],
  },
  {
    id: 'plan-002',
    providerId: 'provider-002',
    name: 'Sun Life Extended Health',
    type: 'PPO',
    copayByServiceOptionId: {
      'service-opt-001': 25, // General consultation
      'service-opt-002': 50, // Specialist consultation
      'service-opt-003': 100, // Emergency visit
    },
    coinsurancePercent: 20,
    deductibleAnnual: 500,
    deductibleRemaining: 300,
    outOfPocketMaxAnnual: 2000,
    networkClinicIds: ['clinic-001', 'clinic-002', 'clinic-004', 'clinic-005'],
  },
  {
    id: 'plan-003',
    providerId: 'provider-003',
    name: 'Manulife Health Plus',
    type: 'PPO',
    copayByServiceOptionId: {
      'service-opt-001': 20,
      'service-opt-002': 40,
      'service-opt-003': 75,
    },
    coinsurancePercent: 15,
    deductibleAnnual: 300,
    deductibleRemaining: 150,
    outOfPocketMaxAnnual: 1500,
    networkClinicIds: ['clinic-002', 'clinic-003', 'clinic-005', 'clinic-006'],
  },
];

export const useInsuranceStore = create<InsuranceStore>()(
  persist(
    (set, get) => ({
      // State
      providers: mockProviders,
      plans: mockPlans,
      connectedPlan: null,
      isLoading: false,
      error: null,

      // Actions
      connectInsurance: async (input: InsuranceConnectionInput) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Validate plan exists
          const plan = get().plans.find(p => p.id === input.planId);
          if (!plan) {
            throw new Error('Insurance plan not found');
          }
          
          // Validate provider exists
          const provider = get().providers.find(p => p.id === input.providerId);
          if (!provider) {
            throw new Error('Insurance provider not found');
          }
          
          // Mock successful connection
          const connectedPlan: ConnectedPlan = {
            providerId: input.providerId,
            planId: input.planId,
            memberId: input.memberId,
            effectiveDate: new Date().toISOString(),
          };
          
          set({ 
            connectedPlan,
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to connect insurance',
            isLoading: false 
          });
        }
      },

      getBenefitsForServiceOption: (serviceOptionId: string): CoverageSummary => {
        const { connectedPlan, plans } = get();
        
        if (!connectedPlan) {
          return {
            listPrice: 0,
            deductibleRemaining: 0,
            deductibleApplied: 0,
            copay: 0,
            coinsurance: 0,
            totalDueNow: 0,
            inNetwork: false,
          };
        }
        
        const plan = plans.find(p => p.id === connectedPlan.planId);
        if (!plan) {
          return {
            listPrice: 0,
            deductibleRemaining: 0,
            deductibleApplied: 0,
            copay: 0,
            coinsurance: 0,
            totalDueNow: 0,
            inNetwork: false,
          };
        }
        
        // Mock service pricing (in real app, this would come from service data)
        const listPrice = 150; // Base consultation price
        const copay = plan.copayByServiceOptionId?.[serviceOptionId] || 0;
        const coinsurancePercent = plan.coinsurancePercent || 0;
        const deductibleRemaining = plan.deductibleRemaining || 0;
        
        // Calculate coverage
        let deductibleApplied = 0;
        let coinsurance = 0;
        let totalDueNow = 0;
        
        if (deductibleRemaining > 0) {
          deductibleApplied = Math.min(deductibleRemaining, listPrice);
          const remainingAfterDeductible = listPrice - deductibleApplied;
          coinsurance = Math.round((remainingAfterDeductible * coinsurancePercent) / 100);
          totalDueNow = deductibleApplied + coinsurance + copay;
        } else {
          coinsurance = Math.round((listPrice * coinsurancePercent) / 100);
          totalDueNow = coinsurance + copay;
        }
        
        return {
          listPrice,
          deductibleRemaining: Math.max(0, deductibleRemaining - deductibleApplied),
          deductibleApplied,
          copay,
          coinsurance,
          totalDueNow,
          inNetwork: true, // Assume in-network for demo
        };
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'twinn-insurance-storage',
      partialize: (state) => ({ connectedPlan: state.connectedPlan }),
    }
  )
);
