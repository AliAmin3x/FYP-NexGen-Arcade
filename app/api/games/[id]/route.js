import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Game from '../../../../models/Game';
import { getSessionFromCookies } from '../../../../lib/session';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const game = await Game.findById(params.id).lean();
    if (!game) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ...game, id: game._id.toString(), _id: undefined });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const session = getSessionFromCookies(request.headers.get('cookie'));
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json();
    const game = await Game.findByIdAndUpdate(params.id, body, { new: true }).lean();
    return NextResponse.json({ ...game, id: game._id.toString(), _id: undefined });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const session = getSessionFromCookies(request.headers.get('cookie'));
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    await Game.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
