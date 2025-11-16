import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/supabase/userProfile';
import { WorkoutForm } from '@/components/workout/WorkoutForm';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <p className="text-gray-600 mb-4">
          Please create your profile before logging workouts.
        </p>
        <button
          onClick={() => navigate('/settings')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Settings
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Log Workout</h1>
        <p className="text-gray-600">
          Phase {profile.current_phase} - Week {profile.current_week}
        </p>
      </div>

      <WorkoutForm profile={profile} />
    </div>
  );
};
