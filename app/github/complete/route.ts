import db from '@/lib/db';
import { createUserSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

// 1. GitHub Access Token을 가져오는 함수
async function getGithubAccessToken(code: string): Promise<string> {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  const accessTokenResponse = await fetch(accessTokenURL, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
  }
  if (error || !access_token) {
    throw new Error('GitHub 액세스 토큰을 가져오는 중 오류가 발생했습니다.');
  }
  return access_token;
}

// 2. GitHub으로부터 사용자 프로필 정보를 가져오는 함수
async function getUserProfile(accessToken: string) {
  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-cache',
  });
  return userProfileResponse.json();
}

// 3. GitHub으로부터 이메일 정보를 가져오는 함수
async function getUserEmail(accessToken: string) {
  const userEmailResponse = await fetch('https://api.github.com/user/emails', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const userEmails = await userEmailResponse.json();
  return userEmails[0]?.email ?? '';
}

async function findUserByGithubId(id: string): Promise<string | null> {
  const existingUser = await db.user.findUnique({
    where: { github_id: id },
    select: { id: true },
  });
  return existingUser ? existingUser.id.toString() : null;
}

async function createUser(
  id: string,
  login: string,
  avatar: string,
  email: string,
): Promise<string> {
  const isUserNameExists = await db.user.findUnique({
    where: { username: login },
    select: { id: true },
  });
  const generateRandomString = () => Math.random().toString(36).substring(2, 8);
  const nameTail = isUserNameExists ? `-${generateRandomString()}` : '';

  const newUser = await db.user.create({
    data: {
      username: `${login}${nameTail}`,
      github_id: id,
      avatar,
      email,
    },
    select: { id: true },
  });
  return newUser.id.toString();
}

// ----- GET 함수 수정: 분리된 함수들 사용 -----
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const accessToken = await getGithubAccessToken(code);
    const { id, avatar_url, login } = await getUserProfile(accessToken);

    // 기존 유저가 있는지 확인
    const existingUserId = await findUserByGithubId(id.toString());

    // 기존 유저 없으면 새 유저 생성
    const userId = existingUserId
      ? existingUserId
      : await createUser(
          id.toString(),
          login,
          avatar_url,
          await getUserEmail(accessToken),
        );

    await createUserSession(Number(userId));

    // 절대 경로 형태로 변환
    const url = new URL('/profile', request.url);
    return NextResponse.redirect(url, 307);
  } catch (err) {
    console.error(err);
    return new NextResponse(null, { status: 400 });
  }
}
