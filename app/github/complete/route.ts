import db from '@/lib/db';
import { createUserSession } from '@/lib/session';
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
    await createUserSession(user.id);
    return redirect('/profile');
  }

  const userEmailResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const userEmails = await userEmailResponse.json();
  const email = userEmails[0].email;

  const isUserNameExists = await db.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    },
  });

  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const nameTail = isUserNameExists ? `-${generateRandomString()}` : '';
  const newUser = await db.user.create({
    data: {
      username: `${login}${nameTail}`,
      github_id: id.toString(),
      avatar: avatar_url,
      email,
    },
    select: {
      id: true,
    },
  });
  await createUserSession(newUser.id);
  return redirect('/profile');
}
