
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Calendar, Crown, Edit3, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export const UserProfileSection: React.FC = () => {
  const { authState, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: authState.user?.name || '',
    email: authState.user?.email || '',
  });

  if (!authState.user) {
    return (
      <Card className="bg-[#1a1f2c] border-[#2d3748]">
        <CardContent className="p-6">
          <p className="text-[#9ca3af]">Please log in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: authState.user?.name || '',
      email: authState.user?.email || '',
    });
  };

  const handleSave = () => {
    if (!editForm.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (!editForm.email.trim() || !editForm.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    updateUserProfile({
      name: editForm.name.trim(),
      email: editForm.email.trim(),
    });

    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: authState.user?.name || '',
      email: authState.user?.email || '',
    });
  };

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'free':
        return { label: 'Free', color: 'bg-gray-500', description: 'Basic features' };
      case 'starter':
        return { label: 'Starter', color: 'bg-blue-500', description: 'Essential tools' };
      case 'developer':
        return { label: 'Developer', color: 'bg-purple-500', description: 'Advanced features' };
      case 'pro':
        return { label: 'Pro', color: 'bg-indigo-500', description: 'Everything you need' };
      case 'team-starter':
        return { label: 'Team Starter', color: 'bg-green-500', description: 'Small team collaboration' };
      case 'team-pro':
        return { label: 'Team Pro', color: 'bg-emerald-500', description: 'Advanced team features' };
      case 'enterprise':
        return { label: 'Enterprise', color: 'bg-yellow-500', description: 'Custom solutions' };
      default:
        return { label: 'Free', color: 'bg-gray-500', description: 'Basic features' };
    }
  };

  const tierInfo = getTierInfo(authState.user.tier);
  const isPaidUser = authState.user.tier !== 'free';

  return (
    <Card className="bg-gradient-to-br from-[#1a1f2c] to-[#2d3748] border-[#3a4553] shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="h-6 w-6 text-[#6366f1]" />
            Profile Information
          </CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1] hover:text-white"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
        <CardDescription className="text-[#9ca3af]">
          Manage your account information and preferences
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 border-2 border-[#6366f1]">
            <AvatarImage src={authState.user.avatar} alt={authState.user.name} />
            <AvatarFallback className="bg-[#6366f1] text-white text-xl font-bold">
              {authState.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`${tierInfo.color} text-white px-3 py-1`}>
                {isPaidUser && <Crown className="h-3 w-3 mr-1" />}
                {tierInfo.label}
              </Badge>
              {authState.user.subscriptionId && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Active Subscription
                </Badge>
              )}
            </div>
            <p className="text-sm text-[#9ca3af]">{tierInfo.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-[#d1d5db] flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-[#2d3748] border-[#4a5568] text-white focus:border-[#6366f1]"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-white text-lg">{authState.user.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-[#d1d5db] flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-[#2d3748] border-[#4a5568] text-white focus:border-[#6366f1]"
                  placeholder="Enter your email address"
                />
              ) : (
                <p className="text-white text-lg">{authState.user.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-[#d1d5db] flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                Member Since
              </Label>
              <p className="text-white text-lg">
                {new Date(authState.user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div>
              <Label className="text-[#d1d5db] flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4" />
                Account Type
              </Label>
              <p className="text-white text-lg">
                {authState.user.authProvider === 'google' ? 'Google Account' : 'Email Account'}
              </p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#3a4553]">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-[#4a5568] text-[#9ca3af] hover:bg-[#374151]"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#6366f1] hover:bg-[#5b21b6] text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
