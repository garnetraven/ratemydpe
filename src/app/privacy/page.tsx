import PageLayout from '@/components/ui/PageLayout';

export default function PrivacyPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          How we handle and protect your information.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Information We Collect
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We collect information that you provide directly to us when you create an account,
              post reviews, or communicate with us. This may include your name, email address,
              and any other information you choose to provide.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We use the information we collect to provide and improve our services,
              communicate with you, and ensure a better user experience. This includes:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300 space-y-1">
              <li>Maintaining and improving our platform</li>
              <li>Responding to your comments and questions</li>
              <li>Sending you technical notices and updates</li>
              <li>Protecting against fraudulent or illegal activity</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Information Sharing
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We do not sell or rent your personal information to third parties.
              We may share your information in limited circumstances, such as:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300 space-y-1">
              <li>When required by law</li>
              <li>To protect our rights and property</li>
              <li>With your consent</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Data Security
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We take reasonable measures to help protect your personal information from loss, theft,
              misuse, unauthorized access, disclosure, alteration, and destruction. However, no
              security system is impenetrable and we cannot guarantee the security of our systems.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 