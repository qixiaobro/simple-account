import { NextResponse } from 'next/server';
import { refundTransaction } from '../../../../../utils';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const refundedTransaction = refundTransaction(id);
  if (refundedTransaction) {
    return NextResponse.json(refundedTransaction);
  } else {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }
}
