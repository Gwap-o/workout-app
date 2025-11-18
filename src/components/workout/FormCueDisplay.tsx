import { useState } from 'react';
import { getFormCues, hasFormCues } from '@/lib/constants/formCues';

interface FormCueDisplayProps {
  exerciseName: string;
  showFormCues: boolean;
}

export const FormCueDisplay = ({ exerciseName, showFormCues }: FormCueDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formCues = getFormCues(exerciseName);

  // Don't render if no form cues or user has disabled them
  if (!showFormCues || !hasFormCues(exerciseName)) {
    return null;
  }

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Form Cues ({formCues.length})
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-blue-600 dark:text-blue-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
          <ul className="space-y-2">
            {formCues.map((cue, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-100"
              >
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{cue}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 italic">
              💡 Review form cues before your first set for best results
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
