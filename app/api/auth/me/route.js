import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '../../../lib/session';

export async function GET(request) {
  const session = getSessionFromCookies(request.headers.get('cookie'));
  if (!session) return NextResponse.json({ user: null });
  return NextResponse.json({ user: session });
}
