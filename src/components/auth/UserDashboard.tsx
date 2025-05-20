
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { UserSubscriptionInfo } from './UserSubscriptionInfo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PremiumFeatures } from './PremiumFeatures';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, User, CreditCard, FileText, Users, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const UserDashboard: React.FC = () => {
  const { authState, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const navigate = useNavigate();

  if (!authState.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="mt-2 text-gray-400">You need to be logged in to view this page.</p>
          <Button 
            variant="default"
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Mock usage data
  const storageUsed = authState.user.tier === 'free' ? 45 : authState.user.tier === 'premium' ? 20 : 10;
  const storageLimit = authState.user.tier === 'free' ? 100 : authState.user.tier === 'premium' ? 500 : 1000;
  const projectsCount = authState.user.tier === 'free' ? 3 : authState.user.tier === 'premium' ? 8 : 12;
  const projectsLimit = authState.user.tier === 'free' ? 5 : authState.user.tier === 'premium' ? 15 : 50;

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully");
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Card className="lg:w-64 w-full bg-[#1a1f2c] border-[#2d3748] shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col items-center py-6">
              <Avatar className="w-24 h-24 border-2 border-[#6366f1] p-1">
                <AvatarImage src={authState.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authState.user?.name || 'User')}`} />
                <AvatarFallback className="bg-[#2d3748] text-[#9ca3af] text-lg">
                  {authState.user?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold text-white">{authState.user?.name || 'User'}</h2>
              <p className="text-sm text-[#9ca3af]">{authState.user.email}</p>
              
              <div className="mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white text-xs font-medium uppercase">
                {authState.user.tier.charAt(0).toUpperCase() + authState.user.tier.slice(1)}
              </div>
            </div>

            <div className="mt-6">
              <nav className="flex flex-col space-y-1">
                <Button 
                  variant="ghost" 
                  className={`justify-start ${activeTab === 'account' ? 'bg-[#2d3748] text-white' : 'text-[#9ca3af] hover:text-white hover:bg-[#2d3748]/60'}`}
                  onClick={() => setActiveTab('account')}
                >
                  <User className="h-4 w-4 mr-3" />
                  Account
                </Button>
                <Button 
                  variant="ghost"
                  className={`justify-start ${activeTab === 'subscription' ? 'bg-[#2d3748] text-white' : 'text-[#9ca3af] hover:text-white hover:bg-[#2d3748]/60'}`}
                  onClick={() => setActiveTab('subscription')}
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Subscription
                </Button>
                <Button 
                  variant="ghost"
                  className={`justify-start ${activeTab === 'projects' ? 'bg-[#2d3748] text-white' : 'text-[#9ca3af] hover:text-white hover:bg-[#2d3748]/60'}`}
                  onClick={() => setActiveTab('projects')}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Projects
                </Button>
                <Button 
                  variant="ghost"
                  className={`justify-start ${activeTab === 'team' ? 'bg-[#2d3748] text-white' : 'text-[#9ca3af] hover:text-white hover:bg-[#2d3748]/60'}`}
                  onClick={() => setActiveTab('team')}
                >
                  <Users className="h-4 w-4 mr-3" />
                  Team
                </Button>
                <Button 
                  variant="ghost"
                  className={`justify-start ${activeTab === 'analytics' ? 'bg-[#2d3748] text-white' : 'text-[#9ca3af] hover:text-white hover:bg-[#2d3748]/60'}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart2 className="h-4 w-4 mr-3" />
                  Analytics
                </Button>
                <Button 
                  variant="ghost"
                  className={`justify-start ${activeTab === 'settings' ? 'bg-[#2d3748] text-white' : 'text-[#9ca3af] hover:text-white hover:bg-[#2d3748]/60'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Button>

                <Button 
                  variant="ghost"
                  className="justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-8"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </Button>
              </nav>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeTab === 'account' && (
              <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Account Information</CardTitle>
                  <CardDescription className="text-[#9ca3af]">Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-[#9ca3af]">Name</h3>
                    <p className="text-white">{authState.user.name || 'Not set'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#9ca3af]">Email</h3>
                    <p className="text-white">{authState.user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#9ca3af]">Account Type</h3>
                    <p className="text-white capitalize">{authState.user.tier} Account</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#9ca3af]">Member Since</h3>
                    <p className="text-white">{new Date(authState.user.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="pt-4">
                    <Button className="bg-[#2d3748] hover:bg-[#374151] text-white mr-4">
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="border-[#4b5563] text-[#d1d5db] hover:bg-[#2d3748]">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'subscription' && (
              <UserSubscriptionInfo />
            )}

            {activeTab === 'projects' && (
              <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Your Projects</CardTitle>
                  <CardDescription className="text-[#9ca3af]">
                    Manage and monitor your projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#9ca3af]">
                        Projects ({projectsCount}/{projectsLimit})
                      </span>
                      <span className="text-xs text-[#9ca3af]">
                        {Math.round((projectsCount / projectsLimit) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(projectsCount / projectsLimit) * 100} 
                      className="h-2 bg-[#2d3748]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#9ca3af]">
                        Storage ({storageUsed} MB/{storageLimit} MB)
                      </span>
                      <span className="text-xs text-[#9ca3af]">
                        {Math.round((storageUsed / storageLimit) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(storageUsed / storageLimit) * 100}
                      className="h-2 bg-[#2d3748]" 
                    />
                  </div>

                  <PremiumFeatures feature="privateProjects" requiredTier="premium">
                    <Button className="w-full bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white">
                      Create New Project
                    </Button>
                  </PremiumFeatures>
                </CardContent>
              </Card>
            )}

            {activeTab === 'team' && (
              <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Team Management</CardTitle>
                  <CardDescription className="text-[#9ca3af]">
                    Collaborate with team members
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PremiumFeatures feature="collaboration" requiredTier="premium">
                    <div className="p-6 text-center">
                      <h3 className="text-lg font-medium text-white">Team Collaboration</h3>
                      <p className="text-[#9ca3af] mt-2">
                        Invite team members and collaborate on projects together.
                      </p>
                      <Button className="mt-4 bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white">
                        Invite Team Members
                      </Button>
                    </div>
                  </PremiumFeatures>
                </CardContent>
              </Card>
            )}

            {activeTab === 'analytics' && (
              <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Analytics</CardTitle>
                  <CardDescription className="text-[#9ca3af]">
                    View your usage statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PremiumFeatures feature="advancedExport" requiredTier="pro">
                    <div className="p-6 text-center">
                      <h3 className="text-lg font-medium text-white">Advanced Analytics</h3>
                      <p className="text-[#9ca3af] mt-2">
                        Get detailed insights about your projects and usage patterns.
                      </p>
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-[#2d3748] rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-[#6366f1]">{Math.floor(Math.random() * 100)}</div>
                            <div className="text-sm text-[#9ca3af] mt-2">Metric {i}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PremiumFeatures>
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Settings</CardTitle>
                  <CardDescription className="text-[#9ca3af]">
                    Customize your experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-white mb-2">Theme Preferences</h3>
                      <PremiumFeatures feature="customThemes" requiredTier="premium">
                        <div className="grid grid-cols-3 gap-2">
                          {['Default', 'Dark', 'Light'].map((theme) => (
                            <div 
                              key={theme}
                              className={`p-2 rounded-md text-center cursor-pointer border ${theme === 'Default' ? 'bg-[#2d3748] border-[#6366f1]' : 'bg-[#1a1f2c] border-[#374151] hover:bg-[#2d3748]'}`}
                            >
                              {theme}
                            </div>
                          ))}
                        </div>
                      </PremiumFeatures>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white mb-2">Notification Settings</h3>
                      <div className="space-y-2">
                        {['Email notifications', 'Project updates', 'Team messages'].map((setting) => (
                          <div key={setting} className="flex items-center justify-between bg-[#1a1f2c] border border-[#374151] p-2 rounded-md">
                            <span>{setting}</span>
                            <Button size="sm" variant="outline" className="h-7 border-[#4b5563] text-[#d1d5db] hover:bg-[#2d3748]">
                              Enable
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
