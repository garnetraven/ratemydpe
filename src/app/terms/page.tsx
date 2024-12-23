import PageLayout from '@/components/ui/PageLayout';

export default function TermsPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Please read these terms carefully before using our service.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              By accessing and using Rate My DPE, you accept and agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              User Responsibilities
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Users are responsible for maintaining the confidentiality of their account information
              and for all activities that occur under their account. You agree to notify us immediately
              of any unauthorized use of your account.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Content Guidelines
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Reviews must be honest, factual, and based on personal experience. Harassment, hate speech,
              and false information are not permitted. We reserve the right to remove any content that
              violates these guidelines.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Intellectual Property
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              All content and materials available on Rate My DPE are protected by applicable copyright 
              and trademark law. Users retain ownership of their content but grant us a license to use,
              store, and display their content.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 