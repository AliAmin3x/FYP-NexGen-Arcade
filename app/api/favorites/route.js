import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Favorite from '../../../models/Favorite';
import { getSessionFromCookies } from '../../../lib/session';

export async function GET(request) {
  try {
    await connectDB();
    const session = getSessionFromCookies(request.headers.get('cookie'));
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const items = await Favorite.find({ uid: session.uid }).lean();
    return NextResponse.json(items.map(i => ({ ...i, id: i._id.toString(), _id: undefined })));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const session = getSessionFromCookies(request.headers.get('cookie'));
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const body = await request.json();
    const item = await Favorite.create({ ...body, uid: session.uid });
    return NextResponse.json({ ...item.toObject(), id: item._id.toString(), _id: undefined });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
