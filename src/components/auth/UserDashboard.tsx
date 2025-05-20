
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleUser, CreditCard, Settings, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { UserSubscriptionInfo } from './UserSubscriptionInfo';

export const UserDashboard: React.FC = () => {
  const { authState, updateUserProfile } = useAuth();

  if (!authState.isAuthenticated || !authState.user) {
    return null;
  }

  const user = authState.user;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white';
      case 'pro':
        return 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white';
      default:
        return 'bg-[#2d3748] text-white';
    }
  };

  const getMemberSince = () => {
    try {
      const date = new Date(user.createdAt);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 bg-[#1a1f2c] border border-[#2d3748]">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#2d3748]">Overview</TabsTrigger>
          <TabsTrigger value="subscription" className="data-[state=active]:bg-[#2d3748]">Subscription</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#2d3748]">Profile Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-[#1a1f2c] border border-[#2d3748] text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Welcome back, {user.name}</CardTitle>
                <CardDescription className="text-[#9ca3af]">
                  Member since {getMemberSince()}
                </CardDescription>
              </div>
              <Badge className={`${getTierColor(user.tier)} ml-2`}>
                {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Account
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-sm font-medium text-[#9ca3af]">Account Status</h3>
                  <div className="flex items-center text-white">
                    <CircleUser className="mr-2 h-4 w-4 text-[#6366f1]" />
                    <span>Active</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-sm font-medium text-[#9ca3af]">Authentication Provider</h3>
                  <div className="flex items-center text-white">
                    {user.authProvider === 'google' ? (
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.6 20H24v8h11.4c-1.1 5.4-5.9 8.6-11.4 8.6-7 0-12.6-5.6-12.6-12.6S17 11.4 24 11.4c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.4 5.1 29.5 3 24 3 13.5 3 5 11.5 5 22s8.5 19 19 19 19-8.5 19-19c0-.7 0-1.3-.1-2h-19.8z"/>
                        <path fill="#FF3D00" d="M5.8 13.5l6.6 4.8C14.3 13.3 18.8 10 24 10c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.4 4.1 29.5 2 24 2 15.5 2 8.2 6.7 5.8 13.5z"/>
                        <path fill="#4CAF50" d="M24 44c5.2 0 10-1.9 13.7-5.2L31.9 33c-2.1 1.4-4.8 2.2-7.9 2.2-5.5 0-10.3-3.2-11.4-8.6l-6.6 5.1C9.3 38.5 16.1 44 24 44z"/>
                        <path fill="#1976D2" d="M43.6 20H24v8h11.4c-.6 2.9-2.2 5.5-4.5 7.2l5.7 5.8c4-3.5 6.4-8.7 6.4-15 0-.7 0-1.3-.1-2h-19.8z"/>
                      </svg>
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4 text-[#6366f1]" />
                    )}
                    <span>{user.authProvider === 'google' ? 'Google' : 'Email & Password'}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-sm font-medium text-[#9ca3af]">Last Login</h3>
                  <div className="flex items-center text-white">
                    <span>
                      {new Date(user.lastLogin).toLocaleDateString()} at {new Date(user.lastLogin).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#1a1f2c] border border-[#2d3748] text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-4 w-4 text-[#f59e0b]" />
                  Available Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Code Playground</span>
                    <Badge className="bg-green-600">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Code Sharing</span>
                    <Badge className="bg-green-600">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Project Storage</span>
                    <Badge className="bg-green-600">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Private Projects</span>
                    <Badge className={user.tier !== 'free' ? "bg-green-600" : "bg-[#4b5563]"}>
                      {user.tier !== 'free' ? 'Available' : 'Premium Feature'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Advanced Export</span>
                    <Badge className={user.tier !== 'free' ? "bg-green-600" : "bg-[#4b5563]"}>
                      {user.tier !== 'free' ? 'Available' : 'Premium Feature'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Access</span>
                    <Badge className={user.tier === 'pro' ? "bg-green-600" : "bg-[#4b5563]"}>
                      {user.tier === 'pro' ? 'Available' : 'Pro Feature'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {user.tier === 'free' && (
                  <Button className="w-full bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5]">
                    Upgrade to Premium
                  </Button>
                )}
                {user.tier === 'premium' && (
                  <Button className="w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309]">
                    Upgrade to Pro
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card className="bg-[#1a1f2c] border border-[#2d3748] text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-4 w-4 text-[#6366f1]" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9ca3af]">Email</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9ca3af]">User ID</span>
                    <span className="font-mono text-xs">{user.id}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#9ca3af]">Storage Used</span>
                      <span>23% / 500MB</span>
                    </div>
                    <Progress value={23} className="h-2 bg-[#2d3748]" indicatorClassName="bg-[#6366f1]" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-[#374151] hover:bg-[#1e293b] text-white">
                  View Account Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="subscription">
          <UserSubscriptionInfo />
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="bg-[#1a1f2c] border border-[#2d3748] text-white">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription className="text-[#9ca3af]">
                Update your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  className="w-full bg-[#131620] border border-[#374151] rounded-md p-2 text-white"
                  defaultValue={user.name}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="w-full bg-[#131620] border border-[#374151] rounded-md p-2 text-white"
                  defaultValue={user.email}
                  disabled={user.authProvider === 'google'}
                />
                {user.authProvider === 'google' && (
                  <p className="text-xs text-[#9ca3af]">Email managed by Google authentication</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5]">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
