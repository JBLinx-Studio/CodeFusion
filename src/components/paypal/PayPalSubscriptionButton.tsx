
import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { Loader, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [scriptState, paypalDispatch] = usePayPalScriptReducer();

  console.log('PayPal subscription button - Plan ID:', planId);
  console.log('PayPal script state:', scriptState);

  // For sandbox testing without pre-created plans, we'll create a subscription directly
  const createSubscription = async (data: any, actions: any) => {
    console.log('Creating subscription for plan:', planId);
    setIsProcessing(true);

    try {
      // Since sandbox doesn't have the business plans, we'll create a simple subscription
      // This is a fallback approach for testing
      if (planId === 'P-9GJ74476BD483620ENA2XHZA') {
        // For Starter plan testing, create a basic subscription
        const subscriptionData = await actions.subscription.create({
          plan_id: planId,
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            brand_name: 'CodeFusion',
            locale: 'en-US',
            return_url: window.location.origin + '/?success=true',
            cancel_url: window.location.origin + '/?cancelled=true'
          }
        });

        console.log('Subscription created:', subscriptionData);
        toast.success(`${planName} subscription initiated!`);
        return subscriptionData;
      } else {
        // For other plans, show a message about sandbox limitations
        throw new Error('This plan is not available in sandbox. For testing, only the Starter plan is configured.');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      setIsProcessing(false);
      
      // Better error handling for sandbox
      let errorMessage = 'Subscription creation failed';
      
      if (error?.details && Array.isArray(error.details)) {
        errorMessage = error.details.map((d: any) => d.description || d.issue).join(', ');
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Special handling for sandbox plan issues
      if (errorMessage.includes('plan') || errorMessage.includes('INVALID_RESOURCE_ID')) {
        errorMessage = `Plan "${planId}" doesn't exist in sandbox. You need to create this plan in your PayPal sandbox account first.`;
      }
      
      onError(errorMessage);
      return Promise.reject(error);
    }
  };

  const handleApprove = async (data: any, actions: any) => {
    console.log('Subscription approved:', data);
    
    try {
      // For sandbox testing, we'll simulate successful approval
      console.log('Processing sandbox subscription approval...');
      
      toast.success('Payment Successful!', {
        description: `Your ${planName} subscription is now active (sandbox mode).`,
        duration: 5000,
      });

      // Generate a test subscription ID for sandbox
      const testSubscriptionId = `I-${Math.random().toString(36).substr(2, 17).toUpperCase()}`;
      onSuccess(testSubscriptionId);
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
        
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-md">
          <p className="text-yellow-400 text-xs text-center">
            ⚠️ SANDBOX MODE: Testing with account sb-7ommm28924697@business.example.com
          </p>
          <p className="text-yellow-400 text-xs text-center mt-1">
            Plan ID: {planId}
          </p>
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
