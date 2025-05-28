
import { useState } from 'react';
import { toast } from 'sonner';

export interface PayPalError {
  name?: string;
  message?: string;
  details?: any[];
  debug_id?: string;
  err?: any;
}

export const usePayPalError = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayPalError = (error: PayPalError | any) => {
    console.error('PayPal error details:', error);
    
    let message: string;
    
    // Handle different types of PayPal errors
    if (error?.details && Array.isArray(error.details) && error.details.length > 0) {
      message = error.details.map((detail: any) => {
        return detail.description || detail.issue || 'Payment processing error';
      }).join(', ');
    } else if (error?.message) {
      if (error.message.includes('script')) {
        message = 'PayPal services are temporarily unavailable. Please refresh and try again.';
      } else if (error.message.includes('window closed')) {
        message = 'Payment window was closed. Please try again and complete the payment process.';
      } else {
        message = error.message;
      }
    } else if (typeof error === 'string') {
      message = error;
    } else {
      message = 'Payment processing failed. Please try again.';
    }
    
    setIsError(true);
    setErrorMessage(message);
    
    toast.error('Payment Error', {
      description: message,
      duration: 6000,
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
