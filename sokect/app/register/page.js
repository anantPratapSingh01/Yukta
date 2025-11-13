'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'otp' | 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Step 1: Send OTP
  const handleSendCode = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const UserExist = await fetch(`/api/findOne-user?email=${email}`, {
      method: 'GET',
    });

    if (!UserExist.ok) {
      
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send code');
        return;
      }

      setStep('otp');
      setSuccess('Verification code sent to your email!');
    } else {
      setError('User already exists');
      return;
    }
  } catch (err) {
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};


  // Step 2: Verify OTP
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid or expired code');
        return;
      }

      if(res.ok){
        const UserSave=await fetch('/api/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
          console.log("Userdata",UserSave)
        const userData=await UserSave.json();
        console.log("userdata in json",useState)
          if (!UserSave.ok) {
        setError(userData.error || 'user not register');
        return;
      }
        
      }

      setStep('success');
      setSuccess('✅ Registration successful! You can now log in with your email.');
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {step === 'form' ? 'Register' : step === 'otp' ? 'Verify Email' : 'Success!'}
        </h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        {step === 'form' && (
          <form onSubmit={handleSendCode}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
                loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Sending...' : 'Try to Register'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyCode}>
            <p className="text-gray-600 mb-4">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-xl tracking-widest"
                required
                placeholder="123456"
                maxLength={6}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className={`flex-1 py-2 px-4 rounded-lg text-white font-medium ${
                  loading || otp.length !== 6
                    ? 'bg-gray-400'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-gray-700 mb-6">
              You’re all set! Now go to <strong>Login</strong> and enter your email to sign in.
            </p>
            <a
              href="/login"
              className="inline-block w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}