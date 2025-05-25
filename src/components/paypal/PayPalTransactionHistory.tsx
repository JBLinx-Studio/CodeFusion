
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { CreditCard, X, Loader, AlertTriangle } from 'lucide-react';

interface Subscription {
  id: string;
  orderID?: string;
  tier: 'premium' | 'pro';
  status: 'active' | 'cancelled' | 'suspended';
  createdAt: string;
  cancelledAt?: string;
  planId?: string;
}

export const PayPalTransactionHistory: React.FC = () => {
  const { authState, updateUserProfile } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = () => {
    try {
      const storedSubscriptions = localStorage.getItem('user_subscriptions');
      if (storedSubscriptions) {
        const parsedSubscriptions = JSON.parse(storedSubscriptions);
        setSubscriptions(parsedSubscriptions);
      }
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      toast.error('Failed to load subscription history');
    }
  };

  const activeSubscription = subscriptions.find(sub => sub.status === 'active');
  const cancelledSubscriptions = subscriptions.filter(sub => sub.status === 'cancelled');

  const handleCancelSubscription = async (subscriptionId: string) => {
    setIsCancelling(subscriptionId);
    
    try {
      // Simulate API call to cancel subscription
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update subscription status
      const updatedSubscriptions = subscriptions.map(sub => 
        sub.id === subscriptionId ? 
        { ...sub, status: 'cancelled' as const, cancelledAt: new Date().toISOString() } : 
        sub
      );
      
      localStorage.setItem('user_subscriptions', JSON.stringify(updatedSubscriptions));
      setSubscriptions(updatedSubscriptions);
      
      // Update user profile to free tier
      await updateUserProfile({
        tier: 'free',
        subscriptionId: null
      });
      
      toast.success('Subscription Cancelled', {
        description: 'Your subscription has been cancelled successfully. You will retain access until the end of your billing period.',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription. Please try again.');
    } finally {
      setIsCancelling(null);
    }
  };

  if (authState.user?.tier === 'free' && subscriptions.length === 0) {
    return (
      <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Subscription Management</CardTitle>
          <CardDescription className="text-[#9ca3af]">
            Manage your active subscriptions and view payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-[#6366f1] mx-auto mb-4 opacity-50" />
            <p className="text-[#9ca3af] text-lg mb-2">No Active Subscriptions</p>
            <p className="text-[#6b7280] text-sm">
              Upgrade to Premium or Pro to unlock advanced features and capabilities.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          Subscription Management
          {activeSubscription && (
            <Badge variant="outline" className="border-green-500 text-green-400">
              Active
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-[#9ca3af]">
          Manage your subscriptions and view payment history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Subscription Section */}
        {activeSubscription && (
          <div className="bg-gradient-to-r from-[#1f2937] to-[#252b3b] border border-[#3e4a69] rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {activeSubscription.tier.charAt(0).toUpperCase() + activeSubscription.tier.slice(1)} Plan
                </h3>
                <p className="text-[#9ca3af] text-sm">
                  Active since {new Date(activeSubscription.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[#6b7280] text-xs mt-1">
                  Subscription ID: {activeSubscription.id}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-1">
                  {activeSubscription.tier === 'premium' ? '$9.99' : '$19.99'}
                </div>
                <div className="text-[#9ca3af] text-sm">per month</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#3e4a69]">
              <div className="flex-1">
                <div className="text-xs text-[#9ca3af] mb-1">Next billing date</div>
                <div className="text-sm text-white">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleCancelSubscription(activeSubscription.id)}
                disabled={isCancelling === activeSubscription.id}
                className="bg-red-900/30 hover:bg-red-800/50 text-red-400 border border-red-800/50"
              >
                {isCancelling === activeSubscription.id ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel Subscription
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Payment History</h3>
          
          {subscriptions.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-[#2d3748]">
              <table className="w-full">
                <thead className="bg-[#2d3748]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d3748]">
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-[#1f2937]">
                      <td className="px-4 py-3 text-sm text-[#d1d5db]">
                        {new Date(subscription.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#d1d5db]">
                        {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-[#d1d5db]">
                        {subscription.tier === 'premium' ? '$9.99' : '$19.99'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          subscription.status === 'active' 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-red-900/30 text-red-400'
                        }`}>
                          {subscription.status === 'active' ? 'Active' : 'Cancelled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-[#9ca3af]">
              <p>No payment history available</p>
            </div>
          )}
        </div>

        {/* Sandbox Notice */}
        <div className="bg-[#2d3748]/50 border border-[#4b5563] rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Sandbox Environment</h4>
              <p className="text-xs text-[#9ca3af] mb-3">
                This is a fully functional demo using PayPal's sandbox environment. All transactions are simulated.
              </p>
              <div className="bg-[#1a1f2c] rounded p-3">
                <p className="text-xs text-[#9ca3af] mb-2">Test PayPal Account:</p>
                <div className="font-mono text-xs text-[#d1d5db] space-y-1">
                  <div>Email: sb-47nmps29800276@personal.example.com</div>
                  <div>Password: M3@Y5!zi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
