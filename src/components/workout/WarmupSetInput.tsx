import { useState, useEffect } from 'react';

interface WarmupSetInputProps {
  setNumber: number;
  recommendedWeight: number;
  recommendedReps: number;
  weight: number;
  reps: number;
  onUpdate: (setNumber: number, weight: number, reps: number) => void;
  percentage: number;
}

export const WarmupSetInput = ({
  setNumber,
  recommendedWeight,
  recommendedReps,
  weight: initialWeight,
  reps: initialReps,
  onUpdate,
  percentage,
}: WarmupSetInputProps) => {
  const [weight, setWeight] = useState(initialWeight.toString());
  const [reps, setReps] = useState(initialReps.toString());

  useEffect(() => {
    setWeight(initialWeight > 0 ? initialWeight.toString() : recommendedWeight.toString());
    setReps(initialReps > 0 ? initialReps.toString() : recommendedReps.toString());
  }, [initialWeight, initialReps, recommendedWeight, recommendedReps]);

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const numWeight = parseFloat(value) || 0;
    const numReps = parseFloat(reps) || 0;
    onUpdate(setNumber, numWeight, numReps);
  };

  const handleRepsChange = (value: string) => {
    setReps(value);
    const numWeight = parseFloat(weight) || 0;
    const numReps = parseFloat(value) || 0;
    onUpdate(setNumber, numWeight, numReps);
  };

  const isCompleted = parseFloat(weight) > 0 && parseFloat(reps) > 0;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        isCompleted
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600'
          : 'bg-[#F5F5F5] dark:bg-[#161B22] border-[#E8EAED] dark:border-[#30363D]'
      }`}
    >
      <div className="flex items-center justify-center w-20 h-8 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold text-xs">
        Warmup {setNumber}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#5F6368] dark:text-[#8B949E] mb-1">
            Weight (lbs)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8EAED] dark:border-[#30363D] bg-white dark:bg-[#1C2128] text-[#202124] dark:text-[#E6EDF3] rounded text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={recommendedWeight.toString()}
            step="5"
            min="0"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#5F6368] dark:text-[#8B949E] mb-1">
            Reps
          </label>
          <input
            type="number"
            value={reps}
            onChange={(e) => handleRepsChange(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8EAED] dark:border-[#30363D] bg-white dark:bg-[#1C2128] text-[#202124] dark:text-[#E6EDF3] rounded text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={recommendedReps.toString()}
            min="0"
          />
        </div>
      </div>

      <div className="text-xs text-blue-600 dark:text-blue-400 min-w-[50px] font-medium">
        {percentage}% of working weight
      </div>

      {isCompleted && (
        <div className="text-blue-600 dark:text-blue-400 font-bold">✓</div>
      )}
    </div>
  );
};
