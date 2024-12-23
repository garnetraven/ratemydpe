import PageLayout from '@/components/ui/PageLayout';

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Rate My DPE
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Connecting pilots with the right DPE for their checkride.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Rate My DPE was created to help student pilots and certificated pilots make informed decisions 
            about choosing a Designated Pilot Examiner (DPE) for their checkrides. We believe in 
            transparency and community-driven insights to improve the checkride experience for everyone.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">What We Do</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We provide a platform where pilots can share their experiences with DPEs, helping others 
            understand what to expect and how to prepare for their checkrides. Our community-driven 
            approach ensures authentic, helpful feedback for both pilots and examiners.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">For Pilots</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Find detailed reviews and ratings from fellow pilots, search for DPEs in your area,
            and make an informed decision about your checkride examiner. Share your own experiences
            to help other pilots in their journey.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">For DPEs</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Claim and manage your profile, interact with the pilot community, and maintain
            transparency in the examination process. Build your reputation through authentic
            reviews and feedback.
          </p>
        </div>
      </div>
    </PageLayout>
  );
} 