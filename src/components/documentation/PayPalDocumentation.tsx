
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TestTube, 
  Globe, 
  Code, 
  CreditCard, 
  Settings, 
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface PayPalDocumentationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PayPalDocumentation: React.FC<PayPalDocumentationProps> = ({
  open,
  onOpenChange
}) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sandboxCredentials = {
    clientId: 'AfaF0EX_vYoZ5D3-P4RSCZ0FjFwHY3v88MhbcytGX9uTkQdDFrQKKFNDzwNsjdn3wPgSPsqrJsdho7RH',
    email: 'sb-7ommm28924697@business.example.com',
    password: '9D&(NHe&'
  };

  const liveCredentials = {
    clientId: 'Abrc68jTAU0GltdLz1FYYLMLaD5Y952gRrHtwrzeWI4-C8nlafFLdcH95KXpo3Fc6zYZsdIkiV7Jnl34',
    planId: 'P-9GJ74476BD483620ENA2XHZA'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1f2c] border-[#2d3748] text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent flex items-center gap-2">
            <Code className="w-6 h-6 text-[#6366f1]" />
            PayPal Integration Documentation
          </DialogTitle>
          <DialogDescription className="text-[#9ca3af]">
            Complete guide for CodeFusion's PayPal subscription system
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4 bg-[#2d3748] border border-[#374151]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#4f46e5]">Overview</TabsTrigger>
            <TabsTrigger value="testing" className="data-[state=active]:bg-[#4f46e5]">Testing</TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-[#4f46e5]">Live Setup</TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-[#4f46e5]">API Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">System Overview</h3>
              <p className="text-[#9ca3af] leading-relaxed">
                CodeFusion's PayPal integration supports both live and sandbox environments with automatic 
                plan creation and seamless mode switching. The system handles subscription management, 
                payment processing, and user account upgrades.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#2d3748]/50 border border-[#374151] rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <TestTube className="w-5 h-5 text-yellow-400" />
                    <h4 className="font-semibold text-yellow-400">Sandbox Mode</h4>
                  </div>
                  <ul className="text-sm text-[#9ca3af] space-y-1">
                    <li>• Safe testing environment</li>
                    <li>• Automatic plan creation via API</li>
                    <li>• Test accounts provided</li>
                    <li>• No real money transactions</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-[#2d3748]/50 border border-[#374151] rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-5 h-5 text-green-400" />
                    <h4 className="font-semibold text-green-400">Live Mode</h4>
                  </div>
                  <ul className="text-sm text-[#9ca3af] space-y-1">
                    <li>• Real payment processing</li>
                    <li>• Production PayPal accounts</li>
                    <li>• Actual subscription billing</li>
                    <li>• Revenue generation</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-white">Sandbox Testing</h3>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">Test Mode</Badge>
              </div>
              
              <div className="p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">Test Account Credentials</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#9ca3af]">Email:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-yellow-300 bg-[#2d3748] px-2 py-1 rounded text-xs">
                        {sandboxCredentials.email}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyCode(sandboxCredentials.email, 'Email')}
                        className="h-6 w-6 p-0"
                      >
                        {copiedCode === 'Email' ? (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#9ca3af]">Password:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-yellow-300 bg-[#2d3748] px-2 py-1 rounded text-xs">
                        {sandboxCredentials.password}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyCode(sandboxCredentials.password, 'Password')}
                        className="h-6 w-6 p-0"
                      >
                        {copiedCode === 'Password' ? (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">Testing Steps</h4>
                <ol className="list-decimal list-inside space-y-2 text-[#9ca3af]">
                  <li>Toggle to Sandbox mode using the PayPal toggle in the top-right corner</li>
                  <li>Navigate to the subscription page in your app</li>
                  <li>Click "Subscribe" to open the PayPal payment dialog</li>
                  <li>Use the test credentials above when prompted by PayPal</li>
                  <li>Complete the subscription flow</li>
                  <li>Verify the subscription appears in your app</li>
                </ol>
              </div>

              <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">Sandbox URLs</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[#9ca3af]">PayPal Sandbox:</span>
                    <a 
                      href="https://sandbox.paypal.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      sandbox.paypal.com <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#9ca3af]">Developer Dashboard:</span>
                    <a 
                      href="https://developer.paypal.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      developer.paypal.com <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="live" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-white">Live Environment</h3>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">Production</Badge>
              </div>

              <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                <h4 className="font-semibold text-red-400 mb-2">⚠️ Important Warning</h4>
                <p className="text-sm text-red-300">
                  Live mode processes real payments. Only use this when you're ready to accept 
                  actual payments from customers. Always test thoroughly in sandbox first.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">Live Configuration</h4>
                <div className="p-4 bg-[#2d3748]/50 border border-[#374151] rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#9ca3af]">Client ID:</span>
                      <code className="text-green-300 bg-[#2d3748] px-2 py-1 rounded text-xs">
                        {liveCredentials.clientId.substring(0, 20)}...
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#9ca3af]">Plan ID:</span>
                      <code className="text-green-300 bg-[#2d3748] px-2 py-1 rounded text-xs">
                        {liveCredentials.planId}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">Go Live Checklist</h4>
                <ul className="space-y-2 text-[#9ca3af]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Test all subscription flows in sandbox</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Verify PayPal business account is approved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Confirm subscription plans are active</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Switch app to live mode</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Monitor initial transactions</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">API Reference</h3>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Key Services</h4>
                
                <div className="p-4 bg-[#2d3748]/50 border border-[#374151] rounded-lg">
                  <h5 className="font-semibold text-white mb-2">PayPalConfigService</h5>
                  <p className="text-sm text-[#9ca3af] mb-3">
                    Manages environment configuration and mode switching.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><code className="text-blue-300">getConfig()</code> - Get current configuration</div>
                    <div><code className="text-blue-300">toggleTestMode(enabled)</code> - Switch environments</div>
                    <div><code className="text-blue-300">ensureSandboxPlan()</code> - Create/get sandbox plan</div>
                  </div>
                </div>

                <div className="p-4 bg-[#2d3748]/50 border border-[#374151] rounded-lg">
                  <h5 className="font-semibold text-white mb-2">PayPalAPIService</h5>
                  <p className="text-sm text-[#9ca3af] mb-3">
                    Handles PayPal REST API operations for plan creation.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><code className="text-blue-300">createProduct()</code> - Create PayPal product</div>
                    <div><code className="text-blue-300">createSubscriptionPlan()</code> - Create subscription plan</div>
                    <div><code className="text-blue-300">createSandboxPlan()</code> - Full sandbox setup</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">Environment Variables</h4>
                <div className="p-4 bg-[#2d3748]/50 border border-[#374151] rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <code className="text-yellow-300">NODE_ENV</code>
                      <span className="text-[#9ca3af]">Determines default mode</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-yellow-300">paypal_test_mode</code>
                      <span className="text-[#9ca3af]">LocalStorage override</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[#2d3748]">
          <Button
            variant="outline"
            onClick={() => window.open('https://developer.paypal.com/docs/', '_blank')}
            className="border-[#4b5563] text-[#e4e5e7] hover:bg-[#2d3748]"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            PayPal Docs
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
