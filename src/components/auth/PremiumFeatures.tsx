
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentMethodDialog } from './PaymentMethodDialog';

interface PremiumFeaturesProps {
  feature: 'collaboration' | 'privateProjects' | 'advancedExport' | 'customThemes' | 'apiAccess' | 'aiAssistant' | 'gitIntegration' | 'whiteLabel' | 'analytics' | 'customDomains';
  requiredTier: 'starter' | 'developer' | 'pro' | 'team-starter' | 'team-pro';
  children: React.ReactNode;
}

export const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({
  feature,
  requiredTier,
  children
}) => {
  const { authState } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  
  const tierLevel = (tier: string): number => {
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
  
  const userTier = authState.user?.tier || 'free';
  const hasAccess = tierLevel(userTier) >= tierLevel(requiredTier);
  
  const getFeatureName = (feature: string): string => {
    const names = {
      collaboration: 'Team Collaboration',
      privateProjects: 'Private Projects',
      advancedExport: 'Advanced Export',
      customThemes: 'Custom Themes',
      apiAccess: 'API Access',
      aiAssistant: 'AI Code Assistant',
      gitIntegration: 'Git Integration',
      whiteLabel: 'White Label',
      analytics: 'Advanced Analytics',
      customDomains: 'Custom Domains'
    };
    return names[feature as keyof typeof names] || 'Premium Feature';
  };
  
  const handlePremiumClick = () => {
    console.log('Premium click triggered, authenticated:', authState.isAuthenticated);
    
    if (!authState.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (requiredTier.startsWith('team')) {
      toast.info('Contact our sales team for team plans', {
        description: 'Email: sales@codefusion.dev',
        duration: 6000,
      });
      return;
    }
    
    console.log('Opening payment dialog for tier:', requiredTier);
    setShowPaymentDialog(true);
  };
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  return (
    <div className="relative group">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-[#1a1f2c]/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-[#6366f1]/20">
        <div className="p-6 rounded-lg text-center bg-gradient-to-b from-[#1a1f2c] to-[#1f2937] border border-[#2d3748]">
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full">
              <Lock className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {getFeatureName(feature)}
          </h3>
          <p className="text-sm text-[#9ca3af] mb-4">
            Requires {requiredTier === 'team-starter' ? 'Team Starter' : 
                     requiredTier === 'team-pro' ? 'Team Pro' :
                     requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} plan or higher
          </p>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            onClick={handlePremiumClick}
          >
            {authState.isAuthenticated ? 'Upgrade Plan' : 'Sign In to Continue'}
          </Button>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultView="login"
      />

      <PaymentMethodDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        selectedTier={requiredTier as any}
        onSuccess={() => {
          setShowPaymentDialog(false);
          const planName = requiredTier === 'starter' ? 'Starter' : 
                          requiredTier === 'developer' ? 'Developer' : 'Pro';
          toast.success(`Successfully upgraded to ${planName} plan!`);
        }}
      />
    </div>
  );
};
