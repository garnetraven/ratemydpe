'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import PageLayout from '@/components/ui/PageLayout';
import AviationIcons from '@/components/ui/AviationIcons';
import Link from 'next/link';
import SignInPromptModal from '@/components/ui/SignInPromptModal';

interface DPE {
  id: string;
  firstName: string;
  lastName: string;
  region: string;
  city: string;
  state: string;
  checkrideTypes: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  savedByUsers: any[];
  savedByUserIds: string[];
  reviews: Array<{
    id: string;
    overallRating: number;
    difficultyRating: number;
    content: string;
    createdAt: string;
    userId: string;
    wouldRecommend: boolean;
    checkridePassed: boolean;
    groundFirst: boolean;
    checkrideType: string;
    tags: string[];
  }>;
}

const ITEMS_PER_PAGE = 10;

export default function SearchPage() {
  const { data: session } = useSession();
  const [dpes, setDpes] = useState<DPE[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    name: '',
    state: '',
  });
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [savingStates, setSavingStates] = useState<{ [key: string]: boolean }>({});

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchParams.name) {
        params.append('name', searchParams.name.trim());
      }
      if (searchParams.state) {
        params.append('state', searchParams.state);
      }

      const response = await fetch(`/api/dpe?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch DPEs');
      }
      
      if (!Array.isArray(data)) {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format');
      }

      setDpes(data);
    } catch (error) {
      console.error('Error fetching DPEs:', error);
      setDpes([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleSearch();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const calculateAverageRating = (reviews: DPE['reviews']) => {
    if (!reviews.length) return 'N/A';
    const average = reviews.reduce((acc, review) => acc + review.overallRating, 0) / reviews.length;
    return average.toFixed(1);
  };

  const calculateAverageDifficulty = (reviews: DPE['reviews']) => {
    const reviewsWithDifficulty = reviews.filter(review => review.difficultyRating);
    if (!reviewsWithDifficulty.length) return 'N/A';
    const average = reviewsWithDifficulty.reduce((acc, review) => acc + (review.difficultyRating || 0), 0) / reviewsWithDifficulty.length;
    return average.toFixed(1);
  };

  const calculatePassRate = (reviews: DPE['reviews']) => {
    const reviewsWithPassStatus = reviews.filter(review => review.checkridePassed !== null);
    if (!reviewsWithPassStatus.length) return 'No data';
    const passCount = reviewsWithPassStatus.filter(review => review.checkridePassed).length;
    const percentage = (passCount / reviewsWithPassStatus.length) * 100;
    return `${percentage.toFixed(0)}%`;
  };

  const calculateRecommendRate = (reviews: DPE['reviews']) => {
    const reviewsWithRecommendation = reviews.filter(review => review.wouldRecommend !== null);
    if (!reviewsWithRecommendation.length) return 'N/A';
    const recommendCount = reviewsWithRecommendation.filter(review => review.wouldRecommend).length;
    const percentage = (recommendCount / reviewsWithRecommendation.length) * 100;
    return `${percentage.toFixed(0)}%`;
  };

  const totalPages = Math.ceil(dpes.length / ITEMS_PER_PAGE);
  const paginatedDPEs = dpes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRatingColor = (rating: string) => {
    if (rating === 'N/A') return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    const score = parseFloat(rating);
    if (score >= 4.0) return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
    if (score >= 3.0) return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
    return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
  };

  const handleSaveDPE = async (dpeId: string) => {
    if (!session?.user) {
      setShowSignInPrompt(true);
      return;
    }

    setSavingStates(prev => ({ ...prev, [dpeId]: true }));
    try {
      const response = await fetch('/api/dpe/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dpeId }),
      });

      if (!response.ok) throw new Error('Failed to save DPE');
      
      const { saved } = await response.json();
      
      setDpes(prev => prev.map(dpe => {
        if (dpe.id === dpeId) {
          return {
            ...dpe,
            savedByUserIds: saved 
              ? [...dpe.savedByUserIds, session.user!.id]
              : dpe.savedByUserIds.filter(id => id !== session.user!.id)
          };
        }
        return dpe;
      }));
    } catch (error) {
      console.error('Error saving DPE:', error);
    } finally {
      setSavingStates(prev => ({ ...prev, [dpeId]: false }));
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-block text-blue-600 mb-6">
          <AviationIcons.Compass className="w-16 h-16 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Find a DPE
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Search for Designated Pilot Examiners in your area and read reviews from other pilots.
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchParams.name}
            onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
          />
          <div className="flex gap-4">
            <select 
              value={searchParams.state}
              onChange={(e) => setSearchParams(prev => ({ ...prev, state: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
            >
              <option value="">Select State</option>
              {[
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
              ].map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4 mb-8">
        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
        ) : paginatedDPEs.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-300">No DPEs found</div>
        ) : (
          <>
            {paginatedDPEs.map((dpe) => {
              const rating = calculateAverageRating(dpe.reviews);
              
              return (
                <div key={dpe.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-6">
                    {/* Quality Score Box */}
                    <div className={`w-20 h-20 ${getRatingColor(rating)} rounded-lg flex items-center justify-center`}>
                      <span className="font-bold text-3xl">
                        {rating}
                      </span>
                    </div>

                    {/* DPE Information */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            <Link href={`/dpe/${dpe.id}`} className="hover:text-blue-600 transition-colors">
                              {`${dpe.firstName} ${dpe.lastName}`}
                            </Link>
                          </h3>
                          <div className="text-gray-600 dark:text-gray-300 mb-2">
                            {dpe.city}, {dpe.state}
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20">
                              <span className="font-semibold text-blue-700 dark:text-blue-400">{calculateRecommendRate(dpe.reviews)}</span>
                              <span className="text-blue-600 dark:text-blue-300 ml-1">would recommend</span>
                            </div>
                            <div className="flex items-center px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20">
                              <span className="font-semibold text-blue-700 dark:text-blue-400">{calculateAverageDifficulty(dpe.reviews)}</span>
                              <span className="text-blue-600 dark:text-blue-300 ml-1">level of difficulty</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleSaveDPE(dpe.id)}
                          disabled={savingStates[dpe.id]}
                          className={`text-gray-400 hover:text-yellow-400 transition-colors ${
                            session?.user && dpe.savedByUserIds.includes(session.user.id) 
                              ? 'text-yellow-400' 
                              : ''
                          }`}
                        >
                          <span className="sr-only">Save DPE</span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-6 w-6 ${savingStates[dpe.id] ? 'animate-pulse' : ''}`} 
                            fill={session?.user && dpe.savedByUserIds.includes(session.user.id) ? 'currentColor' : 'none'} 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {dpe.checkrideTypes.map((type) => (
                          <span
                            key={type}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add DPE Section */}
      <div className="text-center bg-blue-50 dark:bg-gray-800 p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Don't see the DPE you're looking for?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Help the community by adding a new DPE profile.
        </p>
        <Link
          href="/dpe/add"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Add a DPE
        </Link>
      </div>

      {showSignInPrompt && (
        <SignInPromptModal
          onClose={() => setShowSignInPrompt(false)}
          message="Sign in to save DPEs to your profile"
        />
      )}
    </PageLayout>
  );
} 