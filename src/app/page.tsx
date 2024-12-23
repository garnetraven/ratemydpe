'use client';

import { useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';
import Image from "next/image";
import Link from "next/link";
import AviationIcons from '@/components/ui/AviationIcons';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 relative pt-32">
          {/* Airplane Image */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 -top-4 w-32 h-32 opacity-80 dark:opacity-60"
          >
            <Image
              src="/airplane.png"
              alt="Airplane"
              width={128}
              height={128}
              className="object-contain dark:invert"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Find Your Next DPE
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Find and review Designated Pilot Examiners. Help other pilots make informed decisions.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/search"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Find a DPE
            </Link>
            <Link
              href="/review"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Write a Review
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-blue-600 mb-4">
              <AviationIcons.Certificate className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Read Reviews</h3>
            <p className="text-gray-600 dark:text-gray-300">Access honest reviews from fellow pilots about their checkride experiences.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-blue-600 mb-4">
              <AviationIcons.Checklist className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Share Experience</h3>
            <p className="text-gray-600 dark:text-gray-300">Help others by sharing your own checkride experience and rating.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="text-blue-600 mb-4">
              <AviationIcons.Compass className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Find DPEs</h3>
            <p className="text-gray-600 dark:text-gray-300">Easily search and find DPEs in your area with detailed profiles.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-50 dark:bg-gray-800 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to find your DPE?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join our community of pilots helping pilots.
          </p>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsAuthModalOpen(true);
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </main>
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="signup"
      />
    </div>
  );
}
