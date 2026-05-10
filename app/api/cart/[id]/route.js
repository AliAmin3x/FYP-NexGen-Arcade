import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Cart from '../../../../models/Cart';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await Cart.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
