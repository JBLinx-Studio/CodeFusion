
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Crown, Users, Shield } from 'lucide-react';

interface PlanCardProps {
  plan: {
    name: string;
    tier: string;
    monthlyPrice?: number;
    annualPrice?: number;
    price?: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    disabled?: boolean;
    popular?: boolean;
    userCount?: string;
  };
  billingCycle: 'monthly' | 'annual';
  currentTier: string;
  onPlanSelect: (tier: string) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  billingCycle,
  currentTier,
  onPlanSelect
}) => {
  const getPrice = () => {
    if (plan.price) return plan.price;
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    return `$${price}`;
  };

  const getSavings = () => {
    if (billingCycle === 'annual' && plan.monthlyPrice && plan.annualPrice) {
      const monthlyCost = plan.monthlyPrice * 12;
      const savings = monthlyCost - plan.annualPrice;
      if (savings > 0) {
        return (
          <div className="text-xs text-green-400 font-medium mt-1">
            Save ${savings}/year
          </div>
        );
      }
    }
    return null;
  };

  const getIcon = () => {
    switch (plan.tier) {
      case 'free': return <Star className="w-5 h-5" />;
      case 'starter': return <Zap className="w-5 h-5" />;
      case 'developer': return <Crown className="w-5 h-5" />;
      case 'pro': return <Shield className="w-5 h-5" />;
      case 'team-starter':
      case 'team-pro': return <Users className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const isCurrentPlan = currentTier === plan.tier;

  return (
    <div 
      className={`rounded-2xl border relative ${
        plan.popular 
          ? 'border-[#6366f1] bg-gradient-to-b from-[#1a1f2c] to-[#1f2937] ring-2 ring-[#6366f1]/30 shadow-2xl' 
          : 'border-[#2d3748] bg-[#1a1f2c] shadow-lg'
      } ${
        isCurrentPlan 
          ? 'ring-2 ring-[#10b981] border-[#10b981]' 
          : ''
      } overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105`}
    >
      {plan.popular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <Badge className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-4 py-2 text-sm font-semibold shadow-lg">
            <Crown className="w-4 h-4 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 z-10">
          <Badge className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white px-3 py-1 text-xs font-semibold shadow-lg">
            Current Plan
          </Badge>
        </div>
      )}
      
      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${
            plan.popular ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]' : 'bg-[#374151]'
          }`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
            {plan.userCount && (
              <Badge variant="outline" className="text-[#6366f1] border-[#6366f1] mt-1">
                {plan.userCount}
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{getPrice()}</span>
            <span className="text-[#9ca3af] text-lg">/{plan.period}</span>
          </div>
          {getSavings()}
        </div>

        <p className="text-[#d1d5db] text-lg mb-8 leading-relaxed">{plan.description}</p>
        
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-1">
                <Check className="h-5 w-5 text-[#10b981] font-bold" />
              </div>
              <span className="text-[#d1d5db] text-base leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className={`w-full h-12 text-base font-semibold ${
            plan.disabled || isCurrentPlan
              ? 'bg-[#374151] text-[#9ca3af] cursor-not-allowed border border-[#4b5563]' 
              : plan.tier === 'free'
                ? 'bg-gradient-to-r from-[#374151] to-[#4b5563] hover:from-[#4b5563] hover:to-[#6b7280] text-white border border-[#6b7280]'
                : plan.popular
                  ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5b21b6] hover:to-[#7c3aed] text-white shadow-xl hover:shadow-2xl border-0'
                  : 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#5b21b6] text-white shadow-lg hover:shadow-xl border-0'
          } transition-all duration-200 transform hover:scale-105`}
          disabled={plan.disabled || isCurrentPlan}
          onClick={() => onPlanSelect(plan.tier)}
        >
          {isCurrentPlan ? 'Current Plan' : plan.buttonText}
        </Button>
      </div>
    </div>
  );
};
