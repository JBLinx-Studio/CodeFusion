
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

// Use SANDBOX Client ID for testing first
const PAYPAL_CLIENT_ID = 'AfaF0EX_vYoZ5D3-P4RSCZ0FjFwHY3v88MhbcytGX9uTkQdDFrQKKFNDzwNsjdn3wPgSPsqrJsdho7RH';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const [scriptError, setScriptError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Sandbox configuration for testing
  const paypalOptions = {
    clientId: PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'subscription',
    vault: true,
    components: 'buttons',
    'enable-funding': 'paypal',
    'disable-funding': 'paylater,card',
    debug: true,
    // Use sandbox environment for testing
    'data-sdk-integration-source': 'button-factory'
  };

  const handleRetry = () => {
    console.log('Retrying PayPal script load... Attempt:', retryCount + 1);
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Clear any existing PayPal scripts
    const existingScripts = document.querySelectorAll('script[src*="paypal.com"]');
    existingScripts.forEach(script => script.remove());
    
    setTimeout(() => {
      setScriptError(false);
      setIsRetrying(false);
    }, 1000);
  };

  // Handle script loading errors
  useEffect(() => {
    const handleScriptError = (event: ErrorEvent) => {
      if (event.filename && event.filename.includes('paypal.com')) {
        console.error('PayPal script loading error:', {
          message: event.message,
          filename: event.filename,
          error: event.error
        });
        setScriptError(true);
        setIsRetrying(false);
        toast.error('PayPal services failed to load', {
          description: 'This might be due to network issues or browser restrictions.',
          duration: 8000
        });
      }
    };

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
          <p className="text-[#9ca3af] mb-4 text-sm">
            <strong>Environment:</strong> Sandbox Testing
            <br />
            <strong>Client ID:</strong> {PAYPAL_CLIENT_ID.substring(0, 10)}...
            <br />
            <strong>Attempts:</strong> {retryCount}
          </p>
          <p className="text-[#9ca3af] mb-6">
            PayPal sandbox services couldn't be loaded. This might be due to:
            <br />• Network connectivity issues
            <br />• Browser blocking PayPal scripts
            <br />• Ad blockers or extensions
            <br />• Firewall restrictions
          </p>
          <button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors mb-4"
          >
            {isRetrying ? 'Retrying...' : `Retry PayPal Load (${retryCount + 1})`}
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
