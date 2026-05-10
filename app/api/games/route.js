import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Game from '../../../models/Game';
import { getSessionFromCookies } from '../../../lib/session';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '0');

    const filter = {};
    if (type) filter.type = type;
    if (status === 'Pending') filter.status = 'Pending';
    else if (status === 'Approved') filter.status = 'Approved';
    else if (status === 'any') {} // no filter
    else if (!status) filter.status = { $ne: null }; // all with status set

    let query = Game.find(filter).sort({ createdAt: -1 });
    if (limit > 0) query = query.limit(limit);

    const games = await query.lean();
    const mapped = games.map(g => ({ ...g, id: g._id.toString(), _id: undefined }));
    return NextResponse.json(mapped);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const session = getSessionFromCookies(request.headers.get('cookie'));
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    if (session.role !== 'developer' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: only developers can upload games' }, { status: 403 });
    }

    const body = await request.json();
    const game = await Game.create({ ...body, uid: session.uid, status: 'Pending' });
    return NextResponse.json({ ...game.toObject(), id: game._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
