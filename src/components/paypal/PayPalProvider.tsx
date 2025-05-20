
import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

// PayPal client IDs for sandbox environment
const PAYPAL_CLIENT_ID = 'AfaF0EX_vYoZ5D3-P4RSCZ0FjFwHY3v88MhbcytGX9uTkQdDFrQKKFNDzwNsjdn3wPgSPsqrJsdho7RH';
// Note: Secret key is not used in the frontend directly, it would be used in the backend

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  // Configure PayPal options according to their documentation
  const paypalOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
    components: 'buttons,funding-eligibility',
    'enable-funding': 'paypal',
    'disable-funding': 'paylater,card',
    dataClientToken: null,
  };

  const handleScriptError = (error: any) => {
    console.error('Failed to load PayPal script:', error);
    toast.error('Failed to load payment system. Please try again later.');
  };

  return (
    <PayPalScriptProvider 
      options={paypalOptions} 
      deferLoading={false}
      onError={handleScriptError}
    >
      {children}
    </PayPalScriptProvider>
  );
};
