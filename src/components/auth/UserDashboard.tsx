
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileSection } from './UserProfileSection';
import { UserSubscriptionInfo } from './UserSubscriptionInfo';

interface UserDashboardProps {
  inDialog?: boolean;
  showSubscriptionOnly?: boolean;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ 
  inDialog = false,
  showSubscriptionOnly = false 
}) => {
  const { authState } = useAuth();

  if (!authState.user) {
    return (
      <div className="text-center py-8">
        <p className="text-[#9ca3af]">Please log in to view your dashboard.</p>
      </div>
    );
  }

  // Render content based on dialog and subscription only flags
  if (showSubscriptionOnly) {
    return <UserSubscriptionInfo />;
  }

  return (
    <div className={`grid grid-cols-1 ${inDialog ? 'gap-6' : 'gap-8 p-6'}`}>
      {/* User profile section */}
      <UserProfileSection />
      
      {/* User subscription section */}
      <UserSubscriptionInfo />
    </div>
  );
};
