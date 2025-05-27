
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

// PayPal client ID for CodeFusion sandbox environment
const PAYPAL_CLIENT_ID = 'AfaF0EX_vYoZ5D3-P4RSCZ0FjFwHY3v88MhbcytGX9uTkQdDFrQKKFNDzwNsjdn3wPgSPsqrJsdho7RH';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const [scriptError, setScriptError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);

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
    debug: false, // Set to false to reduce console noise
    env: 'sandbox' as const
  };

  // Handle script loading errors with retry mechanism
  const handleRetry = () => {
    console.log('Retrying PayPal script load, attempt:', retryAttempts + 1);
    setScriptError(false);
    setRetryAttempts(prev => prev + 1);
    
    // Clear any existing PayPal scripts
    const existingScripts = document.querySelectorAll('script[src*="paypal.com"]');
    existingScripts.forEach(script => script.remove());
    
    // Force a page reload after 3 attempts
    if (retryAttempts >= 2) {
      toast.info('Multiple PayPal loading failures detected. Refreshing page...');
      setTimeout(() => window.location.reload(), 1000);
      return;
    }
    
    toast.info('Retrying PayPal connection...');
  };

  // Monitor for script loading errors
  useEffect(() => {
    const handleScriptError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('paypal') || 
          event.target instanceof HTMLScriptElement && 
          event.target.src?.includes('paypal')) {
        console.error('PayPal script loading error detected:', event);
        setScriptError(true);
        toast.error('PayPal services failed to load. This may be due to network restrictions.');
      }
    };

    const handleScriptLoad = (event: Event) => {
      if (event.target instanceof HTMLScriptElement && 
          event.target.src?.includes('paypal')) {
        console.log('PayPal script loaded successfully');
        setScriptError(false);
        setRetryAttempts(0);
      }
    };

    // Listen for script errors and successful loads
    window.addEventListener('error', handleScriptError, true);
    window.addEventListener('load', handleScriptLoad, true);
    
    return () => {
      window.removeEventListener('error', handleScriptError, true);
      window.removeEventListener('load', handleScriptLoad, true);
    };
  }, [retryAttempts]);

  if (scriptError) {
    return (
      <div className="text-center p-4">
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-red-400 font-medium mb-2">PayPal Services Unavailable</p>
          <p className="text-sm text-red-300 mb-3">
            PayPal failed to load. This may be due to:
          </p>
          <ul className="text-xs text-red-300 text-left mb-4 space-y-1">
            <li>• Network or firewall restrictions</li>
            <li>• Browser extensions blocking scripts</li>
            <li>• Corporate network security policies</li>
            <li>• Temporary PayPal service issues</li>
          </ul>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
          >
            Retry PayPal Connection
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <PayPalScriptProvider 
      options={paypalOptions} 
      deferLoading={false}
      onLoadStart={() => console.log('PayPal script loading started')}
      onLoadSuccess={() => {
        console.log('PayPal script loaded successfully');
        setScriptError(false);
        setRetryAttempts(0);
      }}
      onLoadError={(error) => {
        console.error('PayPal script loading failed:', error);
        setScriptError(true);
        toast.error('Failed to load PayPal services');
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
};
