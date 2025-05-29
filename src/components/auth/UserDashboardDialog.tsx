
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { UserDashboard } from './UserDashboard';
import { PayPalTransactionHistory } from '../paypal/PayPalTransactionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';

interface UserDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDashboardDialog: React.FC<UserDashboardDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { authState } = useAuth();
  const isPaidUser = authState.user?.tier !== 'free';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0c1018] border-[#2d3748] p-0 max-w-6xl w-[90vw] max-h-[90vh] overflow-hidden">
        <DialogHeader className="p-4 border-b border-[#2d3748] bg-gradient-to-r from-[#0f1117] to-[#1a1f2c]">
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            User Dashboard
          </DialogTitle>
          <DialogDescription className="text-[#9ca3af]">
            Manage your account, subscription, and preferences
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b border-[#2d3748]">
            <TabsList className="bg-transparent h-12 px-4">
              <TabsTrigger 
                value="profile"
                className="data-[state=active]:bg-[#1a1f2c] data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="subscription" 
                className="data-[state=active]:bg-[#1a1f2c] data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                Subscription
              </TabsTrigger>
              {isPaidUser && (
                <TabsTrigger 
                  value="payments" 
                  className="data-[state=active]:bg-[#1a1f2c] data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  Payments
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <div className="overflow-y-auto p-4 max-h-[calc(90vh-160px)]">
            <TabsContent value="profile" className="mt-0 p-0">
              <UserDashboard inDialog />
            </TabsContent>
            <TabsContent value="subscription" className="mt-0 p-0">
              <UserDashboard inDialog showSubscriptionOnly />
            </TabsContent>
            {isPaidUser && (
              <TabsContent value="payments" className="mt-0 p-0">
                <PayPalTransactionHistory />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
