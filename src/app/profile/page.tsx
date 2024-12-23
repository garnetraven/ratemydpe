'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PageLayout from '@/components/ui/PageLayout';
import Link from 'next/link';

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

type TabType = 'profile' | 'settings' | 'reviews' | 'saved';

interface Review {
  id: string;
  content: string;
  overallRating: number;
  difficultyRating?: number;
  checkrideType?: string;
  checkridePassed?: boolean;
  wouldRecommend?: boolean;
  groundFirst?: boolean;
  tags: string[];
  createdAt: string;
  dpe: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface UserProfile {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  certificate: string;
  homeAirport: string;
}

interface SettingsState {
  isEditingEmail: boolean;
  isEditingPassword: boolean;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SavedDPE {
  id: string;
  firstName: string;
  lastName: string;
  region: string;
  reviews: Array<{
    rating: number;
  }>;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    certificate: '',
    homeAirport: '',
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
    isEditingEmail: false,
    isEditingPassword: false,
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savedDPEs, setSavedDPEs] = useState<SavedDPE[]>([]);
  const [loadingSavedDPEs, setLoadingSavedDPEs] = useState(false);
  const [savingStates, setSavingStates] = useState<{ [key: string]: boolean }>({});
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Review> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['profile', 'settings', 'reviews', 'saved'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'reviews') {
      const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
          const response = await fetch('/api/user/reviews');
          if (!response.ok) throw new Error('Failed to fetch reviews');
          const data = await response.json();
          setReviews(data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        } finally {
          setLoadingReviews(false);
        }
      };

