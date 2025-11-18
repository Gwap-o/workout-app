import type { ExerciseLog, ExpectedPerformance, Exercise } from '@/types';
import { useExercisePlateauDetection } from '@/lib/hooks/useExerciseHistory';
import { getRepRange } from '@/lib/constants/exercises';

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
    const repRange = getRepRange(exercise);
    return (
      <div className="bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 border border-[#20808D] dark:border-[#1FB8CD] rounded p-3">
        <p className="text-sm text-[#20808D] dark:text-[#1FB8CD] font-medium">
          First time logging this exercise
        </p>
        <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">
          Start with a weight you can handle for {repRange.min}-
          {repRange.max} reps with good form
        </p>
      </div>
    );
  }

  const lastSet = lastLog.sets[0];

  return (
    <div className="space-y-2">
      {/* Last Workout */}
      <div className="bg-[#F5F5F5] dark:bg-[#161B22] border border-[#E8EAED] dark:border-[#30363D] rounded p-3">
        <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mb-1">Last Workout</p>
        <p className="font-semibold text-[#202124] dark:text-[#E6EDF3]">
          {lastSet.weight} lbs × {lastSet.reps} reps
        </p>
        {lastLog.date && (
          <p className="text-xs text-[#80868B] dark:text-[#6E7681] mt-1">
            {new Date(lastLog.date).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Expected Performance */}
      {expectedPerformance && (
        <div className="bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 border border-[#20808D] dark:border-[#1FB8CD] rounded p-3">
          <p className="text-xs text-[#20808D] dark:text-[#1FB8CD] mb-1">
            Target for Today (Double Progression)
          </p>
          <p className="font-semibold text-[#20808D] dark:text-[#1FB8CD]">
            {expectedPerformance.weight} lbs × {expectedPerformance.reps} reps
          </p>
          {expectedPerformance.weight > lastSet.weight && (
            <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">
              Weight increase: +{expectedPerformance.weight - lastSet.weight}{' '}
              lbs
            </p>
          )}
          {expectedPerformance.weight === lastSet.weight &&
            expectedPerformance.reps > lastSet.reps && (
              <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">
                Rep increase: +{expectedPerformance.reps - lastSet.reps} rep(s)
              </p>
            )}
        </div>
      )}

      {/* Plateau Warning */}
      {plateauAnalysis?.isPlateaued && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded p-3">
          <p className="text-xs text-yellow-800 dark:text-yellow-300 font-medium mb-1">
            Plateau Detected
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            {plateauAnalysis.suggestion}
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
            Stagnant for {plateauAnalysis.consecutiveStagnantWorkouts} workout
            {plateauAnalysis.consecutiveStagnantWorkouts > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};
