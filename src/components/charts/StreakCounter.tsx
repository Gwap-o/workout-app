// Streak Counter Component
// Shows current workout streak and consistency metrics

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Trophy, Calendar, TrendingUp } from 'lucide-react';
import type { StreakData } from '@/lib/utils/analytics';

interface StreakCounterProps {
  streakData: StreakData;
  targetWorkoutsPerWeek?: number;
}

export const StreakCounter = ({
  streakData,
  targetWorkoutsPerWeek = 3,
}: StreakCounterProps) => {
  const { currentStreak, longestStreak, thisWeekWorkouts, weeklyConsistency } = streakData;

  const remainingThisWeek = Math.max(0, targetWorkoutsPerWeek - thisWeekWorkouts);
  const isOnTrack = thisWeekWorkouts >= targetWorkoutsPerWeek;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Streak */}
      <Card className={currentStreak > 0 ? 'border-orange-500 dark:border-orange-400' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {currentStreak}
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">
              {currentStreak === 1 ? 'week' : 'weeks'}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {currentStreak > 0
              ? 'Keep it going! 🔥'
              : 'Complete 3 workouts this week to start'}
          </p>
        </CardContent>
      </Card>

      {/* Longest Streak */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Longest Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {longestStreak}
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">
              {longestStreak === 1 ? 'week' : 'weeks'}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {longestStreak === currentStreak && longestStreak > 0
              ? 'New personal record!'
              : 'All-time best'}
          </p>
        </CardContent>
      </Card>

      {/* This Week */}
      <Card className={isOnTrack ? 'border-green-500 dark:border-green-400' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {thisWeekWorkouts}/{targetWorkoutsPerWeek}
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">
              workouts
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {isOnTrack ? (
              <span className="text-green-600 dark:text-green-400 font-medium">On track! ✓</span>
            ) : (
              <span>
                {remainingThisWeek} more to hit your goal
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Weekly Consistency */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            Consistency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {weeklyConsistency}%
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Last 12 weeks
          </p>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                weeklyConsistency >= 80
                  ? 'bg-green-500'
                  : weeklyConsistency >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${weeklyConsistency}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
