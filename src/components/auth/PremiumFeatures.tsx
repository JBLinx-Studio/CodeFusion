
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { UserDashboardDialog } from './UserDashboardDialog';
import { PaymentMethodDialog } from './PaymentMethodDialog';

interface PremiumFeaturesProps {
  feature: 'collaboration' | 'privateProjects' | 'advancedExport' | 'customThemes' | 'apiAccess';
  requiredTier: 'premium' | 'pro';
  children: React.ReactNode;
}

export const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({
  feature,
  requiredTier,
  children
}) => {
  const { authState } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const navigate = useNavigate();
  
  const tierLevel = (tier: string): number => {
    switch(tier) {
      case 'free': return 0;
      case 'premium': return 1;
      case 'pro': return 2;
      default: return -1;
    }
  };
  
  const userTier = authState.user?.tier || 'free';
  const hasAccess = tierLevel(userTier) >= tierLevel(requiredTier);
  
  const getFeatureName = (feature: string): string => {
    switch(feature) {
      case 'collaboration': return 'Live Collaboration';
      case 'privateProjects': return 'Private Projects';
      case 'advancedExport': return 'Advanced Export';
      case 'customThemes': return 'Custom Themes';
      case 'apiAccess': return 'API Access';
      default: return 'Premium Feature';
    }
  };
  
  const handlePremiumClick = () => {
    if (!authState.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    // Show payment dialog directly
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
      <div className="absolute inset-0 bg-[#1a1f2c]/60 backdrop-blur-sm flex flex-col items-center justify-center">
        <div className="p-4 rounded-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <Lock className="h-5 w-5 text-[#6366f1]" />
          </div>
          <h3 className="text-sm font-medium text-white mb-2">
            {getFeatureName(feature)}
          </h3>
          <p className="text-xs text-[#9ca3af] mb-3">
            Requires {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} plan
          </p>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white"
            onClick={handlePremiumClick}
          >
            {authState.isAuthenticated ? 'Upgrade Plan' : 'Sign In'}
          </Button>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultView="login"
      />
      
      <UserDashboardDialog 
        open={showDashboard}
        onOpenChange={setShowDashboard}
      />

      <PaymentMethodDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        selectedTier={requiredTier}
        onSuccess={() => {
          setShowPaymentDialog(false);
          toast.success(`Successfully upgraded to ${requiredTier} plan!`);
        }}
      />
    </div>
  );
};
