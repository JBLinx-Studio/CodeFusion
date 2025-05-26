import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Star, Crown, Users } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentMethodDialog } from './PaymentMethodDialog';

export const UserSubscriptionInfo: React.FC = () => {
  const { authState, updateUserProfile } = useAuth();
  const currentTier = authState.user?.tier || 'free';
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'developer' | 'pro' | 'team' | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const individualPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for learning and personal projects',
      features: [
        'Unlimited public projects',
        '100 MB storage',
        'Community support',
        'Basic code editor',
        'Live preview',
        '5 deployments per month',
        'CodeFusion branding',
      ],
      buttonText: 'Current Plan',
      disabled: currentTier === 'free',
      tier: 'free',
      popular: false,
    },
    {
      name: 'Starter',
      monthlyPrice: 5,
      annualPrice: 48,
      savings: 12,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'Ideal for hobbyists and students',
      features: [
        'Everything in Free',
        'Unlimited private projects',
        '2 GB storage',
        '20 MB per file',
        'Custom themes',
        'No ads',
        'Priority support',
        '25 deployments per month',
        'Custom domains (1)',
        'Basic analytics',
      ],
      buttonText: currentTier === 'starter' ? 'Current Plan' : 'Upgrade to Starter',
      disabled: currentTier === 'starter',
      tier: 'starter',
      popular: false,
    },
    {
      name: 'Developer',
      monthlyPrice: 9,
      annualPrice: 84,
      savings: 24,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'For professional developers',
      features: [
        'Everything in Starter',
        '10 GB storage',
        '50 MB per file',
        'Advanced code editor',
        'AI code assistant',
        'Git integration',
        '100 deployments per month',
        'Custom domains (5)',
        'Advanced analytics',
        'API access',
        'White-label option',
        'Email support',
      ],
      buttonText: currentTier === 'developer' ? 'Current Plan' : 'Upgrade to Developer',
      disabled: currentTier === 'developer',
      tier: 'developer',
      popular: true,
    },
    {
      name: 'Pro',
      monthlyPrice: 19,
      annualPrice: 180,
      savings: 48,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'For power users and agencies',
      features: [
        'Everything in Developer',
        '50 GB storage',
        '100 MB per file',
        'Unlimited deployments',
        'Custom domains (unlimited)',
        'Advanced collaboration (10 users)',
        'Priority AI processing',
        'Custom branding',
        'Advanced security features',
        'Phone support',
        'SLA guarantee',
        'Export to popular platforms',
      ],
      buttonText: currentTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      disabled: currentTier === 'pro',
      tier: 'pro',
      popular: false,
    }
  ];

  const teamPlans = [
    {
      name: 'Team Starter',
      monthlyPrice: 15,
      annualPrice: 144,
      savings: 36,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'Perfect for small teams (up to 5 users)',
      features: [
        'All Developer features',
        '5 team members included',
        '25 GB shared storage',
        'Team project management',
        'Shared component library',
        'Team analytics',
        'Centralized billing',
        'Admin controls',
        'Team chat integration',
      ],
      buttonText: 'Get Team Starter',
      tier: 'team-starter',
      userCount: '5 users',
      popular: false,
    },
    {
      name: 'Team Pro',
      monthlyPrice: 35,
      annualPrice: 336,
      savings: 84,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'For growing teams (up to 15 users)',
      features: [
        'All Pro features',
        '15 team members included',
        '100 GB shared storage',
        'Advanced team collaboration',
        'Role-based permissions',
        'Advanced team analytics',
        'Custom workflows',
        'Integration APIs',
        'Priority support',
        'Custom onboarding',
      ],
      buttonText: 'Get Team Pro',
      tier: 'team-pro',
      userCount: '15 users',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations',
      features: [
        'Unlimited team members',
        'Unlimited storage',
        'Custom integrations',
        'Single Sign-On (SSO)',
        'Advanced security & compliance',
        'Dedicated account manager',
        'Custom training',
        '24/7 phone support',
        'Custom SLA',
        'On-premise deployment option',
      ],
      buttonText: 'Contact Sales',
      tier: 'enterprise',
      userCount: 'Unlimited',
      popular: false,
    }
  ];

  const getPrice = (plan: any) => {
    if (plan.price) return plan.price;
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    return `$${price}`;
  };

  const getSavings = (plan: any) => {
    if (billingCycle === 'annual' && plan.savings) {
      return (
        <div className="text-xs text-green-400 mt-1">
          Save ${plan.savings}/year
        </div>
      );
    }
    return null;
  };

  const handlePlanChange = (selectedTier: string) => {
    console.log('Plan change clicked for tier:', selectedTier);
    
    if (selectedTier === currentTier) {
      return;
    }

    if (selectedTier === 'free') {
      updateUserProfile({ tier: 'free' });
      toast.success('Downgraded to Free plan');
      return;
    }

    if (selectedTier.startsWith('team') || selectedTier === 'enterprise') {
      toast.info('Contact our sales team for team and enterprise plans', {
        description: 'Email: sales@codefusion.dev',
        duration: 6000,
      });
      return;
    }
    
    console.log('Opening payment dialog for plan:', selectedTier);
    setSelectedPlan(selectedTier as any);
    setPaymentDialogOpen(true);
  };

  return (
    <>
      <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <span>Choose Your Plan</span>
                <Badge variant="outline" className={`
                  ${currentTier === 'free' ? 'border-gray-500 text-gray-400' : 
                    currentTier === 'starter' ? 'border-blue-500 text-blue-400' :
                    currentTier === 'developer' ? 'border-purple-500 text-purple-400' : 
                    'border-indigo-500 text-indigo-400'}
                `}>
                  {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-4 mt-4">
                <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as any)}>
                  <TabsList className="bg-[#2d3748]">
                    <TabsTrigger value="monthly" className="text-white">Monthly</TabsTrigger>
                    <TabsTrigger value="annual" className="text-white">
                      Annual
                      <Badge className="ml-2 bg-green-600 text-white text-xs">Save up to 25%</Badge>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          <CardDescription className="text-[#9ca3af] text-lg">
            Plans that scale with your ambitions. No hidden fees, cancel anytime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#2d3748] mb-8">
              <TabsTrigger value="individual" className="text-white">
                <Star className="w-4 h-4 mr-2" />
                Individual Plans
              </TabsTrigger>
              <TabsTrigger value="team" className="text-white">
                <Users className="w-4 h-4 mr-2" />
                Team Plans
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {individualPlans.map((plan) => (
                  <div 
                    key={plan.name}
                    className={`rounded-xl border relative ${
                      plan.popular 
                        ? 'border-[#6366f1] bg-gradient-to-b from-[#1a1f2c] to-[#1f2937] ring-2 ring-[#6366f1]/20' 
                        : 'border-[#2d3748] bg-[#1a1f2c]'
                    } ${
                      currentTier === plan.tier.toLowerCase() 
                        ? 'ring-2 ring-[#6366f1]' 
                        : ''
                    } overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Badge className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-4 py-1">
                          <Crown className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-white">{getPrice(plan)}</span>
                        <span className="text-[#9ca3af] ml-1">/{plan.period}</span>
                        {getSavings(plan)}
                      </div>
                      <p className="mt-3 text-sm text-[#9ca3af]">{plan.description}</p>
                    </div>
                    
                    <div className="p-6 border-t border-[#2d3748]">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <Check className="h-4 w-4 text-[#6366f1] mr-3 shrink-0 mt-0.5" />
                            <span className="text-sm text-[#d1d5db]">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full ${
                          plan.disabled 
                            ? 'bg-[#2d3748] text-[#9ca3af] cursor-not-allowed' 
                            : plan.tier === 'free'
                              ? 'bg-[#374151] hover:bg-[#4b5563] text-white'
                              : plan.popular
                                ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white shadow-lg'
                                : 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white'
                        }`}
                        disabled={plan.disabled}
                        onClick={() => handlePlanChange(plan.tier)}
                      >
                        {plan.buttonText}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="team">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {teamPlans.map((plan) => (
                  <div 
                    key={plan.name}
                    className={`rounded-xl border relative ${
                      plan.popular 
                        ? 'border-[#6366f1] bg-gradient-to-b from-[#1a1f2c] to-[#1f2937] ring-2 ring-[#6366f1]/20' 
                        : 'border-[#2d3748] bg-[#1a1f2c]'
                    } overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Badge className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-4 py-1">
                          <Users className="w-3 h-3 mr-1" />
                          Team Favorite
                        </Badge>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        <Badge variant="outline" className="text-[#6366f1] border-[#6366f1]">
                          {plan.userCount}
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-white">{getPrice(plan)}</span>
                        <span className="text-[#9ca3af] ml-1">/{plan.period}</span>
                        {getSavings(plan)}
                      </div>
                      <p className="mt-3 text-sm text-[#9ca3af]">{plan.description}</p>
                    </div>
                    
                    <div className="p-6 border-t border-[#2d3748]">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <Check className="h-4 w-4 text-[#6366f1] mr-3 shrink-0 mt-0.5" />
                            <span className="text-sm text-[#d1d5db]">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white shadow-lg'
                            : plan.tier === 'enterprise'
                              ? 'bg-gradient-to-r from-[#1f2937] to-[#374151] hover:from-[#374151] hover:to-[#4b5563] text-white border border-[#6366f1]'
                              : 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white'
                        }`}
                        onClick={() => handlePlanChange(plan.tier)}
                      >
                        {plan.buttonText}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-6 bg-gradient-to-r from-[#1f2937] to-[#374151] rounded-lg border border-[#2d3748]">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">🚀 Why Choose CodeFusion?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#9ca3af]">
                <div>✅ More storage than CodePen at lower prices</div>
                <div>✅ Advanced AI assistant included</div>
                <div>✅ Superior collaboration tools</div>
              </div>
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
          toast.success(`Successfully upgraded to ${selectedPlan === 'starter' ? 'Starter' : selectedPlan === 'developer' ? 'Developer' : 'Pro'} plan!`);
        }}
      />
    </>
  );
};
