import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Account, Transaction } from '../types';

const dataPath = path.join(process.cwd(), 'src', 'data', 'accounts.json');

export function readData(): { accounts: Account[], transactions: Transaction[] } {
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(rawData);
}

export function writeData(data: { accounts: Account[], transactions: Transaction[] }): void {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

export function initializeDataFile() {
  if (!fs.existsSync(dataPath)) {
    writeData({ accounts: [], transactions: [] });
  } else {
    try {
      readData();
    } catch (error) {
      console.error('Error reading data file, initializing with empty data',error);
      writeData({ accounts: [], transactions: [] });
    }
  }
}

export function addAccount(name: string, balance: number): Account {
  const data = readData();
  const newAccount: Account = {
    id: uuidv4(),
    name,
    balance
  };
  data.accounts.push(newAccount);
  writeData(data);
  return newAccount;
}

export function updateAccountBalance(accountId: string, newBalance: number): Account | null {
  const data = readData();
  const account = data.accounts.find(a => a.id === accountId);
  if (account) {
    account.balance = newBalance;
    writeData(data);
    return account;
  }
  return null;
}

export function addTransaction(accountId: string, amount: number, type: 'income' | 'expense', note: string, fee: number): Transaction {
  const data = readData();
  const newTransaction: Transaction = {
    id: uuidv4(),
    accountId,
    amount,
    type,
    note,
    fee,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'normal'
  };
  data.transactions.push(newTransaction);
  
  const account = data.accounts.find(a => a.id === accountId);
  if (account) {
    account.balance += type === 'income' ? (amount - fee) : -(amount + fee);
  }
  
  writeData(data);
  return newTransaction;
}

export function editTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
  const data = readData();
  const transactionIndex = data.transactions.findIndex(t => t.id === id);
  if (transactionIndex === -1) return null;

  const oldTransaction = data.transactions[transactionIndex];
  const newTransaction = { ...oldTransaction, ...updates, updatedAt: new Date().toISOString() };

  // 更新账户余额
  if (oldTransaction.accountId !== newTransaction.accountId || oldTransaction.amount !== newTransaction.amount || oldTransaction.type !== newTransaction.type) {
    const oldAccount = data.accounts.find(a => a.id === oldTransaction.accountId);
    const newAccount = data.accounts.find(a => a.id === newTransaction.accountId);

    if (oldAccount) {
      oldAccount.balance -= oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount;
    }
    if (newAccount) {
      newAccount.balance += newTransaction.type === 'income' ? newTransaction.amount : -newTransaction.amount;
    }
  }

  data.transactions[transactionIndex] = newTransaction;
  writeData(data);
  return newTransaction;
}

export function refundTransaction(id: string, refundFee: boolean): Transaction | null {
  const data = readData();
  const transaction = data.transactions.find(t => t.id === id);
  if (!transaction) return null;

  const account = data.accounts.find(a => a.id === transaction.accountId);
  if (account) {
    const refundAmount = transaction.type === 'income' 
      ? transaction.amount - (refundFee ? 0 : transaction.fee)
      : -(transaction.amount + (refundFee ? transaction.fee : 0));
    account.balance -= refundAmount;
  }

  transaction.updatedAt = new Date().toISOString();
  transaction.status = 'refunded';
  if (!refundFee) {
    transaction.amount -= transaction.fee;
  }
  writeData(data);
  return transaction;;
}

export function deleteTransaction(id: string): boolean {
  const data = readData();
  const transactionIndex = data.transactions.findIndex(t => t.id === id);
  if (transactionIndex === -1) return false;

  const transaction = data.transactions[transactionIndex];
  const account = data.accounts.find(a => a.id === transaction.accountId);
  if (account) {
    account.balance -= transaction.type === 'income' ? transaction.amount : -transaction.amount;
  }

  data.transactions.splice(transactionIndex, 1);
  writeData(data);
  return true;
}
