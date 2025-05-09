
import React from "react";
import { motion } from "framer-motion";
import { FileIcon, Settings, GithubIcon, Share2, Save } from "lucide-react";
import { useLayout } from "@/contexts/LayoutContext";
import { Button } from "@/components/ui/button";
import { EnhancedTooltip } from "./EnhancedTooltip";
import { UserSection } from "./Auth";
import { useSettings } from "@/contexts/SettingsContext";

export const AppHeader = () => {
  const { showFileExplorer, setShowFileExplorer, showSettings, setShowSettings } = useLayout();
  const { userAuth } = useSettings();
  
  // Functions to toggle file explorer and settings
  const toggleFileExplorer = () => {
    setShowFileExplorer(!showFileExplorer);
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  return (
    <header className="border-b border-[#1e293b] flex justify-between items-center p-2 backdrop-blur-lg bg-[#0a101f]/50">
      <div className="flex items-center gap-2">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg p-1.5 mr-2">
            <div className="w-6 h-6 text-white flex items-center justify-center">
              <FileIcon className="w-4 h-4" />
            </div>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
            CodeFusion
          </h1>
        </motion.div>
        
        <div className="hidden md:flex gap-1 items-center ml-6">
          <EnhancedTooltip content="Files">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFileExplorer}
              className="text-[#94a3b8] hover:text-white"
            >
              Files
            </Button>
          </EnhancedTooltip>
          
          <EnhancedTooltip content="Save Project">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#94a3b8] hover:text-white"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </EnhancedTooltip>
          
          <EnhancedTooltip content="Share Project">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#94a3b8] hover:text-white"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </EnhancedTooltip>
          
          {userAuth.tier === 'premium' || userAuth.tier === 'pro' ? (
            <EnhancedTooltip content="GitHub Integration">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#94a3b8] hover:text-white"
              >
                <GithubIcon className="h-4 w-4 mr-1" />
                GitHub
              </Button>
            </EnhancedTooltip>
          ) : null}
        </div>
      </div>
      
      <div className="flex gap-2 items-center">
        <UserSection />
        
        <EnhancedTooltip content="Settings">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSettings}
            className="text-[#94a3b8] hover:text-white"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </EnhancedTooltip>
      </div>
    </header>
  );
};
