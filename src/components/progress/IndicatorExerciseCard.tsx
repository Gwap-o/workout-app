import { useState, useEffect } from 'react';
import type { ExerciseLog } from '@/types';
import {
  type IndicatorExerciseName,
  INDICATOR_STRENGTH_STANDARDS,
  calculateIndicatorProgress,
} from '@/lib/constants/indicatorExercises';
import { useExerciseHistory } from '@/lib/hooks/useExerciseHistory';

interface IndicatorExerciseCardProps {
  exerciseName: IndicatorExerciseName;
}

export const IndicatorExerciseCard = ({
  exerciseName,
}: IndicatorExerciseCardProps) => {
  const { logs, loading } = useExerciseHistory(exerciseName, 10);
  const [isExpanded, setIsExpanded] = useState(false);

  const standard = INDICATOR_STRENGTH_STANDARDS[exerciseName];
  const latestLog = logs && logs.length > 0 ? logs[0] : null;
  const currentWeight = latestLog?.sets?.[0]?.weight || 0;
  const currentReps = latestLog?.sets?.[0]?.reps || 0;

  const progress = calculateIndicatorProgress(exerciseName, currentWeight);

  // Calculate trend (last 3 workouts)
  const recentLogs = logs && logs.length > 0 ? logs.slice(0, 3) : [];
  const trend =
    recentLogs.length >= 2 && recentLogs[0]?.sets?.[0] && recentLogs[recentLogs.length - 1]?.sets?.[0]
      ? recentLogs[0].sets[0].weight - recentLogs[recentLogs.length - 1].sets[0].weight
      : 0;

  // Determine status
  const getStatus = () => {
    if (!latestLog) return { color: 'gray', text: 'Not Started', icon: '⚪' };
    if (progress.level === 'advanced') return { color: 'purple', text: 'Elite', icon: '👑' };
    if (progress.level === 'intermediate')
      return { color: 'green', text: 'Greek God', icon: '⚡' };
    if (trend > 0) return { color: 'blue', text: 'Progressing', icon: '📈' };
    if (trend === 0) return { color: 'yellow', text: 'Plateau', icon: '⏸️' };
    return { color: 'red', text: 'Regressing', icon: '📉' };
  };

  const status = getStatus();

  // Progress bar width (capped at 100% for display)
  const progressBarWidth = Math.min(
    ((currentWeight - standard.beginner) /
      (standard.intermediate - standard.beginner)) *
      100,
    100
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1C2128] rounded-lg shadow border border-[#E8EAED] dark:border-[#30363D] p-6 animate-pulse">
        <div className="h-6 bg-[#F5F5F5] dark:bg-[#161B22] rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-[#F5F5F5] dark:bg-[#161B22] rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1C2128] rounded-lg shadow border border-[#E8EAED] dark:border-[#30363D] hover:border-[#20808D] dark:hover:border-[#1FB8CD] transition-colors">
      {/* Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-[#202124] dark:text-[#E6EDF3]">
                {exerciseName}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  status.color === 'green'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : status.color === 'blue'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : status.color === 'yellow'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    : status.color === 'red'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : status.color === 'purple'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#5F6368] dark:text-[#8B949E]'
                }`}
              >
                {status.icon} {status.text}
              </span>
            </div>
            <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">
              {standard.description}
            </p>
          </div>
          <span className="text-[#80868B] dark:text-[#6E7681] ml-4">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>

        {/* Current Performance */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mb-1">
              Current Best
            </p>
            <p className="text-2xl font-bold text-[#20808D] dark:text-[#1FB8CD]">
              {currentWeight > 0 ? `${currentWeight} lbs` : '--'}
            </p>
            {currentReps > 0 && (
              <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">
                × {currentReps} reps
              </p>
            )}
          </div>
          <div>
            <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mb-1">
              Greek God Target
            </p>
            <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">
              {standard.intermediate} lbs
            </p>
            <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">
              for reps (5+)
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-[#5F6368] dark:text-[#8B949E] mb-1">
            <span>Progress to Greek God</span>
            <span>{Math.round(progressBarWidth)}%</span>
          </div>
          <div className="h-3 bg-[#F5F5F5] dark:bg-[#161B22] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#20808D] to-[#1FB8CD] transition-all duration-500"
              style={{ width: `${progressBarWidth}%` }}
            />
          </div>
        </div>

        {/* Next Milestone */}
        {currentWeight < standard.intermediate && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5F6368] dark:text-[#8B949E]">
              Next milestone: {progress.nextMilestone} lbs
            </span>
            <span className="font-medium text-[#20808D] dark:text-[#1FB8CD]">
              {progress.nextMilestone - currentWeight} lbs to go
            </span>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-[#E8EAED] dark:border-[#30363D] pt-4 space-y-4">
          {/* Strength Standards */}
          <div>
            <h4 className="text-sm font-semibold text-[#202124] dark:text-[#E6EDF3] mb-3">
              Strength Standards
            </h4>
            <div className="space-y-2">
              <div
                className={`flex items-center justify-between p-2 rounded ${
                  progress.level === 'beginner' && currentWeight < standard.beginner
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    : 'bg-[#F5F5F5] dark:bg-[#161B22]'
                }`}
              >
                <span className="text-sm text-[#202124] dark:text-[#E6EDF3]">
                  Beginner
                </span>
                <span className="text-sm font-medium text-[#5F6368] dark:text-[#8B949E]">
                  {standard.beginner} lbs
                </span>
              </div>
              <div
                className={`flex items-center justify-between p-2 rounded ${
                  progress.level === 'intermediate' ||
                  (progress.level === 'beginner' && currentWeight >= standard.beginner)
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-[#F5F5F5] dark:bg-[#161B22]'
                }`}
              >
                <span className="text-sm font-semibold text-[#202124] dark:text-[#E6EDF3]">
                  ⚡ Greek God (Target)
                </span>
                <span className="text-sm font-bold text-[#20808D] dark:text-[#1FB8CD]">
                  {standard.intermediate} lbs
                </span>
              </div>
              <div
                className={`flex items-center justify-between p-2 rounded ${
                  progress.level === 'advanced'
                    ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                    : 'bg-[#F5F5F5] dark:bg-[#161B22]'
                }`}
              >
                <span className="text-sm text-[#202124] dark:text-[#E6EDF3]">
                  👑 Elite
                </span>
                <span className="text-sm font-medium text-[#5F6368] dark:text-[#8B949E]">
                  {standard.advanced} lbs
                </span>
              </div>
            </div>
          </div>

          {/* Recent History */}
          {logs.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[#202124] dark:text-[#E6EDF3] mb-3">
                Recent Workouts
              </h4>
              <div className="space-y-2">
                {logs.slice(0, 5).map((log, index) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-2 rounded bg-[#F5F5F5] dark:bg-[#161B22]"
                  >
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[#20808D] dark:bg-[#1FB8CD] text-white font-medium">
                          Latest
                        </span>
                      )}
                      <span className="text-sm text-[#5F6368] dark:text-[#8B949E]">
                        {new Date(log.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#202124] dark:text-[#E6EDF3]">
                        {log.sets?.[0]?.weight || 0} lbs × {log.sets?.[0]?.reps || 0}
                      </p>
                      {index > 0 && logs[index - 1] && logs[index - 1].sets?.[0] && log.sets?.[0] && (
                        <p
                          className={`text-xs ${
                            log.sets[0].weight > logs[index - 1].sets[0].weight
                              ? 'text-green-600 dark:text-green-400'
                              : log.sets[0].weight < logs[index - 1].sets[0].weight
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-[#5F6368] dark:text-[#8B949E]'
                          }`}
                        >
                          {log.sets[0].weight > logs[index - 1].sets[0].weight && '↑ '}
                          {log.sets[0].weight < logs[index - 1].sets[0].weight && '↓ '}
                          {log.sets[0].weight === logs[index - 1].sets[0].weight && '= '}
                          {Math.abs(
                            log.sets[0].weight - logs[index - 1].sets[0].weight
                          )}{' '}
                          lbs
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Data State */}
          {logs.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mb-2">
                No workout data yet
              </p>
              <p className="text-xs text-[#80868B] dark:text-[#6E7681]">
                Complete a workout with {exerciseName} to start tracking progress
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
