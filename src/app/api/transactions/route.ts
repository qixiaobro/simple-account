import { NextResponse } from 'next/server';
import { addTransaction } from '../../../utils';

export async function POST(request: Request) {
  const { accountId, amount, type, note, fee } = await request.json();
  const newTransaction = addTransaction(accountId, amount, type, note, fee);
  return NextResponse.json(newTransaction);
}
