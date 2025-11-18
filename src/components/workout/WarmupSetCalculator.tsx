import { useState, useEffect } from 'react';
import type { SetLog } from '@/types';
import {
  calculateWarmupSets,
  getWarmupSetGuidance,
  WARMUP_REST_SECONDS,
  type WarmupSet,
} from '@/lib/utils/warmupCalculations';
import { RestTimer } from './RestTimer';
import { useSettings } from '@/lib/hooks/useSettings';

interface WarmupSetCalculatorProps {
  workingWeight: number;
  onWarmupsComplete: (warmupSets: SetLog[]) => void;
  onSkip: () => void;
}

/**
 * WarmupSetCalculator Component
 *
 * Displays warmup set calculator with:
 * - Auto-calculated warmup weights (60%, 75%, 90%)
 * - Rep guidance for each set
 * - Rest timer between warmup sets
 * - Completion tracking
 */
export const WarmupSetCalculator = ({
  workingWeight,
  onWarmupsComplete,
  onSkip,
}: WarmupSetCalculatorProps) => {
  const { settings } = useSettings();
  const [warmupSets, setWarmupSets] = useState<WarmupSet[]>([]);
  const [completedSets, setCompletedSets] = useState<SetLog[]>([]);
  const [activeTimerIndex, setActiveTimerIndex] = useState<number | null>(null);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  useEffect(() => {
    if (workingWeight > 0) {
      setWarmupSets(calculateWarmupSets(workingWeight));
    }
  }, [workingWeight]);

  const handleSetComplete = (index: number, actualReps: number) => {
    const warmupSet = warmupSets[index];
    const completedSet: SetLog = {
      set_number: index,
      weight: warmupSet.weight,
      reps: actualReps,
      completed: true,
      is_warmup: true,
      rest_time: 0,
    };

    const updated = [...completedSets];
    updated[index] = completedSet;
    setCompletedSets(updated);

    // If this is the last warmup set, complete warmups
    if (index === warmupSets.length - 1) {
      onWarmupsComplete(updated);
    } else {
      // Start rest timer for next set
      setActiveTimerIndex(index);
      setCurrentSetIndex(index + 1);
    }
  };

  const handleTimerComplete = (actualRestTime: number) => {
    // Update the rest time for the NEXT set (the one we're about to do)
    const updated = [...completedSets];
    if (updated[currentSetIndex]) {
      updated[currentSetIndex].rest_time = actualRestTime;
    }
    setCompletedSets(updated);
    setActiveTimerIndex(null);
  };

  const handleSkip = () => {
    onSkip();
  };

  if (warmupSets.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          Enter your planned working weight to see warmup recommendations.
        </p>
      </div>
    );
  }

  const allWarmupsComplete = completedSets.length === warmupSets.length &&
    completedSets.every((s) => s.completed);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#202124] dark:text-[#E6EDF3]">
            Warmup Sets
          </h3>
          <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">
            Complete warmup sets before working sets
          </p>
        </div>
        <button
          onClick={handleSkip}
          className="text-sm px-3 py-1 text-[#5F6368] dark:text-[#8B949E] hover:text-[#202124] dark:hover:text-[#E6EDF3] hover:bg-[#F5F5F5] dark:hover:bg-[#1C2128] rounded"
        >
          Skip Warmups
        </button>
      </div>

      {/* Guidance Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-3">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <Ë <strong>Warmup Protocol:</strong> 3 sets at 60%, 75%, and 90% of working weight.
          Rest 2 minutes between warmup sets. Warmup only for the first exercise.
        </p>
      </div>

      {/* Warmup Sets */}
      <div className="space-y-3">
        {warmupSets.map((warmupSet, index) => {
          const isCompleted = completedSets[index]?.completed;
          const isCurrent = currentSetIndex === index && !isCompleted;

          return (
            <div key={index}>
              <div
                className={`p-4 rounded-lg border-2 ${
                  isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : isCurrent
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                    : 'bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D]'
                }`}
              >
                {/* Set Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#202124] dark:text-[#E6EDF3]">
                      Warmup Set {index + 1}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#F5F5F5] dark:bg-[#161B22] text-[#5F6368] dark:text-[#8B949E]">
                      {warmupSet.percentage}% of {workingWeight} lbs
                    </span>
                  </div>
                  {isCompleted && (
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                       Complete
                    </span>
                  )}
                </div>

                {/* Guidance */}
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mb-3">
                  {getWarmupSetGuidance(warmupSet.percentage)}
                </p>

                {/* Weight and Reps */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-[#5F6368] dark:text-[#8B949E] mb-1">
                      Weight
                    </label>
                    <div className="px-3 py-2 bg-[#F5F5F5] dark:bg-[#161B22] rounded border border-[#E8EAED] dark:border-[#30363D]">
                      <span className="text-sm font-semibold text-[#202124] dark:text-[#E6EDF3]">
                        {warmupSet.weight} lbs
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5F6368] dark:text-[#8B949E] mb-1">
                      Reps (suggested: {warmupSet.suggested_reps})
                    </label>
                    <input
                      type="number"
                      value={completedSets[index]?.reps || ''}
                      onChange={(e) => {
                        const reps = parseInt(e.target.value) || 0;
                        if (reps > 0) {
                          handleSetComplete(index, reps);
                        }
                      }}
                      disabled={isCompleted}
                      className="w-full px-3 py-2 border border-[#E8EAED] dark:border-[#30363D] bg-white dark:bg-[#0D1117] text-[#202124] dark:text-[#E6EDF3] rounded focus:outline-none focus:ring-2 focus:ring-[#20808D] dark:focus:ring-[#1FB8CD] disabled:opacity-50"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Rest Timer */}
              {isCompleted && activeTimerIndex === index && index < warmupSets.length - 1 && (
                <div className="mt-2">
                  <RestTimer
                    duration={WARMUP_REST_SECONDS}
                    onComplete={handleTimerComplete}
                    onSkip={() => setActiveTimerIndex(null)}
                    autoStart={true}
                    exerciseName={`Warmup Set ${index + 1}`}
                    soundEnabled={settings.rest_timer_sound}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Complete Button */}
      {allWarmupsComplete && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4 text-center">
          <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
             All warmup sets complete!
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">
            You can now proceed to working sets.
          </p>
        </div>
      )}
    </div>
  );
};
