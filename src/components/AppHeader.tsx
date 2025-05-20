
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/auth/UserMenu';
import { Button } from '@/components/ui/button';
import { LogIn, Menu } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export const AppHeader: React.FC = () => {
  const { authState } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <header className="bg-[#1a1f2c] border-b border-[#2d3748] py-3 px-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent flex items-center gap-1">
          <span className="text-white opacity-70">&lt;&gt;</span>
          CodeFusion
        </div>
      </Link>
      
      {/* Navigation - Shows on desktop */}
      {!isMobile && (
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/" className="text-[#9ca3af] hover:text-white transition-colors">Home</Link>
          <Link to="/dashboard" className="text-[#9ca3af] hover:text-white transition-colors">Dashboard</Link>
          <a href="#features" className="text-[#9ca3af] hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-[#9ca3af] hover:text-white transition-colors">Pricing</a>
        </nav>
      )}
      
      {/* User menu or Login button */}
      <div className="flex items-center gap-4">
        {authState.isAuthenticated ? (
          <UserMenu />
        ) : (
          <>
            {!isMobile && (
              <Button 
                variant="outline"
                className="border-[#4b5563] text-white hover:bg-[#2d3748] hover:border-[#6366f1]"
                onClick={() => setShowAuthModal(true)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </>
        )}
        
        {/* Mobile menu toggle */}
        {isMobile && !authState.isAuthenticated && (
          <Button 
            size="icon" 
            variant="ghost"
            className="text-[#9ca3af] hover:text-white hover:bg-[#2d3748]"
            onClick={() => setShowAuthModal(true)}
          >
            <LogIn className="h-5 w-5" />
          </Button>
        )}
        
        {isMobile && (
          <Button 
            size="icon" 
            variant="ghost"
            className="text-[#9ca3af] hover:text-white hover:bg-[#2d3748]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* Mobile menu dropdown */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-[61px] right-0 left-0 bg-[#1a1f2c] border-b border-[#2d3748] py-2 z-50">
          <nav className="flex flex-col text-sm">
            <Link 
              to="/" 
              className="px-4 py-3 text-[#9ca3af] hover:text-white hover:bg-[#2d3748] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="px-4 py-3 text-[#9ca3af] hover:text-white hover:bg-[#2d3748] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <a 
              href="#features" 
              className="px-4 py-3 text-[#9ca3af] hover:text-white hover:bg-[#2d3748] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="px-4 py-3 text-[#9ca3af] hover:text-white hover:bg-[#2d3748] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
          </nav>
        </div>
      )}
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultView="login"
      />
    </header>
  );
};
