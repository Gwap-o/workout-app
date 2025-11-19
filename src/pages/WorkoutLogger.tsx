import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/supabase/userProfile';
import { WorkoutForm } from '@/components/workout/WorkoutForm';
import { Layout } from '@/components/layout/Layout';
import { TrainingMethodLegend } from '@/components/workout/TrainingMethodBadge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import type { UserProfile } from '@/types';

export const WorkoutLogger = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSetGuide, setShowSetGuide] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-[#202124] dark:text-[#E6EDF3]">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
          <h2 className="text-2xl font-bold mb-4 text-[#202124] dark:text-[#E6EDF3]">Profile Not Found</h2>
          <p className="text-[#5F6368] dark:text-[#8B949E] mb-4">
            Please create your profile before logging workouts.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 bg-[#20808D] dark:bg-[#1FB8CD] text-white rounded hover:bg-[#1A6B76] dark:hover:bg-[#2DD4E8]"
          >
            Go to Settings
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        {/* Header with title and action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#E6EDF3]">Log Workout</h1>
            <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#8B949E] mt-1">
              Phase {profile.current_phase} - Week {profile.current_week}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Set Guide Button - Primary style like Log Workout */}
            <Button
              onClick={() => setShowSetGuide(!showSetGuide)}
              variant="default"
              size="sm"
              className="gap-1.5 sm:gap-2 flex-shrink-0 h-9 sm:h-10"
            >
              <span className="hidden sm:inline whitespace-nowrap">Set Guide</span>
              <span className="sm:hidden whitespace-nowrap">Guide</span>
            </Button>

            {/* Edit Phase Button - Outline style like Edit Profile */}
            <Button
              onClick={() => navigate('/settings?section=phase')}
              variant="outline"
              size="sm"
              className="gap-1.5 sm:gap-2 flex-shrink-0 h-9 sm:h-10"
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Edit Phase</span>
            </Button>
          </div>
        </div>

        {/* Training Method Legend (collapsible) */}
        {showSetGuide && (
          <div className="mt-4">
            <TrainingMethodLegend />
          </div>
        )}
      </div>

      <WorkoutForm profile={profile} />
    </Layout>
  );
};
