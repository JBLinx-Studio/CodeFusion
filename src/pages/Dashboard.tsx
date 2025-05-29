
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserDashboardDialog } from '@/components/auth/UserDashboardDialog';
import { AuthModal } from '@/components/auth/AuthModal';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showDashboard, setShowDashboard] = React.useState(false);
  const [authView, setAuthView] = React.useState<'login' | 'register'>('login');
  
  // If loading, show loading state
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-[#0c1018] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[#6366f1] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#9ca3af]">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If authenticated, show dashboard dialog
  React.useEffect(() => {
    if (authState.isAuthenticated) {
      setShowDashboard(true);
    }
  }, [authState.isAuthenticated]);
  
  return (
    <div className="min-h-screen bg-[#0c1018] flex flex-col">
      <AppHeader />
      
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div 
          className="max-w-md w-full bg-[#1a1f2c] border border-[#2d3748] rounded-lg shadow-xl p-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.h2 
              className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {authState.isAuthenticated ? 'Your Dashboard' : 'Access Your Dashboard'}
            </motion.h2>
            <p className="text-[#9ca3af] mt-2">
              {authState.isAuthenticated 
                ? 'Click the button below to manage your account, subscription, and projects.'
                : 'Please sign in to view your personal dashboard and access premium features.'}
            </p>
          </div>
          
          <div className="space-y-4">
            {authState.isAuthenticated ? (
              <Button 
                className="w-full bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5]"
                onClick={() => setShowDashboard(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Open Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  className="w-full bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5]"
                  onClick={() => {
                    setAuthView('login');
                    setShowAuthModal(true);
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in to continue
                </Button>
                
                <div className="text-center text-sm text-[#9ca3af]">
                  <span>Don't have an account?</span>{' '}
                  <button 
                    className="text-[#6366f1] hover:text-[#818cf8] underline"
                    onClick={() => {
                      setAuthView('register');
                      setShowAuthModal(true);
                    }}
                  >
                    Create one
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
      
      <UserDashboardDialog
        open={showDashboard}
        onOpenChange={setShowDashboard}
      />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultView={authView}
      />
    </div>
  );
};

export default Dashboard;
