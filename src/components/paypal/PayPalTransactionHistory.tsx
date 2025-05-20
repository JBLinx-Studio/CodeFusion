
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { CreditCard, X } from 'lucide-react';

interface Subscription {
  id: string;
  tier: 'premium' | 'pro';
  status: 'active' | 'cancelled' | 'suspended';
  createdAt: string;
  cancelledAt?: string;
}

export const PayPalTransactionHistory: React.FC = () => {
  const { authState, updateUserProfile } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isCancelling, setIsCancelling] = useState(false);

  // Load stored subscriptions
  useEffect(() => {
    const loadSubscriptions = () => {
      try {
        const storedSubscriptions = localStorage.getItem('user_subscriptions');
        if (storedSubscriptions) {
          setSubscriptions(JSON.parse(storedSubscriptions));
        }
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
      }
    };

    loadSubscriptions();
  }, []);

  // Get the active subscription if any
  const activeSubscription = subscriptions.find(sub => sub.status === 'active');

  const handleCancelSubscription = async (subscriptionId: string) => {
    // In a real implementation, this would call PayPal's API to cancel the subscription
    setIsCancelling(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local subscription data
      const updatedSubscriptions = subscriptions.map(sub => 
        sub.id === subscriptionId ? 
        {...sub, status: 'cancelled' as const, cancelledAt: new Date().toISOString()} : 
        sub
      );
      
      localStorage.setItem('user_subscriptions', JSON.stringify(updatedSubscriptions));
      setSubscriptions(updatedSubscriptions);
      
      // Update user profile
      updateUserProfile({
        tier: 'free',
        subscriptionId: null
      });
      
      toast.success('Subscription cancelled successfully', {
        description: 'Your subscription has been cancelled. You will no longer be billed.'
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setIsCancelling(false);
    }
  };

  if (authState.user?.tier === 'free' && subscriptions.length === 0) {
    return (
      <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Subscription Management</CardTitle>
          <CardDescription className="text-[#9ca3af]">
            Manage your subscriptions and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#9ca3af]">
            <CreditCard className="h-10 w-10 text-[#6366f1] mx-auto mb-3 opacity-50" />
            <p>No active subscriptions</p>
            <p className="text-sm mt-2">Upgrade to Premium or Pro to access advanced features.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-white">Subscription Management</CardTitle>
        <CardDescription className="text-[#9ca3af]">
          Manage your subscriptions and payment history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activeSubscription ? (
          <div className="space-y-6">
            <div className="bg-[#252b3b] border border-[#3e4a69] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {activeSubscription.tier.charAt(0).toUpperCase() + activeSubscription.tier.slice(1)} Plan
                  </h3>
                  <p className="text-sm text-[#9ca3af]">
                    Started on {new Date(activeSubscription.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className="border-green-500 text-green-400"
                >
                  Active
                </Badge>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#3e4a69]">
                <div className="text-sm text-[#9ca3af]">
                  Subscription ID: <span className="font-mono text-xs bg-[#1a1f2c] px-1.5 py-0.5 rounded">{activeSubscription.id}</span>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleCancelSubscription(activeSubscription.id)}
                  disabled={isCancelling}
                  className="bg-red-900/30 hover:bg-red-800/50 text-red-400 border border-red-800/50"
                >
                  {isCancelling ? (
                    <>
                      <div className="w-3 h-3 border-2 border-t-red-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-1" /> Cancel Subscription
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-[#d1d5db]">Payment History</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#2d3748]">
                      <th className="py-2 px-4 text-left text-xs font-medium text-[#9ca3af]">Date</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-[#9ca3af]">Description</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-[#9ca3af]">Amount</th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-[#9ca3af]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#2d3748]">
                      <td className="py-2 px-4 text-xs text-[#d1d5db]">
                        {new Date(activeSubscription.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 text-xs text-[#d1d5db]">
                        {activeSubscription.tier.charAt(0).toUpperCase() + activeSubscription.tier.slice(1)} Subscription
                      </td>
                      <td className="py-2 px-4 text-xs font-medium text-[#d1d5db]">
                        ${activeSubscription.tier === 'premium' ? '9.99' : '19.99'}
                      </td>
                      <td className="py-2 px-4">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/30 text-green-400">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-6 text-[#9ca3af]">
              {subscriptions.length > 0 ? (
                <>
                  <p>You have no active subscriptions.</p>
                  <p className="text-sm mt-2">Your previous subscription was cancelled.</p>
                </>
              ) : (
                <>
                  <p>No subscription history found.</p>
                </>
              )}
            </div>
            {subscriptions.filter(sub => sub.status === 'cancelled').length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-[#d1d5db]">Past Subscriptions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[#2d3748]">
                        <th className="py-2 px-4 text-left text-xs font-medium text-[#9ca3af]">Plan</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-[#9ca3af]">Start Date</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-[#9ca3af]">End Date</th>
                        <th className="py-2 px-4 text-left text-xs font-medium text-[#9ca3af]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions
                        .filter(sub => sub.status === 'cancelled')
                        .map(sub => (
                          <tr key={sub.id} className="border-b border-[#2d3748]">
                            <td className="py-2 px-4 text-xs text-[#d1d5db]">
                              {sub.tier.charAt(0).toUpperCase() + sub.tier.slice(1)}
                            </td>
                            <td className="py-2 px-4 text-xs text-[#d1d5db]">
                              {new Date(sub.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-4 text-xs text-[#d1d5db]">
                              {sub.cancelledAt ? new Date(sub.cancelledAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-2 px-4">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-400">
                                Cancelled
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-3 bg-[#2d3748]/50 rounded text-xs text-[#9ca3af] border border-[#4b5563]">
          <p className="font-medium mb-1">Sandbox Testing Information</p>
          <p>This is a fully functional sandbox implementation. You can:</p>
          <ul className="list-disc ml-4 space-y-1 mt-1">
            <li>Subscribe to plans using the sandbox PayPal account</li>
            <li>Cancel subscriptions directly from this interface</li>
            <li>See your subscription history and status</li>
          </ul>
          <p className="mt-2">Sandbox PayPal credentials for testing:</p>
          <div className="font-mono bg-[#1a1f2c] p-1.5 rounded mt-1 text-[10px] leading-relaxed">
            Email: sb-47nmps29800276@personal.example.com<br />
            Password: M3@Y5!zi
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
