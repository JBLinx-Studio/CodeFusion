
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TestTube, Globe, RefreshCw, Settings, Eye, EyeOff } from 'lucide-react';
import { PayPalConfigService } from '@/services/PayPalConfigService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const PayPalTestModeToggle: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const configService = PayPalConfigService.getInstance();
  const config = configService.getConfig();

  const handleToggle = (enabled: boolean) => {
    const mode = enabled ? 'sandbox' : 'live';
    toast.info(`Switching to ${mode} mode...`, {
      description: 'Page will reload to apply changes',
      duration: 3000,
    });
    
    setTimeout(() => {
      configService.toggleTestMode(enabled);
    }, 1000);
  };

  const clearSandboxData = () => {
    configService.clearSandboxData();
    toast.success('Sandbox data cleared', {
      description: 'New plans will be created on next test',
    });
  };

  return (
    <motion.div 
      className="bg-[#1a1f2c]/95 backdrop-blur-sm border border-[#2d3748] rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - Always Visible */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {config.isTestMode ? (
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <TestTube className="w-5 h-5 text-yellow-400" />
              </div>
            ) : (
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Globe className="w-5 h-5 text-green-400" />
              </div>
            )}
            <div>
              <h3 className="text-white font-semibold text-sm">PayPal Mode</h3>
              <p className={`text-xs font-medium ${config.isTestMode ? 'text-yellow-400' : 'text-green-400'}`}>
                {config.environment.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Switch
              checked={config.isTestMode}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-yellow-600"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#9ca3af] hover:text-white h-8 w-8 p-0"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[#2d3748]"
          >
            <div className="p-4 space-y-3 text-sm">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#9ca3af]">Environment:</span>
                  <span className={`font-medium ${config.isTestMode ? 'text-yellow-400' : 'text-green-400'}`}>
                    {config.environment}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#9ca3af]">Client ID:</span>
                  <span className="text-white text-xs font-mono">
                    {config.clientId.substring(0, 12)}...
                  </span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-[#9ca3af]">Plan ID:</span>
                  <span className="text-white text-xs font-mono text-right">
                    {config.planId === 'SANDBOX_PLAN_TO_BE_CREATED' 
                      ? 'Auto-create' 
                      : config.planId.substring(0, 15) + '...'}
                  </span>
                </div>
              </div>
              
              {config.isTestMode && (
                <div className="pt-3 border-t border-[#2d3748]/50">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearSandboxData}
                    className="w-full border-[#374151] text-[#9ca3af] hover:bg-[#374151] hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Sandbox Plans
                  </Button>
                  <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs text-yellow-400 font-medium mb-1">Test Account:</p>
                    <p className="text-xs text-yellow-300 font-mono">
                      sb-7ommm28924697@business.example.com
                    </p>
                    <p className="text-xs text-yellow-400 mt-1">Password: 9D&(NHe&</p>
                  </div>
                </div>
              )}
              
              {!config.isTestMode && (
                <div className="pt-3 border-t border-[#2d3748]/50">
                  <div className="p-3 bg-green-900/20 border border-green-500/20 rounded-lg text-center">
                    <p className="text-xs text-green-400 font-medium">✅ Live Payments Active</p>
                    <p className="text-xs text-green-300 mt-1">Real PayPal accounts will be charged</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
