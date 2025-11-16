// Phase configurations for Greek God 2.0 Program

export interface PhaseConfig {
  phase: 1 | 2 | 3;
  name: string;
  duration_weeks: number;
  focus: string;
  description: string;
  workouts_per_week: number;
}

export const PHASES: Record<number, PhaseConfig> = {
  1: {
    phase: 1,
    name: 'Foundation Phase',
    duration_weeks: 8,
    focus: 'Building base strength with core indicator exercises',
    description:
      'Focus on mastering the 5 indicator lifts with RPT. Establish baseline strength.',
    workouts_per_week: 3,
  },
  2: {
    phase: 2,
    name: 'Intensification Phase',
    duration_weeks: 8,
    focus: 'Increasing volume and adding assistance exercises',
    description:
      'Add more exercises to build balanced muscle. Continue progressing main lifts.',
    workouts_per_week: 3,
  },
  3: {
    phase: 3,
    name: 'Specialization Phase',
    duration_weeks: 8,
    focus: 'Targeting weak points and maximizing strength',
    description:
      'Focus on lagging muscle groups while maintaining strength on main lifts.',
    workouts_per_week: 3,
  },
};

// Get current phase based on start date
export const getCurrentPhase = (
  programStartDate: string
): { phase: 1 | 2 | 3; week: number } => {
  const startDate = new Date(programStartDate);
  const today = new Date();
  const daysDiff = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weeksPassed = Math.floor(daysDiff / 7);

  if (weeksPassed < 8) {
    return { phase: 1, week: weeksPassed + 1 };
  } else if (weeksPassed < 16) {
    return { phase: 2, week: weeksPassed - 7 };
  } else if (weeksPassed < 24) {
    return { phase: 3, week: weeksPassed - 15 };
  } else {
    // After 24 weeks, cycle back to Phase 1
    const cycleWeeks = weeksPassed % 24;
    if (cycleWeeks < 8) {
      return { phase: 1, week: cycleWeeks + 1 };
    } else if (cycleWeeks < 16) {
      return { phase: 2, week: cycleWeeks - 7 };
    } else {
      return { phase: 3, week: cycleWeeks - 15 };
    }
  }
};

// Check if it's time to rotate phases
export const shouldRotatePhase = (currentWeek: number): boolean => {
  return currentWeek >= 8;
};

// Get next phase
export const getNextPhase = (currentPhase: 1 | 2 | 3): 1 | 2 | 3 => {
  if (currentPhase === 1) return 2;
  if (currentPhase === 2) return 3;
  return 1; // Cycle back to Phase 1
};
