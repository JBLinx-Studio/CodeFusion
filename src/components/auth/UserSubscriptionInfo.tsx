
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, CreditCard, Info } from 'lucide-react';
import { toast } from 'sonner';

export const UserSubscriptionInfo: React.FC = () => {
  const { authState, updateUserProfile } = useAuth();
  const user = authState.user;

  if (!user) {
    return null;
  }

  const handleUpgrade = (tier: 'premium' | 'pro') => {
    toast.info(`You'll be redirected to the payment page shortly.`, {
      description: `Upgrade to ${tier.charAt(0).toUpperCase() + tier.slice(1)} tier`,
      action: {
        label: 'Cancel',
        onClick: () => {
          toast.info('Upgrade canceled');
        }
      }
    });

    // Simulate payment process (in a real app, redirect to payment gateway)
    setTimeout(() => {
      // For demo, we'll just update the user's tier
      updateUserProfile({ tier });
      toast.success(`Upgraded to ${tier.charAt(0).toUpperCase() + tier.slice(1)} successfully!`);
    }, 2000);
  };

  const handleCancelSubscription = () => {
    toast.info('Are you sure you want to cancel your subscription?', {
      description: 'You will lose access to premium features',
      action: {
        label: 'Yes, Cancel',
        onClick: () => {
          updateUserProfile({ tier: 'free' });
          toast.success('Subscription canceled successfully');
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1a1f2c] border border-[#2d3748] rounded-lg p-4 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-[#6366f1]" />
          <p className="text-sm">
            Choose the plan that works best for you. All plans include access to our core features.
            You can upgrade, downgrade, or cancel at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free Tier */}
          <Card className={`bg-[#1e293b] border ${user.tier === 'free' ? 'border-[#6366f1]' : 'border-[#2d3748]'}`}>
            <CardHeader>
              <CardTitle className="text-white">Free</CardTitle>
              <CardDescription className="text-[#9ca3af]">Basic access to the platform</CardDescription>
              <div className="mt-2">
                <span className="text-2xl font-bold text-white">$0</span>
                <span className="text-[#9ca3af]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-sm">Code Playground</span>
              </div>
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-sm">Public Projects</span>
              </div>
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-sm">Basic Export</span>
              </div>
            </CardContent>
            <CardFooter>
              {user.tier === 'free' ? (
                <Button className="w-full bg-[#2d3748]" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full bg-[#2d3748] hover:bg-[#374151]"
                  onClick={() => handleUpgrade('free')}
                >
                  Downgrade
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Premium Tier */}
          <Card className={`bg-[#1e293b] border ${user.tier === 'premium' ? 'border-[#6366f1]' : 'border-[#2d3748]'}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Premium</CardTitle>
                <Badge className="bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white">Popular</Badge>
              </div>
              <CardDescription className="text-[#9ca3af]">Enhanced features for developers</CardDescription>
              <div className="mt-2">
                <span className="text-2xl font-bold text-white">$9.99</span>
                <span className="text-[#9ca3af]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-sm">All Free Features</span>
              </div>
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-sm">Private Projects</span>
              </div>
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-sm">Advanced Export</span>
              </div>
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-sm">Custom Themes</span>
              </div>
            </CardContent>
            <CardFooter>
              {user.tier === 'premium' ? (
                <Button className="w-full bg-gradient-to-r from-[#9333ea] to-[#4f46e5]" disabled>
                  Current Plan
                </Button>
              ) : user.tier === 'pro' ? (
                <Button 
                  className="w-full bg-gradient-to-r from-[#9333ea] to-[#4f46e5] hover:from-[#7c3aed] hover:to-[#4338ca]"
                  onClick={() => handleUpgrade('premium')}
                >
                  Downgrade to Premium
                </Button>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-[#9333ea] to-[#4f46e5] hover:from-[#7c3aed] hover:to-[#4338ca]"
                  onClick={() => handleUpgrade('premium')}
                >
                  Upgrade to Premium
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className={`bg-[#1e293b] border ${user.tier === 'pro' ? 'border-[#f59e0b]' : 'border-[#2d3748]'}`}>
            <CardHeader>
              <CardTitle className="text-white">Pro</CardTitle>
              <CardDescription className="text-[#9ca3af]">Professional tools for teams</CardDescription>
              <div className="mt-2">
                <span className="text-2xl font-bold text-white">$29.99</span>
                <span className="text-[#9ca3af]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-sm">All Premium Features</span>
              </div>
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-sm">API Access</span>
              </div>
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-sm">Collaboration Tools</span>
              </div>
              <div className="flex items-center">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-sm">Priority Support</span>
              </div>
            </CardContent>
            <CardFooter>
              {user.tier === 'pro' ? (
                <Button className="w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706]" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309]"
                  onClick={() => handleUpgrade('pro')}
                >
                  Upgrade to Pro
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {user.tier !== 'free' && (
        <Card className="bg-[#1a1f2c] border border-[#2d3748] text-white">
          <CardHeader>
            <CardTitle className="text-lg">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 border border-[#374151] rounded-lg bg-[#131620]">
              <div className="bg-[#2d3748] p-2 rounded-md">
                <CreditCard size={20} className="text-[#6366f1]" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-[#9ca3af]">Expires 12/2025</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto border-[#374151]">
                Update
              </Button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Billing History</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm p-2 border-b border-[#2d3748]">
                  <span>May 1, 2025</span>
                  <span className="text-[#9ca3af]">
                    {user.tier === 'premium' ? '$9.99' : '$29.99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm p-2 border-b border-[#2d3748]">
                  <span>Apr 1, 2025</span>
                  <span className="text-[#9ca3af]">
                    {user.tier === 'premium' ? '$9.99' : '$29.99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm p-2 border-b border-[#2d3748]">
                  <span>Mar 1, 2025</span>
                  <span className="text-[#9ca3af]">
                    {user.tier === 'premium' ? '$9.99' : '$29.99'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full text-[#f87171] hover:text-[#ef4444] border-[#374151] hover:bg-[#1e293b]"
              onClick={handleCancelSubscription}
            >
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
