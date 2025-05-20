
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
    intent: 'subscription',
    vault: true,
    components: 'buttons',
    'disable-funding': 'credit,card',
    'enable-funding': 'paypal',
    'data-namespace': 'paypal_sdk',
  };

  // Create an event handler for script errors
  const onScriptLoadError = (err: any) => {
    console.error('PayPal script error:', err);
    handlePayPalError(err);
  };

  return (
    <PayPalScriptProvider 
      options={paypalOptions} 
      deferLoading={false}
    >
      {/* PayPalScriptProvider doesn't accept onError directly, we need to handle errors elsewhere */}
      {children}
    </PayPalScriptProvider>
  );
};
