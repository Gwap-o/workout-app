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
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">
                Workout {workout.workout_type}
              </h3>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Phase {workout.phase}
              </span>
              {workout.completed && (
                <span className="text-green-600 text-sm">✓ Completed</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(workout.date)}
            </p>
            {workout.duration && (
              <p className="text-xs text-gray-500 mt-1">
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
              className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded hover:bg-red-50"
            >
              Delete
            </button>
            <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading exercises...</div>
          ) : logs.length === 0 ? (
            <div className="text-sm text-gray-500">
              No exercises logged for this workout
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-gray-50 rounded p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{log.exercise_name}</h4>
                      <p className="text-xs text-gray-500">
                        {log.muscle_group} • {log.training_method}
                      </p>
                    </div>
                    {log.hit_progression && (
                      <span className="text-green-600 font-medium text-sm">
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
                        <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs font-semibold">
                          {set.set_number}
                        </span>
                        <span className="font-semibold">
                          {set.weight} lbs × {set.reps} reps
                        </span>
                        {set.target_reps && (
                          <span className="text-gray-500">
                            (Target: {set.target_reps})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {log.notes && (
                    <div className="mt-3 text-sm text-gray-700 bg-white rounded p-2">
                      <span className="font-medium">Notes:</span> {log.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Workout Notes */}
          {workout.notes && (
            <div className="mt-4 text-sm bg-blue-50 rounded p-3">
              <span className="font-medium">Workout Notes:</span>{' '}
              {workout.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
