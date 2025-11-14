'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiCheck, FiLoader, FiArrowLeft } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userExistRes = await fetch(`/api/findOne-user?email=${encodeURIComponent(email)}`);
      
      if (!userExistRes.ok) {
        setError('No account found. Please register first.');
        return;
      }

      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send verification code');
        return;
      }

      setIsCodeSent(true);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        setError('Invalid or expired code');
        return;
      }

      setIsVerified(true);
      setTimeout(() => router.push('/chats'), 1000);
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      {/* Subtle floating backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-cyan-100 opacity-30 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {isCodeSent && !isVerified && (
          <button
            onClick={() => {
              setIsCodeSent(false);
              setError('');
            }}
            className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to email
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Top branded bar */}
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 p-5 text-center">
            <h1 className="text-xl font-bold text-white">Sign in to Yukta</h1>
            <p className="text-indigo-100 text-sm mt-1">
              {isVerified
                ? 'Redirecting to your chats...'
                : isCodeSent
                ? 'Enter your 6-digit code'
                : 'We’ll send you a login code'}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center"
              >
                <span>⚠️</span> <span className="ml-2">{error}</span>
              </motion.div>
            )}

            {!isCodeSent ? (
              // Step 1: Email Input
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FiMail className="mr-2 text-indigo-500" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border text-black border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50 transition"
                    placeholder="you@domain.com"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendCode}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-medium text-white flex items-center justify-center transition-all ${
                    loading
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" /> Sending code...
                    </>
                  ) : (
                    'Send Login Code'
                  )}
                </motion.button>
              </div>
            ) : !isVerified ? (
              // Step 2: Code Input
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 text-black py-4 text-2xl font-mono text-center border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 bg-gray-50 tracking-widest"
                    placeholder="••••••"
                    maxLength={6}
                    inputMode="numeric"
                  />
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Sent to <span className="font-medium text-indigo-600">{email}</span>
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleVerifyCode}
                  disabled={isVerifying || code.length !== 6}
                  className={`w-full py-3 px-4 rounded-xl font-medium text-white flex items-center justify-center transition-all ${
                    code.length === 6 && !isVerifying
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 shadow-md hover:shadow-lg'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <FiLoader className="animate-spin mr-2" /> Verifying...
                    </>
                  ) : (
                    'Verify & Sign In'
                  )}
                </motion.button>
              </div>
            ) : (
              // Step 3: Success
              <div className="text-center py-4 animate-fadeIn">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4"
                >
                  <FiCheck className="text-green-600 text-2xl" />
                </motion.div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Welcome back!</h2>
                <p className="text-gray-600">Redirecting to your chats...</p>
              </div>
            )}
          </div>
        </motion.div>

        <p className="text-center text-gray-500 text-xs mt-4">
          Yukta • Real-time chat for teams that move fast
        </p>
      </div>
    </div>
  );
}