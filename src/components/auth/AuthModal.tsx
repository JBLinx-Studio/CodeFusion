
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

type AuthView = 'login' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: AuthView;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  defaultView = 'login' 
}) => {
  const [view, setView] = useState<AuthView>(defaultView);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1f2c] border border-[#2d3748] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            {view === 'login' ? 'Welcome Back' : 'Join CodePlayground'}
          </DialogTitle>
        </DialogHeader>

        {view === 'login' ? (
          <LoginForm onSuccess={onClose} switchToRegister={() => setView('register')} />
        ) : (
          <RegisterForm onSuccess={onClose} switchToLogin={() => setView('login')} />
        )}
      </DialogContent>
    </Dialog>
  );
};
