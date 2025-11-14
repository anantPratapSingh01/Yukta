'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating decorative blobs */}
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-indigo-100 opacity-30 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-cyan-100 opacity-30 blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header - Branded */}
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 py-6 px-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiMessageSquare className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome to Yukta</h1>
            <p className="text-indigo-100 mt-1">Real-time chat, zero friction</p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            <p className="text-center text-gray-600">
              Join conversations with email-only login — no passwords, no hassle.
            </p>

            <Link href="/login" passHref>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-md transition-all"
              >
                Sign In
              </motion.button>
            </Link>

            <div className="relative flex items-center justify-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-sm font-medium">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Link href="/register" passHref>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-white border-2 border-indigo-500 text-indigo-600 font-semibold rounded-xl transition hover:bg-indigo-50 hover:border-indigo-600"
              >
                Create Account
              </motion.button>
            </Link>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 text-center text-sm text-gray-500 border-t border-gray-100">
            🔒 Secure • ⚡ Instant • 📧 Email-only auth
          </div>
        </div>
      </motion.div>

      {/* Yukta tagline at bottom */}
      <div className="absolute bottom-6 text-center text-gray-500 text-sm">
        Yukta • Chat like it’s 2025
      </div>
    </div>
  );
}