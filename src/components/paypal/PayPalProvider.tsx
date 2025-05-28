
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

// PayPal client ID for CodeFusion sandbox environment - CORRECT SANDBOX ID
const PAYPAL_CLIENT_ID = 'AfaF0EX_vYoZ5D3-P4RSCZ0FjFwHY3v88MhbcytGX9uTkQdDFrQKKFNDzwNsjdn3wPgSPsqrJsdho7RH';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const [scriptError, setScriptError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

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
    debug: true,
    // Explicit sandbox environment
    env: 'sandbox' as const
  };

  const handleRetry = () => {
    console.log('Retrying PayPal script load...');
    setIsRetrying(true);
    setScriptError(false);
    
    // Force reload by refreshing the page
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Handle script loading errors
  useEffect(() => {
    const handleScriptError = (event: ErrorEvent) => {
      console.error('PayPal script loading error:', event.error);
      console.error('Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
      setScriptError(true);
      setIsRetrying(false);
      toast.error('PayPal services failed to load. This might be due to network issues or ad blockers.');
    };

    // Listen for script errors
    window.addEventListener('error', handleScriptError);
    
    return () => {
      window.removeEventListener('error', handleScriptError);
    };
  }, []);

  if (scriptError) {
    return (
      <div className="min-h-screen bg-[#0c1018] flex items-center justify-center">
        <div className="text-center p-8 bg-[#1a1f2c] border border-[#2d3748] rounded-lg max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">!</span>
          </div>
          <h3 className="text-white text-xl font-semibold mb-4">PayPal Failed to Load</h3>
          <p className="text-[#9ca3af] mb-6">
            PayPal services couldn't be loaded. This might be due to:
            <br />• Network connectivity issues
            <br />• Ad blockers or browser extensions
            <br />• Firewall restrictions
          </p>
          <button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            {isRetrying ? 'Retrying...' : 'Retry PayPal Load'}
          </button>
          <div className="mt-6 pt-6 border-t border-[#2d3748]">
            {children}
          </div>
        </div>
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
