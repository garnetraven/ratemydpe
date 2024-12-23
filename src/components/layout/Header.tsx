'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import AuthModal from '../auth/AuthModal';
import ProfileDropdown from '../ui/ProfileDropdown';
import Logo from '../ui/Logo';

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />

        <div className="flex items-center space-x-4">
          <Link 
            href="/search" 
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
          >
            Find DPE
          </Link>
          <Link 
            href="/review" 
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
          >
            Write Review
          </Link>
          {isLoggedIn ? (
            <ProfileDropdown />
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialView="login"
        />
      </nav>
    </header>
  );
} 