'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-green-600 py-6 px-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">💬</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back!</h1>
          <p className="text-green-100 mt-1">Sign in to continue your conversations</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-center text-gray-600">
            Join or access your secure messaging space
          </p>

          <Link href="/login" passHref>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition shadow-md"
            >
              Login with Email
            </motion.button>
          </Link>

          <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <Link href="/register" passHref>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-white border-2 border-green-600 text-green-600 font-semibold rounded-xl transition hover:bg-green-50"
            >
              Create New Account
            </motion.button>
          </Link>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 text-center text-sm text-gray-500 border-t border-gray-200">
          Secure • Fast • No Password Needed
        </div>
      </motion.div>

      {/* Decorative Dots (Optional) */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-green-500 rounded-full opacity-30"></div>
      <div className="absolute bottom-20 right-16 w-3 h-3 bg-green-400 rounded-full opacity-20"></div>
    </div>
  );
}