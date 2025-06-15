import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSystemProvider } from "@/contexts/FileSystemContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AppHeader } from "@/components/AppHeader";
import { MobileControls } from "@/components/MobileControls";
import { EditorContainer } from "@/components/EditorContainer";
import { StatusBar } from "@/components/StatusBar";
import { toast } from "sonner";
import { Code, Sparkles, Database, Layout, Palette, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Set state to control welcome overlay visibility
  const [showWelcome, setShowWelcome] = useState(true);

  // Show welcome toast when the app loads
  useEffect(() => {
    if (!showWelcome) return;
    const timer = setTimeout(() => {
      toast.success(
        "Welcome to CodeFusion",
        {
          description: "Build amazing web experiences with fullstack capabilities",
          duration: 5000,
        }
      );
      // Show backend feature toast with slight delay
      setTimeout(() => {
        toast.info(
          "New Feature: Backend Simulation",
          {
            description: "Create mock API endpoints with Alt+B or the Backend button",
            duration: 8000,
          }
        );
      }, 6000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [showWelcome]);

  return (
    <SettingsProvider>
      <FileSystemProvider>
        <LayoutProvider>
          <motion.div 
            className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#070a13] via-[#0c111d] to-[#121a27] text-[#f1f5f9]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AppHeader />
            <MobileControls />
            
            <AnimatePresence>
              {/* Only show the welcome screen if showWelcome state is true */}
              {showWelcome && (
                <motion.div 
                  className="absolute inset-0 z-10 flex items-center justify-center p-4 pointer-events-none"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.div 
                    className="bg-gradient-to-br from-[#1a1f2c]/90 to-[#0f172a]/90 backdrop-blur-sm border border-[#2d3748] rounded-xl shadow-2xl overflow-hidden max-w-3xl w-full pointer-events-auto"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                        <div className="bg-gradient-to-br from-[#4f46e5] to-[#6366f1] p-4 rounded-xl">
                          <Code size={40} className="text-white" />
                        </div>
                        <div className="text-center md:text-left">
                          <motion.h1 
                            className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                          >
                            Welcome to CodeFusion
                          </motion.h1>
                          <p className="text-[#9ca3af] mt-2">Advanced web development environment with fullstack capabilities</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div 
                          className="p-4 border border-[#2d3748]/60 rounded-lg hover:bg-[#1e293b]/50 transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.7 }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-[#3b82f6]/20 p-2 rounded-md">
                              <Layout size={20} className="text-[#60a5fa]" />
                            </div>
                            <h3 className="font-medium text-white">Responsive Design</h3>
                          </div>
                          <p className="text-sm text-[#9ca3af]">Build and preview your designs across multiple device sizes with our responsive preview tools.</p>
                        </motion.div>
                        
                        <motion.div 
                          className="p-4 border border-[#2d3748]/60 rounded-lg hover:bg-[#1e293b]/50 transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.8 }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-[#8b5cf6]/20 p-2 rounded-md">
                              <Database size={20} className="text-[#a78bfa]" />
                            </div>
                            <h3 className="font-medium text-white">Backend Simulation</h3>
                          </div>
                          <p className="text-sm text-[#9ca3af]">Create and test API endpoints with our backend simulation tools for complete fullstack development.</p>
                        </motion.div>
                        
                        <motion.div 
                          className="p-4 border border-[#2d3748]/60 rounded-lg hover:bg-[#1e293b]/50 transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.9 }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-[#ec4899]/20 p-2 rounded-md">
                              <Palette size={20} className="text-[#f472b6]" />
                            </div>
                            <h3 className="font-medium text-white">UI Components</h3>
                          </div>
                          <p className="text-sm text-[#9ca3af]">Access a comprehensive library of UI components with full styling and customization options.</p>
                        </motion.div>
                        
                        <motion.div 
                          className="p-4 border border-[#2d3748]/60 rounded-lg hover:bg-[#1e293b]/50 transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 1 }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-[#10b981]/20 p-2 rounded-md">
                              <Sparkles size={20} className="text-[#34d399]" />
                            </div>
                            <h3 className="font-medium text-white">AI Assistance</h3>
                          </div>
                          <p className="text-sm text-[#9ca3af]">Get intelligent suggestions, code completion and error fixes with our integrated AI assistant.</p>
                        </motion.div>
                      </div>
                      
                      <div className="border-t border-[#2d3748]/60 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-[#9ca3af]">Ready to build something amazing?</p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              window.open("https://github.com/JBLinx-Studio/CodeFusion", "_blank");
                            }}
                            className="text-[#e4e5e7] border-[#4b5563] hover:bg-[#2d3748] hover:text-white"
                          >
                            <Globe size={16} className="mr-2" />
                            Documentation
                          </Button>
                          <Button
                            onClick={() => setShowWelcome(false)}
                            className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white"
                          >
                            <Code size={16} className="mr-2" />
                            Start Coding
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              className="flex-1 p-2 md:p-3 overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <EditorContainer />
            </motion.div>
            
            <StatusBar />
            
            <motion.footer 
              className="py-2 px-4 text-xs text-center text-[#9ca3af] bg-gradient-to-r from-[#0a0e17]/70 to-[#111827]/70 backdrop-blur-sm border-t border-[#2d3748]/50 flex items-center justify-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <span>CodeFusion © {new Date().getFullYear()}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#4b5563]"></span>
              <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-medium">Build amazing fullstack web experiences</span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#4b5563]"></span>
              <span>Made by JBLinx Studio</span>
            </motion.footer>
          </motion.div>
        </LayoutProvider>
      </FileSystemProvider>
    </SettingsProvider>
  );
};

export default Index;
