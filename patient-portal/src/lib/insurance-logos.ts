/**
 * Insurance company logo service
 * Provides fallback mechanisms for logo URLs
 */

export interface LogoSource {
  primary: string;
  fallback?: string;
  clearbit?: string;
}

export const INSURANCE_LOGOS: Record<string, LogoSource> = {
  sunlife: {
    primary: '/Sun-Life-Financial-01.svg',
    clearbit: 'https://logo.clearbit.com/sunlife.ca',
    fallback: '/logos/sunlife-fallback.svg'
  },
  manulife: {
    primary: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Manulife_logo_%282018%29.svg',
    clearbit: 'https://logo.clearbit.com/manulife.ca',
    fallback: '/logos/manulife-fallback.svg'
  },
  rbc: {
    primary: '/rbc-4.svg',
    clearbit: 'https://logo.clearbit.com/rbcinsurance.com',
    fallback: '/logos/rbc-fallback.svg'
  },
  greenshield: {
    primary: '/GreenShield_Shield_DarkGreen_RGB.svg',
    clearbit: 'https://logo.clearbit.com/greenshield.ca',
    fallback: '/logos/greenshield-fallback.svg'
  },
  desjardins: {
    primary: 'https://www.desjardins.com/etc/designs/desjardins/style/images/desjardins-logo.svg',
    clearbit: 'https://logo.clearbit.com/desjardins.com',
    fallback: '/desjardins.png'
  }
};

/**
 * Get the best available logo URL for an insurance provider
 */
export function getInsuranceLogo(providerId: string, preferAPI: boolean = false): string {
  const logos = INSURANCE_LOGOS[providerId];
  
  if (!logos) {
    return '/logos/default-insurance.svg';
  }
  
  if (preferAPI && logos.clearbit) {
    return logos.clearbit;
  }
  
  return logos.primary;
}

/**
 * Get fallback logo URL for an insurance provider
 */
export function getInsuranceLogoFallback(providerId: string): string {
  const logos = INSURANCE_LOGOS[providerId];
  return logos?.fallback || '/logos/default-insurance.svg';
}

/**
 * Get all logo variants for an insurance provider
 */
export function getInsuranceLogoVariants(providerId: string): LogoSource | null {
  return INSURANCE_LOGOS[providerId] || null;
}