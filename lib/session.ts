import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionContents {
  id?: number;
}

const getSession = async () => {
  return getIronSession<SessionContents>(await cookies(), {
    cookieName: 'delicious-karrot',
    password: process.env.COOKIE_PASSWORD!,
  });
};

export default getSession;
