'use client';

import { FormInput } from '@/components/form-input';
import { FormButton } from '@/components/form-btn';
import { SocialLogin } from '@/components/social-login';
import { useActionState } from 'react';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';
import loginAction from './action';

const Login = () => {
  const [state, dispatch] = useActionState(loginAction, null);
  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with your email and password.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
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
        <FormButton text="Log in" />
      </form>
      <SocialLogin />
    </div>
  );
};

export default Login;
