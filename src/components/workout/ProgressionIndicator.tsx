import type { ExerciseLog, ExpectedPerformance, Exercise } from '@/types';
import { useExercisePlateauDetection } from '@/lib/hooks/useExerciseHistory';

interface ProgressionIndicatorProps {
  lastLog: ExerciseLog | null;
  expectedPerformance: ExpectedPerformance | null;
  exercise: Exercise;
}

export const ProgressionIndicator = ({
  lastLog,
  expectedPerformance,
  exercise,
}: ProgressionIndicatorProps) => {
  const { plateauAnalysis } = useExercisePlateauDetection(exercise.name);

  if (!lastLog) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-3">
        <p className="text-sm text-blue-800 font-medium">
          First time logging this exercise
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Start with a weight you can handle for {exercise.rep_range.min}-
          {exercise.rep_range.max} reps with good form
        </p>
      </div>
    );
  }

  const lastSet = lastLog.sets[0];

  return (
    <div className="space-y-2">
      {/* Last Workout */}
      <div className="bg-gray-50 border border-gray-200 rounded p-3">
        <p className="text-xs text-gray-600 mb-1">Last Workout</p>
        <p className="font-semibold">
          {lastSet.weight} lbs × {lastSet.reps} reps
        </p>
        {lastLog.date && (
          <p className="text-xs text-gray-500 mt-1">
            {new Date(lastLog.date).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Expected Performance */}
      {expectedPerformance && (
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <p className="text-xs text-green-800 mb-1">
            Target for Today (Double Progression)
          </p>
          <p className="font-semibold text-green-900">
            {expectedPerformance.weight} lbs × {expectedPerformance.reps} reps
          </p>
          {expectedPerformance.weight > lastSet.weight && (
            <p className="text-xs text-green-700 mt-1">
              Weight increase: +{expectedPerformance.weight - lastSet.weight}{' '}
              lbs
            </p>
          )}
          {expectedPerformance.weight === lastSet.weight &&
            expectedPerformance.reps > lastSet.reps && (
              <p className="text-xs text-green-700 mt-1">
                Rep increase: +{expectedPerformance.reps - lastSet.reps} rep(s)
              </p>
            )}
        </div>
      )}

      {/* Plateau Warning */}
      {plateauAnalysis?.isPlateaued && (
        <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
          <p className="text-xs text-yellow-800 font-medium mb-1">
            Plateau Detected
          </p>
          <p className="text-xs text-yellow-700">
            {plateauAnalysis.suggestion}
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Stagnant for {plateauAnalysis.consecutiveStagnantWorkouts} workout
            {plateauAnalysis.consecutiveStagnantWorkouts > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};
