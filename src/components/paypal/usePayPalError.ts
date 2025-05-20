
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook to handle PayPal error states and messages
 */
export const usePayPalError = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayPalError = (error: any) => {
    console.error('PayPal error:', error);
    
    // Determine the appropriate error message
    let message: string;
    
    if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else {
      message = 'An error occurred with the payment system. Please try again later.';
    }
    
    setIsError(true);
    setErrorMessage(message);
    
    toast.error('Payment error', {
      description: message.length > 100 ? message.substring(0, 100) + '...' : message,
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
