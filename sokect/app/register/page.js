'use client';

import { useState, useEffect } from 'react';
import { FiArrowLeft, FiCheckCircle, FiMail, FiUser } from 'react-icons/fi'; // Lightweight icons

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'otp' | 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-focus OTP input when step changes
  useEffect(() => {
    if (step === 'otp') {
      const input = document.getElementById('otp-input');
      input?.focus();
    }
  }, [step]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userRes = await fetch(`/api/findOne-user?email=${encodeURIComponent(email)}`);
      
      if (userRes.ok) {
        setError('User already exists. Try logging in.');
        return;
      }

      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send verification code');
        return;
      }

      setStep('otp');
      setSuccess('Check your inbox — we sent a 6-digit code.');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      const verifyRes = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });

      if (!verifyRes.ok) {
        setError('Invalid or expired code');
        return;
      }

      const registerRes = await fetch('/api/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      if (!registerRes.ok) {
        setError('Registration failed. Please try again.');
        return;
      }

      setStep('success');
      setSuccess('Account created successfully!');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      {/* Decorative floating elements (subtle) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-cyan-100 opacity-30 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header / Step Indicator */}
        {step === 'otp' && (
          <button
            onClick={() => setStep('form')}
            className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to info
          </button>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Top bar – Yukta branded */}
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-5 text-center">
            <h1 className="text-xl font-bold text-white">
              {step === 'form' ? 'Join Yukta' : step === 'otp' ? 'Verify Your Email' : 'Welcome!'}
            </h1>
            <p className="text-indigo-100 text-sm mt-1">
              {step === 'form' ? 'Start chatting in seconds' : step === 'otp' ? 'Enter the code we sent you' : 'Your account is ready'}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error / Success Messages */}
            {error && (
              <div className="mb-5 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center animate-fadeIn">
                <span>⚠️</span> <span className="ml-2">{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-5 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center animate-fadeIn">
                <span>✅</span> <span className="ml-2">{success}</span>
              </div>
            )}

            {/* Form Steps */}
            {step === 'form' && (
              <form onSubmit={handleSendCode} className="space-y-5 animate-fadeIn">
                <div>
                  <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FiUser className="mr-2 text-indigo-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 text-black border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50 transition"
                    required
                    placeholder="Alex Morgan"
                  />
                </div>
                <div>
                  <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FiMail className="mr-2 text-indigo-500" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border text-black border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50 transition"
                    required
                    placeholder="you@domain.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all ${
                    loading
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? 'Sending code...' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyCode} className="animate-fadeIn">
                <p className="text-gray-600 mb-5 text-center">
                  We sent a code to <span className="font-semibold text-indigo-700">{email}</span>
                </p>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">6-Digit Code</label>
                  <input
                    id="otp-input"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-4 text-2xl text-black font-mono text-center border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 bg-gray-50 tracking-widest"
                    placeholder="••••••"
                    maxLength={6}
                    inputMode="numeric"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all ${
                    otp.length === 6 && !loading
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Verifying...' : 'Verify & Complete'}
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center animate-fadeIn py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-5">
                  <FiCheckCircle size={32} />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">You’re in!</h2>
                <p className="text-gray-600 mb-6">
                  Your Yukta account is ready. Start chatting, sharing, and connecting instantly.
                </p>
                <a
                  href="/login"
                  className="inline-block w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-cyan-600 shadow-md transition"
                >
                  Go to Login
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Yukta • Real-time chat for teams that move fast
        </p>
      </div>
    </div>
  );
}