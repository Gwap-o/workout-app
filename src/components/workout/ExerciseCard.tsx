import { useState, useEffect } from 'react';
import type { Exercise, SetLog } from '@/types';
import { useLastExerciseLog } from '@/lib/hooks/useExerciseHistory';
import { calculateRPTSets } from '@/lib/progression/rpt';
import { getSetsForMethod } from '@/lib/constants/exercises';
import { SetInput } from './SetInput';
import { ProgressionIndicator } from './ProgressionIndicator';

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdate: (
    exerciseName: string,
    sets: SetLog[],
    hitProgression: boolean,
    notes?: string
  ) => void;
}

export const ExerciseCard = ({ exercise, onUpdate }: ExerciseCardProps) => {
  const { log: lastLog, expectedPerformance, loading } = useLastExerciseLog(
    exercise.name
  );
  const [sets, setSets] = useState<SetLog[]>([]);
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const numSets = getSetsForMethod(exercise.training_method);

  useEffect(() => {
    // Initialize empty sets
    const initialSets: SetLog[] = [];
    for (let i = 1; i <= numSets; i++) {
      initialSets.push({
        set_number: i,
        weight: 0,
        reps: 0,
        target_reps: `${exercise.rep_range.min}-${exercise.rep_range.max}`,
        completed: false,
      });
    }
    setSets(initialSets);
  }, [numSets, exercise.rep_range]);

  const handleSetUpdate = (setNumber: number, weight: number, reps: number) => {
    const updatedSets = [...sets];
    const setIndex = setNumber - 1;

    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      weight,
      reps,
      completed: weight > 0 && reps > 0,
    };

    // For RPT, auto-calculate subsequent sets
    if (exercise.training_method === 'RPT' && setNumber === 1) {
      const rptSets = calculateRPTSets(weight, reps);
      rptSets.forEach((calc, index) => {
        if (index > 0 && index < updatedSets.length) {
          updatedSets[index] = {
            ...updatedSets[index],
            weight: calc.weight,
            target_reps: calc.target_reps,
          };
        }
      });
    }

    setSets(updatedSets);

    // Check if hit progression
    const hitProgression =
      expectedPerformance &&
      updatedSets[0].completed &&
      (updatedSets[0].weight > expectedPerformance.weight ||
        (updatedSets[0].weight === expectedPerformance.weight &&
          updatedSets[0].reps >= expectedPerformance.reps));

    onUpdate(exercise.name, updatedSets, hitProgression || false, notes);
  };

  const completedSets = sets.filter((s) => s.completed).length;
  const allSetsCompleted = completedSets === numSets;

  return (
    <div className="bg-white dark:bg-[#1C2128] rounded-lg shadow border border-[#E8EAED] dark:border-[#30363D]">
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-[#F5F5F5] dark:hover:bg-[#161B22]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-[#202124] dark:text-[#E6EDF3]">{exercise.name}</h3>
              <span className="text-sm text-[#5F6368] dark:text-[#8B949E] bg-[#F5F5F5] dark:bg-[#161B22] px-2 py-1 rounded">
                {exercise.training_method}
              </span>
            </div>
            <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mt-1">
              {completedSets}/{numSets} sets completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            {allSetsCompleted && (
              <span className="text-[#20808D] dark:text-[#1FB8CD] font-medium">✓</span>
            )}
            <span className="text-[#80868B] dark:text-[#6E7681]">
              {isExpanded ? '▼' : '▶'}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#E8EAED] dark:border-[#30363D] pt-4">
          {/* Last Workout & Expected Performance */}
          {loading ? (
            <div className="text-sm text-[#5F6368] dark:text-[#8B949E]">Loading history...</div>
          ) : (
            <ProgressionIndicator
              lastLog={lastLog}
              expectedPerformance={expectedPerformance}
              exercise={exercise}
            />
          )}

          {/* Set Inputs */}
          <div className="space-y-3">
            {sets.map((set) => (
              <SetInput
                key={set.set_number}
                setNumber={set.set_number}
                weight={set.weight}
                reps={set.reps}
                targetReps={set.target_reps || `${exercise.rep_range.min}-${exercise.rep_range.max}`}
                onUpdate={handleSetUpdate}
                disabled={
                  exercise.training_method === 'RPT' &&
                  set.set_number > 1 &&
                  !sets[0].completed
                }
              />
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[#202124] dark:text-[#E6EDF3]">
              Exercise Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                onUpdate(exercise.name, sets, false, e.target.value);
              }}
              className="w-full px-3 py-2 border border-[#E8EAED] dark:border-[#30363D] bg-white dark:bg-[#1C2128] text-[#202124] dark:text-[#E6EDF3] placeholder:text-[#80868B] dark:placeholder:text-[#6E7681] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#20808D] dark:focus:ring-[#1FB8CD]"
              placeholder="Form notes, how it felt, etc."
            />
          </div>

          {/* Exercise Info */}
          <div className="text-xs text-[#5F6368] dark:text-[#8B949E] bg-[#F5F5F5] dark:bg-[#161B22] p-3 rounded border border-[#E8EAED] dark:border-[#30363D]">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Target Reps:</span>{' '}
                {exercise.rep_range.min}-{exercise.rep_range.max}
              </div>
              <div>
                <span className="font-medium">Rest:</span>{' '}
                {exercise.rest_period.min / 60}-{exercise.rest_period.max / 60}{' '}
                min
              </div>
              <div>
                <span className="font-medium">Increment:</span> +
                {exercise.weight_increment} lbs
              </div>
              <div>
                <span className="font-medium">Muscle:</span>{' '}
                {exercise.muscle_group}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
