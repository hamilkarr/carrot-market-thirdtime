'use server';

import { z } from 'zod';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REQUIRED_ERROR,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';

const formSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z
    .string({
      required_error: PASSWORD_REQUIRED_ERROR,
    })
    .min(PASSWORD_MIN_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

const login = async (prevState: any, data: FormData) => {
  console.log('I run in the server');
  const result = formSchema.safeParse({
    email: data.get('email'),
    password: data.get('password'),
  });
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
};

export default login;
