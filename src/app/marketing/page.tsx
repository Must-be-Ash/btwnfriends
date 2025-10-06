import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#222222]">
      {/* Main Content with glassmorphism container - matching MainPage.tsx */}
      <div className="px-4 pt-10 pb-6">
        <div className="max-w-md mx-auto md:backdrop-blur-xl md:bg-[#4A4A4A]/30 md:border md:border-white/20 md:rounded-3xl md:p-6 md:shadow-2xl space-y-6">
          
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image 
                src="/btw-logo.png" 
                alt="Between Friends Logo" 
                width={80} 
                height={80}
                className="rounded-2xl"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Between Friends</h1>
            <p className="text-gray-300">Send stablecoins to your friend'sçç email</p>
          </div>

          {/* Key Features - Minimal Cards */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-800/60 via-gray-700/40 to-gray-900/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">📧</span>
                <h3 className="text-lg font-semibold text-white">Email-Based</h3>
              </div>
              <p className="text-gray-300 text-sm">No wallet setup or seed phrases required</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/60 via-gray-700/40 to-gray-900/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">⚡</span>
                <h3 className="text-lg font-semibold text-white">Instant</h3>
              </div>
              <p className="text-gray-300 text-sm">Send USDC anywhere in the world instantly</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/60 via-gray-700/40 to-gray-900/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🔒</span>
                <h3 className="text-lg font-semibold text-white">Secure</h3>
              </div>
              <p className="text-gray-300 text-sm">Built on Coinbase Developer Platform</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link 
              href="https://www.btwnfriends.com" 
              className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg text-center font-semibold hover:bg-primary-700 transition-colors block"
            >
              Try Web App
            </Link>
            <Link 
              href="/privacy-policy" 
              className="w-full bg-gray-100 text-gray-900 px-6 py-4 rounded-lg text-center font-semibold hover:bg-gray-200 transition-colors block"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Footer Info */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-400">
              Built with Coinbase Developer Platform
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Powered by Base Network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
