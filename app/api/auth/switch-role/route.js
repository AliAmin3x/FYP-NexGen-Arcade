import { NextResponse } from 'next/server';
import { setSessionCookie } from '../../../../lib/session';

// Dev-mode role switcher — no password needed, just pick a role
export async function POST(request) {
  const { role } = await request.json();
  const validRoles = ['user', 'developer', 'admin'];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const profiles = {
    user:      { uid: 'dev-user-001',      email: 'user@nexgen.dev',      username: 'Demo User',      role: 'user' },
    developer: { uid: 'dev-developer-001', email: 'dev@nexgen.dev',       username: 'Demo Developer', role: 'developer' },
    admin:     { uid: 'admin',             email: process.env.ADMIN_EMAIL || 'admin@nexgen.dev', username: 'Admin',          role: 'admin' },
  };

  const session = profiles[role];
  const res = NextResponse.json({ success: true, user: session });
  setSessionCookie(res, session);
  return res;
}
