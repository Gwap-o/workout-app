import { useState } from 'react';
import type { Exercise, SetLog } from '@/types';
import {
  calculateProgression,
  getProgressionGuidance,
  shouldRecommendMicroplates,
} from '@/lib/progression/equipmentProgressionRules';

interface ProgressionGuidanceProps {
  exercise: Exercise;
  lastSet?: SetLog;
}

export const ProgressionGuidance = ({ exercise, lastSet }: ProgressionGuidanceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const guidance = getProgressionGuidance(exercise.equipment);
  const needsMicroplates = shouldRecommendMicroplates(exercise);

  // Calculate next workout target if we have last set data
  const nextTarget = lastSet ? calculateProgression(exercise, lastSet) : null;

  return (
    <div className="mt-3">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
            {exercise.equipment === 'barbell' && '⚡ Barbell Progression'}
            {exercise.equipment === 'dumbbell' && '💪 Dumbbell Progression'}
            {exercise.equipment === 'bodyweight' && '🏋️ Bodyweight Progression'}
            {exercise.equipment === 'cable' && '🔗 Cable Progression'}
          </span>
        </div>
        <span className="text-indigo-600 dark:text-indigo-400 text-xs">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-2 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-4">
          {/* Next Workout Target */}
          {nextTarget && (
            <div className="p-3 bg-white dark:bg-indigo-950/40 rounded border border-indigo-300 dark:border-indigo-700">
              <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                📊 Next Workout Target
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-700 dark:text-indigo-300">
                    Target Weight:
                  </span>
                  <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
                    {nextTarget.nextWeight} lbs
                    {nextTarget.progressionType === 'weight' && (
                      <span className="ml-1 text-green-600 dark:text-green-400">
                        ↑ +{nextTarget.nextWeight - (lastSet?.weight || 0)} lbs
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-700 dark:text-indigo-300">
                    Target Reps:
                  </span>
                  <span className="text-sm font-bold text-indigo-900 dark:text-indigo-100">
                    {nextTarget.nextReps} reps
                    {nextTarget.progressionType === 'reps' && (
                      <span className="ml-1 text-blue-600 dark:text-blue-400">
                        ↑ +{nextTarget.nextReps - (lastSet?.reps || 0)} rep
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-xs text-indigo-800 dark:text-indigo-200 mt-2 italic">
                  {nextTarget.message}
                </p>
              </div>
            </div>
          )}

          {/* Progression Strategy */}
          <div>
            <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
              📈 Progression Strategy
            </h4>
            <ul className="space-y-1.5">
              {guidance.map((tip, index) => (
                <li
                  key={index}
                  className="text-xs text-indigo-800 dark:text-indigo-200 flex items-start gap-2"
                >
                  <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment Info */}
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded border border-indigo-300 dark:border-indigo-700">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                  Equipment:
                </span>
                <p className="text-indigo-900 dark:text-indigo-100 font-semibold capitalize">
                  {exercise.equipment}
                </p>
              </div>
              <div>
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                  Increment:
                </span>
                <p className="text-indigo-900 dark:text-indigo-100 font-semibold">
                  {exercise.equipment === 'bodyweight'
                    ? '2.5 lbs'
                    : `${exercise.weight_increment} lbs`}
                  {exercise.equipment === 'dumbbell' && ' per hand'}
                </p>
              </div>
            </div>
          </div>

          {/* Microplate Recommendation */}
          {needsMicroplates && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-300 dark:border-yellow-700">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚖️</span>
                <div>
                  <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                    Microplates Recommended
                  </h4>
                  <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                    {exercise.equipment === 'bodyweight'
                      ? 'Use 1.25 lb plates (2.5 lbs total) for gradual bodyweight progression'
                      : 'Consider 2.5 lb dumbbells or fractional plates for smaller jumps'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
