
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Users, Crown, Zap, Check } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentMethodDialog } from './PaymentMethodDialog';
import { PlanCard } from './subscription/PlanCard';
import { individualPlans, teamPlans } from './subscription/PlanData';

export const UserSubscriptionInfo: React.FC = () => {
  const { authState, updateUserProfile } = useAuth();
  const currentTier = authState.user?.tier || 'free';
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'developer' | 'pro' | 'team-starter' | 'team-pro' | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

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

    const currentLevel = getTierLevel(currentTier);
    const selectedLevel = getTierLevel(selectedTier);
    
    if (selectedLevel < currentLevel && currentLevel > 0) {
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

  const processedIndividualPlans = individualPlans.map(plan => ({
    ...plan,
    period: billingCycle === 'monthly' ? plan.period : 'year',
    disabled: currentTier === plan.tier
  }));

  const processedTeamPlans = teamPlans.map(plan => ({
    ...plan,
    period: billingCycle === 'monthly' ? plan.period : 'year',
    disabled: currentTier === plan.tier
  }));

  return (
    <>
      <Card className="bg-gradient-to-br from-[#0c1018] via-[#1a1f2c] to-[#0c1018] border-[#2d3748] shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-[#1a1f2c] via-[#2d3748] to-[#1a1f2c] border-b border-[#3a4553] pb-8">
          <div className="text-center">
            <CardTitle className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              Choose Your Plan
            </CardTitle>
            
            <div className="flex items-center justify-center mb-6">
              <Badge variant="outline" className={`px-4 py-2 text-lg font-semibold ${
                currentTier === 'free' ? 'border-gray-500 text-gray-400 bg-gray-900/50' : 
                currentTier === 'starter' ? 'border-blue-500 text-blue-400 bg-blue-900/20' :
                currentTier === 'developer' ? 'border-purple-500 text-purple-400 bg-purple-900/20' : 
                currentTier === 'pro' ? 'border-indigo-500 text-indigo-400 bg-indigo-900/20' :
                'border-green-500 text-green-400 bg-green-900/20'
              }`}>
                Current: {currentTier === 'team-starter' ? 'Team Starter' :
                         currentTier === 'team-pro' ? 'Team Pro' :
                         currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
              </Badge>
            </div>

            <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as any)} className="mb-6">
              <TabsList className="bg-[#1a1f2c] border border-[#3a4553] p-1">
                <TabsTrigger value="monthly" className="text-white data-[state=active]:bg-[#6366f1] px-6 py-2">
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="annual" className="text-white data-[state=active]:bg-[#6366f1] px-6 py-2">
                  Annual
                  <Badge className="ml-2 bg-green-600 text-white text-xs px-2 py-1">
                    Save up to 25%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <CardDescription className="text-[#9ca3af] text-xl max-w-3xl mx-auto leading-relaxed">
              Professional development tools that scale with your ambitions. 
              <br />
              <span className="text-green-400 font-medium">Cancel anytime • No hidden fees • 30-day money-back guarantee</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#2d3748] mb-12 h-14">
              <TabsTrigger value="individual" className="text-white text-lg flex items-center gap-2">
                <Star className="w-5 h-5" />
                Individual Plans
              </TabsTrigger>
              <TabsTrigger value="team" className="text-white text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Plans
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                {processedIndividualPlans.map((plan) => (
                  <PlanCard
                    key={plan.tier}
                    plan={plan}
                    billingCycle={billingCycle}
                    currentTier={currentTier}
                    onPlanSelect={handlePlanChange}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="team">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {processedTeamPlans.map((plan) => (
                  <PlanCard
                    key={plan.tier}
                    plan={plan}
                    billingCycle={billingCycle}
                    currentTier={currentTier}
                    onPlanSelect={handlePlanChange}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 p-8 bg-gradient-to-r from-[#1f2937] via-[#374151] to-[#1f2937] rounded-2xl border border-[#4b5563]">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-[#6366f1]" />
                Why CodeFusion?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
                <div className="flex items-center gap-3 text-[#d1d5db]">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>More storage at better prices</span>
                </div>
                <div className="flex items-center gap-3 text-[#d1d5db]">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>AI-powered development</span>
                </div>
                <div className="flex items-center gap-3 text-[#d1d5db]">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Enterprise-grade collaboration</span>
                </div>
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
