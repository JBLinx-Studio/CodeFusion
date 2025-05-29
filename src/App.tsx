
import React from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { PayPalProvider } from "./components/paypal/PayPalProvider";
import "./App.css";

// Configure the Query Client with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Use HashRouter for GitHub Pages compatibility
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <PayPalProvider>
          <TooltipProvider>
            <Toaster 
              position="bottom-left" 
              theme="dark" 
              closeButton 
              richColors 
              visibleToasts={5}
              toastOptions={{
                duration: 3000,
                className: "bg-[#1e293b] border border-[#374151] text-white shadow-lg rounded-lg",
              }}
            />
            <HashRouter>
              <div className="app-container bg-[#0c1018] min-h-screen">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </HashRouter>
          </TooltipProvider>
        </PayPalProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
