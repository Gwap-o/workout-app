import { useState } from 'react';
import type { WorkoutSession } from '@/types';
import { useSessionExerciseLogs } from '@/lib/hooks/useExerciseHistory';

interface WorkoutCardProps {
  workout: WorkoutSession;
  onDelete: () => void;
}

export const WorkoutCard = ({ workout, onDelete }: WorkoutCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { logs, loading } = useSessionExerciseLogs(
    isExpanded ? workout.id : null
  );

  const handleDelete = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete this workout? This cannot be undone.'
      )
    ) {
      onDelete();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
              <h3 className="text-lg font-semibold text-[#202124] dark:text-[#E6EDF3]">
                Workout {workout.workout_type}
              </h3>
              <span className="text-sm bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 text-[#20808D] dark:text-[#1FB8CD] px-2 py-1 rounded">
                Phase {workout.phase}
              </span>
              {workout.completed && (
                <span className="text-[#20808D] dark:text-[#1FB8CD] text-sm">✓ Completed</span>
              )}
            </div>
            <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mt-1">
              {formatDate(workout.date)}
            </p>
            {workout.duration && (
              <p className="text-xs text-[#80868B] dark:text-[#6E7681] mt-1">
                Duration: {workout.duration} minutes
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </button>
            <span className="text-[#80868B] dark:text-[#6E7681]">{isExpanded ? '▼' : '▶'}</span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[#E8EAED] dark:border-[#30363D] pt-4">
          {loading ? (
            <div className="text-sm text-[#5F6368] dark:text-[#8B949E]">Loading exercises...</div>
          ) : logs.length === 0 ? (
            <div className="text-sm text-[#5F6368] dark:text-[#8B949E]">
              No exercises logged for this workout
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-[#F5F5F5] dark:bg-[#161B22] rounded p-4 border border-[#E8EAED] dark:border-[#30363D]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[#202124] dark:text-[#E6EDF3]">{log.exercise_name}</h4>
                      <p className="text-xs text-[#80868B] dark:text-[#6E7681]">
                        {log.muscle_group} • {log.training_method}
                      </p>
                    </div>
                    {log.hit_progression && (
                      <span className="text-[#20808D] dark:text-[#1FB8CD] font-medium text-sm">
                        ✓ Progression
                      </span>
                    )}
                  </div>

                  {/* Sets */}
                  <div className="space-y-2">
                    {log.sets.map((set) => (
                      <div
                        key={set.set_number}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span className="w-6 h-6 flex items-center justify-center bg-[#E8EAED] dark:bg-[#30363D] rounded-full text-xs font-semibold text-[#202124] dark:text-[#E6EDF3]">
                          {set.set_number}
                        </span>
                        <span className="font-semibold text-[#202124] dark:text-[#E6EDF3]">
                          {set.weight} lbs × {set.reps} reps
                        </span>
                        {set.target_reps && (
                          <span className="text-[#5F6368] dark:text-[#8B949E]">
                            (Target: {set.target_reps})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {log.notes && (
                    <div className="mt-3 text-sm text-[#202124] dark:text-[#E6EDF3] bg-white dark:bg-[#1C2128] rounded p-2 border border-[#E8EAED] dark:border-[#30363D]">
                      <span className="font-medium">Notes:</span> {log.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Workout Notes */}
          {workout.notes && (
            <div className="mt-4 text-sm bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 rounded p-3 border border-[#20808D] dark:border-[#1FB8CD]">
              <span className="font-medium text-[#202124] dark:text-[#E6EDF3]">Workout Notes:</span>{' '}
              <span className="text-[#5F6368] dark:text-[#8B949E]">{workout.notes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
