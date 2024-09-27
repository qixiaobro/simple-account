import { NextResponse } from 'next/server';
import { editTransaction, refundTransaction, deleteTransaction } from '../../../../utils';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const updates = await request.json();
  const updatedTransaction = editTransaction(id, updates);
  if (updatedTransaction) {
    return NextResponse.json(updatedTransaction);
  } else {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { refundFee } = await request.json();
  const refundedTransaction = refundTransaction(id, refundFee);
  if (refundedTransaction) {
    return NextResponse.json(refundedTransaction);
  } else {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const isDeleted = deleteTransaction(id);
  if (isDeleted) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }
}
