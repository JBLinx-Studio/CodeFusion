
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Users, Crown, Zap, Check, Shield, Rocket, Award } from 'lucide-react';
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
      toast.info('To modify your plan, please contact our support team', {
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
      <Card className="bg-gradient-to-br from-[#0c1018] via-[#1a1f2c] to-[#0c1018] border-[#2d3748] shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#1a1f2c] via-[#2d3748] to-[#1a1f2c] border-b border-[#3a4553] pb-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-2xl">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-4xl font-bold text-white mb-4">
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
                <Crown className="w-4 h-4 mr-2" />
                Current: {currentTier === 'team-starter' ? 'Team Starter' :
                         currentTier === 'team-pro' ? 'Team Pro' :
                         currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
              </Badge>
            </div>

            <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as any)} className="mb-8">
              <TabsList className="bg-[#1a1f2c] border border-[#3a4553] p-1 rounded-xl">
                <TabsTrigger value="monthly" className="text-white data-[state=active]:bg-[#6366f1] px-6 py-3 rounded-lg font-medium">
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="annual" className="text-white data-[state=active]:bg-[#6366f1] px-6 py-3 rounded-lg font-medium">
                  Annual
                  <Badge className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Save up to 25%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <CardDescription className="text-[#9ca3af] text-xl max-w-4xl mx-auto leading-relaxed">
              Professional development tools that scale with your ambitions
              <br />
              <span className="text-green-400 font-medium flex items-center justify-center gap-2 mt-2">
                <Shield className="w-4 h-4" />
                30-day money-back guarantee • Cancel anytime • No hidden fees
              </span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#2d3748] mb-12 h-16 rounded-xl">
              <TabsTrigger value="individual" className="text-white text-lg flex items-center gap-2 py-3">
                <Star className="w-5 h-5" />
                Individual Plans
              </TabsTrigger>
              <TabsTrigger value="team" className="text-white text-lg flex items-center gap-2 py-3">
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

          {/* Value Proposition Section */}
          <div className="mt-16 p-8 bg-gradient-to-r from-[#1f2937] via-[#374151] to-[#1f2937] rounded-2xl border border-[#4b5563]">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Rocket className="w-8 h-8 text-[#6366f1]" />
                Why Choose CodeFusion?
              </h3>
              <p className="text-[#9ca3af] text-lg max-w-2xl mx-auto">
                Join thousands of developers building the next generation of web applications
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Lightning Fast</h4>
                <p className="text-[#d1d5db] text-sm">AI-powered development that's 10x faster than traditional coding</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Enterprise Security</h4>
                <p className="text-[#d1d5db] text-sm">Bank-grade security with SOC 2 compliance and data encryption</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Award Winning</h4>
                <p className="text-[#d1d5db] text-sm">Recognized by industry leaders for innovation and excellence</p>
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
