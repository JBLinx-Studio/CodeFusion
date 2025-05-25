
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
      // Handle PayPal API errors with details
      message = error.details.map((detail: any) => {
        if (detail.description) return detail.description;
        if (detail.issue) return detail.issue;
        if (detail.field && detail.value) return `${detail.field}: ${detail.value}`;
        return 'Payment processing error';
      }).join(', ');
    } else if (error?.message) {
      // Handle generic error messages
      if (error.message.includes('script')) {
        message = 'PayPal services are temporarily unavailable. Please refresh and try again.';
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        message = 'Network error. Please check your connection and try again.';
      } else {
        message = error.message;
      }
    } else if (error?.name) {
      // Handle error by name
      switch (error.name) {
        case 'VALIDATION_ERROR':
          message = 'Invalid payment information. Please check your details and try again.';
          break;
        case 'AUTHORIZATION_ERROR':
          message = 'Payment authorization failed. Please try again.';
          break;
        case 'RESOURCE_NOT_FOUND':
          message = 'Payment plan not found. Please contact support.';
          break;
        default:
          message = `Payment error: ${error.name}`;
      }
    } else if (typeof error === 'string') {
      message = error;
    } else if (error?.err) {
      // Handle nested error objects
      return handlePayPalError(error.err);
    } else {
      message = 'Payment processing failed. Please try again or contact support.';
    }
    
    setIsError(true);
    setErrorMessage(message);
    
    // Show user-friendly toast
    toast.error('Payment Error', {
      description: message.length > 100 ? message.substring(0, 100) + '...' : message,
      duration: 6000,
      action: {
        label: 'Dismiss',
        onClick: () => resetError(),
      },
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
