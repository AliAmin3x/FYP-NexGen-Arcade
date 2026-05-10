import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { setSessionCookie } from '../../../lib/session';

// Developer signup — creates user with role=developer
export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const user = await User.create({ username: name, email, password, role: 'developer' });
    const session = { uid: user._id.toString(), email: user.email, username: user.username, role: 'developer' };
    const res = NextResponse.json({ success: true, user: session });
    setSessionCookie(res, session);
    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Developer login — find by email+password with role=developer
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const password = searchParams.get('password');

    const user = await User.findOne({ email, password, role: 'developer' });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const session = { uid: user._id.toString(), email: user.email, username: user.username, role: 'developer' };
    const res = NextResponse.json({ success: true, user: session });
    setSessionCookie(res, session);
    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
