
import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User, UserPlus, Lock } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function AuthDialog() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, userAuth, logout } = useSettings();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        toast.success('Login successful!');
        setOpen(false);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('An error occurred during login.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      const success = await signup(values.email, values.username, values.password);
      if (success) {
        toast.success('Signup successful! Welcome aboard!');
        setOpen(false);
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during signup.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (userAuth.isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1 w-8 h-8 flex items-center justify-center text-white font-medium text-sm">
            {userAuth.username ? userAuth.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium">{userAuth.username}</p>
            <p className="text-xs text-muted-foreground">{userAuth.tier} plan</p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <User size={16} />
          <span className="hidden md:inline">Sign In</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Welcome to CodeFusion</DialogTitle>
          <DialogDescription>
            Sign in to save your projects and access premium features.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={(val) => setActiveTab(val as 'login' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="signup">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-3">
                <FormField
                  control={signupForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing up..." : "Create Account"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PremiumFeatureDialog() {
  const [open, setOpen] = useState(false);
  const { userAuth, updateUserTier } = useSettings();
  
  const handleUpgrade = (tier: 'premium' | 'pro') => {
    // In a real app, this would redirect to a payment gateway
    toast.success(`Upgraded to ${tier} plan!`);
    updateUserTier(tier);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Lock size={16} />
          <span>Upgrade</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Upgrade Your Experience</DialogTitle>
          <DialogDescription>
            Choose a plan that suits your needs and unlock premium features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border rounded-lg p-4 flex flex-col">
            <h3 className="font-bold text-lg">Premium Plan</h3>
            <p className="text-muted-foreground mb-2">For serious developers</p>
            <h4 className="text-2xl font-bold mb-4">$9<span className="text-sm font-normal text-muted-foreground">/month</span></h4>
            <ul className="mb-4 space-y-2 flex-1">
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Private projects
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Custom domains
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Enhanced collaboration
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Priority support
              </li>
            </ul>
            <Button 
              onClick={() => handleUpgrade('premium')}
              disabled={userAuth.tier === 'premium' || userAuth.tier === 'pro'}
            >
              {userAuth.tier === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
            </Button>
          </div>
          
          <div className="border rounded-lg p-4 flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs py-1 px-2 rounded-md">
              Popular
            </div>
            <h3 className="font-bold text-lg">Pro Plan</h3>
            <p className="text-muted-foreground mb-2">For power users</p>
            <h4 className="text-2xl font-bold mb-4">$19<span className="text-sm font-normal text-muted-foreground">/month</span></h4>
            <ul className="mb-4 space-y-2 flex-1">
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Everything in Premium
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Unlimited projects
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Advanced analytics
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Team collaboration
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> API access
              </li>
            </ul>
            <Button 
              variant="default" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={() => handleUpgrade('pro')}
              disabled={userAuth.tier === 'pro'}
            >
              {userAuth.tier === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </Button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>All plans come with a 7-day free trial. Cancel anytime.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// This component combines both auth and premium features in the header
export function UserSection() {
  const { userAuth } = useSettings();
  
  return (
    <div className="flex items-center gap-2">
      <AuthDialog />
      {userAuth.isAuthenticated && userAuth.tier === 'free' && <PremiumFeatureDialog />}
    </div>
  );
}
