import { useState } from 'react';
import { useWorkouts } from '@/lib/hooks/useWorkouts';
import { WorkoutCard } from '@/components/history/WorkoutCard';
import { FilterBar } from '@/components/history/FilterBar';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';

export const WorkoutHistory = () => {
  const { workouts, loading, error, deleteWorkout } = useWorkouts(100);
  const [filterType, setFilterType] = useState<'A' | 'B' | 'all'>('all');
  const [searchDate, setSearchDate] = useState('');

  const filteredWorkouts = workouts.filter((workout) => {
    const matchesType = filterType === 'all' || workout.workout_type === filterType;
    const matchesDate = !searchDate || workout.date.includes(searchDate);
    return matchesType && matchesDate;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-[#202124] dark:text-[#E6EDF3]">Loading workout history...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-600 dark:text-red-400 mb-4">Error loading workouts</div>
          <p className="text-[#5F6368] dark:text-[#8B949E]">{error.message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#E6EDF3]">Workout History</h1>
          </div>
          <Link
            to="/workout"
            className="px-4 py-2 bg-[#20808D] dark:bg-[#1FB8CD] text-white rounded-lg hover:bg-[#1A6B76] dark:hover:bg-[#2DD4E8] text-center"
          >
            Log Workout
          </Link>
        </div>

        <FilterBar
          filterType={filterType}
          searchDate={searchDate}
          onFilterTypeChange={setFilterType}
          onSearchDateChange={setSearchDate}
        />

        <div className="text-sm text-[#5F6368] dark:text-[#8B949E] mt-4">
          Showing {filteredWorkouts.length} of {workouts.length} workouts
        </div>
      </div>

      {filteredWorkouts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#5F6368] dark:text-[#8B949E] mb-4">
            {workouts.length === 0
              ? 'No workouts logged yet'
              : 'No workouts match your filters'}
          </p>
          {workouts.length === 0 && (
            <Link
              to="/workout"
              className="inline-block px-6 py-3 bg-[#20808D] dark:bg-[#1FB8CD] text-white rounded-lg hover:bg-[#1A6B76] dark:hover:bg-[#2DD4E8]"
            >
              Log Your First Workout
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onDelete={() => deleteWorkout(workout.id)}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};
