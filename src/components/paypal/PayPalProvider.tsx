
import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { PayPalConfigService } from '@/services/PayPalConfigService';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  const [scriptError, setScriptError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  const configService = PayPalConfigService.getInstance();
  const config = configService.getConfig();

  // Initialize PayPal configuration
  useEffect(() => {
    const initializePayPal = async () => {
      try {
        setIsInitializing(true);
        
        if (config.isTestMode) {
          console.log('Initializing PayPal in sandbox mode...');
          await configService.ensureSandboxPlan();
        } else {
          console.log('Initializing PayPal in live mode...');
        }
        
        setIsInitializing(false);
      } catch (error) {
        console.error('PayPal initialization error:', error);
        setScriptError(true);
        setIsInitializing(false);
      }
    };

    initializePayPal();
  }, []);

  const paypalOptions = {
    clientId: config.clientId,
    currency: 'USD',
    intent: 'subscription',
    vault: true,
    components: 'buttons',
    debug: config.isTestMode,
    'enable-funding': 'paypal,paylater,card',
    'data-environment': config.environment
  };

  const handleRetry = () => {
    console.log('Retrying PayPal script load... Attempt:', retryCount + 1);
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Clear any existing PayPal scripts
    const existingScripts = document.querySelectorAll('script[src*="paypal.com"]');
    existingScripts.forEach(script => script.remove());
    
    // Clear sandbox data and retry
    if (config.isTestMode) {
      configService.clearSandboxData();
    }
    
    setTimeout(() => {
      setScriptError(false);
      setIsRetrying(false);
      window.location.reload();
    }, 1000);
  };

  // Handle script loading errors
  useEffect(() => {
    const handleScriptError = (event: ErrorEvent) => {
      if (event.filename && event.filename.includes('paypal.com')) {
        console.error('PayPal script loading error:', {
          message: event.message,
          filename: event.filename,
          error: event.error,
          environment: config.environment
        });
        setScriptError(true);
        setIsRetrying(false);
        toast.error('PayPal services failed to load', {
          description: `Environment: ${config.environment}. Check network connection.`,
          duration: 8000
        });
      }
    };

    window.addEventListener('error', handleScriptError);
    
    return () => {
      window.removeEventListener('error', handleScriptError);
    };
  }, [config.environment]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0c1018] flex items-center justify-center">
        <div className="text-center p-8 bg-[#1a1f2c] border border-[#2d3748] rounded-lg max-w-md">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl">⚡</span>
          </div>
          <h3 className="text-white text-xl font-semibold mb-4">Initializing PayPal</h3>
          <p className="text-[#9ca3af] mb-4 text-sm">
            <strong>Environment:</strong> {config.environment}
            <br />
            <strong>Mode:</strong> {config.isTestMode ? 'Test Mode' : 'Live Mode'}
          </p>
        </div>
      </div>
    );
  }

  if (scriptError) {
    return (
      <div className="min-h-screen bg-[#0c1018] flex items-center justify-center">
        <div className="text-center p-8 bg-[#1a1f2c] border border-[#2d3748] rounded-lg max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">!</span>
          </div>
          <h3 className="text-white text-xl font-semibold mb-4">PayPal Failed to Load</h3>
          <p className="text-[#9ca3af] mb-4 text-sm">
            <strong>Environment:</strong> {config.environment}
            <br />
            <strong>Client ID:</strong> {config.clientId.substring(0, 20)}...
            <br />
            <strong>Attempts:</strong> {retryCount}
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
