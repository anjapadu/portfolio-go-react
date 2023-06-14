'use client';
import clsx from 'clsx';
import Button from '../Button';
import Card from '../Card';
import Input from '../Input';
import { PropsWithChildren, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { logIn } from '@/actions/auth';
import { useAuth } from '@/providers/auth';
interface LoginButtonProps extends PropsWithChildren {
  loginButtonText?: string;
}
export default function LoginButton({ children, loginButtonText = 'Log in' }: LoginButtonProps) {
  const [show, setShow] = useState(false);
  const { token } = useAuth();
  const isLogged = !!token;
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const login = async () => {
    setInvalid(false);
    setIsLoading(true);
    const response = await fetch('/api/log-in', {
      method: 'POST',
      body: JSON.stringify({
        email: email.toLocaleLowerCase(),
        password: pass,
      }),
    }).then((res) => {
      if (res.status === 401) {
        setInvalid(true);
      }
      return res.json();
    });
    if (response.token) {
      logIn(response.token);
    }
    setIsLoading(false);
  };
  if (isLogged && children) {
    return children;
  }
  return (
    <div className="flex justify-center flex-col z-10">
      <Button text={loginButtonText} className="!rounded-full" onClick={() => setShow((prev) => !prev)} />
      <div className="relative">
        <Card
          className={clsx(
            'absolute top-2 z-20 border-gray-200 border right-0 overflow-hidden transition-all',
            show ? 'scale-100' : 'scale-0'
          )}
        >
          <XMarkIcon className="w-5 h-5 absolute top-2 right-2 cursor-pointer" onClick={() => setShow(false)} />
          <form className="flex flex-col pt-10 pb-5 p-5 w-80 gap-y-5">
            <Input disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} label="Email" />
            <Input
              disabled={loading}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              label="Password"
              type="password"
            />
            <Button isLoading={loading} text="Log in" color="green" onClick={login} />
            {invalid && <span className="text-red-500 text-xs font-bold">Username or password incorrect</span>}
          </form>
        </Card>
      </div>
    </div>
  );
}
