
import React, { useState } from 'react';
import { User } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit2, Save, X } from 'lucide-react';

interface UserProfileSectionProps {
  user: User | null;
  onProfileUpdate: (updatedData: { name: string; email: string }) => void;
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({ user, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    onProfileUpdate({ name, email });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  // Generate initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-white">Profile Information</CardTitle>
            <CardDescription className="text-[#9ca3af]">
              Manage your personal information
            </CardDescription>
          </div>
          
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#252b3b] hover:bg-[#323a52] border-[#3e4a69] text-[#e2e8f0]"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-24 w-24 border-2 border-[#4f46e5]">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-[#252b3b] text-[#e2e8f0] text-xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-sm font-medium text-[#e2e8f0]">
                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-xs text-[#9ca3af]">
                Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#e2e8f0]">Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#252b3b] border-[#3e4a69] text-[#e2e8f0]"
                  />
                ) : (
                  <p className="text-[#e2e8f0] p-2 bg-[#252b3b] rounded-md border border-[#3e4a69]">
                    {user?.name || 'Not set'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#e2e8f0]">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#252b3b] border-[#3e4a69] text-[#e2e8f0]"
                  />
                ) : (
                  <p className="text-[#e2e8f0] p-2 bg-[#252b3b] rounded-md border border-[#3e4a69]">
                    {user?.email || 'Not set'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[#e2e8f0]">Account Type</Label>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${user?.tier === 'premium' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                      user?.tier === 'pro' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/50'}`
                  }>
                    {user?.tier ? user.tier.charAt(0).toUpperCase() + user.tier.slice(1) : 'Free'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#e2e8f0]">Sign-in Method</Label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/50">
                    {user?.authProvider === 'google' ? 'Google' : 'Email'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-2 mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#252b3b] hover:bg-[#323a52] border-[#3e4a69] text-[#e2e8f0]"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5]"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-1" /> Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
