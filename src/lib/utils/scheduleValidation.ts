import type { WorkoutDay } from '@/types';

/**
 * Schedule Validation Utilities
 *
 * Validates workout scheduling to prevent:
 * - Consecutive day training (inadequate recovery)
 * - Too frequent workouts (overtraining)
 * - Off-schedule workouts without warning
 */

export interface ScheduleValidationResult {
  canProceed: boolean;
  warnings: string[];
  errors: string[];
  recommendation?: string;
  nextScheduledDate?: string;
}

/**
 * Get the day of week as WorkoutDay type
 */
export const getDayOfWeek = (date: Date): WorkoutDay => {
  const days: WorkoutDay[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[date.getDay()];
};

/**
 * Check if a date falls on a scheduled workout day
 */
export const isScheduledWorkoutDay = (
  date: Date,
  schedule: WorkoutDay[]
): boolean => {
  // Defensive check: ensure schedule is an array
  if (!schedule || !Array.isArray(schedule)) {
    return true; // If no schedule defined, allow any day
  }

  const dayOfWeek = getDayOfWeek(date);
  return schedule.includes(dayOfWeek);
};

/**
 * Check if workout is on consecutive day
 */
export const isConsecutiveDay = (
  workoutDate: Date,
  lastWorkoutDate: string
): boolean => {
  const last = new Date(lastWorkoutDate);
  const current = new Date(workoutDate);

  // Reset time to midnight for accurate day comparison
  last.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  const diffTime = current.getTime() - last.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays === 1;
};

/**
 * Get days since last workout
 */
export const getDaysSinceLastWorkout = (
  workoutDate: Date,
  lastWorkoutDate: string
): number => {
  const last = new Date(lastWorkoutDate);
  const current = new Date(workoutDate);

  // Reset time to midnight
  last.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);

  const diffTime = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Get next scheduled workout date
 */
export const getNextScheduledWorkout = (
  currentDate: Date,
  schedule: WorkoutDay[]
): Date => {
  // Defensive check: ensure schedule is an array
  if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
    // If no schedule, return tomorrow
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  // Find next scheduled day
  const dayMap: Record<WorkoutDay, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const currentDayNum = currentDate.getDay();
  const scheduledDayNums = schedule.map((day) => dayMap[day]).sort((a, b) => a - b);

  // Find next scheduled day after today
  let nextDayNum = scheduledDayNums.find((day) => day > currentDayNum);

  // If no scheduled day found this week, take first day of next week
  if (nextDayNum === undefined) {
    nextDayNum = scheduledDayNums[0];
  }

  // Calculate days until next scheduled workout
  let daysUntil = nextDayNum - currentDayNum;
  if (daysUntil <= 0) {
    daysUntil += 7; // Next week
  }

  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + daysUntil);

  return nextDate;
};

/**
 * Validate workout schedule
 */
export const validateWorkoutSchedule = (
  workoutDate: Date,
  schedule: WorkoutDay[],
  lastWorkoutDate?: string
): ScheduleValidationResult => {
  const warnings: string[] = [];
  const errors: string[] = [];
  let canProceed = true;

  // Defensive check: ensure schedule is an array
  const safeSchedule = Array.isArray(schedule) ? schedule : [];

  // Check if on scheduled day
  const isScheduledDay = isScheduledWorkoutDay(workoutDate, safeSchedule);

  if (!isScheduledDay && safeSchedule.length > 0) {
    warnings.push(
      `This is not a scheduled workout day. Your schedule: ${safeSchedule.join(', ')}`
    );

    const nextScheduled = getNextScheduledWorkout(workoutDate, safeSchedule);
    warnings.push(
      `Next scheduled workout: ${getDayOfWeek(nextScheduled)}, ${nextScheduled.toLocaleDateString()}`
    );
  }

  // Check for consecutive day training
  if (lastWorkoutDate) {
    const isConsecutive = isConsecutiveDay(workoutDate, lastWorkoutDate);
    const daysSince = getDaysSinceLastWorkout(workoutDate, lastWorkoutDate);

    if (isConsecutive) {
      errors.push(
        'Training on consecutive days is not recommended! Your body needs rest to recover and grow.'
      );
      canProceed = false;
    } else if (daysSince === 0) {
      errors.push('You already worked out today! Rest is crucial for progress.');
      canProceed = false;
    } else if (daysSince > 7) {
      warnings.push(
        `It has been ${daysSince} days since your last workout. Try to maintain consistency for best results.`
      );
    }
  }

  // Get next scheduled workout
  const nextScheduled = getNextScheduledWorkout(workoutDate, schedule);

  return {
    canProceed,
    warnings,
    errors,
    recommendation: !canProceed
      ? 'Wait at least 1 day between workouts for proper recovery'
      : isScheduledDay
      ? undefined
      : 'Consider rescheduling to your planned workout days for consistency',
    nextScheduledDate: nextScheduled.toISOString().split('T')[0],
  };
};

/**
 * Calculate workout frequency (workouts per week)
 */
export const calculateWorkoutFrequency = (
  workoutDates: string[],
  weeksToAnalyze: number = 4
): number => {
  if (workoutDates.length === 0) return 0;

  const now = new Date();
  const weeksAgo = new Date(now);
  weeksAgo.setDate(weeksAgo.getDate() - weeksToAnalyze * 7);

  const recentWorkouts = workoutDates.filter((date) => {
    const workoutDate = new Date(date);
    return workoutDate >= weeksAgo && workoutDate <= now;
  });

  return recentWorkouts.length / weeksToAnalyze;
};

/**
 * Check schedule adherence
 */
export const calculateScheduleAdherence = (
  workoutDates: string[],
  schedule: WorkoutDay[],
  weeksToAnalyze: number = 4
): {
  adherencePercentage: number;
  missedWorkouts: number;
  expectedWorkouts: number;
} => {
  if (schedule.length === 0) {
    return {
      adherencePercentage: 100,
      missedWorkouts: 0,
      expectedWorkouts: 0,
    };
  }

  const now = new Date();
  const weeksAgo = new Date(now);
  weeksAgo.setDate(weeksAgo.getDate() - weeksToAnalyze * 7);

  // Count expected workouts in the period
  const expectedWorkouts = weeksToAnalyze * schedule.length;

  // Count actual workouts in the period
  const actualWorkouts = workoutDates.filter((date) => {
    const workoutDate = new Date(date);
    return workoutDate >= weeksAgo && workoutDate <= now;
  }).length;

  const missedWorkouts = Math.max(0, expectedWorkouts - actualWorkouts);
  const adherencePercentage = Math.min(
    100,
    (actualWorkouts / expectedWorkouts) * 100
  );

  return {
    adherencePercentage,
    missedWorkouts,
    expectedWorkouts,
  };
};

/**
 * Get workout streak (consecutive weeks with workouts)
 */
export const getWorkoutStreak = (workoutDates: string[]): number => {
  if (workoutDates.length === 0) return 0;

  const sortedDates = [...workoutDates]
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime()); // Most recent first

  const now = new Date();
  let streak = 0;
  let currentWeekStart = new Date(now);
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  // Check each week going backwards
  while (true) {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Check if there's a workout in this week
    const hasWorkoutThisWeek = sortedDates.some((date) => {
      return date >= currentWeekStart && date < weekEnd;
    });

    if (hasWorkoutThisWeek) {
      streak++;
      // Move to previous week
      currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    } else {
      // Streak broken
      break;
    }

    // Safety limit: don't go back more than 52 weeks
    if (streak >= 52) break;
  }

  return streak;
};
