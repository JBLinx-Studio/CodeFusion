import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Star, Crown, Users, Zap, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentMethodDialog } from './PaymentMethodDialog';

export const UserSubscriptionInfo: React.FC = () => {
  const { authState, updateUserProfile } = useAuth();
  const currentTier = authState.user?.tier || 'free';
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'developer' | 'pro' | 'team-starter' | 'team-pro' | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const individualPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for learning and trying out CodeFusion',
      features: [
        '3 public projects',
        '500 MB storage',
        'Community support',
        'Basic code editor',
        'Live preview',
        '5 deployments per month',
        'CodeFusion branding',
        'Basic templates'
      ],
      buttonText: currentTier === 'free' ? 'Current Plan' : 'Downgrade to Free',
      disabled: currentTier === 'free',
      tier: 'free',
      popular: false,
      icon: <Globe className="w-5 h-5" />
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
        '10 MB per file',
        'Remove CodeFusion branding',
        'Email support',
        '25 deployments per month',
        'Custom domains (1)',
        'Basic analytics',
        'Premium templates'
      ],
      buttonText: currentTier === 'starter' ? 'Current Plan' : 'Upgrade to Starter',
      disabled: currentTier === 'starter',
      tier: 'starter',
      popular: false,
      icon: <Star className="w-5 h-5" />
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
        '25 MB per file',
        'Advanced code editor features',
        'Code collaboration (3 users)',
        'Git integration',
        '100 deployments per month',
        'Custom domains (5)',
        'Advanced analytics',
        'API webhook notifications',
        'Priority email support'
      ],
      buttonText: currentTier === 'developer' ? 'Current Plan' : 'Upgrade to Developer',
      disabled: currentTier === 'developer',
      tier: 'developer',
      popular: true,
      icon: <Zap className="w-5 h-5" />
    },
    {
      name: 'Pro',
      monthlyPrice: 19,
      annualPrice: 180,
      savings: 48,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'For power users and small agencies',
      features: [
        'Everything in Developer',
        '50 GB storage',
        '100 MB per file',
        'Unlimited deployments',
        'Custom domains (unlimited)',
        'Advanced collaboration (10 users)',
        'White-label option',
        'Priority support (24h response)',
        'Advanced security features',
        'Custom CSS themes',
        'Export projects',
        'Backup & restore'
      ],
      buttonText: currentTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      disabled: currentTier === 'pro',
      tier: 'pro',
      popular: false,
      icon: <Shield className="w-5 h-5" />
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
        'Team analytics dashboard',
        'Centralized billing',
        'Basic admin controls',
        'Team chat integration',
        'Shared templates'
      ],
      buttonText: currentTier === 'team-starter' ? 'Current Plan' : 'Get Team Starter',
      disabled: currentTier === 'team-starter',
      tier: 'team-starter',
      userCount: '5 users',
      popular: false,
      icon: <Users className="w-5 h-5" />
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
        'API integrations',
        'Priority support (12h response)',
        'Custom onboarding session',
        'Team training resources'
      ],
      buttonText: currentTier === 'team-pro' ? 'Current Plan' : 'Get Team Pro',
      disabled: currentTier === 'team-pro',
      tier: 'team-pro',
      userCount: '15 users',
      popular: true,
      icon: <Crown className="w-5 h-5" />
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
        'Custom training program',
        '24/7 phone support',
        'Custom SLA agreement',
        'On-premise deployment option',
        'Advanced audit logs',
        'Custom contracts & invoicing'
      ],
      buttonText: currentTier === 'enterprise' ? 'Current Plan' : 'Contact Sales',
      disabled: currentTier === 'enterprise',
      tier: 'enterprise',
      userCount: 'Unlimited',
      popular: false,
      icon: <Shield className="w-5 h-5" />
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

  const getTierLevel = (tier: string): number => {
    const levels = {
      'free': 0,
      'starter': 1, 
      'developer': 2,
      'pro': 3,
      'team-starter': 4,
      'team-pro': 5,
      'enterprise': 6
    };
    return levels[tier as keyof typeof levels] || 0;
  };

  const handlePlanChange = (selectedTier: string) => {
    console.log('Plan change clicked for tier:', selectedTier);
    
    if (selectedTier === currentTier) {
      return;
    }

    // Validate tier progression - prevent downgrades without confirmation for paid plans
    const currentLevel = getTierLevel(currentTier);
    const selectedLevel = getTierLevel(selectedTier);
    
    if (selectedLevel < currentLevel && currentLevel > 0) {
      // This is a downgrade from a paid plan
      toast.info('To downgrade your plan, please contact support', {
        description: 'Email: support@codefusion.dev',
        duration: 6000,
      });
      return;
    }

    if (selectedTier === 'free') {
      updateUserProfile({ tier: 'free' });
      toast.success('Welcome to Free plan');
      return;
    }

    if (selectedTier === 'enterprise') {
      toast.info('Contact our sales team for Enterprise plans', {
        description: 'Email: enterprise@codefusion.dev | Phone: +1 (555) 123-4567',
        duration: 8000,
      });
      return;
    }
    
    console.log('Opening payment dialog for plan:', selectedTier);
    setSelectedPlan(selectedTier as any);
    setPaymentDialogOpen(true);
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-[#1a1f2c] via-[#1e2530] to-[#1a1f2c] border-[#2d3748] shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-[#2d3748] to-[#374151] border-b border-[#3a4553]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl text-white flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <span>Choose Your Plan</span>
                <Badge variant="outline" className={`px-3 py-1 text-sm font-semibold ${
                  currentTier === 'free' ? 'border-gray-500 text-gray-400 bg-gray-900/50' : 
                  currentTier === 'starter' ? 'border-blue-500 text-blue-400 bg-blue-900/20' :
                  currentTier === 'developer' ? 'border-purple-500 text-purple-400 bg-purple-900/20' : 
                  currentTier === 'pro' ? 'border-indigo-500 text-indigo-400 bg-indigo-900/20' :
                  'border-green-500 text-green-400 bg-green-900/20'
                }`}>
                  {currentTier === 'team-starter' ? 'Team Starter' :
                   currentTier === 'team-pro' ? 'Team Pro' :
                   currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-4">
                <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as any)}>
                  <TabsList className="bg-[#1a1f2c] border border-[#3a4553]">
                    <TabsTrigger value="monthly" className="text-white data-[state=active]:bg-[#6366f1]">
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger value="annual" className="text-white data-[state=active]:bg-[#6366f1]">
                      Annual
                      <Badge className="ml-2 bg-green-600 text-white text-xs px-2 py-1">
                        Save up to 25%
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          <CardDescription className="text-[#9ca3af] text-lg mt-4">
            Professional plans that scale with your ambitions. Cancel anytime, no hidden fees.
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
          const planName = selectedPlan === 'starter' ? 'Starter' : 
                          selectedPlan === 'developer' ? 'Developer' : 
                          selectedPlan === 'pro' ? 'Pro' :
                          selectedPlan === 'team-starter' ? 'Team Starter' :
                          'Team Pro';
          toast.success(`Successfully upgraded to ${planName} plan!`, {
            description: 'All features are now available in your account.',
            duration: 5000,
          });
        }}
      />
    </>
  );
};
