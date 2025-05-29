import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Code, 
  Zap, 
  Shield, 
  Globe, 
  Users, 
  Check, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  Crown,
  Rocket
} from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { AuthModal } from '@/components/auth/AuthModal';
import { PaymentMethodDialog } from '@/components/auth/PaymentMethodDialog';
import { DocumentationDialog } from '@/components/documentation/DocumentationDialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Plan data
const plans = [
  {
    tier: 'starter',
    name: 'Starter',
    price: '$5',
    description: 'Essential tools for serious developers',
    features: [
      'Unlimited private projects',
      'Custom domain support',
      '24/7 email support',
      '10GB storage',
    ],
  },
  {
    tier: 'developer',
    name: 'Developer',
    price: '$9',
    description: 'Advanced tools for growing teams',
    features: [
      'Everything in Starter',
      'Advanced debugging tools',
      'API integrations',
      '50GB storage',
    ],
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: '$19',
    description: 'Maximum power for professional developers',
    features: [
      'Everything in Developer',
      'Priority support',
      'Advanced analytics',
      'Unlimited storage',
    ],
  },
  {
    tier: 'team-starter',
    name: 'Team Starter',
    price: '$15',
    description: 'Essential tools for small teams',
    features: [
      '5 Team Members',
      'Unlimited private projects',
      'Custom domain support',
      '24/7 email support',
      '50GB storage',
    ],
  },
  {
    tier: 'team-pro',
    name: 'Team Pro',
    price: '$35',
    description: 'Advanced tools for growing teams',
    features: [
      '10 Team Members',
      'Everything in Team Starter',
      'Advanced debugging tools',
      'API integrations',
      'Unlimited storage',
    ],
  },
];

// Tier definitions
type Tier = 'free' | 'starter' | 'developer' | 'pro' | 'team-starter' | 'team-pro';

const Index = () => {
  const [selectedTier, setSelectedTier] = useState<'starter' | 'developer' | 'pro' | 'team-starter' | 'team-pro' | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const { authState } = useAuth();

  const handleGetStarted = (tier: 'starter' | 'developer' | 'pro' | 'team-starter' | 'team-pro') => {
    if (!authState.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setSelectedTier(tier);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentDialog(false);
    setSelectedTier(null);
    toast.success('Subscription activated!', {
      description: 'Welcome to CodeFusion! Your subscription is now active.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1018] via-[#1a1f2c] to-[#0c1018]">
      <AppHeader />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#1e293b]/50 px-4 py-2 rounded-full border border-[#334155] mb-6">
            <Sparkles className="w-4 h-4 text-[#6366f1]" />
            <span className="text-sm text-[#94a3b8]">Powerful Development Environment</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-[#94a3b8] to-white bg-clip-text text-transparent mb-6">
            Build. Deploy. Scale.
            <br />
            <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
              CodeFusion
            </span>
          </h1>
          
          <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto mb-8 leading-relaxed">
            The ultimate web development platform that combines powerful coding tools, 
            instant deployment, and seamless collaboration in one beautiful interface.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => handleGetStarted('starter')}
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white px-8 py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowDocumentation(true)}
              className="border-[#334155] text-[#94a3b8] hover:bg-[#1e293b] hover:text-white px-8 py-3 text-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Everything you need to build amazing apps
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#1e293b] border border-[#334155] shadow-none">
              <CardContent className="p-6 space-y-3">
                <div className="text-5xl text-[#6366f1] flex items-center justify-center">
                  <Code />
                </div>
                <h3 className="text-xl font-semibold text-white text-center">
                  Live Code Editor
                </h3>
                <p className="text-[#94a3b8] text-center">
                  Real-time code editing with syntax highlighting and instant preview.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e293b] border border-[#334155] shadow-none">
              <CardContent className="p-6 space-y-3">
                <div className="text-5xl text-[#a855f7] flex items-center justify-center">
                  <Zap />
                </div>
                <h3 className="text-xl font-semibold text-white text-center">
                  Instant Deployment
                </h3>
                <p className="text-[#94a3b8] text-center">
                  Deploy your applications instantly with global CDN and automatic HTTPS.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e293b] border border-[#334155] shadow-none">
              <CardContent className="p-6 space-y-3">
                <div className="text-5xl text-[#f59e0b] flex items-center justify-center">
                  <Shield />
                </div>
                <h3 className="text-xl font-semibold text-white text-center">
                  Enterprise Security
                </h3>
                <p className="text-[#94a3b8] text-center">
                  Protect your code and data with enterprise-grade security features.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1e293b] border border-[#334155] shadow-none">
              <CardContent className="p-6 space-y-3">
                <div className="text-5xl text-[#34d399] flex items-center justify-center">
                  <Globe />
                </div>
                <h3 className="text-xl font-semibold text-white text-center">
                  Custom Domains
                </h3>
                <p className="text-[#94a3b8] text-center">
                  Connect your own domain and deploy projects with professional URLs.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto">
              Start with our free tier and upgrade as you grow. All plans include core features 
              with additional perks for paid subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {/* Free Tier */}
            <Card className="bg-[#1e293b] border border-[#334155] shadow-none">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  Free
                </h3>
                <p className="text-[#94a3b8] text-center">
                  Perfect for hobbyists and personal projects.
                </p>
                <Separator className="bg-[#334155]" />
                <ul className="text-[#94a3b8] space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6366f1]" />
                    Limited private projects
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#6366f1]" />
                    Community support
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-[#334155] text-[#94a3b8] hover:bg-[#334155] hover:text-white">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {plans.map((plan) => (
              <Card key={plan.tier} className="bg-[#1e293b] border border-[#334155] shadow-none">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <Badge className="bg-[#6366f1] text-white">{plan.price}/month</Badge>
                  </div>
                  <p className="text-[#94a3b8]">{plan.description}</p>
                  <Separator className="bg-[#334155]" />
                  <ul className="text-[#94a3b8] space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#6366f1]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => handleGetStarted(plan.tier as any)} className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-[#1e293b]">
          <div className="text-center text-[#64748b] space-y-4">
            <p className="text-sm">
              © 2024 CodeFusion. All rights reserved.
            </p>
            <div className="max-w-4xl mx-auto">
              <p className="text-xs leading-relaxed">
                <strong>Legal Disclaimer:</strong> CodeFusion services are provided "as-is" without warranty of any kind. 
                We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. Users are responsible for 
                backing up their code and data. Some features may be in beta and subject to changes. By purchasing any 
                subscription, you acknowledge that software services may have limitations and agree to our Terms of Service. 
                Refunds are handled according to our refund policy. CodeFusion is not liable for any losses or damages 
                resulting from service interruptions, data loss, or feature limitations.
              </p>
            </div>
            <div className="flex justify-center space-x-6 text-xs">
              <a href="#" className="hover:text-[#6366f1] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#6366f1] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#6366f1] transition-colors">Refund Policy</a>
              <a href="#" className="hover:text-[#6366f1] transition-colors">Contact Support</a>
            </div>
          </div>
        </footer>
      </main>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />

      <PaymentMethodDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        selectedTier={selectedTier}
        onSuccess={handlePaymentSuccess}
      />

      <DocumentationDialog
        open={showDocumentation}
        onOpenChange={setShowDocumentation}
      />
    </div>
  );
};

export default Index;
