'use server';

import { z } from 'zod';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REQUIRED_ERROR,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user) === true;
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .trim()
    .refine(checkEmailExists, 'An account with this email does not exist'),
  password: z
    .string({
      required_error: PASSWORD_REQUIRED_ERROR,
    })
    .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

const login = async (prevState: any, data: FormData) => {
  const result = await formSchema.safeParseAsync({
    email: data.get('email'),
    password: data.get('password'),
  });
  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        password: true,
        id: true,
      },
    });
    const isPasswordCorrect = await bcrypt.compare(
      result.data.password,
      user!.password ?? '',
    );
    if (isPasswordCorrect) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect('/');
    } else {
      return {
        fieldErrors: {
          password: ['Wrong Password'],
          email: [],
        },
      };
    }
  }
};

export default login;
