import db from '@/lib/db';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return new NextResponse(null, {
      status: 400,
    });
  }
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
    return new NextResponse(null, {
      status: 400,
    });
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
    await login(user.id);
    return redirect('/profile');
  }
  const newUser = await db.user.create({
    data: {
      username: login,
      github_id: id.toString(),
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });
  await login(newUser.id);
  return redirect('/profile');
}
