import type { Exercise } from '@/types';

interface TrainingMethodBadgeProps {
  trainingMethod: Exercise['training_method'];
  showDescription?: boolean;
}

const TRAINING_METHOD_INFO = {
  RPT: {
    label: 'RPT',
    fullName: 'Reverse Pyramid Training',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    icon: '⬇️',
    description: 'Reverse Pyramid: Start heavy, reduce weight 10% each set',
  },
  Kino: {
    label: 'Kino',
    fullName: 'Kino Training',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    icon: '⬆️',
    description: 'Kino Training: Start light, increase weight each set',
  },
  RestPause: {
    label: 'Rest-Pause',
    fullName: 'Rest-Pause Training',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    icon: '⏸️',
    description: '1 heavy set + 3 mini-sets with 10-15 second rests',
  },
  StraightSets: {
    label: 'Straight Sets',
    fullName: 'Straight Sets',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
    icon: '➡️',
    description: 'Straight Sets: Same weight and reps for all sets',
  },
  'Intermediate RPT': {
    label: 'RPT (2min)',
    fullName: 'Intermediate RPT',
    color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
    icon: '⬇️',
    description: 'Intermediate RPT: Same as RPT with 2-min rest periods',
  },
};

export const TrainingMethodBadge = ({
  trainingMethod,
  showDescription = false,
}: TrainingMethodBadgeProps) => {
  const info = TRAINING_METHOD_INFO[trainingMethod];

  return (
    <div className="inline-flex flex-col gap-1">
      {/* Badge */}
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${info.color}`}
        title={info.fullName}
      >
        <span>{info.icon}</span>
        <span>{info.label}</span>
      </div>

      {/* Description (optional) */}
      {showDescription && (
        <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">
          {info.description}
        </p>
      )}
    </div>
  );
};

/**
 * Training Method Legend - Shows all training methods with descriptions
 */
export const TrainingMethodLegend = () => {
  return (
    <div className="bg-[#F8F9FA] dark:bg-[#161B22] rounded-lg p-4 border border-[#E8EAED] dark:border-[#30363D]">
      <h3 className="text-sm font-semibold text-[#202124] dark:text-[#E6EDF3] mb-3 flex items-center gap-2">
        <span>🎯</span>
        Training Methods Guide
      </h3>
      <div className="space-y-2">
        {Object.entries(TRAINING_METHOD_INFO).map(([method, info]) => (
          <div
            key={method}
            className="flex items-start gap-3 p-2 rounded bg-white dark:bg-[#0D1117]"
          >
            <div className="flex-shrink-0">
              <div className={`px-2 py-0.5 rounded border text-xs font-medium ${info.color}`}>
                {info.icon} {info.label}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-[#202124] dark:text-[#E6EDF3] mb-0.5">
                {info.fullName}
              </p>
              <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">
                {info.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
