
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, CreditCard, DollarSign, User, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionData {
  id: string;
  orderID?: string;
  tier: 'premium' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  createdAt: string;
  planId: string;
  facilityCode?: string;
}

export const PayPalTransactionHistory: React.FC = () => {
  const { authState } = useAuth();
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load subscription data from localStorage
    const loadSubscriptions = () => {
      try {
        const stored = localStorage.getItem('user_subscriptions');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSubscriptions(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading subscriptions:', error);
        toast.error('Failed to load subscription history');
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'expired':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
      case 'expired':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPlanPrice = (tier: string) => {
    return tier === 'premium' ? '$9.99' : '$19.99';
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    // In a real app, this would call PayPal's API to cancel the subscription
    toast.info('Subscription cancellation', {
      description: 'In a production environment, this would cancel your PayPal subscription.',
      duration: 5000,
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-[#1a1f2c] border-[#2d3748]">
        <CardContent className="p-6 text-center">
          <div className="w-8 h-8 border-2 border-t-[#6366f1] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#9ca3af]">Loading subscription history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#6366f1]" />
          PayPal Subscription History
        </CardTitle>
        <CardDescription className="text-[#9ca3af]">
          Your PayPal subscription transactions and status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscriptions.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-[#4b5563] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Subscriptions Yet</h3>
            <p className="text-[#9ca3af] mb-4">
              You haven't created any subscriptions yet. Subscribe to a plan to access premium features.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription, index) => (
              <div
                key={subscription.id || index}
                className="border border-[#2d3748] rounded-lg p-4 bg-[#1f2937]/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0070ba] h-10 w-10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-white">PP</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">
                        {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan
                      </h4>
                      <p className="text-sm text-[#9ca3af]">
                        {getPlanPrice(subscription.tier)}/month
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(subscription.status)} border`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(subscription.status)}
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </Badge>
                </div>

                <Separator className="bg-[#2d3748] my-3" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-[#d1d5db]">
                    <User className="h-4 w-4 text-[#6366f1]" />
                    <span>Subscription ID:</span>
                    <code className="bg-[#1a1f2c] px-1 rounded text-xs">
                      {subscription.id.substring(0, 20)}...
                    </code>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[#d1d5db]">
                    <Calendar className="h-4 w-4 text-[#6366f1]" />
                    <span>Created:</span>
                    <span>{formatDate(subscription.createdAt)}</span>
                  </div>

                  {subscription.orderID && (
                    <div className="flex items-center gap-2 text-[#d1d5db]">
                      <CreditCard className="h-4 w-4 text-[#6366f1]" />
                      <span>Order ID:</span>
                      <code className="bg-[#1a1f2c] px-1 rounded text-xs">
                        {subscription.orderID}
                      </code>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[#d1d5db]">
                    <DollarSign className="h-4 w-4 text-[#6366f1]" />
                    <span>Plan ID:</span>
                    <code className="bg-[#1a1f2c] px-1 rounded text-xs">
                      {subscription.planId}
                    </code>
                  </div>
                </div>

                {subscription.status === 'active' && (
                  <div className="mt-4 pt-3 border-t border-[#2d3748]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelSubscription(subscription.id)}
                      className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 rounded-lg bg-[#2d3748]/50 border border-[#4b5563] flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[#f87171] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-white">Sandbox Environment</h4>
            <p className="text-xs text-[#9ca3af] mt-1">
              This is a demonstration environment. All subscription data shown here is for testing purposes only.
              In a production environment, this data would be synchronized with PayPal's subscription management system.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
