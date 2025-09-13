import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Mock insurance data - Canadian providers
// Note: logoUrl is kept for backward compatibility, but new components should use the logo service
const mockProviders = [
    {
        id: 'sunlife',
        name: 'Sun Life',
        logoUrl: '/Sun-Life-Financial-01.svg',
    },
    {
        id: 'manulife',
        name: 'Manulife',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Manulife_logo_%282018%29.svg',
    },
    {
        id: 'rbc',
        name: 'RBC Insurance',
        logoUrl: '/rbc-4.svg',
    },
    {
        id: 'greenshield',
        name: 'Green Shield Canada',
        logoUrl: '/GreenShield_Shield_DarkGreen_RGB.svg',
    },
    {
        id: 'desjardins',
        name: 'Desjardins Insurance',
        logoUrl: 'https://www.desjardins.com/etc/designs/desjardins/style/images/desjardins-logo.svg',
    },
    {
        id: 'greatwest',
        name: 'Great-West Life',
        logoUrl: 'https://www.greatwestlife.com/content/dam/gwl/about-us/media-centre/logos/GWL_Lockup_RGB.png',
    },
    {
        id: 'bluecross',
        name: 'Blue Cross',
        logoUrl: 'https://www.medavie.bluecross.ca/-/media/medaviebc/images/logo/medavie-blue-cross-logo.png',
    },
    {
        id: 'chambers',
        name: 'Chambers of Commerce',
        logoUrl: 'https://www.chamberplan.ca/wp-content/uploads/2020/10/chambers-logo.png',
    },
];
const mockPlans = [
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
export const useInsuranceStore = create()(persist((set, get) => ({
    // State
    providers: mockProviders,
    plans: mockPlans,
    connectedPlan: null,
    isLoading: false,
    error: null,
    // Actions
    connectInsurance: async (input) => {
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
            const connectedPlan = {
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
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to connect insurance',
                isLoading: false
            });
        }
    },
    getBenefitsForServiceOption: (serviceOptionId) => {
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
        }
        else {
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
}), {
    name: 'twinn-insurance-storage',
    partialize: (state) => ({ connectedPlan: state.connectedPlan }),
}));
