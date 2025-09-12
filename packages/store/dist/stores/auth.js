import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Mock patient account data
const mockPatientAccount = {
    id: 'patient-001',
    email: 'patient@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1-416-555-0123',
    dateOfBirth: '1990-01-15',
    isActive: true,
    isLocked: false,
    failedLoginAttempts: 0,
    lastLoginAt: new Date().toISOString(),
    emailVerified: true,
};
export const useAuthStore = create()(persist((set) => ({
    // State
    account: null,
    isLoading: false,
    error: null,
    // Actions
    signIn: async (email, code) => {
        set({ isLoading: true, error: null });
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Mock validation - accept any code for demo
            if (code.length >= 4) {
                set({
                    account: { ...mockPatientAccount, email },
                    isLoading: false,
                    error: null
                });
            }
            else {
                throw new Error('Invalid verification code');
            }
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Sign in failed',
                isLoading: false
            });
        }
    },
    signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
            // Simulate Google OAuth flow
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Mock Google user data
            const googleUser = {
                ...mockPatientAccount,
                email: 'user@gmail.com',
                firstName: 'Google',
                lastName: 'User',
                emailVerified: true,
            };
            set({
                account: googleUser,
                isLoading: false,
                error: null
            });
        }
        catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Google sign in failed',
                isLoading: false
            });
        }
    },
    signOut: () => {
        set({
            account: null,
            error: null
        });
    },
    clearError: () => {
        set({ error: null });
    },
}), {
    name: 'twinn-auth-storage',
    partialize: (state) => ({ account: state.account }),
}));
