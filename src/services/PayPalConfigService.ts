
interface PayPalConfig {
  clientId: string;
  planId: string;
  environment: 'sandbox' | 'live';
  isTestMode: boolean;
}

export class PayPalConfigService {
  private static instance: PayPalConfigService;
  private config: PayPalConfig;
  private sandboxPlanId: string | null = null;

  private constructor() {
    // Check if we're in development or if test mode is explicitly enabled
    const isDevMode = process.env.NODE_ENV === 'development';
    const isTestMode = localStorage.getItem('paypal_test_mode') === 'true' || isDevMode;

    this.config = {
      clientId: isTestMode 
        ? 'AfaF0EX_vYoZ5D3-P4RSCZ0FjFwHY3v88MhbcytGX9uTkQdDFrQKKFNDzwNsjdn3wPgSPsqrJsdho7RH'
        : 'Abrc68jTAU0GltdLz1FYYLMLaD5Y952gRrHtwrzeWI4-C8nlafFLdcH95KXpo3Fc6zYZsdIkiV7Jnl34',
      planId: isTestMode 
        ? 'SANDBOX_PLAN_TO_BE_CREATED'
        : 'P-9GJ74476BD483620ENA2XHZA',
      environment: isTestMode ? 'sandbox' : 'live',
      isTestMode
    };
  }

  static getInstance(): PayPalConfigService {
    if (!PayPalConfigService.instance) {
      PayPalConfigService.instance = new PayPalConfigService();
    }
    return PayPalConfigService.instance;
  }

  getConfig(): PayPalConfig {
    return { ...this.config };
  }

  isTestMode(): boolean {
    return this.config.isTestMode;
  }

  async ensureSandboxPlan(): Promise<string> {
    if (!this.config.isTestMode) {
      return this.config.planId;
    }

    // Check if we already have a sandbox plan stored
    const storedPlanId = localStorage.getItem('paypal_sandbox_plan_id');
    if (storedPlanId) {
      console.log('Using stored sandbox plan ID:', storedPlanId);
      return storedPlanId;
    }

    // Create new sandbox plan
    try {
      const { PayPalAPIService } = await import('./PayPalAPIService');
      const apiService = PayPalAPIService.getInstance();
      const { planId } = await apiService.createSandboxPlan();
      
      // Store the plan ID for future use
      localStorage.setItem('paypal_sandbox_plan_id', planId);
      this.sandboxPlanId = planId;
      
      console.log('Created and stored new sandbox plan ID:', planId);
      return planId;
    } catch (error) {
      console.error('Failed to create sandbox plan:', error);
      // Fallback to a test plan ID if creation fails
      return 'SANDBOX_FALLBACK_PLAN';
    }
  }

  toggleTestMode(enabled: boolean): void {
    localStorage.setItem('paypal_test_mode', enabled.toString());
    // Reload to apply changes
    window.location.reload();
  }

  clearSandboxData(): void {
    localStorage.removeItem('paypal_sandbox_plan_id');
    this.sandboxPlanId = null;
  }
}
