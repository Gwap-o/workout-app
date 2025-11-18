import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile, ExerciseLog, SetLog } from '@/types';
import { getWorkoutExercises } from '@/lib/constants/exercises';
import { createWorkoutSession } from '@/lib/supabase/workouts';
import { createExerciseLogs } from '@/lib/supabase/exercises';
import { ExerciseCard } from './ExerciseCard';
import { Input } from '@/components/ui/input';
import { DeloadWeekBanner } from './DeloadWeekBanner';
import { useDeload } from '@/lib/hooks/useDeload';
import { ScheduleValidator } from './ScheduleValidator';
import { useWorkouts } from '@/lib/hooks/useWorkouts';

interface WorkoutFormProps {
  profile: UserProfile;
}

export const WorkoutForm = ({ profile }: WorkoutFormProps) => {
  const navigate = useNavigate();
  const [workoutType, setWorkoutType] = useState<'A' | 'B'>('A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [exerciseLogs, setExerciseLogs] = useState<
    Omit<ExerciseLog, 'id' | 'user_id' | 'created_at'>[]
  >([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Deload tracking
  const {
    isDeloadActive,
    reductionPercentage,
    endDeload,
  } = useDeload();

  // Workout history for schedule validation
  const { workouts } = useWorkouts(1); // Get most recent workout
  const lastWorkoutDate = workouts.length > 0 ? workouts[0].date : undefined;

  const exercises = getWorkoutExercises(
    profile.current_phase,
    workoutType,
    profile.training_mode || 'standard',
    profile.active_specialization || null
  );

  const handleExerciseUpdate = (
    exerciseName: string,
    sets: SetLog[],
    hitProgression: boolean,
    exerciseNotes?: string
  ) => {
    const exercise = exercises.find((ex) => ex.name === exerciseName);
    if (!exercise) return;

    const updatedLogs = [...exerciseLogs];
    const existingIndex = updatedLogs.findIndex(
      (log) => log.exercise_name === exerciseName
    );

    const log: Omit<ExerciseLog, 'id' | 'user_id' | 'created_at'> = {
      session_id: '', // Will be set after creating session
      exercise_name: exerciseName,
      muscle_group: exercise.muscle_group,
      training_method: exercise.training_method,
      sets,
      hit_progression: hitProgression,
      notes: exerciseNotes,
      date,
    };

    if (existingIndex >= 0) {
      updatedLogs[existingIndex] = log;
    } else {
      updatedLogs.push(log);
    }

    setExerciseLogs(updatedLogs);
  };

  const handleSaveWorkout = async () => {
    if (exerciseLogs.length === 0) {
      alert('Please log at least one exercise');
      return;
    }

    try {
      setSaving(true);

      // Create workout session
      const session = await createWorkoutSession({
        date,
        workout_type: workoutType,
        phase: profile.current_phase,
        completed: true,
        notes,
      });

      // Update exercise logs with session_id
      const logsWithSession = exerciseLogs.map((log) => ({
        ...log,
        session_id: session.id,
      }));

      // Create all exercise logs
      await createExerciseLogs(logsWithSession);

      alert('Workout saved successfully!');
      navigate('/history');
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workout Settings */}
      <div className="bg-white dark:bg-[#1C2128] p-6 rounded-lg shadow border border-[#E8EAED] dark:border-[#30363D]">
        <h2 className="text-xl font-semibold mb-4 text-[#202124] dark:text-[#E6EDF3]">Workout Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#202124] dark:text-[#E6EDF3]">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#202124] dark:text-[#E6EDF3]">
              Workout Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setWorkoutType('A')}
                className={`flex-1 px-4 py-2 rounded font-medium ${
                  workoutType === 'A'
                    ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white'
                    : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
                }`}
              >
                Workout A
              </button>
              <button
                onClick={() => setWorkoutType('B')}
                className={`flex-1 px-4 py-2 rounded font-medium ${
                  workoutType === 'B'
                    ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white'
                    : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
                }`}
              >
                Workout B
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2 text-[#202124] dark:text-[#E6EDF3]">
            Workout Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8EAED] dark:border-[#30363D] bg-white dark:bg-[#1C2128] text-[#202124] dark:text-[#E6EDF3] placeholder:text-[#80868B] dark:placeholder:text-[#6E7681] rounded focus:outline-none focus:ring-2 focus:ring-[#20808D] dark:focus:ring-[#1FB8CD]"
            rows={3}
            placeholder="How did you feel? Any observations?"
          />
        </div>
      </div>

      {/* Schedule Validation */}
      <ScheduleValidator
        workoutDate={new Date(date)}
        schedule={profile.workout_schedule}
        lastWorkoutDate={lastWorkoutDate}
      />

      {/* Deload Week Banner */}
      <DeloadWeekBanner
        isDeloadWeek={isDeloadActive}
        reductionPercentage={reductionPercentage}
        onEndDeload={async () => {
          const success = await endDeload();
          if (success) {
            alert('Deload week ended successfully! Resume normal training.');
          }
        }}
      />

      {/* Exercise List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#202124] dark:text-[#E6EDF3]">Exercises</h2>
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.name}
            exercise={exercise}
            exerciseIndex={index}
            onUpdate={handleExerciseUpdate}
            isDeloadWeek={isDeloadActive}
            deloadReductionPercentage={reductionPercentage}
          />
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 border border-[#E8EAED] dark:border-[#30363D] rounded-lg font-medium text-[#202124] dark:text-[#E6EDF3] hover:bg-[#F5F5F5] dark:hover:bg-[#1C2128]"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveWorkout}
          disabled={saving || exerciseLogs.length === 0}
          className="px-6 py-3 bg-[#20808D] dark:bg-[#1FB8CD] text-white rounded-lg font-medium hover:bg-[#1A6B76] dark:hover:bg-[#2DD4E8] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Workout'}
        </button>
      </div>
    </div>
  );
};
