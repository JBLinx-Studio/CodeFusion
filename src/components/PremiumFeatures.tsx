
import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumFeatureDialog } from './Auth';

interface PremiumFeatureProps {
  requiredTier: 'premium' | 'pro';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PremiumFeature: React.FC<PremiumFeatureProps> = ({ 
  requiredTier,
  children,
  fallback 
}) => {
  const { userAuth } = useSettings();
  
  // Determine if user can access this feature
  const canAccess = userAuth.isAuthenticated && (
    (requiredTier === 'premium' && (userAuth.tier === 'premium' || userAuth.tier === 'pro')) ||
    (requiredTier === 'pro' && userAuth.tier === 'pro')
  );
  
  if (!userAuth.isAuthenticated || !canAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="relative border rounded-lg p-6 bg-gray-900/50 text-center flex flex-col items-center justify-center space-y-2 min-h-[150px] backdrop-blur-sm">
        <Lock className="h-8 w-8 text-gray-400 mb-2" />
        <h3 className="font-medium text-gray-200">Premium Feature</h3>
        <p className="text-sm text-gray-400 mb-3">
          This feature requires a {requiredTier} subscription
        </p>
        <PremiumFeatureDialog />
      </div>
    );
  }
  
  return <>{children}</>;
};

// Example premium features showcase
export const PremiumFeaturesShowcase = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div className="border rounded-lg p-4">
        <h3 className="font-bold">Basic Editor</h3>
        <p className="text-sm text-gray-400 mb-3">Available to all users</p>
        <div className="h-32 bg-gray-800 rounded flex items-center justify-center text-gray-400">
          Standard Editor
        </div>
      </div>
      
      <PremiumFeature requiredTier="premium">
        <div className="border rounded-lg p-4 border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-transparent">
          <h3 className="font-bold text-indigo-400">Collaborative Editing</h3>
          <p className="text-sm text-gray-400 mb-3">Premium feature</p>
          <div className="h-32 bg-gray-800 rounded flex items-center justify-center text-gray-400">
            Real-time collaboration with teammates
          </div>
        </div>
      </PremiumFeature>
      
      <PremiumFeature requiredTier="pro">
        <div className="border rounded-lg p-4 border-purple-500/30 bg-gradient-to-br from-purple-950/30 to-transparent">
          <h3 className="font-bold text-purple-400">AI Code Assistant</h3>
          <p className="text-sm text-gray-400 mb-3">Pro feature</p>
          <div className="h-32 bg-gray-800 rounded flex items-center justify-center text-gray-400">
            AI-powered code suggestions and optimizations
          </div>
        </div>
      </PremiumFeature>
    </div>
  );
};
