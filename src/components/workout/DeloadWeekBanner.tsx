import { useState } from 'react';
import { getDeloadGuidance, getDeloadBenefits, calculateDeloadWeight } from '@/lib/utils/deloadUtils';

interface DeloadWeekBannerProps {
  isDeloadWeek: boolean;
  reductionPercentage?: number;
  onStartDeload?: () => void;
  onEndDeload?: () => void;
}

export const DeloadWeekBanner = ({
  isDeloadWeek,
  reductionPercentage = 10,
  onStartDeload,
  onEndDeload,
}: DeloadWeekBannerProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const guidance = getDeloadGuidance();
  const benefits = getDeloadBenefits();

  if (!isDeloadWeek) {
    return null;
  }

  return (
    <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
              🔄 Deload Week Active
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Recovery week - reduce all weights by {reductionPercentage}%
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 text-sm font-medium"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Quick Tips */}
      <div className="bg-white dark:bg-purple-950/30 rounded-lg p-4 mb-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="flex items-start gap-2">
            <span className="text-2xl">💪</span>
            <div>
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Same Volume</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">Keep sets and reps</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Lighter Load</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">-{reductionPercentage}% weight</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Perfect Form</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">Focus on technique</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="space-y-4">
          {/* Guidance */}
          <div className="bg-white dark:bg-purple-950/30 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Deload Week Protocol
            </h4>
            <ul className="space-y-2">
              {guidance.map((tip, index) => (
                <li
                  key={index}
                  className="text-sm text-purple-800 dark:text-purple-200 flex items-start gap-2"
                >
                  <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-white dark:bg-purple-950/30 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Why Deload?
            </h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="text-sm text-purple-800 dark:text-purple-200 flex items-start gap-2"
                >
                  <span className="text-purple-600 dark:text-purple-400 mt-0.5">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Example Weight Calculation */}
          <div className="bg-purple-100 dark:bg-purple-900/40 rounded-lg p-4 border border-purple-300 dark:border-purple-700">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Example Weight Calculations:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[100, 150, 200, 250].map((weight) => (
                <div
                  key={weight}
                  className="bg-white dark:bg-purple-950/50 p-2 rounded border border-purple-200 dark:border-purple-800"
                >
                  <p className="text-purple-600 dark:text-purple-400 font-mono text-xs">
                    {weight} lbs
                  </p>
                  <p className="text-purple-900 dark:text-purple-100 font-bold">
                    → {calculateDeloadWeight(weight, reductionPercentage)} lbs
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {onEndDeload && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onEndDeload}
            className="px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 font-medium text-sm transition-colors"
          >
            End Deload Week
          </button>
        </div>
      )}
    </div>
  );
};
