"use client";

import { useState } from 'react';

export default function BalanceChecker() {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]); // Explicitly typed as any[] or Transaction[]

  const handleCheckBalance = async () => {
    const response = await fetch('/api/balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    });

    const data = await response.json();
    setBalance(data.balance);

    const transactionResponse = await fetch('/api/transactionHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    });

    const transactionData = await transactionResponse.json();
    setTransactions(transactionData.transactions || []);
  };

  const formatBlockTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Solana Wallet Balance Checker</h1>

      <div className="mb-6 flex">
        <input
          id="walletAddress"
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="w-96 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search"
        />
        <button
          onClick={handleCheckBalance}
          className="px-6 bg-blue-500 text-white font-semibold rounded-r-md focus:outline-none hover:bg-blue-600"
        >
          Check Balance
        </button>
      </div>

      {balance && (
        <div className="mt-8">
          <p className="text-xl font-medium">Wallet Balance:</p>
          <p className="text-4xl font-semibold text-green-600">{balance} SOL</p>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="my-8">
          <p className="text-xl font-medium">Transaction History:</p>
          <table className="w-full table-auto border-collapse border border-gray-500">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Signature</th>
                <th className="px-4 py-2">Block Time</th>
                <th className="px-4 py-2">Slot</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{transaction.signature}</td>
                  <td className="border px-4 py-2">{formatBlockTime(transaction.blockTime)}</td>
                  <td className="border px-4 py-2">{transaction.slot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

