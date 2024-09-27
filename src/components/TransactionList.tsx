import { useState } from 'react';
import { Account, Transaction } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefundDialog } from './RefundDialog';

export default function TransactionList({ transactions, accounts, onTransactionEdited, onTransactionDeleted }: { transactions: Transaction[], accounts: Account[], onTransactionEdited: () => void, onTransactionDeleted: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTransaction, setEditedTransaction] = useState<Partial<Transaction>>({});
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

  const handleRefund = async (amount: number, refundFee: boolean) => {
    if (selectedTransaction) {
      const response = await fetch(`/api/transactions/${selectedTransaction.id}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, refundFee }),
      });
      if (response.ok) {
        await response.json();
        onTransactionEdited();
        setRefundDialogOpen(false);
      }
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
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>账户</TableHead>
          <TableHead>金额</TableHead>
          <TableHead>手续费</TableHead>
          <TableHead>类型</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>备注</TableHead>
          <TableHead>时间</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              {editingId === transaction.id ? (
                <Select onValueChange={(value) => setEditedTransaction({ ...editedTransaction, accountId: value })} value={editedTransaction.accountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择账户" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                accounts.find(a => a.id === transaction.accountId)?.name
              )}
            </TableCell>
            <TableCell>
              {editingId === transaction.id ? (
                <Input
                  type="number"
                  value={editedTransaction.amount?.toString()}
                  onChange={(e) => setEditedTransaction({ ...editedTransaction, amount: parseFloat(e.target.value) })}
                />
              ) : (
                transaction.amount.toFixed(2)
              )}
            </TableCell>
            <TableCell>
              {editingId === transaction.id ? (
                <Input
                  type="number"
                  value={editedTransaction.fee?.toString()}
                  onChange={(e) => setEditedTransaction({ ...editedTransaction, fee: parseFloat(e.target.value) })}
                />
              ) : (
                transaction.fee.toFixed(2)
              )}
            </TableCell>
            <TableCell>
              {editingId === transaction.id ? (
                <Select onValueChange={(value) => setEditedTransaction({ ...editedTransaction, type: value as 'income' | 'expense' })} value={editedTransaction.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">收入</SelectItem>
                    <SelectItem value="expense">支出</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                transaction.type === 'income' ? '收入' : '支出'
              )}
            </TableCell>
            <TableCell>
              {transaction.status === 'normal' ? '正常' : '已退款'}
            </TableCell>
            <TableCell>
              {editingId === transaction.id ? (
                <Input
                  value={editedTransaction.note}
                  onChange={(e) => setEditedTransaction({ ...editedTransaction, note: e.target.value })}
                />
              ) : (
                transaction.note
              )}
            </TableCell>
            <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
            <TableCell>
              {editingId === transaction.id ? (
                <Button onClick={() => handleSave(transaction)}>保存</Button>
              ) : (
                <>
                  <Button onClick={() => handleEdit(transaction)} variant="outline" className="mr-2">编辑</Button>
                  <Button 
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setRefundDialogOpen(true);
                      }} 
                      variant="outline" 
                      className="mr-2"
                    >
                      退款
                    </Button>
                  <Button onClick={() => handleDelete(transaction)} variant="destructive">删除</Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {selectedTransaction && (
      <RefundDialog
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        onRefund={handleRefund}
        maxAmount={selectedTransaction.amount}
      />
    )}
    </>
  );
}
