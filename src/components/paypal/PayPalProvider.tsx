
import React, { useState } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

// PayPal client ID for sandbox environment
const PAYPAL_CLIENT_ID = 'AfaF0EX_vYoZ5D3-P4RSCZ0FjFwHY3v88MhbcytGX9uTkQdDFrQKKFNDzwNsjdn3wPgSPsqrJsdho7RH';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const [scriptError, setScriptError] = useState(false);

  // Configure PayPal options for subscriptions
  const paypalOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'subscription',
    vault: true,
    components: 'buttons,funding-eligibility',
    'enable-funding': 'paypal',
    'disable-funding': 'paylater,card',
    'data-namespace': 'CodeFusionPayPal',
  };

  const handleScriptError = (error: any) => {
    console.error('PayPal script loading error:', error);
    setScriptError(true);
    toast.error('PayPal services are temporarily unavailable. Please try again later.');
  };

  if (scriptError) {
    return <>{children}</>;
  }

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
