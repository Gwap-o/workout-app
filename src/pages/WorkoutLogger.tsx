import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/supabase/userProfile';
import { WorkoutForm } from '@/components/workout/WorkoutForm';
import { Layout } from '@/components/layout/Layout';
import type { UserProfile } from '@/types';

export const WorkoutLogger = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#202124] dark:text-[#E6EDF3]">Log Workout</h1>
        <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#8B949E]">
          Phase {profile.current_phase} - Week {profile.current_week}
        </p>
      </div>

      <WorkoutForm profile={profile} />
    </Layout>
  );
};
