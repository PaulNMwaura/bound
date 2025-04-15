import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import Ably from 'ably';

const rest = new Ably.Rest({ key: process.env.ABLY_API_KEY });

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tokenDetails = await rest.auth.createTokenRequest({ clientId: session.user.id, authOptions });

    if (tokenDetails) {
      return NextResponse.json(tokenDetails, { status: 200 });
    }

    return NextResponse.json({ error: "Couldn't retrieve the token details" }, { status: 500 });

  } catch (error) {
    console.error('Error generating Ably token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}