
import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { toast } from 'sonner';

// PayPal client IDs - replace with your own when going to production
const PAYPAL_CLIENT_ID = {
  sandbox: 'AUuNirVvb6STfDVfZWvvVXG4j1pYz9M8xyr6nWKVlnEpcnO0zMoe0bp5h0hponRUVXKYGw_awWrmEaA0',
  production: '' // Leave empty for now - would be filled for production
};

interface PayPalProviderProps {
  children: React.ReactNode;
}

export const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  // Fixed the PayPal options to match the required interface
  const paypalOptions = {
    clientId: PAYPAL_CLIENT_ID.sandbox, // Using sandbox for testing
    currency: 'USD',
    intent: 'subscription',
    'data-client-token': '',
    components: 'buttons,funding-eligibility',
    'disable-funding': 'paylater,card',
    'enable-funding': 'paypal',
  };

  return (
    <PayPalScriptProvider options={paypalOptions} deferLoading={false}>
      {children}
    </PayPalScriptProvider>
  );
};
