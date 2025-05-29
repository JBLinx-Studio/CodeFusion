
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSystemProvider } from "@/contexts/FileSystemContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AppHeader } from "@/components/AppHeader";
import { MobileControls } from "@/components/MobileControls";
import { EditorContainer } from "@/components/EditorContainer";
import { StatusBar } from "@/components/StatusBar";
import { PayPalTestModeToggle } from "@/components/paypal/PayPalTestModeToggle";
import { DocumentationDialog } from "@/components/documentation/DocumentationDialog";
import { toast } from "sonner";
import { Code, Sparkles, Database, Layout, Palette, Globe, Settings, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showDocumentation, setShowDocumentation] = React.useState(false);

  // Show welcome toast when the app loads
  useEffect(() => {
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
  }, []);

  const handleDocumentationClick = () => {
    setShowDocumentation(true);
  };

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
            
            {/* PayPal Test Mode Toggle - Fixed Position */}
            <div className="fixed top-4 right-4 z-50">
              <PayPalTestModeToggle />
            </div>
            
            <AnimatePresence>
              <motion.div 
                className="flex-1 p-2 md:p-3 overflow-hidden flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {/* Enhanced Welcome section overlay */}
                <div className="absolute inset-0 z-10 flex items-center justify-center p-4 pointer-events-none">
                  <motion.div 
                    className="bg-gradient-to-br from-[#1a1f2c]/95 to-[#0f172a]/95 backdrop-blur-lg border border-[#2d3748]/60 rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full pointer-events-auto"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="p-8 md:p-10">
                      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                        <div className="bg-gradient-to-br from-[#4f46e5] to-[#6366f1] p-6 rounded-2xl shadow-lg">
                          <Code size={48} className="text-white" />
                        </div>
                        <div className="text-center md:text-left">
                          <motion.h1 
                            className="text-4xl font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                          >
                            Welcome to CodeFusion
                          </motion.h1>
                          <p className="text-[#9ca3af] mt-3 text-lg">Advanced web development environment with fullstack capabilities</p>
                          <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
                            <TestTube className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-yellow-400">PayPal Testing Mode Available</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div 
                          className="p-6 border border-[#2d3748]/60 rounded-xl hover:bg-[#1e293b]/50 transition-all duration-300 hover:border-[#4f46e5]/30"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.7 }}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="bg-[#3b82f6]/20 p-3 rounded-lg">
                              <Layout size={24} className="text-[#60a5fa]" />
                            </div>
                            <h3 className="font-semibold text-white text-lg">Responsive Design</h3>
                          </div>
                          <p className="text-[#9ca3af] leading-relaxed">Build and preview your designs across multiple device sizes with our responsive preview tools and real-time updates.</p>
                        </motion.div>
                        
                        <motion.div 
                          className="p-6 border border-[#2d3748]/60 rounded-xl hover:bg-[#1e293b]/50 transition-all duration-300 hover:border-[#8b5cf6]/30"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.8 }}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="bg-[#8b5cf6]/20 p-3 rounded-lg">
                              <Database size={24} className="text-[#a78bfa]" />
                            </div>
                            <h3 className="font-semibold text-white text-lg">Backend Simulation</h3>
                          </div>
                          <p className="text-[#9ca3af] leading-relaxed">Create and test API endpoints with our backend simulation tools for complete fullstack development experience.</p>
                        </motion.div>
                        
                        <motion.div 
                          className="p-6 border border-[#2d3748]/60 rounded-xl hover:bg-[#1e293b]/50 transition-all duration-300 hover:border-[#ec4899]/30"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.9 }}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="bg-[#ec4899]/20 p-3 rounded-lg">
                              <Palette size={24} className="text-[#f472b6]" />
                            </div>
                            <h3 className="font-semibold text-white text-lg">UI Components</h3>
                          </div>
                          <p className="text-[#9ca3af] leading-relaxed">Access a comprehensive library of UI components with full styling and customization options using shadcn/ui.</p>
                        </motion.div>
                        
                        <motion.div 
                          className="p-6 border border-[#2d3748]/60 rounded-xl hover:bg-[#1e293b]/50 transition-all duration-300 hover:border-[#10b981]/30"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 1 }}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="bg-[#10b981]/20 p-3 rounded-lg">
                              <Sparkles size={24} className="text-[#34d399]" />
                            </div>
                            <h3 className="font-semibold text-white text-lg">AI Assistance</h3>
                          </div>
                          <p className="text-[#9ca3af] leading-relaxed">Get intelligent suggestions, code completion and error fixes with our integrated AI assistant powered by Lovable.</p>
                        </motion.div>
                      </div>
                      
                      <div className="border-t border-[#2d3748]/60 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                          <p className="text-[#9ca3af] text-lg">Ready to build something amazing?</p>
                          <p className="text-sm text-[#6b7280] mt-1">Full PayPal integration with live & sandbox testing</p>
                        </div>
                        <div className="flex gap-4">
                          <Button
                            variant="outline"
                            onClick={handleDocumentationClick}
                            className="text-[#e4e5e7] border-[#4b5563] hover:bg-[#2d3748] hover:text-white transition-all duration-200"
                          >
                            <Globe size={18} className="mr-2" />
                            Documentation
                          </Button>
                          <Button
                            onClick={() => {
                              // Close the welcome screen by hiding it
                              document.querySelector(".absolute.inset-0.z-10")?.classList.add("hidden");
                            }}
                            className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white transition-all duration-200 shadow-lg"
                          >
                            <Code size={18} className="mr-2" />
                            Start Coding
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <EditorContainer />
              </motion.div>
            </AnimatePresence>
            
            <StatusBar />
            
            <motion.footer 
              className="py-3 px-4 text-xs text-center text-[#9ca3af] bg-gradient-to-r from-[#0a0e17]/80 to-[#111827]/80 backdrop-blur-sm border-t border-[#2d3748]/50 flex items-center justify-center gap-2"
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

            {/* Documentation Dialog */}
            <DocumentationDialog 
              open={showDocumentation}
              onOpenChange={setShowDocumentation}
            />
          </motion.div>
        </LayoutProvider>
      </FileSystemProvider>
    </SettingsProvider>
  );
};

export default Index;
