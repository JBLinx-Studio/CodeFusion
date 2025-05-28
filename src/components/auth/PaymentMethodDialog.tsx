
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Check, CreditCard, AlertCircle } from 'lucide-react';
import { PayPalSubscriptionButton } from '../paypal/PayPalSubscriptionButton';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTier: 'starter' | 'developer' | 'pro' | 'team-starter' | 'team-pro' | null;
  onSuccess: () => void;
}

// Use the CORRECT Plan ID from your business dashboard - but for testing, we need sandbox plan IDs
// NOTE: You'll need to create this plan in your SANDBOX account, not business account
const PLAN_IDS = {
  starter: 'P-9GJ74476BD483620ENA2XHZA', // This should be created in SANDBOX for testing
  developer: 'P-CODEFUSION-DEVELOPER-MONTHLY-2024',
  pro: 'P-CODEFUSION-PRO-MONTHLY-2024',
  'team-starter': 'P-CODEFUSION-TEAM-STARTER-MONTHLY-2024',
  'team-pro': 'P-CODEFUSION-TEAM-PRO-MONTHLY-2024',
};

const PLAN_PRICES = {
  starter: '$5.00',
  developer: '$9.00',
  pro: '$19.00',
  'team-starter': '$15.00',
  'team-pro': '$35.00',
};

const PLAN_NAMES = {
  starter: 'Starter',
  developer: 'Developer', 
  pro: 'Pro',
  'team-starter': 'Team Starter',
  'team-pro': 'Team Pro',
};

export const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  open,
  onOpenChange,
  selectedTier,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'creditCard'>('paypal');
  const [subscriptionStep, setSubscriptionStep] = useState<'select' | 'processing' | 'complete' | 'error'>('select');
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const { updateUserProfile } = useAuth();

  console.log('PaymentMethodDialog - selectedTier:', selectedTier);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      console.log('Payment dialog opened - resetting state');
      setSubscriptionStep('select');
      setSubscriptionId(null);
      setErrorDetails('');
    }
  }, [open]);

  const handlePaymentSuccess = async (subscriptionId: string) => {
    console.log('Payment successful - subscription ID:', subscriptionId);
    
    try {
      setSubscriptionStep('processing');
      
      // Store subscription data
      const subscriptionData = {
        id: subscriptionId,
        tier: selectedTier,
        status: 'active',
        createdAt: new Date().toISOString(),
        planId: PLAN_IDS[selectedTier!]
      };

      // Store in localStorage for testing
      const existingSubscriptions = JSON.parse(localStorage.getItem('user_subscriptions') || '[]');
      const updatedSubscriptions = [...existingSubscriptions, subscriptionData];
      localStorage.setItem('user_subscriptions', JSON.stringify(updatedSubscriptions));

      // Update user profile
      await updateUserProfile({
        tier: selectedTier!,
        subscriptionId: subscriptionId
      });

      setSubscriptionId(subscriptionId);
      setSubscriptionStep('complete');

      setTimeout(() => {
        onSuccess();
        setSubscriptionStep('select');
      }, 3000);

    } catch (error) {
      console.error('Error processing successful payment:', error);
      setErrorDetails('Failed to update user profile after successful payment');
      setSubscriptionStep('error');
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error details:', error);
    
    let errorMessage = 'Unknown payment error';
    
    if (error?.details && Array.isArray(error.details)) {
      errorMessage = error.details.map((d: any) => d.description || d.issue || 'Payment error').join(', ');
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    setErrorDetails(errorMessage);
    setSubscriptionStep('error');
    
    toast.error('Payment Failed', {
      description: errorMessage,
      duration: 8000,
    });
  };

  const retryPayment = () => {
    console.log('Retrying payment process');
    setSubscriptionStep('select');
    setErrorDetails('');
  };

  if (!selectedTier) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1f2c] border-[#2d3748] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            {subscriptionStep === 'complete' ? 'Payment Successful!' : 
             subscriptionStep === 'error' ? 'Payment Failed' :
             subscriptionStep === 'processing' ? 'Processing Payment...' :
             'Choose Payment Method'}
          </DialogTitle>
          <DialogDescription className="text-[#9ca3af]">
            {subscriptionStep === 'complete' 
              ? `Your ${PLAN_NAMES[selectedTier]} subscription has been activated`
              : subscriptionStep === 'error'
              ? 'There was an issue processing your payment'
              : subscriptionStep === 'processing'
              ? 'Please wait while we process your payment'
              : `Subscribe to ${PLAN_NAMES[selectedTier]} plan for ${PLAN_PRICES[selectedTier]}/month`
            }
          </DialogDescription>
        </DialogHeader>

        {subscriptionStep === 'complete' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <p className="text-green-400 font-medium">Payment Successful!</p>
            <p className="text-[#9ca3af] text-sm mt-2">
              Subscription ID: {subscriptionId?.substring(0, 15)}...
            </p>
          </div>
        ) : subscriptionStep === 'error' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-red-400 font-medium">Payment Failed</p>
            <p className="text-[#9ca3af] text-sm mt-2 mb-4">
              {errorDetails || 'Please try again or contact support.'}
            </p>
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-4">
              <p className="text-red-400 text-xs">
                <strong>Possible Issues:</strong><br/>
                • Plan ID might not exist in sandbox<br/>
                • Using business plan ID in sandbox environment<br/>
                • Subscription setup mismatch
              </p>
            </div>
            <Button 
              onClick={retryPayment}
              className="mt-4 bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as 'paypal' | 'creditCard')}
              className="space-y-3"
            >
              <div className={`flex items-center space-x-2 rounded-lg border p-4 ${
                paymentMethod === 'paypal' ? 'border-[#6366f1] bg-[#1f2937]' : 'border-[#2d3748]'
              }`}>
                <RadioGroupItem value="paypal" id="paypal" />
                <label htmlFor="paypal" className="flex items-center justify-between w-full cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0070ba] h-8 w-8 rounded-md flex items-center justify-center">
                      <span className="text-xs font-bold text-white">PP</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">PayPal</div>
                      <div className="text-xs text-[#9ca3af]">Sandbox testing mode</div>
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
              {paymentMethod === 'paypal' && (
                <div className="space-y-4">
                  <PayPalSubscriptionButton
                    planId={PLAN_IDS[selectedTier]}
                    planName={PLAN_NAMES[selectedTier]}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    disabled={subscriptionStep === 'processing'}
                  />
                  
                  <div className="text-xs text-[#9ca3af] text-center">
                    <p>⚠️ IMPORTANT: Using business plan ID in sandbox</p>
                    <p>✓ Plan ID: {PLAN_IDS[selectedTier]}</p>
                    <p className="text-yellow-400 mt-1">
                      If payment fails, you need to create this plan in your SANDBOX account
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
