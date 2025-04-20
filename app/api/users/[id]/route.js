import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/user';

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        await connectMongoDB();

        const user = await User.findById(id).select('_id username profilePicture');

        if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}
