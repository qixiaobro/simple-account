'use client';

import { useState, useEffect } from 'react';
import { Account, Transaction } from '../types';
import AccountOverview from '../components/AccountOverview';
import TransactionList from '../components/TransactionList';
import AddAccountDialog from '../components/AddAccountDialog';
import AddTransactionDialog from '../components/AddTransactionDialog';
import { Button } from "@/components/ui/button";

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('/api/data');
    const data = await response.json();
    setAccounts(data.accounts || []);
    setTransactions(data.transactions || []);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">记账软件</h1>
      <div className="mb-8">
        <AccountOverview accounts={accounts} />
      </div>
      <div className="flex justify-between mb-8">
        <Button onClick={() => setIsAddAccountOpen(true)}>添加账户</Button>
        <Button onClick={() => setIsAddTransactionOpen(true)}>添加交易</Button>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">交易记录</h2>
        <TransactionList transactions={transactions} accounts={accounts} onTransactionEdited={fetchData} onTransactionDeleted={fetchData} />
      </div>
      <AddAccountDialog isOpen={isAddAccountOpen} onClose={() => setIsAddAccountOpen(false)} onAccountAdded={fetchData} />
      <AddTransactionDialog isOpen={isAddTransactionOpen} onClose={() => setIsAddTransactionOpen(false)} onTransactionAdded={fetchData} accounts={accounts} />
    </div>
  );
}
