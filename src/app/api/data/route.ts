import { NextResponse } from 'next/server';
import { readData } from '../../../utils';

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}
