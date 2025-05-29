
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TestTube, Globe, RefreshCw } from 'lucide-react';
import { PayPalConfigService } from '@/services/PayPalConfigService';
import { toast } from 'sonner';

export const PayPalTestModeToggle: React.FC = () => {
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
    <div className="p-4 bg-[#1a1f2c] border border-[#2d3748] rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {config.isTestMode ? (
            <TestTube className="w-5 h-5 text-yellow-400" />
          ) : (
            <Globe className="w-5 h-5 text-green-400" />
          )}
          <h3 className="text-white font-medium">PayPal Environment</h3>
        </div>
        
        <Switch
          checked={config.isTestMode}
          onCheckedChange={handleToggle}
          className="data-[state=checked]:bg-yellow-600"
        />
      </div>
      
      <div className="space-y-2 text-sm">
        <p className={`${config.isTestMode ? 'text-yellow-400' : 'text-green-400'}`}>
          <strong>Current:</strong> {config.environment} mode
        </p>
        <p className="text-[#9ca3af]">
          <strong>Client ID:</strong> {config.clientId.substring(0, 20)}...
        </p>
        
        {config.isTestMode && (
          <div className="pt-2 border-t border-[#2d3748]">
            <Button
              size="sm"
              variant="outline"
              onClick={clearSandboxData}
              className="w-full border-[#374151] text-[#9ca3af] hover:bg-[#374151]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Sandbox Plans
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
