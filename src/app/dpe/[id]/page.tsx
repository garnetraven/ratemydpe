'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PageLayout from '@/components/ui/PageLayout';
import AviationIcons from '@/components/ui/AviationIcons';
import SignInPromptModal from '@/components/ui/SignInPromptModal';
import Link from 'next/link';

interface DPE {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  region: string;
  checkrideTypes: string[];
  tags: string[];
  createdAt: string;
  reviews: Array<{
    id: string;
    overallRating: number;
    difficultyRating?: number;
    content: string;
    createdAt: string;
    checkrideType?: string;
    checkridePassed?: boolean;
    wouldRecommend?: boolean;
    tags: string[];
    user: {
      name: string;
    };
  }>;
  savedByUserIds: string[];
}

export default function DPEProfilePage() {
  const params = useParams();
  const { data: session } = useSession();
  const [dpe, setDpe] = useState<DPE | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingState, setSavingState] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    const fetchDPE = async () => {
      try {
        const response = await fetch(`/api/dpe/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch DPE');
        const data = await response.json();
        setDpe(data);
        if (session?.user?.id) {
          setIsSaved(data.savedByUserIds?.includes(session.user.id));
        }
      } catch (error) {
        console.error('Error fetching DPE:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDPE();
  }, [params.id, session?.user?.id]);

  const handleSaveToggle = async () => {
    if (!session?.user) {
      setShowSignInPrompt(true);
      return;
    }

    setSavingState(true);
    try {
      const response = await fetch('/api/dpe/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dpeId: params.id }),
      });

      if (!response.ok) throw new Error('Failed to save DPE');
      
      const data = await response.json();
      setIsSaved(data.saved);
    } catch (error) {
      console.error('Error saving DPE:', error);
    } finally {
      setSavingState(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  }

  if (!dpe) {
    return (
      <PageLayout>
        <div className="text-center">DPE not found</div>
      </PageLayout>
    );
  }

  const calculateAverageRating = () => {
    if (!dpe.reviews.length) return 'No ratings';
    const average = dpe.reviews.reduce((acc, review) => acc + review.overallRating, 0) / dpe.reviews.length;
    return average.toFixed(1);
  };

  const calculateAverageDifficulty = () => {
    const reviewsWithDifficulty = dpe.reviews.filter(review => review.difficultyRating);
    if (!reviewsWithDifficulty.length) return 'No ratings';
    const average = reviewsWithDifficulty.reduce((acc, review) => acc + (review.difficultyRating || 0), 0) / reviewsWithDifficulty.length;
    return average.toFixed(1);
  };

  const calculatePassRate = () => {
    const reviewsWithPassStatus = dpe.reviews.filter(review => review.checkridePassed !== null);
    if (!reviewsWithPassStatus.length) return 'No data';
    const passCount = reviewsWithPassStatus.filter(review => review.checkridePassed).length;
    const percentage = (passCount / reviewsWithPassStatus.length) * 100;
    return `${percentage.toFixed(0)}%`;
  };

  const calculateRecommendRate = () => {
    const reviewsWithRecommendation = dpe.reviews.filter(review => review.wouldRecommend !== null);
    if (!reviewsWithRecommendation.length) return 'No data';
    const recommendCount = reviewsWithRecommendation.filter(review => review.wouldRecommend).length;
    const percentage = (recommendCount / reviewsWithRecommendation.length) * 100;
    return `${percentage.toFixed(0)}%`;
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        {/* DPE Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="text-blue-600">
              <AviationIcons.Certificate className="w-16 h-16" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {`${dpe.firstName} ${dpe.lastName}`}
                  </h1>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      Location: {dpe.city}, {dpe.state} ({dpe.region} Region)
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="text-blue-600 font-semibold text-lg">
                            {calculateAverageRating()} ★
                          </span>
                          <span className="text-sm text-gray-500">
                            ({dpe.reviews.length} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Difficulty:
                          </span>
                          <span className="text-blue-600 font-semibold text-lg">
                            {calculateAverageDifficulty()} ●
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 flex-wrap text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-400">Pass Rate:</span>
                          <span className="font-semibold text-green-600">
                            {calculatePassRate()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-400">Would Recommend:</span>
                          <span className="font-semibold text-blue-600">
                            {calculateRecommendRate()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {session?.user && (
                  <button
                    onClick={handleSaveToggle}
                    disabled={savingState}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isSaved
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {savingState ? (
                      'Saving...'
                    ) : (
                      <>
                        {isSaved ? 'Saved' : 'Save DPE'}
                        <span className={isSaved ? 'text-blue-600' : 'text-white'}>★</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DPE Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Checkride Types */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Checkride Types
            </h2>
            <div className="flex flex-wrap gap-2">
              {dpe.checkrideTypes.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Specialties & Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {dpe.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Reviews
            </h2>
            <Link
              href={`/review/${dpe.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </Link>
          </div>
          
          <div className="space-y-6">
            {dpe.reviews.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No reviews yet. Be the first to review this DPE!
              </p>
            ) : (
              dpe.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-yellow-400 text-lg mb-1">
                        {'★'.repeat(review.overallRating)}
                        {'☆'.repeat(5 - review.overallRating)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        {review.checkridePassed !== null && (
                          <span className={`font-medium ${
                            review.checkridePassed ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {review.checkridePassed ? 'Passed' : 'Did Not Pass'}
                          </span>
                        )}
                      </div>
                    </div>
                    {review.difficultyRating && (
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Difficulty: </span>
                        <span className="text-blue-600 font-medium">
                          {review.difficultyRating}/5
                        </span>
                      </div>
                    )}
                  </div>

                  {review.checkrideType && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                        {review.checkrideType}
                      </span>
                    </div>
                  )}

                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line mb-3">
                    {review.content}
                  </p>

                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {review.wouldRecommend !== null && (
                    <div className="mt-3 text-sm">
                      <span className={`font-medium ${
                        review.wouldRecommend ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {review.wouldRecommend ? 'Would recommend' : 'Would not recommend'}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <SignInPromptModal 
        isOpen={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
        message="Please sign in or create an account to save this DPE."
      />
    </PageLayout>
  );
} 