      fetchReviews();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'saved') {
      const fetchSavedDPEs = async () => {
        setLoadingSavedDPEs(true);
        try {
          const response = await fetch('/api/user/saved-dpes');
          if (!response.ok) throw new Error('Failed to fetch saved DPEs');
          const data = await response.json();
          setSavedDPEs(data);
        } catch (error) {
          console.error('Error fetching saved DPEs:', error);
        } finally {
          setLoadingSavedDPEs(false);
        }
      };

      fetchSavedDPEs();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/user/profile`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setUserProfile({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          city: data.city || '',
          state: data.state || '',
          certificate: data.certificate || '',
          homeAirport: data.homeAirport || '',
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [session?.user?.id]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch('/api/user/settings');
        if (!response.ok) throw new Error('Failed to fetch user settings');
        const data = await response.json();
        setSettings(prev => ({ ...prev, email: data.email }));
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    fetchUserEmail();
  }, [session?.user?.id]);

  const inputClassName = "w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black";

  const handleSaveProfile = () => {
    // TODO: Implement API call to save profile
    setIsEditing(false);
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      setIsEditing(false);
      // Optionally show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: settings.email }),
      });

      if (!response.ok) throw new Error('Failed to update email');
      
      setSettings(prev => ({ ...prev, isEditingEmail: false }));
      // Optionally show success message
    } catch (error) {
      console.error('Error updating email:', error);
      // Show error message
    }
  };

  const handleUpdatePassword = async () => {
    if (settings.newPassword !== settings.confirmPassword) {
      // Show error message
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: settings.currentPassword,
          newPassword: settings.newPassword,
        }),
      });

      if (!response.ok) throw new Error('Failed to update password');
      
      setSettings(prev => ({
        ...prev,
        isEditingPassword: false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      // Optionally show success message
    } catch (error) {
      console.error('Error updating password:', error);
      // Show error message
    }
  };

  const handleUnsave = async (dpeId: string) => {
    setSavingStates(prev => ({ ...prev, [dpeId]: true }));
    try {
      const response = await fetch('/api/dpe/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dpeId }),
      });

      if (!response.ok) throw new Error('Failed to unsave DPE');
      
      // Remove the DPE from the saved list
      setSavedDPEs(prev => prev.filter(dpe => dpe.id !== dpeId));
    } catch (error) {
      console.error('Error unsaving DPE:', error);
    } finally {
      setSavingStates(prev => ({ ...prev, [dpeId]: false }));
    }
  };

  const handleEditSubmit = async (reviewId: string) => {
    if (!editFormData) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) throw new Error('Failed to update review');

      const updatedReview = await response.json();
      
      // Update the reviews list with the edited review
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, ...updatedReview } : review
      ));
      
      setEditingReview(null);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProfileContent = () => {
    if (isEditing) {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={userProfile.firstName}
              onChange={(e) => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={userProfile.lastName}
              onChange={(e) => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City
            </label>
            <input
              type="text"
              value={userProfile.city}
              onChange={(e) => setUserProfile(prev => ({ ...prev, city: e.target.value }))}
              className={inputClassName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State
            </label>
            <select
              value={userProfile.state}
              onChange={(e) => setUserProfile(prev => ({ ...prev, state: e.target.value }))}
              className={inputClassName}
            >
              <option value="">Select State</option>
              {[
                'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
              ].map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Highest Certificate
            </label>
            <select
              value={userProfile.certificate}
              onChange={(e) => setUserProfile(prev => ({ ...prev, certificate: e.target.value }))}
              className={inputClassName}
            >
              <option value="">Select Certificate</option>
              <option value="student">Student</option>
              <option value="private">Private</option>
              <option value="commercial">Commercial</option>
              <option value="atp">ATP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Home Airport
            </label>
            <input
              type="text"
              value={userProfile.homeAirport}
              onChange={(e) => setUserProfile(prev => ({ 
                ...prev, 
                homeAirport: e.target.value.toUpperCase() 
              }))}
              maxLength={4}
              placeholder="KJFK"
              className={inputClassName}
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter your home airport's ICAO code (e.g., KJFK)
            </p>
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              onClick={handleProfileUpdate}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <p className="text-gray-900 dark:text-white">
            {userProfile.firstName} {userProfile.lastName}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <p className="text-gray-900 dark:text-white">
            {userProfile.city}, {userProfile.state}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Highest Certificate
          </label>
          <p className="text-gray-900 dark:text-white capitalize">
            {userProfile.certificate}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Home Airport
          </label>
          <p className="text-gray-900 dark:text-white">
            {userProfile.homeAirport}
          </p>
        </div>
        <div className="pt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>
    );
  };

  const renderSettingsContent = () => {
    return (
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Email Address</h4>
          {settings.isEditingEmail ? (
            <div className="space-y-4">
              <input
                type="email"
                className={inputClassName}
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
              <div className="flex space-x-4">
                <button 
                  onClick={handleUpdateEmail}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Email
                </button>
                <button 
                  onClick={() => setSettings(prev => ({ ...prev, isEditingEmail: false }))}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-900 dark:text-white">{settings.email}</p>
              <button 
                onClick={() => setSettings(prev => ({ ...prev, isEditingEmail: true }))}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Email
              </button>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Password</h4>
          {settings.isEditingPassword ? (
            <div className="space-y-4">
              <input
                type="password"
                className={inputClassName}
                value={settings.currentPassword}
                onChange={(e) => setSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Current Password"
              />
              <input
                type="password"
                className={inputClassName}
                value={settings.newPassword}
                onChange={(e) => setSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="New Password"
              />
              <input
                type="password"
                className={inputClassName}
                value={settings.confirmPassword}
                onChange={(e) => setSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm New Password"
              />
              <div className="flex space-x-4">
                <button 
                  onClick={handleUpdatePassword}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Password
                </button>
                <button 
                  onClick={() => setSettings(prev => ({ 
                    ...prev, 
                    isEditingPassword: false,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  }))}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button 
                onClick={() => setSettings(prev => ({ ...prev, isEditingPassword: true }))}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'Settings' },
    { id: 'reviews', label: 'Your Reviews' },
    { id: 'saved', label: 'Saved DPEs' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h3>
              {renderProfileContent()}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Account Settings
              </h3>
              {renderSettingsContent()}
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Reviews</h3>
              {loadingReviews ? (
                <div className="text-center py-4">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">You haven't written any reviews yet.</p>
                  <Link 
                    href="/review"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Write a Review
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {renderReviews()}
                </div>
              )}
            </div>
          </div>
        );
      case 'saved':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Saved DPEs
              </h3>
              {loadingSavedDPEs ? (
                <div className="text-center py-4">Loading saved DPEs...</div>
              ) : savedDPEs.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    You haven't saved any DPEs yet.
                  </p>
                  <Link 
                    href="/search"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Find DPEs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedDPEs.map((dpe) => (
                    <div key={dpe.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link 
                            href={`/dpe/${dpe.id}`}
                            className="font-semibold text-blue-600 hover:text-blue-700"
                          >
                            {dpe.firstName} {dpe.lastName}
                          </Link>
                          <p className="text-gray-600 dark:text-gray-300">
                            Region: {dpe.region}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-yellow-400">
                            {dpe.reviews.length > 0
                              ? (dpe.reviews.reduce((acc, r) => acc + r.overallRating, 0) / dpe.reviews.length).toFixed(1)
                              : 'No'} ★
                          </div>
                          <button
                            onClick={() => handleUnsave(dpe.id)}
                            disabled={savingStates[dpe.id]}
                            className="text-gray-400 hover:text-red-600 transition-colors text-xl"
                          >
                            {savingStates[dpe.id] ? (
                              'Removing...'
                            ) : (
                              '×'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  const renderReviews = () => (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
          {editingReview === review.id ? (
            <div className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Overall Rating*
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setEditFormData(prev => ({ ...prev, overallRating: rating }))}
                      className={`text-2xl ${
                        editFormData?.overallRating >= rating ? 'text-yellow-400' : 'text-gray-400'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setEditFormData(prev => ({ ...prev, difficultyRating: rating }))}
                      className={`text-2xl ${
                        editFormData?.difficultyRating >= rating ? 'text-blue-400' : 'text-gray-400'
                      } hover:text-blue-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkride Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Checkride Type*
                </label>
                <select
                  value={editFormData?.checkrideType || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, checkrideType: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                >
                  <option value="">Select a checkride type</option>
                  <option value="Private Pilot">Private Pilot</option>
                  <option value="Instrument">Instrument</option>
                  <option value="Commercial">Commercial</option>
                  <option value="ATP">ATP</option>
                  <option value="CFI">CFI</option>
                  <option value="CFII">CFII</option>
                  <option value="MEI">MEI</option>
                </select>
              </div>

              {/* Pass/Fail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Did you pass the checkride?*
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditFormData(prev => ({ ...prev, checkridePassed: true }))}
                    className={`px-4 py-2 rounded-lg ${
                      editFormData?.checkridePassed === true
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFormData(prev => ({ ...prev, checkridePassed: false }))}
                    className={`px-4 py-2 rounded-lg ${
                      editFormData?.checkridePassed === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Would Recommend */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Would you recommend this DPE?
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditFormData(prev => ({ ...prev, wouldRecommend: true }))}
                    className={`px-4 py-2 rounded-lg ${
                      editFormData?.wouldRecommend === true
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFormData(prev => ({ ...prev, wouldRecommend: false }))}
                    className={`px-4 py-2 rounded-lg ${
                      editFormData?.wouldRecommend === false
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review*
                </label>
                <textarea
                  value={editFormData?.content || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                  rows={6}
                  maxLength={2000}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {2000 - (editFormData?.content?.length || 0)} characters remaining
                </p>
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
                      onClick={() => {
                        if (!editFormData?.tags?.includes(tag) && editFormData?.tags?.length >= 3) return;
                        setEditFormData(prev => ({
                          ...prev,
                          tags: prev?.tags?.includes(tag)
                            ? prev.tags.filter(t => t !== tag)
                            : [...(prev?.tags || []), tag]
                        }));
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        editFormData?.tags?.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditingReview(null);
                    setEditFormData(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditSubmit(review.id)}
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link 
                    href={`/dpe/${review.dpe.id}`}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {review.dpe.firstName} {review.dpe.lastName}
                  </Link>
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
                <div className="flex items-center gap-4">
                  {review.difficultyRating && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Difficulty: </span>
                      <span className="text-blue-600 font-medium">
                        {review.difficultyRating}/5
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setEditingReview(review.id);
                      setEditFormData(review);
                    }}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <span className="sr-only">Edit review</span>
                    ✎
                  </button>
                </div>
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
                  {review.tags.map(tag => (
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
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>
        
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {renderTabContent()}
      </div>
    </PageLayout>
  );
} 
