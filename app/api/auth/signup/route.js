import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { setSessionCookie } from '../../../../lib/session';

export async function POST(request) {
  try {
    await connectDB();
    const { username, email, password, role } = await request.json();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const user = await User.create({ username, email, password, role: role || 'user' });

    const session = { uid: user._id.toString(), email: user.email, username: user.username, role: user.role };
    const res = NextResponse.json({ success: true, user: session });
    setSessionCookie(res, session);
    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
