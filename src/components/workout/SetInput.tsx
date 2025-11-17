import { useState, useEffect } from 'react';

interface SetInputProps {
  setNumber: number;
  weight: number;
  reps: number;
  targetReps: string;
  onUpdate: (setNumber: number, weight: number, reps: number) => void;
  disabled?: boolean;
}

export const SetInput = ({
  setNumber,
  weight: initialWeight,
  reps: initialReps,
  targetReps,
  onUpdate,
  disabled = false,
}: SetInputProps) => {
  const [weight, setWeight] = useState(initialWeight.toString());
  const [reps, setReps] = useState(initialReps.toString());

  useEffect(() => {
    setWeight(initialWeight > 0 ? initialWeight.toString() : '');
    setReps(initialReps > 0 ? initialReps.toString() : '');
  }, [initialWeight, initialReps]);

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
          ? 'bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 border-[#20808D] dark:border-[#1FB8CD]'
          : 'bg-[#F5F5F5] dark:bg-[#161B22] border-[#E8EAED] dark:border-[#30363D]'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8EAED] dark:bg-[#30363D] font-semibold text-sm text-[#202124] dark:text-[#E6EDF3]">
        {setNumber}
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
            disabled={disabled}
            className="w-full px-3 py-2 border border-[#E8EAED] dark:border-[#30363D] bg-white dark:bg-[#1C2128] text-[#202124] dark:text-[#E6EDF3] rounded text-center font-semibold focus:outline-none focus:ring-2 focus:ring-[#20808D] dark:focus:ring-[#1FB8CD] disabled:bg-[#F5F5F5] dark:disabled:bg-[#0D1117] disabled:cursor-not-allowed"
            placeholder="0"
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
            disabled={disabled}
            className="w-full px-3 py-2 border border-[#E8EAED] dark:border-[#30363D] bg-white dark:bg-[#1C2128] text-[#202124] dark:text-[#E6EDF3] rounded text-center font-semibold focus:outline-none focus:ring-2 focus:ring-[#20808D] dark:focus:ring-[#1FB8CD] disabled:bg-[#F5F5F5] dark:disabled:bg-[#0D1117] disabled:cursor-not-allowed"
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      <div className="text-sm text-[#5F6368] dark:text-[#8B949E] min-w-[60px]">
        Target: {targetReps}
      </div>

      {isCompleted && (
        <div className="text-[#20808D] dark:text-[#1FB8CD] font-bold">✓</div>
      )}
    </div>
  );
};
