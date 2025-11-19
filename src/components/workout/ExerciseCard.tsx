import { useState, useEffect } from 'react';
import type { Exercise, SetLog, TrainingMethod } from '@/types';
import { useLastExerciseLog } from '@/lib/hooks/useExerciseHistory';
import { calculateRPTSets } from '@/lib/progression/rpt';
import { getSetsForMethod, getRepRange } from '@/lib/constants/exercises';
import { SetInput } from './SetInput';
import { ProgressionIndicator } from './ProgressionIndicator';
import { RestTimer } from './RestTimer';
import { WarmupSetInput } from './WarmupSetInput';
import { useSettings } from '@/lib/hooks/useSettings';
import { calculateWarmupSets, shouldShowWarmupSets } from '@/lib/utils/warmupCalculations';
import { FormCueDisplay } from './FormCueDisplay';
import { calculateDeloadWeight } from '@/lib/utils/deloadUtils';
import { ProgressionGuidance } from './ProgressionGuidance';
import { InlineProgressionWarning } from './ProgressionWarning';
import { checkProgressionGuardrails } from '@/lib/utils/progressionValidation';
import type { GuardrailCheck } from '@/lib/utils/progressionValidation';
import { TrainingMethodBadge } from './TrainingMethodBadge';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  exerciseIndex: number;
  onUpdate: (
    exerciseName: string,
    sets: SetLog[],
    hitProgression: boolean,
    notes?: string
  ) => void;
  isDeloadWeek?: boolean;
  deloadReductionPercentage?: number;
}

