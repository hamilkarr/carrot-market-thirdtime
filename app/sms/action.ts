'use server';

import twilio from 'twilio';
import { z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import crypto from 'crypto';
import { createUserSession } from '@/lib/session';
const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, 'ko-KR'), {
    message: 'Invalid phone number',
  });

async function checkTokenExist(token: number) {
  const existingToken = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(existingToken);
}
const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(checkTokenExist, 'This token does not exist.');

interface ActionState {
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const existingToken = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (existingToken) {
    return getToken();
  }
  return token;
}

export const smsLogin = async (prevState: ActionState, data: FormData) => {
  const phone = data.get('phone');
  const token = data.get('token');

  if (prevState.token === false) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return { token: false, error: result.error.flatten() };
    } else {
      // delete previous token
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      // create new token
      const newToken = await getToken();
      await db.sMSToken.create({
        data: {
          token: newToken,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString('hex'),
                phone: result.data,
              },
            },
          },
        },
      });
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
      await client.messages.create({
        to: result.data,
        // to: process.env.TWILIO_PHONE_NUMBER!,
        // from: '+12053725555',
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Your verification code is ${newToken}`,
      });
      return { token: true };
    }
  } else {
    const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return { token: true, error: result.error.flatten() };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      await createUserSession(token!.userId);
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });

      redirect('/profile');
    }
  }
};
