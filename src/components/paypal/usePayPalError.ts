
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
    console.error('Error type:', typeof error);
    console.error('Error stringified:', JSON.stringify(error, null, 2));
    
    let message: string;
    
    // Handle different types of PayPal errors
    if (error?.details && Array.isArray(error.details) && error.details.length > 0) {
      // Handle PayPal API errors with details
      console.log('Processing PayPal API error with details:', error.details);
      message = error.details.map((detail: any) => {
        if (detail.description) return detail.description;
        if (detail.issue) return detail.issue;
        if (detail.field && detail.value) return `${detail.field}: ${detail.value}`;
        return 'Payment processing error';
      }).join(', ');
    } else if (error?.message) {
      // Handle generic error messages
      console.log('Processing error with message:', error.message);
      if (error.message.includes('script')) {
        message = 'PayPal services are temporarily unavailable. Please refresh and try again.';
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        message = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('window closed') || error.message.includes('popup closed')) {
        message = 'Payment window was closed. Please try again and complete the payment process.';
      } else if (error.message.includes('not yet configured')) {
        message = error.message; // Pass through configuration errors
      } else {
        message = error.message;
      }
    } else if (error?.name) {
      // Handle error by name
      console.log('Processing error by name:', error.name);
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
        case 'POPUP_CLOSED':
          message = 'Payment popup was closed. Please try again and complete the payment process.';
          break;
        case 'SCRIPT_LOAD_ERROR':
          message = 'PayPal failed to load. Please check your internet connection and try again.';
          break;
        default:
          message = `Payment error: ${error.name}`;
      }
    } else if (typeof error === 'string') {
      message = error;
    } else if (error?.err) {
      // Handle nested error objects
      console.log('Processing nested error object:', error.err);
      return handlePayPalError(error.err);
    } else {
      message = 'Payment processing failed. Please try again or contact support.';
      console.log('Using fallback error message for unknown error type');
    }
    
    setIsError(true);
    setErrorMessage(message);
    
    // Show user-friendly toast
    toast.error('Payment Error', {
      description: message.length > 100 ? message.substring(0, 100) + '...' : message,
      duration: 6000,
    });
    
    return message;
  };

  const resetError = () => {
    console.log('Resetting PayPal error state');
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
