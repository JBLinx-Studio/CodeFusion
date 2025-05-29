
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Check, CreditCard, AlertCircle, TestTube, Globe } from 'lucide-react';
import { PayPalSubscriptionButton } from '../paypal/PayPalSubscriptionButton';
import { PayPalConfigService } from '@/services/PayPalConfigService';

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTier: 'starter' | 'developer' | 'pro' | 'team-starter' | 'team-pro' | null;
  onSuccess: () => void;
}

const PLAN_IDS = {
  starter: 'P-9GJ74476BD483620ENA2XHZA',
  developer: 'SANDBOX-DEV-PLAN-TEST',
  pro: 'SANDBOX-PRO-PLAN-TEST',
  'team-starter': 'SANDBOX-TEAM-START-TEST',
  'team-pro': 'SANDBOX-TEAM-PRO-TEST',
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
  const [paymentMode, setPaymentMode] = useState<'live' | 'sandbox'>('live');
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

  // Update PayPal config when mode changes
  useEffect(() => {
    const configService = PayPalConfigService.getInstance();
    if (paymentMode === 'sandbox') {
      configService.setTestMode(true);
    } else {
      configService.setTestMode(false);
    }
  }, [paymentMode]);

  const handlePaymentSuccess = async (subscriptionId: string) => {
    console.log('Payment successful - subscription ID:', subscriptionId);
    
    try {
      setSubscriptionStep('processing');
      
      const subscriptionData = {
        id: subscriptionId,
        tier: selectedTier,
        status: 'active',
        createdAt: new Date().toISOString(),
        planId: PLAN_IDS[selectedTier!],
        environment: paymentMode
      };

      const existingSubscriptions = JSON.parse(localStorage.getItem('user_subscriptions') || '[]');
      const updatedSubscriptions = [...existingSubscriptions, subscriptionData];
      localStorage.setItem('user_subscriptions', JSON.stringify(updatedSubscriptions));

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
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.details && Array.isArray(error.details)) {
      errorMessage = error.details.map((d: any) => d.description || d.issue || 'Payment error').join(', ');
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    if (errorMessage.includes('plan') || errorMessage.includes('INVALID_RESOURCE_ID')) {
      errorMessage += '\n\nFor sandbox testing, you need to create subscription plans in your PayPal sandbox account first.';
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
              ? `Your ${PLAN_NAMES[selectedTier]} subscription has been activated (${paymentMode})`
              : subscriptionStep === 'error'
              ? 'There was an issue processing your payment'
              : subscriptionStep === 'processing'
              ? 'Please wait while we process your payment'
              : `Subscribe to ${PLAN_NAMES[selectedTier]} plan for ${PLAN_PRICES[selectedTier]}/month (${paymentMode === 'sandbox' ? 'Sandbox Testing' : 'Live Payment'})`
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
            <p className="text-yellow-400 text-xs mt-2">
              ({paymentMode === 'sandbox' ? 'Sandbox Test' : 'Live Payment'} Mode)
            </p>
          </div>
        ) : subscriptionStep === 'error' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-red-400 font-medium">Payment Failed</p>
            <p className="text-[#9ca3af] text-sm mt-2 mb-4 whitespace-pre-line">
              {errorDetails || 'Please try again or contact support.'}
            </p>
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-blue-400 text-xs">
                <strong>Sandbox Testing Note:</strong><br/>
                • Account: sb-7ommm28924697@business.example.com<br/>
                • Plans need to be created in sandbox dashboard<br/>
                • Or use PayPal's REST API to create plans<br/>
                • Only Starter plan is currently configured for testing
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
                      <div className="text-xs text-[#9ca3af]">{paymentMode} mode</div>
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
                  
                  {/* Payment Mode Toggle */}
                  <div className="space-y-2">
                    {/* Live Payment Mode */}
                    <div 
                      className={`p-3 rounded-md border cursor-pointer transition-all ${
                        paymentMode === 'live' 
                          ? 'bg-green-900/30 border-green-500/50 shadow-md' 
                          : 'bg-green-900/10 border-green-500/20 hover:bg-green-900/20'
                      }`}
                      onClick={() => setPaymentMode('live')}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Globe className={`w-4 h-4 ${paymentMode === 'live' ? 'text-green-400' : 'text-green-600'}`} />
                        <p className={`text-xs font-medium ${paymentMode === 'live' ? 'text-green-400' : 'text-green-600'}`}>
                          LIVE PAYMENT MODE
                        </p>
                        {paymentMode === 'live' && <Check className="w-4 h-4 text-green-400" />}
                      </div>
                      <p className="text-xs text-center text-gray-400 mt-1">
                        Environment: live
                      </p>
                      <p className="text-xs text-center text-gray-400">
                        Plan ID: {PLAN_IDS[selectedTier].substring(0, 25)}...
                      </p>
                    </div>

                    {/* Sandbox Testing Mode */}
                    <div 
                      className={`p-3 rounded-md border cursor-pointer transition-all ${
                        paymentMode === 'sandbox' 
                          ? 'bg-yellow-900/30 border-yellow-500/50 shadow-md' 
                          : 'bg-yellow-900/10 border-yellow-500/20 hover:bg-yellow-900/20'
                      }`}
                      onClick={() => setPaymentMode('sandbox')}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <TestTube className={`w-4 h-4 ${paymentMode === 'sandbox' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <p className={`text-xs font-medium ${paymentMode === 'sandbox' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                          SANDBOX TESTING MODE
                        </p>
                        {paymentMode === 'sandbox' && <Check className="w-4 h-4 text-yellow-400" />}
                      </div>
                      <p className="text-xs text-center text-gray-400 mt-1">
                        Account: sb-7ommm28924697@business.example.com
                      </p>
                      <p className="text-xs text-center text-gray-400">
                        Plan ID: {PLAN_IDS[selectedTier]}
                      </p>
                      {paymentMode === 'sandbox' && (
                        <p className="text-xs text-center text-blue-400 mt-2">
                          Note: Plans may need to be created in your sandbox account first
                        </p>
                      )}
                    </div>
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
