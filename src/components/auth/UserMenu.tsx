
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { User, LogOut, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserTier } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const { authState, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  
  const handleLoginClick = () => {
    setAuthModalView('login');
    setShowAuthModal(true);
  };
  
  const handleRegisterClick = () => {
    setAuthModalView('register');
    setShowAuthModal(true);
  };
  
  const getTierBadge = (tier: UserTier) => {
    switch (tier) {
      case 'free':
        return <Badge variant="outline" className="ml-2 text-xs">Free</Badge>;
      case 'premium':
        return (
          <Badge variant="outline" className="ml-2 bg-gradient-to-r from-[#9333ea] to-[#4f46e5] text-white text-xs">
            Premium
          </Badge>
        );
      case 'pro':
        return (
          <Badge variant="outline" className="ml-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white text-xs">
            Pro
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {authState.isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={authState.user?.avatar} alt={authState.user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-[#4f46e5] to-[#6366f1] text-white">
                  {getInitials(authState.user?.name || 'User')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#1a1f2c] border border-[#2d3748] text-white" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-0.5 leading-none">
                <p className="font-medium text-sm">{authState.user?.name}</p>
                <p className="text-xs text-[#9ca3af] w-[170px] truncate">{authState.user?.email}</p>
              </div>
              {getTierBadge(authState.user?.tier || 'free')}
            </div>
            <DropdownMenuSeparator className="bg-[#2d3748]" />
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-[#2d3748] focus:bg-[#2d3748]"
              onClick={() => navigate('/dashboard')}
            >
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-[#2d3748] focus:bg-[#2d3748]"
              onClick={() => navigate('/dashboard')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2d3748]" />
            <DropdownMenuItem 
              className="cursor-pointer text-[#f87171] hover:text-[#ef4444] hover:bg-[#2d3748] focus:bg-[#2d3748]"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#2d3748]"
            onClick={handleLoginClick}
          >
            Log in
          </Button>
          <Button 
            className="bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] text-white"
            onClick={handleRegisterClick}
          >
            <User className="mr-2 h-4 w-4" />
            Sign up
          </Button>
        </div>
      )}
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultView={authModalView}
      />
    </>
  );
};
