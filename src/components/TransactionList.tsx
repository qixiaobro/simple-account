import { useState } from 'react';
import { Transaction, Account } from '../types';

export default function TransactionList({ transactions, accounts, onTransactionEdited, onTransactionDeleted }: { transactions: Transaction[], accounts: Account[], onTransactionEdited: () => void, onTransactionDeleted: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTransaction, setEditedTransaction] = useState<Partial<Transaction>>({});

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditedTransaction({ ...transaction });
  };

  const handleSave = async (transaction: Transaction) => {
    const response = await fetch(`/api/transactions/${transaction.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedTransaction),
    });
    if (response.ok) {
      setEditingId(null);
      onTransactionEdited();
    }
  };

  const handleRefund = async (transaction: Transaction) => {
    const response = await fetch(`/api/transactions/${transaction.id}/refund`, {
      method: 'POST',
    });
    if (response.ok) {
      await response.json();
      onTransactionEdited();
    }
  };

  const handleDelete = async (transaction: Transaction) => {
    const response = await fetch(`/api/transactions/${transaction.id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      onTransactionDeleted();
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">账户</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">备注</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === transaction.id ? (
                  <select
                    value={editedTransaction.accountId}
                    onChange={(e) => setEditedTransaction({ ...editedTransaction, accountId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                ) : (
                  accounts.find(a => a.id === transaction.accountId)?.name
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === transaction.id ? (
                  <input
                    type="number"
                    value={editedTransaction.amount}
                    onChange={(e) => setEditedTransaction({ ...editedTransaction, amount: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                ) : (
                  transaction.amount.toFixed(2)
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === transaction.id ? (
                  <select
                    value={editedTransaction.type}
                    onChange={(e) => setEditedTransaction({ ...editedTransaction, type: e.target.value as 'income' | 'expense' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="income">收入</option>
                    <option value="expense">支出</option>
                  </select>
                ) : (
                  transaction.type === 'income' ? '收入' : '支出'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {transaction.status === 'normal' ? '正常' : '已退款'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === transaction.id ? (
                  <input
                    type="text"
                    value={editedTransaction.note}
                    onChange={(e) => setEditedTransaction({ ...editedTransaction, note: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                ) : (
                  transaction.note
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.createdAt).toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === transaction.id ? (
                  <button onClick={() => handleSave(transaction)} className="text-indigo-600 hover:text-indigo-900 mr-2">保存</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(transaction)} className="text-indigo-600 hover:text-indigo-900 mr-2">编辑</button>
                    <button onClick={() => handleRefund(transaction)} className="text-yellow-600 hover:text-yellow-900 mr-2">退款</button>
                    <button onClick={() => handleDelete(transaction)} className="text-red-600 hover:text-red-900">删除</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
