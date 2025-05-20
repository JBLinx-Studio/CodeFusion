
import React, { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, CreditCard } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { UserDashboardDialog } from './UserDashboardDialog';

export const UserMenu: React.FC = () => {
  const { authState, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully");
    navigate('/');
  };

  if (authState.isLoading) {
    return (
      <Button variant="ghost" size="sm" className="bg-[#2d3748]/30 h-8 w-8 rounded-full p-0">
        <span className="animate-pulse h-4 w-4 rounded-full bg-gray-500/50"></span>
      </Button>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-[#9ca3af] hover:text-white hover:bg-[#2d3748] flex items-center gap-1 h-8"
          onClick={() => {
            setAuthView('login');
            setAuthModalOpen(true);
          }}
        >
          <User size={16} />
          <span className="hidden md:inline text-xs">Sign In</span>
        </Button>

        <AuthModal 
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)} 
          defaultView={authView}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 hover:bg-[#2d3748]" size="sm">
            <Avatar className="h-8 w-8 border border-[#4b5563]">
              <AvatarImage 
                src={authState.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authState.user?.name || "User")}&background=374151&color=fff`}
                alt={authState.user?.name || "User avatar"} 
              />
              <AvatarFallback className="bg-[#374151] text-xs">
                {authState.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#1a1f2c]"></span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-[#1a1f2c] border-[#2d3748] text-white shadow-xl">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-gray-100">{authState.user?.name || "User"}</p>
              <p className="text-xs text-gray-400 truncate">{authState.user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#2d3748]" />
          <DropdownMenuItem
            className="flex items-center text-xs cursor-pointer hover:bg-[#2d3748]"
            onClick={() => setDashboardOpen(true)}
          >
            <User size={14} className="mr-2 text-gray-400" />
            Account Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center text-xs cursor-pointer hover:bg-[#2d3748]"
            onClick={() => {
              setDashboardOpen(true);
              // This will be handled by the dashboard component
              // We'll select the subscription tab after it opens
              setTimeout(() => {
                const subscriptionTabButton = document.querySelector('[data-tab="subscription"]') as HTMLButtonElement;
                if (subscriptionTabButton) {
                  subscriptionTabButton.click();
                }
              }, 100);
            }}
          >
            <CreditCard size={14} className="mr-2 text-gray-400" />
            Subscription
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center text-xs cursor-pointer hover:bg-[#2d3748]"
            onClick={() => {
              setDashboardOpen(true);
              // Select settings tab
              setTimeout(() => {
                const settingsTabButton = document.querySelector('[data-tab="settings"]') as HTMLButtonElement;
                if (settingsTabButton) {
                  settingsTabButton.click();
                }
              }, 100);
            }}
          >
            <Settings size={14} className="mr-2 text-gray-400" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#2d3748]" />
          <DropdownMenuItem 
            className="flex items-center text-xs cursor-pointer hover:bg-red-900/30 text-red-400 hover:text-red-300"
            onClick={handleSignOut}
          >
            <LogOut size={14} className="mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserDashboardDialog 
        open={dashboardOpen}
        onOpenChange={setDashboardOpen}
      />

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)} 
        defaultView={authView}
      />
    </>
  );
};
