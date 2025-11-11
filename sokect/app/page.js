'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEnvelope, FaCheck, FaSpinner } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Send verification code
  const handleSendCode = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a Valid Email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send code');
        return;
      }

      setIsCodeSent(true);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify code and redirect
  const handleVerifyCode = async () => {
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError('Enter the Correct Code');
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

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid or expired code');
        return;
      }

      setIsVerified(true);

      // ✅ Auto-redirect to /chats after successful verification
      setTimeout(() => {
        router.push('/chats');
      }, 1000);
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
      >
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <FaEnvelope className="text-green-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Login Through Your Email</h1>
          <p className="text-gray-500 mt-1">
            {isVerified
              ? 'Redirecting to your chats...'
              : 'Ek verification code aapke email pe bheja jayega'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {!isCodeSent ? (
          // Step 1: Enter Email
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                placeholder="apka.email@example.com"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendCode}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center ${
                loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Sending...
                </>
              ) : (
                'Send Verification Code'
              )}
            </motion.button>
          </div>
        ) : !isVerified ? (
          // Step 2: Enter Code
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-center text-xl tracking-widest font-mono"
                placeholder="______"
                maxLength={6}
              />
              <p className="text-gray-500 text-xs mt-1">
                Code {email} pe bheja gaya hai
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerifyCode}
              disabled={isVerifying}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center ${
                isVerifying ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isVerifying ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </motion.button>
          </div>
        ) : (
          // Step 3: Success & Auto-redirect (NO BUTTON NEEDED)
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4"
            >
              <FaCheck className="text-green-600 text-2xl" />
            </motion.div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">✅ Verified!</h2>
            <p className="text-gray-600">Redirecting to your chats...</p>
          </div>
        )}

        <div className="mt-6 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} Tera App. Sabhi adhikar surakshit.
        </div>
      </motion.div>
    </div>
  );
}