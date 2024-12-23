import PageLayout from '@/components/ui/PageLayout';

export default function GuidelinesPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Community Guidelines
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Help us maintain a helpful and respectful community.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Review Guidelines</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-8">
            <li>Write from personal experience only</li>
            <li>Be honest and objective</li>
            <li>Focus on the checkride experience</li>
            <li>Avoid personal attacks or unprofessional language</li>
            <li>Do not share confidential or private information</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">DPE Profile Guidelines</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-8">
            <li>Provide accurate and up-to-date information</li>
            <li>Include relevant certifications and qualifications</li>
            <li>Maintain professional conduct in responses</li>
            <li>Respect privacy of all parties involved</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Content Moderation</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            We reserve the right to remove content that:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>Contains harassment or hate speech</li>
            <li>Includes false or misleading information</li>
            <li>Violates privacy or confidentiality</li>
            <li>Is spam or promotional in nature</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
} 