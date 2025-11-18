import { useState } from 'react';
import { useDeload } from '@/lib/hooks/useDeload';
import { calculateDeloadRecommendation } from '@/lib/utils/deloadUtils';

interface DeloadManagementProps {
  weeksSinceLastDeload?: number;
  recentPlateaus?: number;
}

export const DeloadManagement = ({
  weeksSinceLastDeload = 0,
  recentPlateaus = 0,
}: DeloadManagementProps) => {
  const { isDeloadActive, currentDeload, startDeload, endDeload, refetch } = useDeload();
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);

  const recommendation = calculateDeloadRecommendation(
    weeksSinceLastDeload,
    recentPlateaus
  );

  const handleStartDeload = async (reason: 'plateau' | 'scheduled' | 'manual') => {
    try {
      setStarting(true);
      const result = await startDeload(reason, recommendation.recommendedReduction);
      if (result) {
        alert('Deload week started! All exercise weights will be reduced.');
        refetch();
      } else {
        alert('Failed to start deload week. Please try again.');
      }
    } catch (error) {
      console.error('Error starting deload:', error);
      alert('Error starting deload week.');
    } finally {
      setStarting(false);
    }
  };

  const handleEndDeload = async () => {
    try {
      setEnding(true);
      const success = await endDeload();
      if (success) {
        alert('Deload week ended! Resume normal training.');
        refetch();
      } else {
        alert('Failed to end deload week. Please try again.');
      }
    } catch (error) {
      console.error('Error ending deload:', error);
      alert('Error ending deload week.');
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C2128] rounded-lg shadow border border-[#E8EAED] dark:border-[#30363D] p-6">
      <h2 className="text-xl font-bold text-[#202124] dark:text-[#E6EDF3] mb-4">
        Deload Week Management
      </h2>

      {/* Current Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#5F6368] dark:text-[#8B949E]">
            Status:
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isDeloadActive
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            }`}
          >
            {isDeloadActive ? 'Deload Active' : 'Normal Training'}
          </span>
        </div>

        {currentDeload && (
          <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              <strong>Reason:</strong>{' '}
              {currentDeload.reason === 'plateau'
                ? 'Plateau Break'
                : currentDeload.reason === 'scheduled'
                ? 'Scheduled Recovery'
                : 'Manual'}
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
              <strong>Dates:</strong> {currentDeload.start_date} to{' '}
              {currentDeload.end_date}
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
              <strong>Weight Reduction:</strong> {currentDeload.weight_reduction_percentage}%
            </p>
          </div>
        )}
      </div>

      {/* Recommendation */}
      {!isDeloadActive && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#202124] dark:text-[#E6EDF3] mb-2">
            Deload Recommendation
          </h3>
          <div
            className={`p-4 rounded-lg border ${
              recommendation.shouldDeload
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
            }`}
          >
            <p
              className={`text-sm font-medium ${
                recommendation.shouldDeload
                  ? 'text-yellow-800 dark:text-yellow-200'
                  : 'text-green-800 dark:text-green-200'
              }`}
            >
              {recommendation.reason}
            </p>
            {recommendation.shouldDeload && (
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                Recommended reduction: {recommendation.recommendedReduction}%
              </p>
            )}
          </div>
        </div>
      )}

      {/* Training Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="bg-[#F5F5F5] dark:bg-[#161B22] p-3 rounded">
          <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">Weeks Since Deload</p>
          <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">
            {weeksSinceLastDeload}
          </p>
        </div>
        <div className="bg-[#F5F5F5] dark:bg-[#161B22] p-3 rounded">
          <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">Recent Plateaus</p>
          <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">
            {recentPlateaus}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {isDeloadActive ? (
          <button
            onClick={handleEndDeload}
            disabled={ending}
            className="w-full px-4 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {ending ? 'Ending...' : 'End Deload Week'}
          </button>
        ) : (
          <>
            {recommendation.shouldDeload && (
              <button
                onClick={() =>
                  handleStartDeload(
                    weeksSinceLastDeload >= 6 ? 'scheduled' : 'plateau'
                  )
                }
                disabled={starting}
                className="w-full px-4 py-3 bg-[#20808D] dark:bg-[#1FB8CD] text-white rounded-lg hover:bg-[#1A6B76] dark:hover:bg-[#2DD4E8] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {starting ? 'Starting...' : 'Start Recommended Deload'}
              </button>
            )}
            <button
              onClick={() => handleStartDeload('manual')}
              disabled={starting}
              className="w-full px-4 py-3 bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] rounded-lg hover:bg-[#E8EAED] dark:hover:bg-[#1C2128] font-medium border border-[#E8EAED] dark:border-[#30363D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {starting ? 'Starting...' : 'Start Manual Deload'}
            </button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          About Deload Weeks
        </h4>
        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Deload every 6-8 weeks for recovery</li>
          <li>• Reduce weights by 10-15%, keep sets and reps</li>
          <li>• Focus on perfect form and technique</li>
          <li>• Allows CNS and muscles to fully recover</li>
          <li>• Often leads to strength gains afterward</li>
        </ul>
      </div>
    </div>
  );
};
