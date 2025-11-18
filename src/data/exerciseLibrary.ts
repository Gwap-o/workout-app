export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  trainingMethod: string;
  repRange: string;
  sets: string;
  description: string;
  category: 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'compound' | 'neck-traps';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  variations?: string[];
  notes?: string;
  phase?: string[];
  workoutDay?: 'A' | 'B' | 'C' | 'A/B' | 'A/C' | 'B/C'; // For program phases with Workout A, B, or C
}

export const exerciseLibrary: Exercise[] = [
  // CHEST EXERCISES
  {
    id: 'incline-barbell-press',
    name: 'Incline Barbell Bench Press',
    muscleGroups: ['Upper Chest', 'Anterior Deltoids', 'Triceps'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '4-5, 6-7, 8-10',
    sets: '3',
    description: 'Primary indicator exercise for upper chest development. More effective than flat bench for developing the upper pecs and relevant for athletic pressing movements.',
    category: 'chest',
    difficulty: 'intermediate',
    equipment: ['Barbell', 'Incline Bench', 'Rack'],
    notes: 'Primary indicator exercise. Develop the upper pectoral region effectively.',
    phase: ['Phase One', 'Phase Three', 'MEGA Phase Two'],
    workoutDay: 'A'
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    muscleGroups: ['Upper Chest', 'Anterior Deltoids', 'Triceps'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6-8, 8-10, 10-12',
    sets: '3',
    description: 'Intense exercise that develops the upper chest with dumbbells for greater range of motion and independent arm work.',
    category: 'chest',
    difficulty: 'intermediate',
    equipment: ['Dumbbells', 'Incline Bench'],
    phase: ['Phase Two', '3-Day Split'],
    workoutDay: 'A'
  },
  {
    id: 'flat-bench-press',
    name: 'Flat Bench Press',
    muscleGroups: ['Pectorals', 'Anterior Deltoids', 'Triceps'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6, 8, 10',
    sets: '3',
    description: 'Great overall mass builder for the entire pectoral region. Terrific compound exercise for chest development.',
    category: 'chest',
    difficulty: 'beginner',
    equipment: ['Barbell', 'Flat Bench', 'Rack'],
    phase: ['Chest Specialization', '3-Day Split Phase Two'],
    workoutDay: 'A'
  },
  {
    id: 'close-grip-bench',
    name: 'Close-Grip Bench Press',
    muscleGroups: ['Triceps', 'Upper Chest'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6-8, 8-10, 10-12',
    sets: '3',
    description: 'Phenomenal pressing movement that builds a powerful chest and triceps. Elbows tucked to sides increase triceps and upper chest recruitment.',
    category: 'chest',
    difficulty: 'intermediate',
    equipment: ['Barbell', 'Flat Bench', 'Rack'],
    phase: ['MEGA Phase One'],
    workoutDay: 'A'
  },
  {
    id: 'cable-crossovers',
    name: 'Cable Cross-Overs',
    muscleGroups: ['Pectorals', 'Anterior Deltoids'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-12',
    sets: '4',
    description: 'Isolation movement for chest detail and definition. Progressive loading with each set.',
    category: 'chest',
    difficulty: 'beginner',
    equipment: ['Cable Machine'],
    phase: ['MEGA Phase One'],
    workoutDay: 'A'
  },
  {
    id: 'machine-bench-press',
    name: 'Machine Bench Press',
    muscleGroups: ['Pectorals', 'Anterior Deltoids', 'Triceps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-12',
    sets: '4',
    description: 'Fixed-path pressing movement for controlled chest development with reduced stabilizer requirements.',
    category: 'chest',
    difficulty: 'beginner',
    equipment: ['Chest Press Machine'],
    phase: ['MEGA Phase Two'],
    workoutDay: 'A'
  },
  {
    id: 'weighted-dips',
    name: 'Weighted Dips',
    muscleGroups: ['Triceps', 'Pectorals', 'Anterior Deltoids'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6, 8, 10',
    sets: '3',
    description: 'Intense exercise that adds massive pressing strength. Develops triceps and pectoral region. Indicator exercise that progresses smoothly.',
    category: 'compound',
    difficulty: 'intermediate',
    equipment: ['Dip Station', 'Weight Belt', 'Plates'],
    notes: 'Can add 45 pounds in 3 months. Increase by 2.5-5 pounds every workout.',
    phase: ['Phase Two', '3-Day Split'],
    workoutDay: 'A'
  },

  // BACK EXERCISES
  {
    id: 'weighted-chinups',
    name: 'Weighted Chinups',
    muscleGroups: ['Lats', 'Biceps'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '4, 6, 8',
    sets: '3',
    description: 'Primary indicator exercise for back development. Closed-chain exercise with greater muscle recruitment than pulldowns. Develops back so effectively that additional lat work may not be needed.',
    category: 'back',
    difficulty: 'intermediate',
    equipment: ['Pull-up Bar', 'Weight Belt', 'Plates'],
    notes: 'Increase by 2.5 pounds per workout. Can\'t cheat with momentum.',
    phase: ['Phase One', 'Phase Three', 'MEGA Phase Two', '3-Day Split'],
    workoutDay: 'B'
  },
  {
    id: 'weighted-pullups',
    name: 'Weighted Pullups',
    muscleGroups: ['Lats', 'Biceps', 'Rear Deltoids'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6, 8, 8',
    sets: '3',
    description: 'Wider grip variation of chinups emphasizing lat width. Increase by 2.5 pounds per workout.',
    category: 'back',
    difficulty: 'intermediate',
    equipment: ['Pull-up Bar', 'Weight Belt', 'Plates'],
    phase: ['Phase Two', 'MEGA Phase One', '3-Day Split Phase Two'],
    workoutDay: 'B'
  },
  {
    id: 'weighted-close-grip-chinups',
    name: 'Weighted Close-Grip Chinups',
    muscleGroups: ['Biceps', 'Lats'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '5, 6, 8',
    sets: '3',
    description: 'Closer grip variation that emphasizes bicep involvement while still developing the back.',
    category: 'back',
    difficulty: 'intermediate',
    equipment: ['Pull-up Bar', 'Weight Belt', 'Plates'],
    phase: ['Biceps Specialization'],
    workoutDay: 'B'
  },
  {
    id: 'lat-pulldowns',
    name: 'LAT Pulldowns',
    muscleGroups: ['Lats', 'Biceps'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6-8, 8-10, 10-12',
    sets: '3',
    description: 'Alternative to weighted chinups for beginners. Open-chain movement for building toward bodyweight chinups.',
    category: 'back',
    difficulty: 'beginner',
    equipment: ['Cable Machine', 'Lat Bar'],
    notes: 'Substitute until you can perform bodyweight chinups',
    workoutDay: 'B'
  },
  {
    id: 'cable-rows',
    name: 'Cable Rows',
    muscleGroups: ['Middle Back', 'Lats', 'Biceps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-12',
    sets: '4',
    description: 'Machine-based rowing variation for back thickness and detail.',
    category: 'back',
    difficulty: 'beginner',
    equipment: ['Cable Machine', 'Row Handle'],
    phase: ['MEGA Phase One'],
    workoutDay: 'B'
  },
  {
    id: 'seated-cable-rows',
    name: 'Seated Cable Rows',
    muscleGroups: ['Middle Back', 'Lats', 'Biceps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-12',
    sets: '4',
    description: 'Seated variation that reduces leg drive and focuses on back contraction.',
    category: 'back',
    difficulty: 'beginner',
    equipment: ['Cable Machine', 'Row Handle', 'Seat'],
    phase: ['3-Day Split'],
    workoutDay: 'A'
  },
  {
    id: 'machine-rows',
    name: 'Machine Rows',
    muscleGroups: ['Middle Back', 'Lats', 'Biceps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-12',
    sets: '3-4',
    description: 'Fixed-path rowing for consistent back development.',
    category: 'back',
    difficulty: 'beginner',
    equipment: ['Row Machine'],
    phase: ['MEGA Phase Two', '3-Day Split Phase Two'],
    workoutDay: 'A'
  },
  {
    id: 'hang-cleans',
    name: 'Hang Cleans',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back', 'Upper Back', 'Shoulders'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '5, 6, 8',
    sets: '3',
    description: 'Olympic lifting variation for explosive power and posterior chain development.',
    category: 'compound',
    difficulty: 'advanced',
    equipment: ['Barbell', 'Plates'],
    notes: 'Can substitute with sumo deadlifts',
    phase: ['Back Specialization'],
    workoutDay: 'B'
  },

  // SHOULDER EXERCISES
  {
    id: 'standing-press',
    name: 'Standing Barbell Press',
    muscleGroups: ['Anterior Deltoids', 'Medial Deltoids', 'Triceps', 'Upper Chest', 'Core'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6-8, 8-10, 8-10',
    sets: '3',
    description: 'Go-to exercise for shoulder development and true strength. Indicator exercise that fills in the upper chest below the collarbone. Core engagement for stability.',
    category: 'shoulders',
    difficulty: 'intermediate',
    equipment: ['Barbell', 'Rack'],
    notes: 'Avoid seated presses with elbows flared - unnatural shoulder position',
    phase: ['Phase One', 'Phase Three', 'MEGA Phase Two', '3-Day Split'],
    workoutDay: 'A'
  },
  {
    id: 'arnold-press',
    name: 'Arnold Press',
    muscleGroups: ['Anterior Deltoids', 'Medial Deltoids', 'Triceps', 'Upper Chest'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6-8, 8-10, 10-12',
    sets: '3',
    description: 'Rotating dumbbell press with greater range of motion than standard pressing movements.',
    category: 'shoulders',
    difficulty: 'intermediate',
    equipment: ['Dumbbells'],
    phase: ['3-Day Split Phase Two'],
    workoutDay: 'A'
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    muscleGroups: ['Medial Deltoids'],
    trainingMethod: 'Rest-Pause Training',
    repRange: '12-15 + 3 mini-sets x 4-6',
    sets: '1 + 3',
    description: 'Essential for medial deltoid development and V-shaped frame. Medial head never gets fully worked with pressing alone.',
    category: 'shoulders',
    difficulty: 'beginner',
    equipment: ['Dumbbells'],
    notes: 'Rest 10-15 seconds between mini-sets',
    phase: ['Phase One', 'Phase Three', 'Multiple'],
    workoutDay: 'A'
  },
  {
    id: 'dumbbell-lateral-raises',
    name: 'Dumbbell Lateral Raises',
    muscleGroups: ['Medial Deltoids'],
    trainingMethod: 'Rest-Pause Training',
    repRange: '12-15 + 3 sets x 4-6',
    sets: '1 + 3',
    description: 'Dumbbell variation of lateral raises for shoulder width development.',
    category: 'shoulders',
    difficulty: 'beginner',
    equipment: ['Dumbbells'],
    phase: ['3-Day Split'],
    workoutDay: 'A'
  },
  {
    id: 'dumbbell-upright-rows',
    name: 'Dumbbell Upright Rows',
    muscleGroups: ['Medial Deltoids', 'Anterior Deltoids', 'Traps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-15',
    sets: '4',
    description: 'Shoulder and trap development with progressive loading. Also listed as "Upright Rows" in some phases.',
    category: 'shoulders',
    difficulty: 'beginner',
    equipment: ['Dumbbells'],
    phase: ['Phase Two', '3-Day Split Phase Two', 'MEGA Phase Two'],
    workoutDay: 'A'
  },
  {
    id: 'face-pulls',
    name: 'Face Pulls',
    muscleGroups: ['Rear Deltoids', 'Middle Traps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '12-15',
    sets: '4',
    description: 'Develops rear deltoids and middle traps. Great for shoulder balance and upper back development.',
    category: 'shoulders',
    difficulty: 'beginner',
    equipment: ['Cable Machine', 'Rope Attachment'],
    phase: ['Phase One', 'Phase Three'],
    workoutDay: 'B'
  },
  {
    id: 'cable-face-pulls',
    name: 'Cable Face Pulls',
    muscleGroups: ['Rear Deltoids', 'Upper Back', 'Traps'],
    trainingMethod: 'Rest-Pause Training',
    repRange: '12-15 + 3 sets x 4-6',
    sets: '1 + 3',
    description: 'Rest-pause variation of face pulls for rear deltoid and trap development.',
    category: 'shoulders',
    difficulty: 'beginner',
    equipment: ['Cable Machine', 'Rope Attachment'],
    phase: ['3-Day Split'],
    workoutDay: 'C'
  },
  {
    id: 'bent-over-flyes',
    name: 'Bent-Over Flyes',
    muscleGroups: ['Rear Deltoids', 'Upper Back'],
    trainingMethod: 'Straight Sets',
    repRange: '8-12',
    sets: '3',
    description: 'Strong rear deltoids keep shoulders balanced and healthy. Prevents injury from heavy pressing. Completes the full, capped shoulder look.',
    category: 'shoulders',
    difficulty: 'beginner',
    equipment: ['Dumbbells'],
    notes: 'Use correct form - rear deltoids are weak starting out. Don\'t use heavy weight.',
    phase: ['Back Specialization'],
    workoutDay: 'B'
  },
  {
    id: 'seated-bent-over-flyes',
    name: 'Seated Bent-Over Flyes',
    muscleGroups: ['Rear Deltoids'],
    trainingMethod: 'Rest-Pause Training',
    repRange: '12-15 + 3 mini-sets x 4-6',
    sets: '1 + 3',
    description: 'Seated variation for isolated rear deltoid development with rest-pause technique.',
    category: 'shoulders',
    difficulty: 'beginner',
    equipment: ['Dumbbells', 'Bench'],
    phase: ['Phase Two'],
    workoutDay: 'B'
  },
  {
    id: 'machine-rear-delt-flyes',
    name: 'Machine Rear Deltoid Flyes',
    muscleGroups: ['Rear Deltoids'],
    trainingMethod: 'Rest-Pause Training',
    repRange: '12-15 + 3 sets x 4-6',
    sets: '1 + 3',
    description: 'Machine-based variation for consistent rear deltoid activation.',
    category: 'shoulders',
    difficulty: 'beginner',
    equipment: ['Rear Delt Machine'],
    phase: ['3-Day Split Phase Two'],
    workoutDay: 'C'
  },

  // ARM EXERCISES - TRICEPS
  {
    id: 'triceps-rope-pushdowns',
    name: 'Triceps Rope Pushdowns',
    muscleGroups: ['Triceps'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6-8, 8-10, 10-12',
    sets: '3',
    description: 'Isolation movement for triceps development. Drop weight by 10% each set.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Cable Machine', 'Rope Attachment'],
    phase: ['Phase One', 'Phase Three', '3-Day Split'],
    workoutDay: 'A'
  },
  {
    id: 'triceps-pushdowns',
    name: 'Triceps Pushdowns',
    muscleGroups: ['Triceps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-12',
    sets: '4',
    description: 'Higher rep cable-based triceps work for volume and pump.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Cable Machine', 'Bar or Rope'],
    phase: ['MEGA Phase One'],
    workoutDay: 'A'
  },
  {
    id: 'rope-extensions',
    name: 'Rope Extensions',
    muscleGroups: ['Triceps'],
    trainingMethod: 'Kino Rep Training / Rest-Pause',
    repRange: '10-12',
    sets: '2',
    description: 'Better suited for higher reps and short rest periods. Used for Kino rep training and rest-pause training.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Cable Machine', 'Rope Attachment'],
    notes: 'Rest 60-90 seconds between sets',
    phase: ['Triceps Specialization'],
    workoutDay: 'A'
  },
  {
    id: 'skull-crushers',
    name: 'Skull Crushers',
    muscleGroups: ['Triceps'],
    trainingMethod: 'Straight Sets',
    repRange: '6-10',
    sets: '3',
    description: 'Hits triceps intensely with regular loading progression. Can build up to 135 pounds for several reps. Translates to better lockout strength.',
    category: 'arms',
    difficulty: 'intermediate',
    equipment: ['Barbell or EZ-Bar', 'Bench'],
    notes: 'Main triceps movement - killer exercise',
    phase: ['Chest Specialization', 'Shoulder Specialization'],
    workoutDay: 'A'
  },
  {
    id: 'one-arm-overhead-triceps',
    name: 'One-Arm Overhead Triceps Extensions',
    muscleGroups: ['Triceps'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '8-10, 10-12, 12-15',
    sets: '3',
    description: 'Single-arm variation emphasizing the long head of the triceps.',
    category: 'arms',
    difficulty: 'intermediate',
    equipment: ['Dumbbell'],
    notes: 'Rest 2 minutes between sets',
    phase: ['Phase Two'],
    workoutDay: 'A'
  },
  {
    id: 'dumbbell-overhead-triceps',
    name: 'Dumbbell Overhead Triceps Extensions',
    muscleGroups: ['Triceps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-12',
    sets: '4',
    description: 'Overhead extension for long head triceps emphasis with progressive loading.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Dumbbell'],
    phase: ['MEGA Phase Two'],
    workoutDay: 'A'
  },
  {
    id: 'single-arm-overhead-dumbbell-triceps',
    name: 'Single-Arm Overhead Dumbbell Triceps Press',
    muscleGroups: ['Triceps'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '8-10, 10-12, 10-12',
    sets: '3',
    description: 'Unilateral overhead triceps work for balanced development.',
    category: 'arms',
    difficulty: 'intermediate',
    equipment: ['Dumbbell'],
    phase: ['3-Day Split Phase Two'],
    workoutDay: 'A'
  },

  // ARM EXERCISES - BICEPS
  {
    id: 'incline-hammer-curls',
    name: 'Incline Dumbbell Hammer Curls',
    muscleGroups: ['Biceps', 'Brachialis'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6-8, 6-8, 8-10',
    sets: '3',
    description: 'Arms locked to sides with back flat against bench. Forces biceps to work in isolation - unable to use back swing.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Dumbbells', 'Incline Bench'],
    notes: 'Drop weight by 5 pounds per dumbbell each set',
    phase: ['Phase One', 'Phase Three', 'MEGA Phase Two'],
    workoutDay: 'B'
  },
  {
    id: 'incline-dumbbell-curls',
    name: 'Incline Dumbbell Curls',
    muscleGroups: ['Biceps'],
    trainingMethod: 'Reverse Pyramid Training / Higher Reps',
    repRange: '6-8 or 8-12',
    sets: '2-4',
    description: 'Effective biceps isolation with arms locked and back against bench. Prevents cheating with back swing.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Dumbbells', 'Incline Bench'],
    notes: 'Alternate with barbell curls every 3-4 weeks. Rest 60-90 seconds for higher rep version.',
    phase: ['Phase Two', 'Biceps Specialization', '3-Day Split'],
    workoutDay: 'C'
  },
  {
    id: 'incline-bicep-curls',
    name: 'Incline Dumbbell Bicep Curls',
    muscleGroups: ['Biceps'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6-8',
    sets: '3',
    description: 'Incline biceps isolation with pyramid progression.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Dumbbells', 'Incline Bench'],
    phase: ['Phase Two'],
    workoutDay: 'B'
  },
  {
    id: 'barbell-curls',
    name: 'Barbell Curls',
    muscleGroups: ['Biceps'],
    trainingMethod: 'Straight Sets',
    repRange: '6-10',
    sets: '3',
    description: 'Best exercise for developing biceps with gradual progress in resistance. Can eventually build up to 135 pounds for reps, increasing by 5 or even 2.5 pounds per session.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Barbell or EZ-Bar'],
    notes: 'Main biceps exercise - little strength increase seen in most biceps exercises',
    phase: ['Back Specialization', 'Legs Specialization'],
    workoutDay: 'B'
  },
  {
    id: 'standing-hammer-curls',
    name: 'Standing Hammer Curls',
    muscleGroups: ['Biceps', 'Brachialis', 'Forearms'],
    trainingMethod: 'Kino Rep Training',
    repRange: '8-10',
    sets: '4',
    description: 'Neutral grip curls that develop the brachialis for increased arm size.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Dumbbells'],
    phase: ['3-Day Split'],
    workoutDay: 'C'
  },
  {
    id: 'seated-hammer-curls',
    name: 'Seated Hammer Curls',
    muscleGroups: ['Biceps', 'Forearms'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '6-8',
    sets: '4',
    description: 'Seated variation prevents leg drive and focuses on arm contraction.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Dumbbells', 'Bench'],
    phase: ['3-Day Split Phase Two'],
    workoutDay: 'C'
  },
  {
    id: 'machine-curls',
    name: 'Machine Curls',
    muscleGroups: ['Biceps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-12',
    sets: '4',
    description: 'Isolation movement with fixed path for consistent biceps work.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Curl Machine'],
    phase: ['MEGA Phase One', '3-Day Split Phase Two'],
    workoutDay: 'B'
  },
  {
    id: 'cable-rope-curls',
    name: 'Cable Rope Curls',
    muscleGroups: ['Biceps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-12',
    sets: '4',
    description: 'Uses rope attachment on cable machine for unique biceps stimulus.',
    category: 'arms',
    difficulty: 'beginner',
    equipment: ['Cable Machine', 'Rope Attachment'],
    phase: ['MEGA Phase Two'],
    workoutDay: 'B'
  },

  // LEG EXERCISES - QUADS/GLUTES
  {
    id: 'bulgarian-split-squats',
    name: 'Bulgarian Split Squats',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    trainingMethod: 'Kino Rep Training',
    repRange: '6-8',
    sets: '4',
    description: 'Powerful single-leg exercise for leg strength and muscle. Primary leg indicator exercise option. Start light and increase weight each set.',
    category: 'legs',
    difficulty: 'intermediate',
    equipment: ['Dumbbells', 'Bench or Box'],
    notes: 'When you can do all 4 sets for 8 reps, increase by 5 pounds per hand',
    phase: ['Phase One', 'Phase Three', 'MEGA Phase Two', '3-Day Split Phase Two'],
    workoutDay: 'B'
  },
  {
    id: 'box-squats',
    name: 'Box Squats',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Lower Back'],
    trainingMethod: 'Kino Rep Training',
    repRange: '6-8',
    sets: '4-5',
    description: 'Primary leg indicator exercise option. Pause for 1 second at parallel. Ensures proper depth and teaches proper mechanics: sitting back, chest up, weight in heels.',
    category: 'legs',
    difficulty: 'intermediate',
    equipment: ['Barbell', 'Rack', 'Box or Bench'],
    notes: 'Box height should put you parallel. Keep tension, don\'t completely rest. Increase by 5 pounds per workout.',
    phase: ['Phase Two', 'MEGA Phase One', '3-Day Split'],
    workoutDay: 'B'
  },
  {
    id: 'barbell-squats',
    name: 'Squats (Barbell Back Squat)',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core', 'Lower Back'],
    trainingMethod: 'Reverse Pyramid Training',
    repRange: '5, 6, 8',
    sets: '3',
    description: 'Most powerful leg mass builder. So powerful that most people don\'t need to use for very long. Add 5 pounds to the bar every squat workout.',
    category: 'legs',
    difficulty: 'intermediate',
    equipment: ['Barbell', 'Rack'],
    notes: 'If you don\'t want bigger legs, avoid this routine',
    phase: ['Legs Specialization'],
    workoutDay: 'B'
  },
  {
    id: 'front-squats',
    name: 'Front Squats',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    trainingMethod: 'Kino Rep Training',
    repRange: '6-8',
    sets: '3',
    description: 'Develops leg strength with more quad focus. Amazing for building rock-solid core. Vertical bar position.',
    category: 'legs',
    difficulty: 'advanced',
    equipment: ['Barbell', 'Rack'],
    notes: 'Start light and increase weight all three sets',
    phase: ['Heavy Deadlift Phase Two'],
    workoutDay: 'B'
  },
  {
    id: 'pistols',
    name: 'Pistols (One-Legged Squats)',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Stabilizers', 'Core'],
    trainingMethod: 'Bodyweight / Weighted',
    repRange: '3-5 or 5-8',
    sets: '3',
    description: 'Unbelievable exercise requiring balance, leg strength, flexibility, and coordination. Building up to 6-10 slow controlled reps per leg is enough for adequate leg strength.',
    category: 'legs',
    difficulty: 'advanced',
    equipment: ['None or Dumbbells'],
    variations: ['Jumping Pistol Squats'],
    notes: 'Can hold weight in hands or perform jumping variation for power',
    phase: ['Biceps Specialization', 'Legs Specialization Alternative'],
    workoutDay: 'B'
  },
  {
    id: 'barbell-walking-lunges',
    name: 'Barbell Walking Lunges',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Stabilizers'],
    trainingMethod: 'Kino Rep Training',
    repRange: '8-10 per leg',
    sets: '2',
    description: 'Dynamic single-leg movement for leg development and balance.',
    category: 'legs',
    difficulty: 'intermediate',
    equipment: ['Barbell'],
    phase: ['3-Day Split'],
    workoutDay: 'B'
  },

  // LEG EXERCISES - POSTERIOR CHAIN
  {
    id: 'romanian-deadlift-dumbbell',
    name: 'Dumbbell Romanian Deadlifts',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back', 'Forearms'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-12',
    sets: '4',
    description: 'Favorite deadlift variation using hip drive and hip hinge. Safer than conventional, works best for higher reps. Develops posterior chain excellently.',
    category: 'legs',
    difficulty: 'beginner',
    equipment: ['Dumbbells'],
    notes: 'Allows greater range of motion and corrects imbalances. Start light and progress.',
    phase: ['Phase One', 'Phase Three', 'MEGA Phase Two'],
    workoutDay: 'B'
  },
  {
    id: 'romanian-deadlift-barbell',
    name: 'Romanian Deadlift (Barbell)',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
    trainingMethod: 'Kino Rep Training',
    repRange: '8-15',
    sets: '3-4',
    description: 'Barbell variation typically allows more weight than dumbbells. Hip drive and hip hinge focus.',
    category: 'legs',
    difficulty: 'intermediate',
    equipment: ['Barbell', 'Plates'],
    notes: 'Alternate with dumbbell version every couple months',
    phase: ['Various'],
    workoutDay: 'B'
  },
  {
    id: 'single-leg-romanian-deadlift',
    name: 'Single-Leg Romanian Deadlifts',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back', 'Balance Stabilizers'],
    trainingMethod: 'Kino Rep Training',
    repRange: '8-12 per leg',
    sets: '3',
    description: 'Develops balance, knee stability, and builds hamstrings and glutes. Pairs nicely with box squats.',
    category: 'legs',
    difficulty: 'intermediate',
    equipment: ['Dumbbells'],
    notes: 'Start light and increase load every set. Can substitute with hip thrusts.',
    phase: ['Phase Two'],
    workoutDay: 'B'
  },
  {
    id: 'sumo-deadlifts',
    name: 'Sumo Deadlifts',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back', 'Quads', 'Traps'],
    trainingMethod: 'Reverse Pyramid Training / Kino Rep',
    repRange: '5, 6, 8 or 4-6',
    sets: '3-5',
    description: 'Wider stance deadlift with greater leg emphasis. Better back positioning (prevents rounding). Amazing for developing legs and sprinting power. Preferred by top sprint coaches.',
    category: 'legs',
    difficulty: 'intermediate',
    equipment: ['Barbell', 'Plates'],
    notes: 'Feet outside of hands. For heavy option: start light, increase each set. Increase 5 pounds weekly.',
    phase: ['Back Specialization', '3-Day Split Phase Two', 'Heavy Deadlift'],
    workoutDay: 'B'
  },
  {
    id: 'hip-thrusts',
    name: 'Hip Thrusts',
    muscleGroups: ['Glutes', 'Hamstrings', 'Lower Back'],
    trainingMethod: 'Kino Rep Training',
    repRange: '8-10 or 8-12',
    sets: '3-4',
    description: 'Alternative to single-leg Romanian deadlifts. Excellent glute and hamstring developer.',
    category: 'legs',
    difficulty: 'beginner',
    equipment: ['Barbell', 'Bench', 'Pad'],
    notes: 'Can substitute for single-leg RDLs',
    phase: ['Phase Two Alternative', 'MEGA Phase One'],
    workoutDay: 'B'
  },

  // LEG EXERCISES - CALVES
  {
    id: 'elevated-single-leg-calf-raises',
    name: 'Elevated Single-Leg Calf Raises',
    muscleGroups: ['Calves'],
    trainingMethod: 'Straight Sets',
    repRange: '10-12',
    sets: '3',
    description: 'Important for direct lower leg training. Keeps calves proportionate to upper arms for balance.',
    category: 'legs',
    difficulty: 'beginner',
    equipment: ['Step or Platform', 'Optional Dumbbell'],
    notes: 'Small calves create chicken leg illusion',
    workoutDay: 'B'
  },
  {
    id: 'calf-raises',
    name: 'Calf Raises',
    muscleGroups: ['Calves'],
    trainingMethod: 'Straight Sets',
    repRange: '8-12',
    sets: '3',
    description: 'Basic calf development for lower leg strength and size.',
    category: 'legs',
    difficulty: 'beginner',
    equipment: ['None or Dumbbells'],
    phase: ['Legs Specialization'],
    workoutDay: 'B'
  },
  {
    id: 'machine-calf-raises',
    name: 'Machine Calf Raises',
    muscleGroups: ['Calves'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-15',
    sets: '4',
    description: 'Machine-based calf work for progressive overload.',
    category: 'legs',
    difficulty: 'beginner',
    equipment: ['Calf Raise Machine'],
    phase: ['3-Day Split'],
    workoutDay: 'B'
  },

  // CORE EXERCISES
  {
    id: 'hanging-knee-raises',
    name: 'Hanging Knee Raises',
    muscleGroups: ['Abdominals', 'Hip Flexors'],
    trainingMethod: 'Straight Sets',
    repRange: '8-12',
    sets: '3',
    description: 'Hanging ab exercise. If too easy, hold weight between legs. Rest 1 minute between sets.',
    category: 'core',
    difficulty: 'beginner',
    equipment: ['Pull-up Bar', 'Optional Dumbbell'],
    notes: 'When you can complete 3 sets of 12 reps, increase weight',
    phase: ['Phase One', 'Phase Three', 'MEGA Phase One'],
    workoutDay: 'A'
  },
  {
    id: 'side-to-side-knee-ups',
    name: 'Side-to-Side Knee Ups',
    muscleGroups: ['Obliques', 'Core'],
    trainingMethod: 'Straight Sets',
    repRange: '8-12 per side',
    sets: '3',
    description: 'Variation of hanging knee raises targeting obliques. Can hold light weight between knees.',
    category: 'core',
    difficulty: 'intermediate',
    equipment: ['Pull-up Bar', 'Optional Dumbbell'],
    phase: ['Phase Two'],
    workoutDay: 'A'
  },

  // NECK AND TRAPS
  {
    id: 'cable-shrugs',
    name: 'Cable Shrugs',
    muscleGroups: ['Traps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-15',
    sets: '3',
    description: 'Cable variation of shrugs for trap development.',
    category: 'neck-traps',
    difficulty: 'beginner',
    equipment: ['Cable Machine', 'Straight Bar'],
    phase: ['3-Day Split'],
    workoutDay: 'B'
  },
  {
    id: 'leaning-one-arm-dumbbell-shrugs',
    name: 'Leaning One-Arm Dumbbell Shrugs',
    muscleGroups: ['Traps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-15',
    sets: '4',
    description: 'Lean and lift shoulder up toward ear, not just straight up. Focuses on traps. Increase weight each set.',
    category: 'neck-traps',
    difficulty: 'beginner',
    equipment: ['Dumbbell'],
    notes: 'Once traps are developed, can train once every 2 weeks for maintenance',
    phase: ['Neck and Traps Bonus'],
    workoutDay: 'B'
  },
  {
    id: 'shrugs',
    name: 'Shrugs',
    muscleGroups: ['Traps'],
    trainingMethod: 'Kino Rep Training',
    repRange: '10-12',
    sets: '4',
    description: 'General shrug movement for trap development.',
    category: 'neck-traps',
    difficulty: 'beginner',
    equipment: ['Dumbbells or Barbell'],
    phase: ['MEGA Phase One Bonus'],
    workoutDay: 'B'
  },
  {
    id: 'neck-extensions',
    name: 'Neck Extensions',
    muscleGroups: ['Posterior Neck', 'Upper Back'],
    trainingMethod: 'Kino Rep Training',
    repRange: '20-30',
    sets: '3',
    description: 'Lying face down on bench with head off. Light weight (5-10 pounds) on back of head. Perform reverse neck curls. Don\'t push too close to failure or neck can cramp.',
    category: 'neck-traps',
    difficulty: 'beginner',
    equipment: ['Bench', 'Weight Plate'],
    notes: 'Start light! Increase by 5-10 pounds per set. Control the weight carefully.',
    phase: ['3-Day Split'],
    workoutDay: 'B'
  },
  {
    id: 'reverse-neck-curls',
    name: 'Reverse Neck Curls',
    muscleGroups: ['Posterior Neck', 'Upper Back'],
    trainingMethod: 'Kino Rep Training',
    repRange: '20-30',
    sets: '3',
    description: 'Same as neck extensions. Lying face down, weight on back of head, raise neck against gravity.',
    category: 'neck-traps',
    difficulty: 'beginner',
    equipment: ['Bench', 'Weight Plate'],
    notes: 'Light weight - 5-10 pounds to start',
    phase: ['Neck and Traps Bonus'],
    workoutDay: 'B'
  },
  {
    id: 'neck-curls',
    name: 'Neck Curls',
    muscleGroups: ['Anterior Neck'],
    trainingMethod: 'Kino Rep Training',
    repRange: '20-30',
    sets: '3',
    description: 'Lying on back with head off bench. Hold light plate on forehead and perform neck curls. Don\'t push too close to failure or neck cramps. Control the weight.',
    category: 'neck-traps',
    difficulty: 'beginner',
    equipment: ['Bench', 'Weight Plate'],
    notes: 'When you can do 30 reps on last set, increase weight next week',
    phase: ['3-Day Split', 'Neck and Traps Bonus'],
    workoutDay: 'B'
  }
];

// Helper functions for filtering
export const getExercisesByCategory = (category: Exercise['category']) => {
  return exerciseLibrary.filter(ex => ex.category === category);
};

export const getExercisesByMuscleGroup = (muscleGroup: string) => {
  return exerciseLibrary.filter(ex =>
    ex.muscleGroups.some(mg => mg.toLowerCase().includes(muscleGroup.toLowerCase()))
  );
};

export const getExercisesByDifficulty = (difficulty: Exercise['difficulty']) => {
  return exerciseLibrary.filter(ex => ex.difficulty === difficulty);
};

export const getExercisesByEquipment = (equipment: string) => {
  return exerciseLibrary.filter(ex =>
    ex.equipment.some(eq => eq.toLowerCase().includes(equipment.toLowerCase()))
  );
};

export const searchExercises = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return exerciseLibrary.filter(ex =>
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.description.toLowerCase().includes(lowerQuery) ||
    ex.muscleGroups.some(mg => mg.toLowerCase().includes(lowerQuery)) ||
    ex.equipment.some(eq => eq.toLowerCase().includes(lowerQuery))
  );
};
