import { useState } from 'react';
import type { SetLog } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface RestPauseMiniSetsProps {
  mainSet: SetLog;
  miniSets: SetLog[];
  onUpdateMiniSet: (miniSetIndex: number, field: 'weight' | 'reps', value: number) => void;
  onCompleteMiniSet: (miniSetIndex: number) => void;
}

/**
 * RestPauseMiniSets Component
 *
 * Displays the rest-pause training structure:
 * - 1 heavy main set
 * - 3 mini-sets with 10-15 second rests
 *
 * Mini-sets typically use same weight as main set but with fewer reps
 */
export const RestPauseMiniSets = ({
  mainSet,
  miniSets,
  onUpdateMiniSet,
  onCompleteMiniSet,
}: RestPauseMiniSetsProps) => {
  const [expandedMiniSets, setExpandedMiniSets] = useState(true);

  return (
    <div className="mt-3 border-t border-[#E8EAED] dark:border-[#30363D] pt-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandedMiniSets(!expandedMiniSets)}
            className="text-[#5F6368] dark:text-[#8B949E] hover:text-[#202124] dark:hover:text-[#E6EDF3]"
          >
            {expandedMiniSets ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          <h4 className="text-sm font-semibold text-[#202124] dark:text-[#E6EDF3]">
            Mini-Sets (10-15 sec rest)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-700">
            ⏸️ Rest-Pause
          </span>
        </div>
      </div>

      {/* Mini-Sets Grid */}
      {expandedMiniSets && (
        <div className="space-y-2">
          <div className="bg-[#F8F9FA] dark:bg-[#161B22] rounded-lg p-3 border border-[#E8EAED] dark:border-[#30363D]">
            <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mb-2">
              💡 <strong>Rest-Pause Technique:</strong> After the main heavy set, take 10-15
              second rests between mini-sets. Use the same weight but expect fewer reps.
            </p>
          </div>

          {miniSets.map((miniSet, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 gap-2 p-3 rounded-lg border-2 ${
                miniSet.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  : 'bg-white dark:bg-[#0D1117] border-[#E8EAED] dark:border-[#30363D]'
              }`}
            >
              {/* Mini-Set Label */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#5F6368] dark:text-[#8B949E]">
                  Mini {index + 1}
                </span>
              </div>

              {/* Weight Input */}
              <div>
                <label className="text-xs text-[#5F6368] dark:text-[#8B949E] block mb-1">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={miniSet.weight || mainSet.weight}
                  onChange={(e) =>
                    onUpdateMiniSet(index, 'weight', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-2 py-1 text-sm border border-[#E8EAED] dark:border-[#30363D] rounded bg-white dark:bg-[#0D1117] text-[#202124] dark:text-[#E6EDF3]"
                  disabled={miniSet.completed}
                />
              </div>

              {/* Reps Input */}
              <div>
                <label className="text-xs text-[#5F6368] dark:text-[#8B949E] block mb-1">
                  Reps
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={miniSet.reps || 0}
                    onChange={(e) =>
                      onUpdateMiniSet(index, 'reps', parseInt(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 text-sm border border-[#E8EAED] dark:border-[#30363D] rounded bg-white dark:bg-[#0D1117] text-[#202124] dark:text-[#E6EDF3]"
                    disabled={miniSet.completed}
                  />
                  {!miniSet.completed && (miniSet.weight || 0) > 0 && (miniSet.reps || 0) > 0 && (
                    <button
                      onClick={() => onCompleteMiniSet(index)}
                      className="px-2 py-1 text-xs bg-[#20808D] dark:bg-[#1FB8CD] text-white rounded hover:bg-[#1A6B76] dark:hover:bg-[#2DD4E8]"
                      title="Mark complete"
                    >
                      ✓
                    </button>
                  )}
                  {miniSet.completed && (
                    <span className="text-xs text-green-600 dark:text-green-400">✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="flex items-center justify-between text-xs text-[#5F6368] dark:text-[#8B949E] mt-2">
            <span>
              Total Mini-Sets: {miniSets.filter((s) => s.completed).length}/{miniSets.length}
            </span>
            <span>
              Total Reps: {miniSets.reduce((sum, s) => sum + (s.reps || 0), 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
