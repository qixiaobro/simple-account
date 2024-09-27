import { Account } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountOverview({ accounts }: { accounts: Account[] }) {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>总余额</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">¥{totalBalance.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <CardTitle>{account.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">¥{account.balance.toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
