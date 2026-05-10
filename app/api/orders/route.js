import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';
import { getSessionFromCookies } from '../../../lib/session';

export async function GET(request) {
  try {
    await connectDB();
    const session = getSessionFromCookies(request.headers.get('cookie'));
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const orders = await Order.find({ uid: session.uid }).lean();
    return NextResponse.json(orders.map(o => ({ ...o, id: o._id.toString(), _id: undefined })));
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
    const order = await Order.create({ ...body, uid: session.uid });
    return NextResponse.json({ ...order.toObject(), id: order._id.toString(), _id: undefined });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
