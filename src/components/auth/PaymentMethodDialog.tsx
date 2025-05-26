
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Check, CreditCard, Loader, RefreshCw } from 'lucide-react';
import { usePayPalError } from '../paypal/usePayPalError';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTier: 'premium' | 'pro' | null;
  onSuccess: () => void;
}

const PLAN_IDS = {
  premium: 'P-3RX065706M3469222MYMALYQ',
  pro: 'P-5ML4271244454362PMYMALTQ',
};

const PLAN_PRICES = {
  premium: '$9.99',
  pro: '$19.99',
};

export const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  open,
  onOpenChange,
  selectedTier,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'creditCard'>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionStep, setSubscriptionStep] = useState<'select' | 'processing' | 'complete'>('select');
  const [scriptState, paypalDispatch] = usePayPalScriptReducer();
  const { updateUserProfile } = useAuth();
  const { handlePayPalError, resetError } = usePayPalError();

  console.log('PaymentMethodDialog rendered:', { open, selectedTier, subscriptionStep });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      console.log('Payment dialog opened');
      setSubscriptionStep('select');
      setIsProcessing(false);
      resetError();
    }
  }, [open, resetError]);

  const createSubscription = async (data: any, actions: any) => {
    if (!selectedTier) {
      const error = 'Please select a subscription tier';
      toast.error(error);
      return Promise.reject(new Error(error));
    }

    console.log('Creating subscription for tier:', selectedTier);
    setIsProcessing(true);
    setSubscriptionStep('processing');

    try {
      const planId = PLAN_IDS[selectedTier];
      console.log('Using plan ID:', planId);

      if (!planId) {
        throw new Error('Invalid subscription plan selected');
      }

      return actions.subscription.create({
        plan_id: planId,
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          brand_name: 'CodeFusion',
          locale: 'en-US',
          return_url: `${window.location.origin}/#/dashboard?subscription=success`,
          cancel_url: `${window.location.origin}/#/dashboard?subscription=cancelled`,
        }
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      handlePayPalError(error);
      setIsProcessing(false);
      setSubscriptionStep('select');
      return Promise.reject(error);
    }
  };

  const onApprove = async (data: any, actions: any) => {
    console.log('Subscription approved:', data);
    
    try {
      setSubscriptionStep('complete');
      
      // Store subscription information
      const subscriptionData = {
        id: data.subscriptionID,
        orderID: data.orderID,
        tier: selectedTier,
        status: 'active',
        createdAt: new Date().toISOString(),
        planId: PLAN_IDS[selectedTier!],
        facilityCode: data.facilitatorAccessToken || 'N/A'
      };

      console.log('Storing subscription data:', subscriptionData);

      // Save to localStorage for demo
      const existingSubscriptions = JSON.parse(localStorage.getItem('user_subscriptions') || '[]');
      const updatedSubscriptions = [...existingSubscriptions, subscriptionData];
      localStorage.setItem('user_subscriptions', JSON.stringify(updatedSubscriptions));

      // Update user profile
      await updateUserProfile({
        tier: selectedTier!,
        subscriptionId: data.subscriptionID
      });

      toast.success('Subscription Successful!', {
        description: `Welcome to ${selectedTier?.charAt(0).toUpperCase()}${selectedTier?.slice(1)}! Your subscription is now active.`,
        duration: 5000,
      });

      // Close dialog after short delay
      setTimeout(() => {
        onSuccess();
        setSubscriptionStep('select');
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      console.error('Error processing approved subscription:', error);
      handlePayPalError(error);
      setIsProcessing(false);
      setSubscriptionStep('select');
    }
  };

  const onError = (error: any) => {
    console.error('PayPal subscription error:', error);
    handlePayPalError(error);
    setIsProcessing(false);
    setSubscriptionStep('select');
  };

  const onCancel = (data: any) => {
    console.log('Subscription cancelled:', data);
    toast.info('Subscription process was cancelled');
    setIsProcessing(false);
    setSubscriptionStep('select');
  };

  if (!selectedTier) {
    console.log('No selected tier, not rendering dialog');
    return null;
  }

  const isScriptLoading = scriptState.isPending;
  const isScriptResolved = scriptState.isResolved;
  const isScriptRejected = scriptState.isRejected;

  console.log('Script state:', { isScriptLoading, isScriptResolved, isScriptRejected });

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      console.log('Dialog onOpenChange called:', newOpen);
      if (isProcessing && !newOpen) {
        toast.info("Please wait for the payment to complete");
        return;
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="bg-[#1a1f2c] border-[#2d3748] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            {subscriptionStep === 'complete' ? 'Subscription Complete!' : 'Choose Payment Method'}
          </DialogTitle>
          <DialogDescription className="text-[#9ca3af]">
            {subscriptionStep === 'complete' 
              ? `Your ${selectedTier} subscription has been activated`
              : `Subscribe to ${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} plan for ${PLAN_PRICES[selectedTier]}/month`
            }
          </DialogDescription>
        </DialogHeader>

        {subscriptionStep === 'complete' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <p className="text-green-400 font-medium">Payment Successful!</p>
            <p className="text-[#9ca3af] text-sm mt-2">You now have access to all {selectedTier} features.</p>
          </div>
        ) : (
          <div className="mt-4">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as 'paypal' | 'creditCard')}
              className="space-y-3"
              disabled={isProcessing}
            >
              <div className={`flex items-center space-x-2 rounded-lg border p-4 ${
                paymentMethod === 'paypal' ? 'border-[#6366f1] bg-[#1f2937]' : 'border-[#2d3748]'
              } ${isProcessing ? 'opacity-50' : ''}`}>
                <RadioGroupItem value="paypal" id="paypal" disabled={isProcessing} />
                <label htmlFor="paypal" className="flex items-center justify-between w-full cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0070ba] h-8 w-8 rounded-md flex items-center justify-center">
                      <span className="text-xs font-bold text-white">PP</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">PayPal</div>
                      <div className="text-xs text-[#9ca3af]">Safe and secure payments</div>
                    </div>
                  </div>
                  {paymentMethod === 'paypal' && <Check className="h-5 w-5 text-[#6366f1]" />}
                </label>
              </div>

              <div className={`flex items-center space-x-2 rounded-lg border p-4 border-[#2d3748] opacity-50`}>
                <RadioGroupItem value="creditCard" id="creditCard" disabled />
                <label htmlFor="creditCard" className="flex items-center justify-between w-full cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#374151] h-8 w-8 rounded-md flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Credit Card</div>
                      <div className="text-xs text-[#9ca3af]">Coming soon</div>
                    </div>
                  </div>
                </label>
              </div>
            </RadioGroup>

            <div className="mt-6">
              {paymentMethod === 'paypal' ? (
                <div className="space-y-4">
                  {subscriptionStep === 'processing' ? (
                    <div className="w-full py-4 text-center bg-[#2d3748] text-[#9ca3af] rounded-md flex items-center justify-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin text-[#6366f1]" />
                      <span>Processing your subscription...</span>
                    </div>
                  ) : isScriptLoading ? (
                    <div className="w-full py-4 text-center bg-[#2d3748] text-[#9ca3af] rounded-md flex items-center justify-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin text-[#6366f1]" />
                      <span>Loading PayPal...</span>
                    </div>
                  ) : isScriptRejected ? (
                    <div className="w-full py-4 text-center bg-red-900/20 border border-red-500/20 text-red-400 rounded-md">
                      <p className="mb-2">Failed to load PayPal</p>
                      <Button 
                        onClick={() => window.location.reload()}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    </div>
                  ) : isScriptResolved ? (
                    <div className="w-full">
                      <PayPalButtons
                        style={{ 
                          layout: 'vertical',
                          color: 'blue',
                          shape: 'rect',
                          label: 'subscribe',
                          height: 50
                        }}
                        createSubscription={createSubscription}
                        onApprove={onApprove}
                        onError={onError}
                        onCancel={onCancel}
                        disabled={isProcessing}
                      />
                    </div>
                  ) : (
                    <div className="w-full py-4 text-center bg-[#2d3748] text-[#9ca3af] rounded-md">
                      Initializing PayPal...
                    </div>
                  )}
                  
                  <div className="text-xs text-[#9ca3af] text-center">
                    By subscribing, you agree to our Terms of Service
                  </div>
                </div>
              ) : (
                <Button disabled className="w-full bg-[#2d3748] text-[#9ca3af] cursor-not-allowed">
                  Credit Card Coming Soon
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
