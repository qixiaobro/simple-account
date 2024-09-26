import { NextResponse } from 'next/server';
import { updateAccountBalance } from '../../../../utils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { balance } = await request.json();
  const updatedAccount = updateAccountBalance(id, balance);
  if (updatedAccount) {
    return NextResponse.json(updatedAccount);
  } else {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }
}
