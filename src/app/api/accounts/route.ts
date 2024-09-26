import { NextResponse } from 'next/server';
import { addAccount } from '../../../utils';

export async function POST(request: Request) {
  try {
    const { name, balance } = await request.json();
    const newAccount = addAccount(name, balance);
    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    console.error('Error adding account:', error);
    return NextResponse.json({ error: 'Failed to add account' }, { status: 500 });
  }
}

export async function GET() {
  const { accounts } = await import('../../../utils').then(m => m.readData());
  return NextResponse.json(accounts);
}
