
import { useState } from 'react';
import { toast } from 'sonner';

export interface PayPalError {
  name?: string;
  message?: string;
  details?: any[];
  debug_id?: string;
}

export const usePayPalError = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayPalError = (error: PayPalError | any) => {
    console.error('PayPal error:', error);
    
    let message: string;
    
    if (error?.details && error.details.length > 0) {
      // Handle PayPal API errors with details
      message = error.details.map((detail: any) => detail.description || detail.issue).join(', ');
    } else if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else {
      message = 'Payment processing failed. Please try again.';
    }
    
    setIsError(true);
    setErrorMessage(message);
    
    toast.error('Payment Error', {
      description: message.length > 80 ? message.substring(0, 80) + '...' : message,
      duration: 5000,
    });
    
    return message;
  };

  const resetError = () => {
    setIsError(false);
    setErrorMessage(null);
  };

  return {
    isError,
    errorMessage,
    handlePayPalError,
    resetError
  };
};
