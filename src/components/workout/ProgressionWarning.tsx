import { useState } from 'react';
import type {
  ProgressionWarning as ProgressionWarningType,
  GuardrailCheck,
} from '@/lib/utils/progressionValidation';
import { getSeverityColor } from '@/lib/utils/progressionValidation';

interface ProgressionWarningProps {
  guardrailCheck: GuardrailCheck;
  onOverride?: () => void;
  onCancel?: () => void;
}

export const ProgressionWarning = ({
  guardrailCheck,
  onOverride,
  onCancel,
}: ProgressionWarningProps) => {
  const [userAcknowledged, setUserAcknowledged] = useState(false);

  if (guardrailCheck.warnings.length === 0) return null;

  const hasErrors = guardrailCheck.warnings.some((w) => w.severity === 'error');
  const hasWarnings = guardrailCheck.warnings.some((w) => w.severity === 'warning');

  return (
    <div className="mt-3 space-y-2">
      {/* Individual Warnings */}
      {guardrailCheck.warnings.map((warning, index) => {
        const colors = getSeverityColor(warning.severity);

        return (
          <div
            key={index}
            className={`rounded-lg p-3 border-2 ${colors.bg} ${colors.border}`}
          >
            {/* Warning Header */}
            <div className="flex items-start gap-2 mb-2">
              <span className="text-xl flex-shrink-0">{colors.icon}</span>
              <div className="flex-1">
                <h4 className={`font-semibold text-sm ${colors.text}`}>
                  {warning.severity === 'error' && '⛔ Cannot Proceed'}
                  {warning.severity === 'warning' && '⚠️ Warning'}
                  {warning.severity === 'info' && 'ℹ️ Notice'}
                </h4>
                <p className={`text-sm mt-1 ${colors.text}`}>{warning.message}</p>
              </div>
            </div>

            {/* Recommendation */}
            <div
              className={`mt-2 p-2 rounded border text-xs ${
                warning.severity === 'error'
                  ? 'bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-800'
                  : warning.severity === 'warning'
                  ? 'bg-yellow-100 dark:bg-yellow-950/40 border-yellow-300 dark:border-yellow-800'
                  : 'bg-blue-100 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800'
              }`}
            >
              <p
                className={`font-medium ${
                  warning.severity === 'error'
                    ? 'text-red-900 dark:text-red-100'
                    : warning.severity === 'warning'
                    ? 'text-yellow-900 dark:text-yellow-100'
                    : 'text-blue-900 dark:text-blue-100'
                }`}
              >
                💡 {warning.recommendation}
              </p>
            </div>

            {/* Override Status */}
            {warning.canOverride && (
              <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-300">
                ⓘ This warning can be overridden if you understand the risks
              </div>
            )}
          </div>
        );
      })}

      {/* Overall Severity Badge */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${
          guardrailCheck.overallSeverity === 'danger'
            ? 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 border border-red-400 dark:border-red-700'
            : guardrailCheck.overallSeverity === 'caution'
            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-400 dark:border-yellow-700'
            : 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border border-green-400 dark:border-green-700'
        }`}
      >
        {guardrailCheck.overallSeverity === 'danger' && '🛑 High Risk'}
        {guardrailCheck.overallSeverity === 'caution' && '⚠️ Proceed with Caution'}
        {guardrailCheck.overallSeverity === 'safe' && '✅ Safe to Proceed'}
      </div>

      {/* Action Buttons */}
      {(hasErrors || hasWarnings) && (onOverride || onCancel) && (
        <div className="flex gap-2 mt-3">
          {/* Cancel Button */}
          {onCancel && (
            <button
              onClick={onCancel}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                hasErrors
                  ? 'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600'
                  : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] border border-[#E8EAED] dark:border-[#30363D] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
              }`}
            >
              {hasErrors ? 'Adjust Numbers' : 'Cancel'}
            </button>
          )}

          {/* Override Button (only if no hard errors) */}
          {!hasErrors && guardrailCheck.canProceed && onOverride && (
            <>
              {!userAcknowledged ? (
                <button
                  onClick={() => setUserAcknowledged(true)}
                  className="flex-1 px-4 py-2 bg-yellow-600 dark:bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-600 font-medium transition-colors"
                >
                  I Understand the Risks
                </button>
              ) : (
                <button
                  onClick={onOverride}
                  className="flex-1 px-4 py-2 bg-[#20808D] dark:bg-[#1FB8CD] text-white rounded-lg hover:bg-[#1A6B76] dark:hover:bg-[#2DD4E8] font-medium transition-colors"
                >
                  ✓ Proceed Anyway
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Hard Error Help Text */}
      {hasErrors && !guardrailCheck.canProceed && (
        <p className="text-xs text-red-700 dark:text-red-300 mt-2 text-center">
          These safety limits protect you from injury. Please adjust your numbers.
        </p>
      )}
    </div>
  );
};

/**
 * Compact inline warning for minor issues
 */
interface InlineProgressionWarningProps {
  warning: ProgressionWarningType;
}

export const InlineProgressionWarning = ({
  warning,
}: InlineProgressionWarningProps) => {
  const colors = getSeverityColor(warning.severity);

  return (
    <div className={`mt-2 p-2 rounded-lg border text-xs ${colors.bg} ${colors.border}`}>
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0">{colors.icon}</span>
        <div className="flex-1">
          <p className={`font-medium ${colors.text}`}>{warning.message}</p>
          {warning.recommendation && (
            <p className={`mt-1 ${colors.text} opacity-80`}>
              💡 {warning.recommendation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
