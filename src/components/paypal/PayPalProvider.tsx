
import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { usePayPalError } from './usePayPalError';

// PayPal client IDs for sandbox environment
const PAYPAL_CLIENT_ID = 'AfaF0EX_vYoZ5D3-P4RSCZ0FjFwHY3v88MhbcytGX9uTkQdDFrQKKFNDzwNsjdn3wPgSPsqrJsdho7RH';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const { handlePayPalError } = usePayPalError();
  
  // Configure PayPal options according to their documentation
  const paypalOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture',  // Changed from 'subscription' to 'capture' for more general use
    vault: true,
    components: 'buttons,funding-eligibility',
    'data-client-token': 'abc123', // Added client token
    'disable-funding': 'credit',
    'enable-funding': 'paypal',
    'data-sdk-integration-source': 'button-factory',
    'data-namespace': 'paypal_sdk',
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
};
