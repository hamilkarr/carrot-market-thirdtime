'use server';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  PASSWORD_REQUIRED_ERROR,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '@/lib/constants';
import db from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { redirect } from 'next/navigation';

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => {
  return password === confirm_password;
};

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user) === false;
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user) === false;
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'Username must be string',
        required_error: 'Where is my username?',
      })
      .min(USERNAME_MIN_LENGTH)
      .max(USERNAME_MAX_LENGTH)
      .toLowerCase()
      .trim()
      .refine(checkUniqueUsername, 'This username is already taken'),
    // .transform((username) => {
    //   return `🔥 ${username} 🔥`;
    // }),
    email: z
      .string()
      .email()
      .toLowerCase()
      .trim()
      .refine(checkUniqueEmail, 'This email is already taken'),
    password: z
      .string({
        required_error: PASSWORD_REQUIRED_ERROR,
      })
      .min(PASSWORD_MIN_LENGTH),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkPassword, {
    message: 'Both passwords should be the same!',
    path: ['confirm_password'],
  });

export const createAccount = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 4);
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    // log the user in
    // const session = await getIronSession(cookies(), {
    //   cookieName: 'delicious-karrot',
    //   password: process.env.COOKIE_PASSWORD!,
    // });

    const session = await getIronSession(await cookies(), {
      cookieName: 'delicious-karrot',
      password: process.env.COOKIE_PASSWORD!,
    });
    // @ts-ignore
    session.id = user.id;
    await session.save();
    redirect('/profile');
  }
};
