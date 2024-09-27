export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: 'income' | 'expense';
  note: string;
  createdAt: string;
  updatedAt: string;
  status: 'normal' | 'refunded';
  fee: number;
}
