'use client';

import { FormInput } from '@/components/form-input';
import { FormButton } from '@/components/form-btn';
import { useActionState } from 'react';
import { smsLogin } from './action';

const initialState = {
  token: false,
  error: undefined,
};

const SMSLogin = () => {
  const [state, dispatch] = useActionState(smsLogin, initialState);
  return (
    <div className="flex flex-col gap-10 py-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {state.token ? (
          <FormInput
            name="token"
            type="number"
            placeholder="Verification Code"
            required
            min={100000}
            max={999999}
          />
        ) : (
          <FormInput
            name="phone"
            type="number"
            placeholder="Phone Number"
            required
            errors={state?.error?.formErrors}
          />
        )}
        <FormButton text={state.token ? 'Verify' : 'Send SMS'} />
      </form>
    </div>
  );
};

export default SMSLogin;
