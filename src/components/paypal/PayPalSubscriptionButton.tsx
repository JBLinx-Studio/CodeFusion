
import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Subscription plan IDs - these would come from your PayPal dashboard
const PLAN_IDS = {
  premium: 'P-9SR30198RG065044UMVLT4KA', // Example sandbox plan ID
  pro: 'P-95L96850TB8459310MVLT4XY', // Example sandbox plan ID
};

interface PayPalSubscriptionButtonProps {
  tier: 'premium' | 'pro';
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
  tier,
  onSuccess,
  onError,
}) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);
  const { updateUserProfile, authState } = useAuth();

  const handleCreateSubscription = async (data: any, actions: any) => {
    try {
      return actions.subscription.create({
        plan_id: tier === 'premium' ? PLAN_IDS.premium : PLAN_IDS.pro,
      });
    } catch (error) {
      console.error('Failed to create subscription:', error);
      toast.error('Failed to create subscription');
      if (onError) onError(error as Error);
      return null;
    }
  };

  const handleApprove = async (data: any) => {
    setIsProcessing(true);
    try {
      console.log('Subscription approved:', data);
      toast.success('Subscription successful!', {
        description: `Thank you for subscribing to ${tier.charAt(0).toUpperCase() + tier.slice(1)}!`,
      });
      
      // Update user profile with subscription details
      updateUserProfile({
        tier: tier,
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error processing subscription:', error);
      toast.error('Failed to process subscription');
      if (onError) onError(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: any) => {
    console.error('PayPal error:', error);
    toast.error('PayPal encountered an error');
    if (onError) onError(new Error('PayPal error: ' + (error.message || 'Unknown error')));
  };

  const handleCancel = () => {
    toast.info('Subscription canceled');
  };

  // Don't allow subscription to the current tier
  const isCurrentTier = authState.user?.tier === tier;

  return (
    <>
      {isPending || isProcessing ? (
        <div className="w-full py-3 text-center bg-[#2d3748] text-[#9ca3af] rounded-md">
          Processing...
        </div>
      ) : (
        <div className={isCurrentTier ? "opacity-60 pointer-events-none" : ""}>
          <PayPalButtons
            style={{ 
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'subscribe',
              height: 40
            }}
            disabled={isCurrentTier}
            createSubscription={handleCreateSubscription}
            onApprove={handleApprove}
            onError={handleError}
            onCancel={handleCancel}
          />
        </div>
      )}
    </>
  );
};
