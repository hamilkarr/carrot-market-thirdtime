import db from '@/lib/db';
import getSession from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return notFound();
  }
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  });
  const accessTokenUrl = `https://github.com/login/oauth/access_token?${params.toString()}`;
  const accessTokenResponse = await fetch(accessTokenUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
    return new NextResponse(null, { status: 400 });
  }

  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-cache',
  });
  const { id, avatar_url, login } = await userProfileResponse.json();
  const user = await db.user.findUnique({
    where: {
      github_id: id.toString(),
    },
    select: {
      id: true,
    },
  });
  if (user) {
    const session = await getSession();
    session.id = user.id;
    session.save();
    return redirect('/profile');
  }
  const newUser = await db.user.create({
    data: {
      github_id: id.toString(),
      avatar: avatar_url,
      username: login,
    },
    select: {
      id: true,
    },
  });
  const session = await getSession();
  session.id = newUser.id;
  session.save();
  return redirect('/profile');
}
