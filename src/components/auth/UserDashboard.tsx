import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileSection } from './UserProfileSection';
import { UserSubscriptionInfo } from './UserSubscriptionInfo';
import { toast } from 'sonner';

interface UserDashboardProps {
  inDialog?: boolean;
  showSubscriptionOnly?: boolean;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ 
  inDialog = false,
  showSubscriptionOnly = false 
}) => {
  const { authState, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(authState.user?.name || '');
  const [email, setEmail] = useState(authState.user?.email || '');

  const handleProfileUpdate = async () => {
    if (!authState.user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Invalid email format');
        return;
      }

      // Check if name is empty
      if (!name.trim()) {
        toast.error('Name cannot be empty');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update user profile
      updateUserProfile({
        name: name.trim(),
        email: email.toLowerCase(),
      });

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  // Render content based on dialog and subscription only flags
  if (showSubscriptionOnly) {
    return <UserSubscriptionInfo />;
  }

  return (
    <div className={`grid grid-cols-1 ${inDialog ? 'gap-6' : 'gap-8 p-6'}`}>
      {/* User profile section */}
      <UserProfileSection 
        user={authState.user} 
        onProfileUpdate={handleProfileUpdate} 
      />
      
      {/* User subscription section */}
      <UserSubscriptionInfo />
    </div>
  );
};
