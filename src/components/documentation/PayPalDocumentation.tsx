
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Code, Zap, Shield, Globe, Users, Sparkles } from 'lucide-react';

interface CodeFusionDocumentationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PayPalDocumentation: React.FC<CodeFusionDocumentationProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0c1018] border-[#1e293b] text-white max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent flex items-center gap-2">
            <Code className="w-6 h-6 text-[#6366f1]" />
            CodeFusion Documentation
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-[#6366f1] mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Welcome to CodeFusion
              </h2>
              <p className="text-[#94a3b8] leading-relaxed">
                CodeFusion is a powerful web-based development environment that brings together the best tools 
                for modern web development. Whether you're building your first website or developing complex 
                applications, CodeFusion provides everything you need in one seamless platform.
              </p>
            </section>

            <Separator className="bg-[#1e293b]" />

            {/* Features */}
            <section>
              <h2 className="text-xl font-semibold text-[#6366f1] mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                  <h3 className="font-semibold text-white mb-2">🚀 Live Code Editor</h3>
                  <p className="text-[#94a3b8] text-sm">
                    Real-time code editing with syntax highlighting, autocomplete, and instant preview.
                  </p>
                </div>
                <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                  <h3 className="font-semibold text-white mb-2">🔗 Custom Domains</h3>
                  <p className="text-[#94a3b8] text-sm">
                    Connect your own domain and deploy projects with professional URLs.
                  </p>
                </div>
                <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                  <h3 className="font-semibold text-white mb-2">🔒 Private Projects</h3>
                  <p className="text-[#94a3b8] text-sm">
                    Keep your code secure with unlimited private repositories and projects.
                  </p>
                </div>
                <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                  <h3 className="font-semibold text-white mb-2">⚡ Instant Deployment</h3>
                  <p className="text-[#94a3b8] text-sm">
                    Deploy your applications instantly with global CDN and automatic HTTPS.
                  </p>
                </div>
              </div>
            </section>

            <Separator className="bg-[#1e293b]" />

            {/* Plans */}
            <section>
              <h2 className="text-xl font-semibold text-[#6366f1] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Subscription Plans
              </h2>
              <div className="space-y-4">
                <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">Starter Plan</h3>
                    <Badge className="bg-[#6366f1] text-white">$5/month</Badge>
                  </div>
                  <ul className="text-[#94a3b8] text-sm space-y-1">
                    <li>• Unlimited private projects</li>
                    <li>• Custom domain support</li>
                    <li>• 24/7 email support</li>
                    <li>• 10GB storage</li>
                  </ul>
                </div>
                
                <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">Developer Plan</h3>
                    <Badge className="bg-[#8b5cf6] text-white">$9/month</Badge>
                  </div>
                  <ul className="text-[#94a3b8] text-sm space-y-1">
                    <li>• Everything in Starter</li>
                    <li>• Advanced debugging tools</li>
                    <li>• API integrations</li>
                    <li>• 50GB storage</li>
                  </ul>
                </div>

                <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">Pro Plan</h3>
                    <Badge className="bg-[#f59e0b] text-white">$19/month</Badge>
                  </div>
                  <ul className="text-[#94a3b8] text-sm space-y-1">
                    <li>• Everything in Developer</li>
                    <li>• Priority support</li>
                    <li>• Advanced analytics</li>
                    <li>• Unlimited storage</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator className="bg-[#1e293b]" />

            {/* Getting Started */}
            <section>
              <h2 className="text-xl font-semibold text-[#6366f1] mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Getting Started
              </h2>
              <div className="space-y-3">
                <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                  <h3 className="font-semibold text-white mb-2">1. Create Your Account</h3>
                  <p className="text-[#94a3b8] text-sm">
                    Sign up with your email or Google account to get started with CodeFusion.
                  </p>
                </div>
                
                <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                  <h3 className="font-semibold text-white mb-2">2. Choose Your Plan</h3>
                  <p className="text-[#94a3b8] text-sm">
                    Select the plan that best fits your development needs and budget.
                  </p>
                </div>
                
                <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                  <h3 className="font-semibold text-white mb-2">3. Start Building</h3>
                  <p className="text-[#94a3b8] text-sm">
                    Create your first project and start coding with our powerful editor and tools.
                  </p>
                </div>
              </div>
            </section>

            <Separator className="bg-[#1e293b]" />

            {/* Security & Support */}
            <section>
              <h2 className="text-xl font-semibold text-[#6366f1] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Support
              </h2>
              <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                <div className="space-y-2">
                  <p className="text-[#94a3b8] text-sm">
                    <strong className="text-white">Security:</strong> Your code and data are protected with enterprise-grade security, 
                    including encrypted storage and secure transmission.
                  </p>
                  <p className="text-[#94a3b8] text-sm">
                    <strong className="text-white">Support:</strong> Our team provides 24/7 email support for all paid plans, 
                    with priority support for Pro subscribers.
                  </p>
                  <p className="text-[#94a3b8] text-sm">
                    <strong className="text-white">Updates:</strong> Regular platform updates and new features are included 
                    in all subscription plans at no additional cost.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="pb-6">
              <h2 className="text-xl font-semibold text-[#6366f1] mb-3">Contact & Legal</h2>
              <div className="bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
                <p className="text-[#94a3b8] text-sm">
                  For questions, feature requests, or technical support, please contact us at{' '}
                  <span className="text-[#6366f1]">support@codefusion.dev</span>
                </p>
                <p className="text-[#94a3b8] text-sm mt-2">
                  By using CodeFusion, you agree to our Terms of Service and Privacy Policy. 
                  All features are provided "as-is" and may be subject to beta limitations.
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
