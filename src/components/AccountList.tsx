import { useState } from 'react';
import { Account } from '../types';

export default function AccountList({ accounts, onAccountUpdated }: { accounts: Account[], onAccountUpdated: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedBalance, setEditedBalance] = useState('');

  const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;

  const handleEdit = (account: Account) => {
    setEditingId(account.id);
    setEditedBalance(account.balance.toString());
  };

  const handleSave = async (account: Account) => {
    const response = await fetch(`/api/accounts/${account.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ balance: parseFloat(editedBalance) }),
    });
    if (response.ok) {
      setEditingId(null);
      onAccountUpdated();
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">总余额: ¥{totalBalance.toFixed(2)}</h3>
      <ul className="space-y-2">
        {accounts?.map((account) => (
          <li key={account.id} className="flex justify-between items-center">
            <span>{account.name}</span>
            {editingId === account.id ? (
              <div>
                <input
                  type="number"
                  value={editedBalance}
                  onChange={(e) => setEditedBalance(e.target.value)}
                  className="border rounded px-2 py-1 w-24"
                />
                <button onClick={() => handleSave(account)} className="ml-2 text-blue-600 hover:text-blue-800">保存</button>
              </div>
            ) : (
              <div>
                <span className="font-semibold">¥{account.balance.toFixed(2)}</span>
                <button onClick={() => handleEdit(account)} className="ml-2 text-blue-600 hover:text-blue-800">编辑</button>
              </div>
            )}
          </li>
        )) || <li>暂无账户</li>}
      </ul>
    </div>
  );
}
