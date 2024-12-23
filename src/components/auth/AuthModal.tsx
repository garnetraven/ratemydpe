import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup' | 'dpe';
}

export default function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup' | 'dpe'>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    onClose();
    setView(initialView);
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (view === 'signup') {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to sign up');
        }

        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        handleClose();
        router.refresh();
      } else if (view === 'login') {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        
        if (result?.error) {
          throw new Error(result.error);
        }

        handleClose();
        router.refresh();
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl max-w-md w-full">
        {view === 'dpe' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                DPE Sign Up
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                  Search for your DPE profile
                </h3>
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                />
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Can&apos;t find your profile?
                </p>
                <Link
                  href="/dpe/add"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={handleClose}
                >
                  Create one here
                </Link>
              </div>

              <div className="border-t pt-4 text-center">
                <button
                  onClick={() => setView('login')}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                {view === 'signup' ? 'Create Account' : 'Sign In'}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {view === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : (view === 'signup' ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => signIn('google')}
                className="bg-white text-gray-700 border-2 border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <img src="/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-black dark:text-gray-400">
              {view === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setView(view === 'signup' ? 'login' : 'signup')}
                className="text-blue-600 hover:underline"
              >
                {view === 'signup' ? 'Sign In' : 'Sign Up'}
              </button>
            </div>

            {view === 'signup' && (
              <div className="mt-4 text-center text-sm">
                <span className="text-black dark:text-gray-400">Are you a DPE? </span>
                <button
                  onClick={() => setView('dpe')}
                  className="text-blue-600 hover:underline"
                >
                  Sign up here
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 