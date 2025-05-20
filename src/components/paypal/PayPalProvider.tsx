
import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

// PayPal client IDs - using your sandbox credentials
const PAYPAL_CLIENT_ID = {
  sandbox: 'AfaF0EX_vYoZ5D3-P4RSCZ0FjFwHY3v88MhbcytGX9uTkQdDFrQKKFNDzwNsjdn3wPgSPsqrJsdho7RH',
  production: '' // Leave empty for now - would be filled for production
};

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  // Fixed the PayPal options to match the required interface
  const paypalOptions = {
    clientId: PAYPAL_CLIENT_ID.sandbox, // Using sandbox for testing
    currency: 'USD',
    intent: 'subscription',
    components: 'buttons,funding-eligibility',
    'disable-funding': 'paylater,card',
    'enable-funding': 'paypal',
  };

  return (
    <PayPalScriptProvider options={paypalOptions} deferLoading={false}>
      {children}
    </PayPalScriptProvider>
  );
};
