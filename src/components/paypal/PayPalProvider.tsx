
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

// PayPal client ID from your business dashboard - CORRECT BUSINESS ID
const PAYPAL_CLIENT_ID = 'Abrc68jTAU0GltdLz1FYYLMLaD5Y952gRrHtwrzeWI4-C8nlafFLdcH95KXpo3Fc6zYZsdIkiV7Jnl34';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const [scriptError, setScriptError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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

  // Test PayPal connectivity
  const testPayPalConnectivity = async () => {
    try {
      console.log('Testing PayPal connectivity...');
      const response = await fetch('https://www.paypal.com/sdk/js?client-id=test', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      console.log('PayPal connectivity test completed');
    } catch (error) {
      console.error('PayPal connectivity test failed:', error);
      toast.error('Network connectivity issue detected. Please check your internet connection.');
    }
  };

  // Handle script loading errors
  useEffect(() => {
    testPayPalConnectivity();

    const handleScriptError = (event: ErrorEvent) => {
      if (event.filename && event.filename.includes('paypal.com')) {
        console.error('PayPal script loading error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        });
        setScriptError(true);
        setIsRetrying(false);
        toast.error('PayPal services failed to load', {
          description: 'This might be due to network issues, ad blockers, or firewall restrictions.',
          duration: 8000
        });
      }
    };

    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLScriptElement;
      if (target && target.src && target.src.includes('paypal.com')) {
        console.error('PayPal resource loading error:', target.src);
        setScriptError(true);
        setIsRetrying(false);
      }
    };

    // Listen for script errors
    window.addEventListener('error', handleScriptError);
    document.addEventListener('error', handleResourceError, true);
    
    return () => {
      window.removeEventListener('error', handleScriptError);
      document.removeEventListener('error', handleResourceError, true);
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
            <strong>Client ID:</strong> {PAYPAL_CLIENT_ID.substring(0, 10)}...
            <br />
            <strong>Attempts:</strong> {retryCount}
          </p>
          <p className="text-[#9ca3af] mb-6">
            PayPal services couldn't be loaded. This might be due to:
            <br />• Network connectivity issues
            <br />• Ad blockers or browser extensions
            <br />• Firewall restrictions
            <br />• VPN or proxy blocking PayPal
          </p>
          <button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors mb-4"
          >
            {isRetrying ? 'Retrying...' : `Retry PayPal Load (${retryCount + 1})`}
          </button>
          <p className="text-xs text-[#6b7280] mb-4">
            If this persists, try disabling ad blockers or VPN
          </p>
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
