
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentMethodDialog } from './PaymentMethodDialog';

export const UserSubscriptionInfo: React.FC = () => {
  const { authState, updateUserProfile } = useAuth();
  const currentTier = authState.user?.tier || 'free';
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro' | null>(null);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Basic features for personal use',
      features: [
        '5 Projects',
        '100 MB Storage',
        'Community Support',
        'Basic Code Editor',
      ],
      buttonText: 'Current Plan',
      disabled: currentTier === 'free',
      tier: 'free',
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'Advanced features for professionals',
      features: [
        '15 Projects',
        '500 MB Storage',
        'Priority Support',
        'Private Projects',
        'Custom Themes',
        'Team Collaboration',
      ],
      buttonText: currentTier === 'premium' ? 'Current Plan' : 
                 currentTier === 'pro' ? 'Downgrade' : 'Upgrade Plan',
      highlighted: true,
      disabled: currentTier === 'premium',
      tier: 'premium',
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: 'per month',
      description: 'Everything you need for enterprise',
      features: [
        'Unlimited Projects',
        '1 GB Storage',
        '24/7 Phone Support',
        'API Access',
        'Advanced Analytics',
        'Custom Branding',
        'All Premium Features',
      ],
      buttonText: currentTier === 'pro' ? 'Current Plan' : 'Upgrade Plan',
      disabled: currentTier === 'pro',
      tier: 'pro',
    }
  ];

  const handlePlanChange = (selectedTier: 'free' | 'premium' | 'pro') => {
    console.log('Plan change clicked for tier:', selectedTier);
    
    if (selectedTier === currentTier) {
      return;
    }

    // For free tier, no payment processing needed
    if (selectedTier === 'free') {
      updateUserProfile({ tier: 'free' });
      toast.success('Downgraded to Free plan');
      return;
    }
    
    // For premium and pro, show payment dialog
    console.log('Opening payment dialog for plan:', selectedTier);
    setSelectedPlan(selectedTier);
    setPaymentDialogOpen(true);
  };

  return (
    <>
      <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <span>Subscription Plans</span>
            <Badge variant="outline" className={`
              ${currentTier === 'free' ? 'border-gray-500 text-gray-400' : 
                currentTier === 'premium' ? 'border-purple-500 text-purple-400' : 
                'border-indigo-500 text-indigo-400'}
            `}>
              {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
            </Badge>
          </CardTitle>
          <CardDescription className="text-[#9ca3af]">
            Choose the plan that's right for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`rounded-lg border ${
                  plan.highlighted 
                    ? 'border-[#6366f1] bg-gradient-to-b from-[#1a1f2c] to-[#1f2937]' 
                    : 'border-[#2d3748] bg-[#1a1f2c]'
                } ${
                  currentTier === plan.tier.toLowerCase() 
                    ? 'ring-2 ring-[#6366f1]' 
                    : ''
                } overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className={`p-5 ${
                  plan.highlighted ? 'bg-gradient-to-r from-[#4f46e5]/20 to-[#6366f1]/20' : ''
                }`}>
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                    <span className="text-[#9ca3af] ml-1">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#9ca3af]">{plan.description}</p>
                </div>
                <div className="p-5 border-t border-[#2d3748]">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-[#6366f1] mr-2 shrink-0" />
                        <span className="text-sm text-[#d1d5db]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Button
                      className={`w-full ${
                        plan.disabled 
                          ? 'bg-[#2d3748] text-[#9ca3af] cursor-not-allowed' 
                          : plan.tier === 'free'
                            ? 'bg-[#374151] hover:bg-[#4b5563] text-white'
                            : 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white shadow-md transform transition-all hover:shadow-lg'
                      }`}
                      disabled={plan.disabled}
                      onClick={() => handlePlanChange(plan.tier as 'free' | 'premium' | 'pro')}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-[#2d3748]/50 border border-[#4b5563] flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#f87171] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white">Sandbox Environment</h4>
              <p className="text-xs text-[#9ca3af] mt-1">
                This is a demonstration environment for testing the subscription process. For testing purposes, you can use our PayPal sandbox account:
                <br />
                <span className="font-mono bg-[#1a1f2c] px-1 rounded mt-1 inline-block">Email: sb-47nmps29800276@personal.example.com</span>
                <br />
                <span className="font-mono bg-[#1a1f2c] px-1 rounded mt-1 inline-block">Password: M3@Y5!zi</span>
                <br />
                <span className="text-yellow-400 mt-1 inline-block">All transactions in this demo are simulated and no actual charges will be made.</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PaymentMethodDialog 
        open={paymentDialogOpen} 
        onOpenChange={setPaymentDialogOpen}
        selectedTier={selectedPlan}
        onSuccess={() => {
          setPaymentDialogOpen(false);
          setSelectedPlan(null);
          toast.success(`Successfully upgraded to ${selectedPlan === 'premium' ? 'Premium' : 'Pro'} plan!`);
        }}
      />
    </>
  );
};
