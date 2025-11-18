import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTimerCompleteSound } from '@/lib/utils/audio';

interface RestTimerProps {
  duration: number; // Duration in seconds
  onComplete: (actualRestTime: number) => void;
  onSkip?: () => void;
  autoStart?: boolean;
  exerciseName: string;
  soundEnabled?: boolean;
}

export const RestTimer = ({
  duration,
  onComplete,
  onSkip,
  autoStart = true,
  exerciseName,
  soundEnabled = true,
}: RestTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPulsing, setIsPulsing] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get color based on time remaining
  const getColorClass = (): string => {
    if (timeRemaining > 60) {
      return 'text-green-600 dark:text-green-400';
    } else if (timeRemaining > 30) {
      return 'text-yellow-600 dark:text-yellow-400';
    } else {
      return 'text-red-600 dark:text-red-400';
    }
  };

  // Get progress bar color
  const getProgressColor = (): string => {
    if (timeRemaining > 60) {
      return 'bg-green-500 dark:bg-green-400';
    } else if (timeRemaining > 30) {
      return 'bg-yellow-500 dark:bg-yellow-400';
    } else {
      return 'bg-red-500 dark:bg-red-400';
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((duration - timeRemaining) / duration) * 100;

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning || hasCompleted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setHasCompleted(true);
          setIsPulsing(true);

          // Play completion sound
          playTimerCompleteSound(soundEnabled);

          // Calculate actual rest time
          const actualRestTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
          onComplete(actualRestTime);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, hasCompleted, onComplete, soundEnabled]);

  // Toggle pause/resume
  const handleTogglePause = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  // Add 30 seconds
  const handleAddTime = useCallback(() => {
    setTimeRemaining((prev) => prev + 30);
  }, []);

  // Skip timer
  const handleSkip = useCallback(() => {
    const actualRestTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setIsRunning(false);
    setHasCompleted(true);

    // Always call onComplete with actual rest time
    onComplete(actualRestTime);

    // Also call onSkip if provided for additional UI handling
    if (onSkip) {
      onSkip();
    }
  }, [onComplete, onSkip]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div
          className={`my-3 p-4 rounded-lg border ${
            hasCompleted
              ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700'
              : 'bg-[#F5F5F5] dark:bg-[#161B22] border-[#E8EAED] dark:border-[#30363D]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-[#5F6368] dark:text-[#8B949E]">
              Rest Period
            </div>
            <div className="text-xs text-[#5F6368] dark:text-[#8B949E]">
              Recommended: {formatTime(duration)}
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-3">
            <motion.div
              animate={isPulsing ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: hasCompleted ? Infinity : 0 }}
              className={`text-5xl font-bold ${getColorClass()}`}
            >
              {formatTime(timeRemaining)}
            </motion.div>
            {hasCompleted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-green-600 dark:text-green-400 mt-2"
              >
                Rest Complete! Ready for next set
              </motion.div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#E8EAED] dark:bg-[#30363D] rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full ${getProgressColor()}`}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {/* Pause/Resume Button */}
            {!hasCompleted && (
              <button
                onClick={handleTogglePause}
                className="flex-1 px-4 py-2 bg-[#20808D] hover:bg-[#1a6b76] dark:bg-[#1FB8CD] dark:hover:bg-[#1aa3b5] text-white rounded-lg font-medium text-sm transition-colors"
              >
                {isRunning ? 'Pause' : 'Resume'}
              </button>
            )}

            {/* Add Time Button */}
            {!hasCompleted && (
              <button
                onClick={handleAddTime}
                className="px-4 py-2 bg-[#5F6368] hover:bg-[#4a4f54] dark:bg-[#6E7681] dark:hover:bg-[#5a5f6a] text-white rounded-lg font-medium text-sm transition-colors"
              >
                +30s
              </button>
            )}

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="px-4 py-2 bg-[#E8EAED] hover:bg-[#d1d3d6] dark:bg-[#30363D] dark:hover:bg-[#3d444d] text-[#202124] dark:text-[#E6EDF3] rounded-lg font-medium text-sm transition-colors"
            >
              {hasCompleted ? 'Continue' : 'Skip'}
            </button>
          </div>

          {/* Exercise Name Reminder */}
          <div className="mt-3 text-xs text-center text-[#5F6368] dark:text-[#8B949E]">
            Next: <span className="font-medium">{exerciseName}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
