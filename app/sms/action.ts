'use server';

import { z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, 'ko-KR'), {
    message: 'Invalid phone number',
  });

const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  token: boolean;
}

export const smsLogin = async (prevState: ActionState, data: FormData) => {
  const phone = data.get('phone');
  const token = data.get('token');

  if (prevState.token === false) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return { token: false, error: result.error.flatten() };
    } else {
      return { token: true };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return { token: true, error: result.error.flatten() };
      // return error plus
    } else {
      // login
      redirect('/');
    }
  }
};
