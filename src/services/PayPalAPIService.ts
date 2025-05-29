
interface PayPalAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalProduct {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
}

interface PayPalPlan {
  id: string;
  product_id: string;
  name: string;
  description: string;
  status: string;
  billing_cycles: any[];
  payment_preferences: any;
}

export class PayPalAPIService {
  private static instance: PayPalAPIService;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private constructor() {}

  static getInstance(): PayPalAPIService {
    if (!PayPalAPIService.instance) {
      PayPalAPIService.instance = new PayPalAPIService();
    }
    return PayPalAPIService.instance;
  }

  private getConfig() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // Live credentials
      return {
        clientId: 'Abrc68jTAU0GltdLz1FYYLMLaD5Y952gRrHtwrzeWI4-C8nlafFLdcH95KXpo3Fc6zYZsdIkiV7Jnl34',
        clientSecret: '', // You'll need to provide this
        baseUrl: 'https://api-m.paypal.com'
      };
    } else {
      // Sandbox credentials
      return {
        clientId: 'AfaF0EX_vYoZ5D3-P4RSCZ0FjFwHY3v88MhbcytGX9uTkQdDFrQKKFNDzwNsjdn3wPgSPsqrJsdho7RH',
        clientSecret: 'EJHoNOgMSLIDSnUIVsQ76aCO0xdHP7AMS51X4-SpxtFo8hTdcy-lirfQuAgU3PkMgulWO9y4fqFZMPzF',
        baseUrl: 'https://api-m.sandbox.paypal.com'
      };
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const config = this.getConfig();
    const auth = btoa(`${config.clientId}:${config.clientSecret}`);

    try {
      const response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`Auth failed: ${response.status}`);
      }

      const data: PayPalAuthResponse = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

      return this.accessToken;
    } catch (error) {
      console.error('PayPal auth error:', error);
      throw error;
    }
  }

  async createProduct(): Promise<PayPalProduct> {
    const config = this.getConfig();
    const token = await this.getAccessToken();

    const productData = {
      name: 'CodeFusion Starter Plan',
      description: 'Professional development tools for individual developers',
      type: 'SERVICE',
      category: 'SOFTWARE'
    };

    try {
      const response = await fetch(`${config.baseUrl}/v1/catalogs/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`Product creation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Product creation error:', error);
      throw error;
    }
  }

  async createSubscriptionPlan(productId: string): Promise<PayPalPlan> {
    const config = this.getConfig();
    const token = await this.getAccessToken();

    const planData = {
      product_id: productId,
      name: 'Starter Monthly Plan',
      description: 'Monthly subscription for CodeFusion Starter plan',
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: '5.00',
              currency_code: 'USD'
            }
          }
        }
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0.00',
          currency_code: 'USD'
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3
      }
    };

    try {
      const response = await fetch(`${config.baseUrl}/v1/billing/plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData)
      });

      if (!response.ok) {
        throw new Error(`Plan creation failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Plan creation error:', error);
      throw error;
    }
  }

  async createSandboxPlan(): Promise<{ productId: string; planId: string }> {
    try {
      console.log('Creating sandbox product...');
      const product = await this.createProduct();
      
      console.log('Creating sandbox plan...');
      const plan = await this.createSubscriptionPlan(product.id);
      
      console.log('Sandbox plan created successfully:', {
        productId: product.id,
        planId: plan.id
      });

      return {
        productId: product.id,
        planId: plan.id
      };
    } catch (error) {
      console.error('Sandbox plan creation failed:', error);
      throw error;
    }
  }
}
