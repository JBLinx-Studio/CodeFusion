
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

  const createSubscription = async (data: any, actions: any) => {
    console.log('Creating subscription with plan ID:', planId);
    setIsProcessing(true);

    try {
      const subscriptionData = await actions.subscription.create({
        plan_id: planId,
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          brand_name: 'CodeFusion',
          locale: 'en-US'
        }
      });

      console.log('Subscription created successfully:', subscriptionData);
      toast.success(`${planName} subscription created! Complete the payment.`);
      return subscriptionData;
    } catch (error) {
      console.error('Error creating subscription:', error);
      setIsProcessing(false);
      onError(error);
      return Promise.reject(error);
    }
  };

  const handleApprove = async (data: any, actions: any) => {
    console.log('Subscription approved:', data);
    
    try {
      const details = await actions.subscription.get();
      console.log('Subscription details:', details);
      
      toast.success('Payment Successful!', {
        description: `Your ${planName} subscription is now active.`,
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
    onError(error);
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
      </div>
    );
  }

  return (
    <div className="w-full py-4 text-center bg-[#2d3748] text-[#9ca3af] rounded-md">
      Initializing PayPal...
    </div>
  );
};
