
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { UserDashboard } from './UserDashboard';

interface UserDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDashboardDialog: React.FC<UserDashboardDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0c1018] border-[#2d3748] p-0 max-w-6xl w-[90vw] max-h-[90vh] overflow-hidden">
        <DialogHeader className="p-4 border-b border-[#2d3748] bg-gradient-to-r from-[#0f1117] to-[#1a1f2c]">
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            User Dashboard
          </DialogTitle>
          <DialogDescription className="text-[#9ca3af]">
            Manage your account, subscription, and preferences
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto p-0 max-h-[calc(90vh-120px)]">
          <UserDashboard inDialog />
        </div>
      </DialogContent>
    </Dialog>
  );
};
