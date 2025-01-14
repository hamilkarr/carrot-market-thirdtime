import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionContents {
  id?: number;
}

export const getSession = async () => {
  return getIronSession<SessionContents>(await cookies(), {
    cookieName: 'delicious-karrot',
    password: process.env.COOKIE_PASSWORD!,
  });
};

export async function createUserSession(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}
