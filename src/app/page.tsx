'use client';

import { useState, useEffect } from 'react';
import { Account, Transaction } from '../types';
import AccountList from '../components/AccountList';
import TransactionList from '../components/TransactionList';
import AddAccountForm from '../components/AddAccountForm';
import AddTransactionForm from '../components/AddTransactionForm';

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('/api/data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    const data = await response.json();
    setAccounts(data.accounts || []);
    setTransactions(data.transactions || []);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">记账软件</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">账户总览</h2>
          <AccountList accounts={accounts} onAccountUpdated={fetchData} />
          <AddAccountForm onAccountAdded={fetchData} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">添加交易</h2>
          <AddTransactionForm accounts={accounts} onTransactionAdded={fetchData} />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">交易记录</h2>
        <TransactionList transactions={transactions} accounts={accounts} onTransactionEdited={fetchData} onTransactionDeleted={fetchData} />
      </div>
    </div>
  );
}
