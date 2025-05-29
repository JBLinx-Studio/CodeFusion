
import React from 'react';
import { PayPalDocumentation } from './PayPalDocumentation';

interface DocumentationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentationDialog: React.FC<DocumentationDialogProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <PayPalDocumentation 
      open={open} 
      onOpenChange={onOpenChange} 
    />
  );
};
