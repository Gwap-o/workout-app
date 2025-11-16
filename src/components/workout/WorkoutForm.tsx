import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserProfile, ExerciseLog, SetLog } from '@/types';
import { getWorkoutExercises } from '@/lib/constants/exercises';
import { createWorkoutSession } from '@/lib/supabase/workouts';
import { createExerciseLogs } from '@/lib/supabase/exercises';
import { ExerciseCard } from './ExerciseCard';

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

  const exercises = getWorkoutExercises(profile.current_phase, workoutType);

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
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Workout Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Workout Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setWorkoutType('A')}
                className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
                  workoutType === 'A'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Workout A
              </button>
              <button
                onClick={() => setWorkoutType('B')}
                className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
                  workoutType === 'B'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Workout B
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">
            Workout Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="How did you feel? Any observations?"
          />
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Exercises</h2>
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.name}
            exercise={exercise}
            onUpdate={handleExerciseUpdate}
          />
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveWorkout}
          disabled={saving || exerciseLogs.length === 0}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Workout'}
        </button>
      </div>
    </div>
  );
};
