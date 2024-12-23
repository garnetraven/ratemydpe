import PageLayout from '@/components/ui/PageLayout';

export default function FAQPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Find answers to common questions about Rate My DPE.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            How do I find a DPE in my area?
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Use our search feature to find DPEs by location, rating type, or name.
            You can filter results based on your specific needs and read reviews from other pilots.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            How do I write a review?
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to your account, find the DPE's profile, and click on "Write a Review."
            Share your experience and provide helpful feedback for other pilots. Make sure to follow
            our community guidelines when writing your review.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            I'm a DPE. How do I claim my profile?
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Click on "Sign Up" and select "Are you a DPE?" to search for your profile.
            If you can't find it, you can create a new one. You'll need to verify your credentials
            during the process.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Are the reviews moderated?
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Yes, all reviews are moderated to ensure they follow our community guidelines.
            We focus on maintaining a helpful and respectful environment for both pilots and DPEs.
          </p>
        </div>
      </div>
    </PageLayout>
  );
} 