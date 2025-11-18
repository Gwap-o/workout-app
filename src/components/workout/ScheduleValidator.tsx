import { useState, useEffect } from 'react';
import type { WorkoutDay } from '@/types';
import {
  validateWorkoutSchedule,
  getDayOfWeek,
  type ScheduleValidationResult,
} from '@/lib/utils/scheduleValidation';

interface ScheduleValidatorProps {
  workoutDate: Date;
  schedule: WorkoutDay[];
  lastWorkoutDate?: string;
  onProceed?: () => void;
  onCancel?: () => void;
}

export const ScheduleValidator = ({
  workoutDate,
  schedule,
  lastWorkoutDate,
  onProceed,
  onCancel,
}: ScheduleValidatorProps) => {
  const [validation, setValidation] = useState<ScheduleValidationResult | null>(
    null
  );
  const [userAcknowledged, setUserAcknowledged] = useState(false);

  useEffect(() => {
    const result = validateWorkoutSchedule(workoutDate, schedule, lastWorkoutDate);
    setValidation(result);
    setUserAcknowledged(false);
  }, [workoutDate, schedule, lastWorkoutDate]);

  if (!validation) return null;

  // No issues - don't show anything
  if (validation.canProceed && validation.warnings.length === 0) {
    return null;
  }

  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;

  return (
    <div
      className={`rounded-lg p-4 border-2 ${
        hasErrors
          ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-700'
          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{hasErrors ? '🛑' : '⚠️'}</span>
        <div className="flex-1">
          <h3
            className={`font-bold text-base ${
              hasErrors
                ? 'text-red-900 dark:text-red-100'
                : 'text-yellow-900 dark:text-yellow-100'
            }`}
          >
            {hasErrors ? 'Cannot Proceed' : 'Schedule Notice'}
          </h3>
          <p
            className={`text-sm mt-1 ${
              hasErrors
                ? 'text-red-800 dark:text-red-200'
                : 'text-yellow-800 dark:text-yellow-200'
            }`}
          >
            {hasErrors
              ? 'This workout violates recovery guidelines'
              : 'This workout is off your scheduled days'}
          </p>
        </div>
      </div>

      {/* Current Workout Info */}
      <div
        className={`p-3 rounded border mb-3 ${
          hasErrors
            ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800'
            : 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-800'
        }`}
      >
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span
              className={
                hasErrors
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-yellow-700 dark:text-yellow-300'
              }
            >
              Workout Date:
            </span>
            <p
              className={`font-semibold ${
                hasErrors
                  ? 'text-red-900 dark:text-red-100'
                  : 'text-yellow-900 dark:text-yellow-100'
              }`}
            >
              {getDayOfWeek(workoutDate)}, {workoutDate.toLocaleDateString()}
            </p>
          </div>
          {lastWorkoutDate && (
            <div>
              <span
                className={
                  hasErrors
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-yellow-700 dark:text-yellow-300'
                }
              >
                Last Workout:
              </span>
              <p
                className={`font-semibold ${
                  hasErrors
                    ? 'text-red-900 dark:text-red-100'
                    : 'text-yellow-900 dark:text-yellow-100'
                }`}
              >
                {new Date(lastWorkoutDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Errors */}
      {hasErrors && validation.errors.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
            ❌ Issues:
          </h4>
          <ul className="space-y-1">
            {validation.errors.map((error, index) => (
              <li
                key={index}
                className="text-sm text-red-800 dark:text-red-200 flex items-start gap-2"
              >
                <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {hasWarnings && validation.warnings.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            ⚠️ Warnings:
          </h4>
          <ul className="space-y-1">
            {validation.warnings.map((warning, index) => (
              <li
                key={index}
                className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2"
              >
                <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      {validation.recommendation && (
        <div
          className={`p-3 rounded border mb-3 ${
            hasErrors
              ? 'bg-red-200 dark:bg-red-950/40 border-red-400 dark:border-red-800'
              : 'bg-yellow-200 dark:bg-yellow-950/40 border-yellow-400 dark:border-yellow-800'
          }`}
        >
          <p
            className={`text-sm font-medium ${
              hasErrors
                ? 'text-red-900 dark:text-red-100'
                : 'text-yellow-900 dark:text-yellow-100'
            }`}
          >
            💡 Recommendation: {validation.recommendation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {/* Cancel/Back button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              hasErrors
                ? 'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600'
                : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] border border-[#E8EAED] dark:border-[#30363D] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
            }`}
          >
            {hasErrors ? 'Go Back' : 'Cancel'}
          </button>
        )}

        {/* Proceed button (only if no hard errors) */}
        {!hasErrors && onProceed && (
          <>
            {!userAcknowledged ? (
              <button
                onClick={() => setUserAcknowledged(true)}
                className="flex-1 px-4 py-2 bg-yellow-600 dark:bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-600 font-medium transition-colors"
              >
                I Understand, Proceed Anyway
              </button>
            ) : (
              <button
                onClick={onProceed}
                className="flex-1 px-4 py-2 bg-[#20808D] dark:bg-[#1FB8CD] text-white rounded-lg hover:bg-[#1A6B76] dark:hover:bg-[#2DD4E8] font-medium transition-colors"
              >
                ✓ Confirm Workout
              </button>
            )}
          </>
        )}
      </div>

      {/* Help Text */}
      {hasErrors && (
        <p className="text-xs text-red-700 dark:text-red-300 mt-2 text-center">
          Recovery is essential for muscle growth and injury prevention. Please wait
          before your next workout.
        </p>
      )}
    </div>
  );
};
