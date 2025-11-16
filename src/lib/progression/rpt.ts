/**
 * Reverse Pyramid Training (RPT) Calculations
 *
 * Set 1: Heavy set (4-6 reps, max effort)
 * Set 2: -10% weight, +1-2 reps
 * Set 3: -20% weight (or -10% from Set 2), +1-2 reps
 *
 * Weights are rounded to nearest 5 lbs
 */

export interface RPTSetCalculation {
  set_number: number;
  weight: number;
  target_reps: string;
  weight_reduction_percent?: number;
}

const roundToNearest5 = (weight: number): number => {
  return Math.round(weight / 5) * 5;
};

export const calculateRPTSets = (
  set1Weight: number,
  set1Reps: number
): RPTSetCalculation[] => {
  const set1 = {
    set_number: 1,
    weight: set1Weight,
    target_reps: `${set1Reps}`,
  };

  const set2Weight = roundToNearest5(set1Weight * 0.9); // -10%
  const set2 = {
    set_number: 2,
    weight: set2Weight,
    target_reps: `${set1Reps + 1}-${set1Reps + 2}`,
    weight_reduction_percent: 10,
  };

  const set3Weight = roundToNearest5(set1Weight * 0.8); // -20%
  const set3 = {
    set_number: 3,
    weight: set3Weight,
    target_reps: `${set1Reps + 2}-${set1Reps + 3}`,
    weight_reduction_percent: 20,
  };

  return [set1, set2, set3];
};

export const calculateSet2Weight = (set1Weight: number): number => {
  return roundToNearest5(set1Weight * 0.9);
};

export const calculateSet3Weight = (set1Weight: number): number => {
  return roundToNearest5(set1Weight * 0.8);
};

// Calculate target reps for subsequent sets
export const getTargetRepsForSet = (
  setNumber: number,
  set1Reps: number
): string => {
  if (setNumber === 1) {
    return `${set1Reps}`;
  }
  if (setNumber === 2) {
    return `${set1Reps + 1}-${set1Reps + 2}`;
  }
  if (setNumber === 3) {
    return `${set1Reps + 2}-${set1Reps + 3}`;
  }
  return `${set1Reps}`;
};

// Calculate warmup sets (60%, 75%, 90% of working weight)
export const calculateWarmupSets = (
  workingWeight: number
): { weight: number; reps: number }[] => {
  return [
    {
      weight: roundToNearest5(workingWeight * 0.6),
      reps: 5,
    },
    {
      weight: roundToNearest5(workingWeight * 0.75),
      reps: 3,
    },
    {
      weight: roundToNearest5(workingWeight * 0.9),
      reps: 1,
    },
  ];
};

// Validate RPT set structure
export const validateRPTSets = (
  sets: { weight: number; reps: number }[]
): { valid: boolean; message: string } => {
  if (sets.length !== 3) {
    return {
      valid: false,
      message: 'RPT requires exactly 3 working sets',
    };
  }

  const [set1, set2, set3] = sets;

  // Check descending weight
  if (set1.weight <= set2.weight || set2.weight <= set3.weight) {
    return {
      valid: false,
      message: 'RPT sets must have descending weight (Set 1 > Set 2 > Set 3)',
    };
  }

  // Check ascending reps
  if (set1.reps >= set2.reps || set2.reps >= set3.reps) {
    return {
      valid: false,
      message: 'RPT sets should have ascending reps (Set 1 < Set 2 < Set 3)',
    };
  }

  return {
    valid: true,
    message: 'Valid RPT structure',
  };
};
