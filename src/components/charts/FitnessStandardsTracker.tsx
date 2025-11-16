// Fitness Standards Tracker Component
// Shows current tier and progress to next tier for each exercise

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTierColor, getTierDisplayName, type TierProgress } from '@/lib/utils/fitnessStandards';
import { Trophy, Target } from 'lucide-react';

interface FitnessStandardsTrackerProps {
  tierProgress: TierProgress[];
  userBodyweight: number;
}

const TierBadge = ({ tier }: { tier: string }) => {
  const tierLevel = tier as 'beginner' | 'good' | 'great' | 'godlike';
  const colorClass = getTierColor(tierLevel);
  const displayName = getTierDisplayName(tierLevel);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${colorClass}`}
    >
      {displayName}
    </span>
  );
};

const ProgressBar = ({ percentage, tier }: { percentage: number; tier: string }) => {
  const tierLevel = tier as 'beginner' | 'good' | 'great' | 'godlike';
  const colorClass = getTierColor(tierLevel);

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full transition-all duration-500 ease-out ${colorClass}`}
        style={{ width: `${Math.min(100, percentage)}%` }}
      />
    </div>
  );
};

const TierProgressCard = ({ progress }: { progress: TierProgress }) => {
  const isMaxTier = progress.currentTier === 'godlike';

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{progress.exercise}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Current Max: <span className="font-medium">{progress.currentWeight} lbs</span>
          </p>
        </div>
        <TierBadge tier={progress.currentTier} />
      </div>

      {!isMaxTier && progress.nextTier && progress.nextTierWeight && progress.poundsAway ? (
        <>
          <div className="mb-2">
            <ProgressBar percentage={progress.percentageToNext} tier={progress.currentTier} />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Next: {getTierDisplayName(progress.nextTier)}
            </span>
            <span className="font-medium">
              {progress.poundsAway} lbs away ({progress.nextTierWeight} lbs)
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium">
          <Trophy className="w-4 h-4" />
          Maximum tier achieved!
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Strength Score:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {progress.strengthScore}/100
          </span>
        </div>
      </div>
    </div>
  );
};

export const FitnessStandardsTracker = ({
  tierProgress,
  userBodyweight,
}: FitnessStandardsTrackerProps) => {
  if (tierProgress.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fitness Standards</CardTitle>
          <CardDescription>Track your progress toward strength tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Target className="w-12 h-12 mb-3 opacity-50" />
            <p>No exercise data available</p>
            <p className="text-sm mt-1">Start logging workouts to track your fitness standards</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate summary stats
  const totalExercises = tierProgress.length;
  const tierCounts = tierProgress.reduce(
    (acc, p) => {
      acc[p.currentTier] = (acc[p.currentTier] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const avgStrengthScore =
    tierProgress.reduce((sum, p) => sum + p.strengthScore, 0) / totalExercises;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Fitness Standards
        </CardTitle>
        <CardDescription>
          Track your progress toward Good, Great, and Godlike strength tiers (for {userBodyweight}{' '}
          lbs bodyweight)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalExercises}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Tracked Exercises</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {tierCounts.godlike || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Godlike</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {tierCounts.great || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Great</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {avgStrengthScore.toFixed(0)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Avg. Score</p>
          </div>
        </div>

        {/* Exercise Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tierProgress.map((progress) => (
            <TierProgressCard key={progress.exercise} progress={progress} />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tier Guide:
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-500" />
              <span>Beginner (0-25)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Good (25-50)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Great (50-75)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Godlike (75-100)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
