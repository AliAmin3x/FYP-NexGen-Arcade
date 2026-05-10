import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Favorite from '../../../../models/Favorite';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await Favorite.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
