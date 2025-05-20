
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Check, CreditCard, Loader } from 'lucide-react';
import { usePayPalError } from '../paypal/usePayPalError';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTier: 'premium' | 'pro' | null;
  onSuccess: () => void;
}

// PayPal plan IDs for the sandbox environment
const PLAN_IDS = {
  premium: 'P-3RX065706M3469222MYMALYQ',
  pro: 'P-5ML4271244454362PMYMALTQ',
};

export const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  open,
  onOpenChange,
  selectedTier,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'creditCard'>('paypal');
  const [isLoading, setIsLoading] = useState(false);
  const [paypalInitialized, setPaypalInitialized] = useState(false);
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);
  const { updateUserProfile } = useAuth();
  const { handlePayPalError, resetError } = usePayPalError();

  // Reset state when dialog opens or closes
  useEffect(() => {
    if (!open) {
      setIsLoading(false);
      setSubscriptionCreated(false);
      resetError();
    }
  }, [open, resetError]);

  const handleCreateSubscription = (data: any, actions: any) => {
    if (!selectedTier) {
      toast.error("No subscription tier selected");
      return null;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Creating subscription for plan:', selectedTier);
      setPaypalInitialized(true);
      
      // Create the subscription with the appropriate plan ID
      return actions.subscription.create({
        plan_id: selectedTier === 'premium' ? PLAN_IDS.premium : PLAN_IDS.pro,
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW' // Changed to SUBSCRIBE_NOW to complete the flow immediately
        }
      }).then((orderId: string) => {
        console.log('Subscription created with order ID:', orderId);
        setSubscriptionCreated(true);
        return orderId;
      }).catch((error: any) => {
        console.error('Failed to create subscription:', error);
        handlePayPalError(error);
        setIsLoading(false);
        return null;
      });
    } catch (error) {
      console.error('Exception creating subscription:', error);
      handlePayPalError(error);
      setIsLoading(false);
      return null;
    }
  };

  const handleApprove = async (data: any) => {
    try {
      console.log('Subscription approved:', data);
      
      if (!selectedTier) {
        toast.error("No subscription tier selected");
        return;
      }
      
      // Store subscription data for later management
      const subscriptionData = {
        id: data.subscriptionID,
        tier: selectedTier,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage for demo purposes
      const subscriptions = JSON.parse(localStorage.getItem('user_subscriptions') || '[]');
      subscriptions.push(subscriptionData);
      localStorage.setItem('user_subscriptions', JSON.stringify(subscriptions));
      
      toast.success('Subscription successful!', {
        description: `Thank you for subscribing to ${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}!`,
      });
      
      // Update user profile with subscription details
      updateUserProfile({
        tier: selectedTier,
        subscriptionId: data.subscriptionID
      });
      
      // Call the success callback which will close this dialog
      onSuccess();
    } catch (error) {
      console.error('Error processing subscription:', error);
      handlePayPalError(error);
      setIsLoading(false);
    }
  };

  const handleError = (error: any) => {
    console.error('PayPal error:', error);
    handlePayPalError(error);
    setIsLoading(false);
    setPaypalInitialized(false);
  };

  const handleCancel = () => {
    toast.info('Subscription process was canceled');
    setIsLoading(false);
    setPaypalInitialized(false);
  };

  // If no tier is selected, don't show the dialog
  if (!selectedTier) return null;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only allow closing if not currently loading
      if (isLoading && newOpen === false) {
        toast.info("Please wait until the payment process completes");
        return;
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="bg-[#1a1f2c] border-[#2d3748] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            Choose Payment Method
          </DialogTitle>
          <DialogDescription className="text-[#9ca3af]">
            Select how you'd like to pay for your {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} subscription
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <RadioGroup
            defaultValue="paypal"
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as 'paypal' | 'creditCard')}
            className="space-y-3"
          >
            <div className={`flex items-center space-x-2 rounded-lg border p-4 
              ${paymentMethod === 'paypal' ? 'border-[#6366f1] bg-[#1f2937]' : 'border-[#2d3748]'}`}
            >
              <RadioGroupItem value="paypal" id="paypal" />
              <label htmlFor="paypal" className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-[#0070ba] h-8 w-8 rounded-md flex items-center justify-center">
                    <span className="text-xs font-bold text-white">Pay</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">PayPal</div>
                    <div className="text-xs text-[#9ca3af]">Safe and easy payments</div>
                  </div>
                </div>
                {paymentMethod === 'paypal' && (
                  <Check className="h-5 w-5 text-[#6366f1]" />
                )}
              </label>
            </div>

            <div className={`flex items-center space-x-2 rounded-lg border p-4 
              ${paymentMethod === 'creditCard' ? 'border-[#6366f1] bg-[#1f2937]' : 'border-[#2d3748]'} opacity-50`}
            >
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
                {paymentMethod === 'creditCard' && (
                  <Check className="h-5 w-5 text-[#6366f1]" />
                )}
              </label>
            </div>
          </RadioGroup>

          <div className="mt-6">
            {paymentMethod === 'paypal' ? (
              <div className="space-y-4">
                <p className="text-sm text-[#9ca3af]">
                  Click the PayPal button below to complete your {selectedTier} subscription.
                </p>
                
                {isLoading ? (
                  <div className="w-full py-3 text-center bg-[#2d3748] text-[#9ca3af] rounded-md flex items-center justify-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin text-[#6366f1]" />
                    <span>Processing payment...</span>
                  </div>
                ) : (
                  <div className="w-full overflow-hidden rounded-md">
                    <PayPalButtons
                      style={{ 
                        layout: 'vertical',
                        color: 'blue',
                        shape: 'rect',
                        label: 'subscribe',
                        height: 45
                      }}
                      fundingSource="paypal"
                      createSubscription={handleCreateSubscription}
                      onApprove={handleApprove}
                      onError={handleError}
                      onCancel={handleCancel}
                      disabled={isLoading || subscriptionCreated}
                    />
                  </div>
                )}
                
                <div className="text-xs text-[#9ca3af] text-center">
                  By subscribing, you agree to our Terms and Conditions
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button disabled className="w-full bg-[#2d3748] text-[#9ca3af] cursor-not-allowed">
                  Credit Card Coming Soon
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 rounded-md bg-[#2d3748]/30 border border-[#3e4a69] text-xs">
          <h4 className="font-medium text-[#d1d5db]">Test Payment Information</h4>
          <p className="text-[#9ca3af] mt-1">
            This is a sandbox environment. Use these test credentials:
          </p>
          <div className="bg-[#1a1f2c] p-1.5 rounded mt-2 font-mono text-[10px] text-[#d1d5db]">
            Email: sb-47nmps29800276@personal.example.com<br />
            Password: M3@Y5!zi
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
