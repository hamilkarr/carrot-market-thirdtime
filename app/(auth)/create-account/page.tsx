'use client';

import { FormInput } from '@/components/form-input';
import { FormButton } from '@/components/form-btn';
import { SocialLogin } from '@/components/social-login';
import { createAccount } from './action';
import { useActionState } from 'react';
import {
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '@/lib/constants';

const CreateAccount = () => {
  const [state, dispatch] = useActionState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <FormInput
          name="username"
          type="text"
          placeholder="Username"
          required={true}
          errors={state?.fieldErrors.username}
          minLength={USERNAME_MIN_LENGTH}
          maxLength={USERNAME_MAX_LENGTH}
        />
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required={true}
          errors={state?.fieldErrors.email}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required={true}
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <FormInput
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          required={true}
          errors={state?.fieldErrors.confirm_password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <FormButton text="Create Account" />
      </form>
      <SocialLogin />
    </div>
  );
};

export default CreateAccount;