export const ExerciseCard = ({
  exercise,
  exerciseIndex,
  onUpdate,
  isDeloadWeek = false,
  deloadReductionPercentage = 10,
}: ExerciseCardProps) => {
  const { log: lastLog, expectedPerformance, loading } = useLastExerciseLog(
    exercise.name
  );
  const { settings } = useSettings();
  const [sets, setSets] = useState<SetLog[]>([]);
  const [warmupSets, setWarmupSets] = useState<SetLog[]>([]);
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTimerSetIndex, setActiveTimerSetIndex] = useState<number | null>(null);
  const [showWarmups, setShowWarmups] = useState(false);
  const [completedRestTimes, setCompletedRestTimes] = useState<Record<number, number>>({});
  const [guardrailCheck, setGuardrailCheck] = useState<GuardrailCheck | null>(null);

  const numSets = getSetsForMethod(exercise.training_method);
  const needsWarmup = shouldShowWarmupSets(exerciseIndex);

  // Apply deload weight reduction if in deload week
  const adjustedExpectedPerformance = isDeloadWeek && expectedPerformance
    ? {
        ...expectedPerformance,
        weight: calculateDeloadWeight(
          expectedPerformance.weight,
          deloadReductionPercentage
        ),
      }
    : expectedPerformance;

  /**
   * Calculate recommended rest time based on training method
   * - RPT: Use max rest period for heavy sets
   * - Kino: Use mid-range rest
   * - RestPause: Use 15 seconds between mini-sets (not the documented 60-90s which is for full rest)
   */
  const getRecommendedRestSeconds = (trainingMethod: TrainingMethod): number => {
    if (trainingMethod === 'RestPause') {
      return 15; // Short rest between mini-sets in Rest-Pause
    } else if (trainingMethod === 'RPT') {
      return exercise.rest_period.max; // Full rest for heavy RPT sets
    } else {
      // Kino: Mid-range rest
      return Math.floor((exercise.rest_period.min + exercise.rest_period.max) / 2);
    }
  };

  useEffect(() => {
    // Initialize empty working sets
    const initialSets: SetLog[] = [];
    for (let i = 1; i <= numSets; i++) {
      // For RPT, use set-specific rep ranges (set1, set2, set3)
      let targetReps: string;
      if (exercise.training_method === 'RPT') {
        const setKey = `set${i}` as 'set1' | 'set2' | 'set3';
        const repRangeAny = exercise.rep_range as any;
        const repRange = repRangeAny[setKey];

        if (repRange) {
          // New RPT format with set1, set2, set3
          targetReps = repRange.min === repRange.max
            ? `${repRange.min}`
            : `${repRange.min}-${repRange.max}`;
        } else if (repRangeAny.min !== undefined && repRangeAny.max !== undefined) {
          // Legacy RPT format with direct min/max - use same range for all sets
          targetReps = `${repRangeAny.min}-${repRangeAny.max}`;
        } else {
          targetReps = '0';
        }
      } else {
        // For Kino, RestPause, and StraightSets, use general rep range
        const repRange = exercise.rep_range as { min: number; max: number };
        targetReps = `${repRange.min}-${repRange.max}`;
      }

      initialSets.push({
        set_number: i,
        weight: 0,
        reps: 0,
        target_reps: targetReps,
        completed: false,
        is_warmup: false,
      });
    }
    setSets(initialSets);

    // Initialize warmup sets (3 warmup sets at 60%, 75%, 90%)
    if (needsWarmup) {
      const initialWarmups: SetLog[] = [];
      for (let i = 1; i <= 3; i++) {
        initialWarmups.push({
          set_number: i,
          weight: 0,
          reps: 0,
          completed: false,
          is_warmup: true,
        });
      }
      setWarmupSets(initialWarmups);
    }
  }, [numSets, exercise.rep_range, needsWarmup]);

  const handleSetUpdate = (setNumber: number, weight: number, reps: number) => {
    const updatedSets = [...sets];
    const setIndex = setNumber - 1;
    const isNowCompleted = weight > 0 && reps > 0;

    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      weight,
      reps,
      completed: isNowCompleted,
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

    // Run progression guardrails on the first set
    if (setNumber === 1 && isNowCompleted && lastLog?.sets?.[0]) {
      const currentSet: SetLog = updatedSets[0];
      const lastSet = lastLog.sets[0];

      // Only run if both sets have valid weight and reps
      if (currentSet.weight > 0 && currentSet.reps > 0 && lastSet.weight > 0 && lastSet.reps > 0) {
        const check = checkProgressionGuardrails(
          currentSet,
          lastSet,
          exercise,
          0, // recentPlateaus - would need to calculate from history
          0  // weeksSinceLastDeload - would need to fetch from deload tracking
        );

        setGuardrailCheck(check);
      }
    } else if (setNumber === 1 && !isNowCompleted) {
      // Clear guardrail check if set is being edited/cleared
      setGuardrailCheck(null);
    }

    // Don't auto-start timer - let user start it manually
    // Timer is now triggered by the "Start Rest Timer" button

    // Check if hit progression (use adjusted expected performance for deload weeks)
    const hitProgression =
      adjustedExpectedPerformance &&
      updatedSets[0].completed &&
      (updatedSets[0].weight > adjustedExpectedPerformance.weight ||
        (updatedSets[0].weight === adjustedExpectedPerformance.weight &&
          updatedSets[0].reps >= adjustedExpectedPerformance.reps));

    onUpdate(exercise.name, updatedSets, hitProgression || false, notes);
  };

  /**
   * Handle warmup set updates
   */
  const handleWarmupSetUpdate = (setNumber: number, weight: number, reps: number) => {
    const updatedWarmups = [...warmupSets];
    const setIndex = setNumber - 1;

    updatedWarmups[setIndex] = {
      ...updatedWarmups[setIndex],
      weight,
      reps,
      completed: weight > 0 && reps > 0,
    };

    setWarmupSets(updatedWarmups);
  };

  /**
   * Handle rest timer completion - store actual rest time in the next set's log
   */
  const handleTimerComplete = (setIndex: number, actualRestTime: number) => {
    const updatedSets = [...sets];
    const nextSetIndex = setIndex + 1;

    if (nextSetIndex < updatedSets.length) {
      updatedSets[nextSetIndex] = {
        ...updatedSets[nextSetIndex],
        rest_time: actualRestTime,
      };
      setSets(updatedSets);
      onUpdate(exercise.name, updatedSets, false, notes);
    }

    // Track completed rest time for this set
    setCompletedRestTimes(prev => ({
      ...prev,
      [setIndex]: actualRestTime,
    }));

    // Clear active timer
    setActiveTimerSetIndex(null);
  };

  /**
   * Handle timer skip - user wants to start next set early
   */
  const handleTimerSkip = () => {
    // Timer will still call onComplete with actual rest time
    // This is just for UI feedback - actual time tracking happens in timer
    setActiveTimerSetIndex(null);
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
              <TrainingMethodBadge trainingMethod={exercise.training_method} />
            </div>
            <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mt-1">
              {completedSets}/{numSets} sets completed
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-[#80868B] dark:text-[#6E7681]" />
            ) : (
              <ChevronRight className="w-5 h-5 text-[#80868B] dark:text-[#6E7681]" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#E8EAED] dark:border-[#30363D] pt-4">
          {/* Form Cues */}
          <FormCueDisplay
            exerciseName={exercise.name}
            showFormCues={settings.show_form_cues}
          />

          {/* Last Workout & Expected Performance */}
          {loading ? (
            <div className="text-sm text-[#5F6368] dark:text-[#8B949E]">Loading history...</div>
          ) : (
            <ProgressionIndicator
              lastLog={lastLog}
              expectedPerformance={adjustedExpectedPerformance}
              exercise={exercise}
            />
          )}

          {/* Equipment-Specific Progression Guidance */}
          <ProgressionGuidance
            exercise={exercise}
            lastSet={lastLog?.sets[0]}
          />

          {/* Progression Guardrails - Show warnings/errors for unsafe progressions */}
          {guardrailCheck && guardrailCheck.warnings.length > 0 && (
            <div className="space-y-2">
              {guardrailCheck.warnings.map((warning, index) => (
                <InlineProgressionWarning key={index} warning={warning} />
              ))}
            </div>
          )}

          {/* Warmup Sets - Only for first exercise */}
          {needsWarmup && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  Warmup Sets (First Exercise Only)
                </h3>
                <button
                  onClick={() => setShowWarmups(!showWarmups)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {showWarmups ? 'Hide' : 'Show'} Warmup Sets
                </button>
              </div>

              {showWarmups && (
                <>
                  <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">
                    Do 3 warmup sets at 60%, 75%, and 90% of your first working set weight. Rest 2-3 min between warmup sets.
                  </p>

                  {sets[0].weight > 0 ? (
                    calculateWarmupSets(sets[0].weight).map((warmup, idx) => (
                      <WarmupSetInput
                        key={idx}
                        setNumber={idx + 1}
                        recommendedWeight={warmup.weight}
                        recommendedReps={warmup.reps}
                        weight={warmupSets[idx]?.weight || 0}
                        reps={warmupSets[idx]?.reps || 0}
                        onUpdate={handleWarmupSetUpdate}
                        percentage={warmup.percentage}
                      />
                    ))
                  ) : (
                    <div className="text-sm text-[#5F6368] dark:text-[#8B949E] bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                      Enter your first working set weight below, and warmup recommendations will appear here.
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Set Inputs with Rest Timers */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#202124] dark:text-[#E6EDF3]">Working Sets</h3>
            {sets.map((set, index) => (
              <div key={set.set_number}>
                {/* RPT Weight Reduction Guidance */}
                {exercise.training_method === 'RPT' && index > 0 && (
                  <div className="mb-2 p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded text-xs flex items-center justify-between">
                    <span className="text-purple-700 dark:text-purple-300">
                      RPT: Reduce weight by ~10% from previous set
                    </span>
                    {index === 1 && sets[0].weight > 0 && (
                      <span className="font-medium text-purple-800 dark:text-purple-200">
                        Suggested: {Math.round(sets[0].weight * 0.9)} lbs
                      </span>
                    )}
                    {index === 2 && sets[1].weight > 0 && (
                      <span className="font-medium text-purple-800 dark:text-purple-200">
                        Suggested: {Math.round(sets[1].weight * 0.9)} lbs
                      </span>
                    )}
                  </div>
                )}

                {/* Kino Training Progression Guidance */}
                {exercise.training_method === 'Kino' && index > 0 && (
                  <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded text-xs flex items-center justify-between">
                    <span className="text-blue-700 dark:text-blue-300">
                      Kino: Increase weight from previous set
                    </span>
                    {sets[index - 1].weight > 0 && (
                      <span className="font-medium text-blue-800 dark:text-blue-200">
                        Previous: {sets[index - 1].weight} lbs
                      </span>
                    )}
                  </div>
                )}

                <SetInput
                  setNumber={set.set_number}
                  weight={set.weight}
                  reps={set.reps}
                  targetReps={set.target_reps || '0'}
                  onUpdate={handleSetUpdate}
                  disabled={
                    exercise.training_method === 'RPT' &&
                    set.set_number > 1 &&
                    !sets[0].completed
                  }
                />

                {/* Rest comparison after completing rest */}
                {completedRestTimes[index] && index < numSets - 1 && (
                  <div className={`mt-2 p-3 rounded-lg border text-sm ${
                    Math.abs(completedRestTimes[index] - getRecommendedRestSeconds(exercise.training_method)) <= 10
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600 text-green-700 dark:text-green-300'
                      : completedRestTimes[index] < getRecommendedRestSeconds(exercise.training_method) - 10
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Rest completed:</span>
                      <span>{Math.floor(completedRestTimes[index] / 60)}:{(completedRestTimes[index] % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span>Recommended:</span>
                      <span>{Math.floor(getRecommendedRestSeconds(exercise.training_method) / 60)}:{(getRecommendedRestSeconds(exercise.training_method) % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                )}

                {/* Rest Timer - Manual start button or active timer */}
                {set.completed && index < numSets - 1 && activeTimerSetIndex !== index && !completedRestTimes[index] && (
                  <div className="mt-2 space-y-2">
                    {/* Recommended rest display */}
                    <div className="text-sm text-[#5F6368] dark:text-[#8B949E] text-center">
                      Recommended rest: {Math.floor(getRecommendedRestSeconds(exercise.training_method) / 60)}:{(getRecommendedRestSeconds(exercise.training_method) % 60).toString().padStart(2, '0')}
                    </div>

                    <button
                      onClick={() => setActiveTimerSetIndex(index)}
                      className="w-full px-4 py-2 bg-[#20808D] dark:bg-[#1FB8CD] text-white rounded-lg hover:bg-[#1A6B76] dark:hover:bg-[#2DD4E8] transition-colors font-medium text-sm"
                    >
                      Start Rest Timer
                    </button>
                  </div>
                )}

                {activeTimerSetIndex === index && (
                  <RestTimer
                    duration={getRecommendedRestSeconds(exercise.training_method)}
                    onComplete={(actualRestTime) => handleTimerComplete(index, actualRestTime)}
                    onSkip={handleTimerSkip}
                    autoStart={true}
                    exerciseName={`${exercise.name} - Set ${set.set_number + 1}`}
                    soundEnabled={settings.rest_timer_sound}
                  />
                )}
              </div>
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
                {(() => {
                  const repRange = getRepRange(exercise);
                  return `${repRange.min}-${repRange.max}`;
                })()}
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
