import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { setSessionCookie } from '../../../../lib/session';

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // Hardcoded admin shortcut (matching original logic)
    if (email === 'admin@gmail.com' && password === 'admin') {
      const session = { uid: 'admin', email: 'admin@gmail.com', username: 'Admin', role: 'admin' };
      const res = NextResponse.json({ success: true, user: session });
      setSessionCookie(res, session);
      return res;
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const session = { uid: user._id.toString(), email: user.email, username: user.username, role: user.role };
    const res = NextResponse.json({ success: true, user: session });
    setSessionCookie(res, session);
    return res;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
