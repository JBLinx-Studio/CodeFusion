
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

// PayPal client ID for CodeFusion sandbox environment - UPDATED TO CORRECT ID
const PAYPAL_CLIENT_ID = 'AfaF0EX_vYoZ5D3-P4RSCZ0FjFwHY3v88MhbcytGX9uTkQdDFrQKKFNDzwNsjdn3wPgSPsqrJsdho7RH';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const [scriptError, setScriptError] = useState(false);

  // Configure PayPal options for sandbox subscriptions
  const paypalOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'subscription',
    vault: true,
    components: 'buttons,funding-eligibility',
    'enable-funding': 'paypal',
    'disable-funding': 'paylater,card',
    'data-partner-attribution-id': 'CodeFusion_SP',
    // Enable sandbox mode for testing
    'data-client-token': undefined,
    debug: true,
    // Add explicit sandbox environment
    env: 'sandbox' as const
  };

  // Handle script loading errors
  useEffect(() => {
    const handleScriptError = (event: ErrorEvent) => {
      console.error('PayPal script loading error:', event.error);
      setScriptError(true);
      toast.error('PayPal services are temporarily unavailable. Please try again later.');
    };

    // Listen for script errors
    window.addEventListener('error', handleScriptError);
    
    return () => {
      window.removeEventListener('error', handleScriptError);
    };
  }, []);

  if (scriptError) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">PayPal services are unavailable. Please refresh the page.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Refresh Page
        </button>
        {children}
      </div>
    );
  }

  return (
    <PayPalScriptProvider 
      options={paypalOptions} 
      deferLoading={false}
    >
      {children}
    </PayPalScriptProvider>
  );
};
