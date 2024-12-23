import PageLayout from '@/components/ui/PageLayout';

export default function ReviewPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Write a Review
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Share your checkride experience and help other pilots make informed decisions.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 max-w-2xl mx-auto">
        {/* DPE Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select DPE
          </label>
          <input
            type="text"
            placeholder="Search for a DPE..."
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className="text-2xl text-gray-400 hover:text-yellow-400"
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Review
          </label>
          <textarea
            rows={6}
            placeholder="Share details about your checkride experience..."
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Review
        </button>
      </div>
    </PageLayout>
  );
} 