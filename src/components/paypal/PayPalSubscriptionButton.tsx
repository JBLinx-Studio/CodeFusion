
import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, X } from 'lucide-react';

// Subscription plan IDs - these are sandbox plan IDs that work with the provided credentials
const PLAN_IDS = {
  premium: 'P-3RX065706M3469222MYMALYQ', // Example sandbox plan ID
  pro: 'P-5ML4271244454362PMYMALTQ',     // Example sandbox plan ID
};

interface PayPalSubscriptionButtonProps {
  tier: 'premium' | 'pro';
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

export const PayPalSubscriptionButton: React.FC<PayPalSubscriptionButtonProps> = ({
  tier,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);
  const { updateUserProfile, authState } = useAuth();

  const handleCreateSubscription = async (data: any, actions: any) => {
    try {
      console.log('Creating subscription for plan:', tier);
      return actions.subscription.create({
        plan_id: tier === 'premium' ? PLAN_IDS.premium : PLAN_IDS.pro,
        application_context: {
          shipping_preference: 'NO_SHIPPING'
        }
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
      
      // Store subscription data for later management
      const subscriptionData = {
        id: data.subscriptionID,
        tier: tier,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage for demo purposes
      // In a real app, this would be stored in your backend
      const subscriptions = JSON.parse(localStorage.getItem('user_subscriptions') || '[]');
      subscriptions.push(subscriptionData);
      localStorage.setItem('user_subscriptions', JSON.stringify(subscriptions));
      
      toast.success('Subscription successful!', {
        description: `Thank you for subscribing to ${tier.charAt(0).toUpperCase() + tier.slice(1)}!`,
      });
      
      // Update user profile with subscription details
      updateUserProfile({
        tier: tier,
        subscriptionId: data.subscriptionID
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
    if (onCancel) onCancel();
  };

  // Don't allow subscription to the current tier
  const isCurrentTier = authState.user?.tier === tier;

  // If PayPal is not loaded properly, show error
  if (isRejected) {
    return (
      <div className="w-full py-3 text-center bg-red-900/30 text-red-400 rounded-md">
        PayPal failed to load. Please refresh and try again.
      </div>
    );
  }

  return (
    <>
      {isPending || isProcessing ? (
        <div className="w-full py-3 text-center bg-[#2d3748] text-[#9ca3af] rounded-md flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-t-[#6366f1] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
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
