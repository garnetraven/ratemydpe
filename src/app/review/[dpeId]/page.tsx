'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PageLayout from '@/components/ui/PageLayout';

interface DPE {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
}

const TAGS = [
  'Professional',
  'Well Prepared',
  'By The Book',
  'Thorough',
  'Clear Instructions',
  'Fair',
  'Patient',
  'Knowledgeable',
  'Strict',
  'Helpful',
  'Experienced',
  'Calm',
  'Efficient',
  'Organized',
  'Punctual',
  'Flexible',
  'Detailed',
  'Straightforward',
  'Encouraging',
  'Safety Focused'
];

export default function WriteReviewPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [dpe, setDpe] = useState<DPE | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    overallRating: 0,
    difficultyRating: 0,
    wouldRecommend: null as boolean | null,
    checkridePassed: null as boolean | null,
    groundFirst: null as boolean | null,
    tags: [] as string[],
    content: '',
    checkrideType: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchDPE = async () => {
      try {
        const response = await fetch(`/api/dpe/${params.dpeId}`);
        if (!response.ok) throw new Error('Failed to fetch DPE');
        const data = await response.json();
        setDpe(data);
      } catch (error) {
        console.error('Error fetching DPE:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDPE();
  }, [params.dpeId]);

  const handleTagClick = (tag: string) => {
    setFormData(prev => {
      if (prev.tags.includes(tag)) {
        return { ...prev, tags: prev.tags.filter(t => t !== tag) };
      }
      if (prev.tags.length >= 3) {
        return prev;
      }
      return { ...prev, tags: [...prev.tags, tag] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.overallRating === 0) {
      setError('Please provide an overall rating');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dpeId: params.dpeId,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      router.push(`/dpe/${params.dpeId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <PageLayout><div className="text-center">Loading...</div></PageLayout>;
  if (!dpe) return <PageLayout><div className="text-center">DPE not found</div></PageLayout>;

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Rate {dpe.firstName} {dpe.lastName}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Overall Rating*
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, overallRating: rating }))}
                  className={`text-2xl ${
                    formData.overallRating >= rating ? 'text-yellow-400' : 'text-gray-400'
                  } hover:text-yellow-400 transition-colors`}
                >
                  ★
                </button>
              ))}
              <span className="text-sm text-gray-500 ml-2">
                (1 - Poor, 5 - Excellent)
              </span>
            </div>
          </div>

          {/* Difficulty Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              How difficult was this checkride?*
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, difficultyRating: rating }))}
                  className={`text-2xl ${
                    formData.difficultyRating >= rating ? 'text-blue-500' : 'text-gray-400'
                  } hover:text-blue-500 transition-colors`}
                >
                  ●
                </button>
              ))}
              <span className="text-sm text-gray-500 ml-2">
                (1 - Very Easy, 5 - Very Difficult)
              </span>
            </div>
          </div>

          {/* Yes/No Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Would you recommend this DPE?*
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: true }))}
                  className={`px-4 py-2 rounded-lg ${
                    formData.wouldRecommend === true
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: false }))}
                  className={`px-4 py-2 rounded-lg ${
                    formData.wouldRecommend === false
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Did you pass the checkride?*
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, checkridePassed: true }))}
                  className={`px-4 py-2 rounded-lg ${
                    formData.checkridePassed === true
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, checkridePassed: false }))}
                  className={`px-4 py-2 rounded-lg ${
                    formData.checkridePassed === false
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select up to 3 tags that describe this DPE
            </label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.tags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Review Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Write your review*
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Share your checkride experience and provide helpful feedback for other pilots.
              Please keep it professional and constructive.
            </p>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
              rows={6}
              maxLength={2000}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {2000 - formData.content.length} characters remaining
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
} 