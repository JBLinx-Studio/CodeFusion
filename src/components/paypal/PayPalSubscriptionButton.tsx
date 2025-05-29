
import React, { useState, useEffect } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { Loader, RefreshCw, TestTube, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PayPalConfigService } from '@/services/PayPalConfigService';

interface PayPalSubscriptionButtonProps {
  planId: string;
  planName: string;
  onSuccess: (subscriptionId: string) => void;
  onError: (error: any) => void;
  disabled?: boolean;
}

export const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
  planId,
  planName,
  onSuccess,
  onError,
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actualPlanId, setActualPlanId] = useState<string>(planId);
  const [scriptState, paypalDispatch] = usePayPalScriptReducer();
  
  const configService = PayPalConfigService.getInstance();
  const config = configService.getConfig();

  console.log('PayPal subscription button initialized:', {
    planId,
    actualPlanId,
    environment: config.environment,
    isTestMode: config.isTestMode
  });

  // Get the correct plan ID based on environment
  useEffect(() => {
    const initializePlanId = async () => {
      if (config.isTestMode) {
        try {
          const sandboxPlanId = await configService.ensureSandboxPlan();
          setActualPlanId(sandboxPlanId);
          console.log('Using sandbox plan ID:', sandboxPlanId);
        } catch (error) {
          console.error('Failed to get sandbox plan ID:', error);
          setActualPlanId('SANDBOX_FALLBACK_PLAN');
        }
      } else {
        setActualPlanId(planId);
        console.log('Using live plan ID:', planId);
      }
    };

    initializePlanId();
  }, [planId, config.isTestMode]);

  const createSubscription = async (data: any, actions: any) => {
    console.log('Creating subscription for plan:', actualPlanId);
    setIsProcessing(true);

    try {
      if (config.isTestMode && actualPlanId === 'SANDBOX_FALLBACK_PLAN') {
        // Fallback for sandbox testing when plan creation fails
        console.log('Using fallback subscription creation for sandbox');
        
        const subscriptionData = await actions.subscription.create({
          plan_id: actualPlanId,
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            brand_name: 'CodeFusion',
            locale: 'en-US',
            return_url: window.location.origin + '/?success=true',
            cancel_url: window.location.origin + '/?cancelled=true'
          }
        });

        console.log('Fallback subscription created:', subscriptionData);
        return subscriptionData;
      } else {
        // Standard subscription creation
        const subscriptionData = await actions.subscription.create({
          plan_id: actualPlanId,
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            brand_name: 'CodeFusion',
            locale: 'en-US',
            return_url: window.location.origin + '/?success=true',
            cancel_url: window.location.origin + '/?cancelled=true'
          }
        });

        console.log('Subscription created successfully:', subscriptionData);
        toast.success(`${planName} subscription initiated!`, {
          description: `Environment: ${config.environment}`
        });
        return subscriptionData;
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      setIsProcessing(false);
      
      let errorMessage = 'Subscription creation failed';
      
      if (error?.details && Array.isArray(error.details)) {
        errorMessage = error.details.map((d: any) => d.description || d.issue).join(', ');
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      onError(errorMessage);
      return Promise.reject(error);
    }
  };

  const handleApprove = async (data: any, actions: any) => {
    console.log('Subscription approved:', data);
    
    try {
      const details = await actions.subscription.get();
      console.log('Subscription details:', details);
      
      toast.success('Payment Successful!', {
        description: `Your ${planName} subscription is now active (${config.environment}).`,
        duration: 5000,
      });

      onSuccess(data.subscriptionID);
    } catch (error) {
      console.error('Error processing approved subscription:', error);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: any) => {
    console.error('PayPal subscription error:', error);
    setIsProcessing(false);
    
    let errorMessage = 'Payment processing failed';
    
    if (error?.message) {
      if (error.message.includes('popup') || error.message.includes('window')) {
        errorMessage = 'Payment popup was blocked or closed. Please allow popups and try again.';
      } else {
        errorMessage = error.message;
      }
    }
    
    onError(errorMessage);
  };

  const handleCancel = (data: any) => {
    console.log('Subscription cancelled:', data);
    setIsProcessing(false);
    toast.info('Payment cancelled');
  };

  if (scriptState.isPending) {
    return (
      <div className="w-full py-4 text-center bg-[#2d3748] text-[#9ca3af] rounded-md flex items-center justify-center space-x-2">
        <Loader className="w-5 h-5 animate-spin text-[#6366f1]" />
        <span>Loading PayPal...</span>
      </div>
    );
  }

  if (scriptState.isRejected) {
    return (
      <div className="w-full py-4 text-center bg-red-900/20 border border-red-500/20 text-red-400 rounded-md">
        <p className="mb-2">Failed to load PayPal SDK</p>
        <Button 
          onClick={() => window.location.reload()}
          size="sm"
          className="bg-red-600 hover:bg-red-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (scriptState.isResolved) {
    return (
      <div className="w-full">
        <PayPalButtons
          style={{ 
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'subscribe',
            height: 50
          }}
          createSubscription={createSubscription}
          onApprove={handleApprove}
          onError={handleError}
          onCancel={handleCancel}
          disabled={disabled || isProcessing}
        />
        
        <div className={`mt-4 p-3 rounded-md border ${
          config.isTestMode 
            ? 'bg-yellow-900/20 border-yellow-500/20' 
            : 'bg-green-900/20 border-green-500/20'
        }`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            {config.isTestMode ? (
              <TestTube className="w-4 h-4 text-yellow-400" />
            ) : (
              <Globe className="w-4 h-4 text-green-400" />
            )}
            <p className={`text-xs font-medium ${
              config.isTestMode ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {config.isTestMode ? 'SANDBOX TESTING MODE' : 'LIVE PAYMENT MODE'}
            </p>
          </div>
          <p className="text-xs text-center text-gray-400">
            Environment: {config.environment}
          </p>
          <p className="text-xs text-center text-gray-400">
            Plan ID: {actualPlanId.substring(0, 25)}...
          </p>
          {config.isTestMode && (
            <p className="text-xs text-center text-blue-400 mt-2">
              Use sandbox PayPal credentials for testing
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 text-center bg-[#2d3748] text-[#9ca3af] rounded-md">
      Initializing PayPal...
    </div>
  );
};
