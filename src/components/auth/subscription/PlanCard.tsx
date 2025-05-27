
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, Crown, Star, Zap } from 'lucide-react';

interface PlanCardProps {
  plan: {
    name: string;
    tier: string;
    price?: string;
    monthlyPrice?: number;
    annualPrice?: number;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    popular?: boolean;
    highlight?: string;
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
  const isCurrentPlan = currentTier === plan.tier;
  const isPremium = plan.tier !== 'free';
  
  const getDisplayPrice = () => {
    if (plan.price) return plan.price;
    if (!plan.monthlyPrice) return '$0';
    
    const price = billingCycle === 'annual' && plan.annualPrice 
      ? plan.annualPrice / 12 
      : plan.monthlyPrice;
    
    return `$${price.toFixed(0)}`;
  };

  const getSavingsPercent = () => {
    if (!plan.monthlyPrice || !plan.annualPrice) return 0;
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = ((monthlyTotal - plan.annualPrice) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  const getPlanIcon = () => {
    if (plan.tier === 'enterprise') return Crown;
    if (plan.popular) return Star;
    if (isPremium) return Zap;
    return Check;
  };

  const Icon = getPlanIcon();

  return (
    <Card className={`relative transition-all duration-300 hover:scale-[1.02] ${
      plan.popular 
        ? 'border-[#6366f1] bg-gradient-to-br from-[#1a1f2c] via-[#2d3748] to-[#1a1f2c] shadow-2xl shadow-[#6366f1]/20' 
        : 'border-[#3a4553] bg-gradient-to-br from-[#1a1f2c] to-[#2d3748]'
    } ${isCurrentPlan ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-4 py-1 text-sm font-semibold">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <Badge className="bg-green-600 text-white px-3 py-1 text-xs">
            Current Plan
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-3">
          <div className={`p-3 rounded-xl ${
            plan.popular ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]' : 'bg-[#374151]'
          }`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
        
        {plan.highlight && (
          <Badge variant="outline" className="text-[#a855f7] border-[#a855f7] mb-3">
            {plan.highlight}
          </Badge>
        )}

        <div className="mb-2">
          <span className="text-4xl font-bold text-white">{getDisplayPrice()}</span>
          {plan.monthlyPrice && (
            <span className="text-[#9ca3af] ml-1">
              /{billingCycle === 'annual' ? 'month' : plan.period}
            </span>
          )}
        </div>

        {billingCycle === 'annual' && plan.annualPrice && (
          <div className="text-sm">
            <span className="text-green-400 font-medium">
              Save {getSavingsPercent()}% annually
            </span>
            <div className="text-[#9ca3af]">
              Billed ${plan.annualPrice}/year
            </div>
          </div>
        )}

        {plan.userCount && (
          <div className="text-sm text-[#9ca3af] mt-2">
            Up to {plan.userCount}
          </div>
        )}

        <p className="text-[#9ca3af] text-sm mt-3">{plan.description}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <div className="flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-[#d1d5db]">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => onPlanSelect(plan.tier)}
          disabled={isCurrentPlan}
          className={`w-full ${
            plan.popular
              ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5b21b6] hover:to-[#7c3aed] text-white'
              : isCurrentPlan
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-[#374151] hover:bg-[#4b5563] text-white border border-[#4b5563]'
          } transition-all duration-200 font-medium py-3`}
        >
          {isCurrentPlan ? 'Current Plan' : plan.buttonText}
        </Button>

        {plan.tier === 'free' && (
          <p className="text-xs text-[#9ca3af] text-center mt-3">
            No credit card required
          </p>
        )}
      </CardContent>
    </Card>
  );
};
