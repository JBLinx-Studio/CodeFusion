
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumFeatures } from './PremiumFeatures';

export const UserSubscriptionInfo: React.FC = () => {
  const { authState, updateUserTier } = useAuth();
  const currentTier = authState.user?.tier || 'free';

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
      buttonText: currentTier === 'premium' ? 'Current Plan' : currentTier === 'pro' ? 'Downgrade' : 'Upgrade',
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
      buttonText: currentTier === 'pro' ? 'Current Plan' : 'Upgrade',
      disabled: currentTier === 'pro',
      tier: 'pro',
    }
  ];

  const handlePlanChange = (selectedTier: 'free' | 'premium' | 'pro') => {
    // This would normally connect to a payment processor
    if (selectedTier === currentTier) {
      return;
    }

    const action = selectedTier === 'free' || 
      (selectedTier === 'premium' && currentTier === 'pro') 
      ? 'downgraded to' : 'upgraded to';

    updateUserTier(selectedTier);
    
    toast.success(
      `Subscription ${action} ${selectedTier}`,
      {
        description: `Your account has been successfully ${action} the ${selectedTier} plan.`,
      }
    );
  };

  return (
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
              } overflow-hidden`}
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
                {plan.tier === 'free' ? (
                  <Button
                    className={`w-full mt-6 ${
                      plan.disabled 
                        ? 'bg-[#2d3748] text-[#9ca3af] cursor-not-allowed' 
                        : 'bg-[#374151] hover:bg-[#4b5563] text-white'
                    }`}
                    disabled={plan.disabled}
                    onClick={() => handlePlanChange(plan.tier as 'free' | 'premium' | 'pro')}
                  >
                    {plan.buttonText}
                  </Button>
                ) : (
                  <PremiumFeatures feature="customThemes" requiredTier={plan.tier as 'premium' | 'pro'}>
                    <Button
                      className={`w-full mt-6 ${
                        plan.disabled 
                          ? 'bg-[#2d3748] text-[#9ca3af] cursor-not-allowed' 
                          : plan.highlighted
                            ? 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white'
                            : 'bg-[#374151] hover:bg-[#4b5563] text-white'
                      }`}
                      disabled={plan.disabled}
                      onClick={() => handlePlanChange(plan.tier as 'free' | 'premium' | 'pro')}
                    >
                      {plan.buttonText}
                    </Button>
                  </PremiumFeatures>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-lg bg-[#2d3748]/50 border border-[#4b5563] flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[#f87171] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-white">Important Note</h4>
            <p className="text-xs text-[#9ca3af] mt-1">
              This is a demonstration of subscription capabilities. No actual payments are processed and all upgrades are simulated.
              In a production environment, this would connect to a payment processor like Stripe or PayPal.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
