
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface Transaction {
  id: string;
  date: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'T-12345',
    date: '2025-05-15',
    amount: '$9.99',
    status: 'completed',
    description: 'Premium Subscription - May'
  },
  {
    id: 'T-12346', 
    date: '2025-04-15', 
    amount: '$9.99',
    status: 'completed',
    description: 'Premium Subscription - April'
  }
];

export const PayPalTransactionHistory: React.FC = () => {
  const { authState } = useAuth();
  const [transactions] = useState<Transaction[]>(mockTransactions);

  if (authState.user?.tier === 'free') {
    return (
      <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-white">Payment History</CardTitle>
          <CardDescription className="text-[#9ca3af]">
            Your payment and subscription history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#9ca3af]">
            <p>No payment history available for free tier.</p>
            <p className="text-sm mt-2">Upgrade to Premium or Pro to see your payment history.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1a1f2c] border-[#2d3748] shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-white">Payment History</CardTitle>
        <CardDescription className="text-[#9ca3af]">
          Your payment and subscription history
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-[#9ca3af]">No transactions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#2d3748]">
                  <th className="py-2 px-4 text-left text-sm font-medium text-[#9ca3af]">Date</th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-[#9ca3af]">Transaction</th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-[#9ca3af]">Amount</th>
                  <th className="py-2 px-4 text-left text-sm font-medium text-[#9ca3af]">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-[#2d3748]">
                    <td className="py-3 px-4 text-sm text-[#d1d5db]">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#d1d5db]">
                      <div>{transaction.description}</div>
                      <div className="text-xs text-[#9ca3af]">ID: {transaction.id}</div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-[#d1d5db]">
                      {transaction.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-900/30 text-green-400' 
                          : transaction.status === 'pending' 
                            ? 'bg-yellow-900/30 text-yellow-400' 
                            : 'bg-red-900/30 text-red-400'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 p-3 bg-[#2d3748]/50 rounded text-xs text-[#9ca3af] border border-[#4b5563]">
          <p>This is a sandbox implementation. In a production environment, this would show your actual PayPal transaction history.</p>
        </div>
      </CardContent>
    </Card>
  );
};
