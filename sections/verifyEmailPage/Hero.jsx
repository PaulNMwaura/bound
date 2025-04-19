'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Hero = () => {
  const [status, setStatus] = useState('idle' | 'loading' | 'success' | 'error');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleResend = async () => {
    if (!email) return setMessage('Please enter your email');

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/validation/verify-email/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      } else {
        setStatus('success');
        setMessage(data.message);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-2 md:px-0">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p className="text-gray-600">
          We've sent a verification link to your email. Didn't get it?
        </p>

        <input
          type="email"
          placeholder="Enter your email again"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-4 py-2"
        />

        <button
          onClick={handleResend}
          className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white px-4 py-2 rounded w-full"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Resend Verification Email'}
        </button>

        <button className="btn btn-primary-alt cursor-pointer" onClick={() => router.replace("/login")}>
          login
        </button>

        {message && <p className={`text-sm ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
      </div>
    </div>
  );
}
