import { useState } from 'react';
import { useWorkouts } from '@/lib/hooks/useWorkouts';
import { WorkoutCard } from '@/components/history/WorkoutCard';
import { FilterBar } from '@/components/history/FilterBar';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading workout history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 mb-4">Error loading workouts</div>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Workout History</h1>
          <Link
            to="/workout"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

        <div className="text-sm text-gray-600 mt-4">
          Showing {filteredWorkouts.length} of {workouts.length} workouts
        </div>
      </div>

      {filteredWorkouts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            {workouts.length === 0
              ? 'No workouts logged yet'
              : 'No workouts match your filters'}
          </p>
          {workouts.length === 0 && (
            <Link
              to="/workout"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
    </div>
  );
};
