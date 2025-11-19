import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Dumbbell, Target, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  exerciseLibrary,
  Exercise,
  searchExercises,
  getExercisesByCategory,
} from '../data/exerciseLibrary';

type ViewMode = 'all' | 'by-phase' | 'by-category';

const ExerciseLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('by-phase');

  // Get unique equipment types
  const allEquipment = useMemo(() => {
    const equipment = new Set<string>();
    exerciseLibrary.forEach(ex => ex.equipment.forEach(eq => equipment.add(eq)));
    return Array.from(equipment).sort();
  }, []);

  // Get unique phases
  const allPhases = useMemo(() => {
    const phases = new Set<string>();
    exerciseLibrary.forEach(ex => {
      if (ex.phase) {
        ex.phase.forEach(p => phases.add(p));
      }
    });
    return Array.from(phases).sort();
  }, []);

  // Filter exercises based on all criteria
  const filteredExercises = useMemo(() => {
    let results = exerciseLibrary;

    if (searchQuery.trim()) {
      results = searchExercises(searchQuery);
    }

    if (selectedCategory !== 'all') {
      results = results.filter(ex => ex.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      results = results.filter(ex => ex.difficulty === selectedDifficulty);
    }

    if (selectedEquipment !== 'all') {
      results = results.filter(ex =>
        ex.equipment.some(eq => eq === selectedEquipment)
      );
    }

    if (selectedPhase !== 'all') {
      results = results.filter(ex =>
        ex.phase && ex.phase.some(p => p === selectedPhase)
      );
    }

    return results;
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedEquipment, selectedPhase]);

  // Group exercises by phase
  const exercisesByPhase = useMemo(() => {
    const grouped: Record<string, Exercise[]> = {};

    const phaseOrder = [
      'Phase One',
      'Phase Two',
      'Phase Three',
      'MEGA Phase One',
      'MEGA Phase Two',
      'Chest Specialization',
      'Shoulder Specialization',
      'Triceps Specialization',
      'Back Specialization',
      'Biceps Specialization',
      'Legs Specialization',
      '3-Day Split',
      '3-Day Split Phase Two',
      'Heavy Deadlift Phase One',
      'Heavy Deadlift Phase Two',
      'Neck and Traps Bonus'
    ];

    phaseOrder.forEach(phase => {
      grouped[phase] = filteredExercises.filter(ex =>
        ex.phase && ex.phase.includes(phase)
      );
    });

    const withoutPhases = filteredExercises.filter(ex => !ex.phase || ex.phase.length === 0);
    if (withoutPhases.length > 0) {
      grouped['General Exercises'] = withoutPhases;
    }

    Object.keys(grouped).forEach(key => {
      if (grouped[key].length === 0) {
        delete grouped[key];
      }
    });

    return grouped;
  }, [filteredExercises]);

  const categoryStats = useMemo(() => ({
    all: exerciseLibrary.length,
    chest: getExercisesByCategory('chest').length,
    back: getExercisesByCategory('back').length,
    shoulders: getExercisesByCategory('shoulders').length,
    arms: getExercisesByCategory('arms').length,
    legs: getExercisesByCategory('legs').length,
    core: getExercisesByCategory('core').length,
    compound: getExercisesByCategory('compound').length,
    'neck-traps': getExercisesByCategory('neck-traps').length,
  }), []);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedEquipment('all');
    setSelectedPhase('all');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedEquipment !== 'all' || selectedPhase !== 'all';

  const getDifficultyColor = (difficulty: Exercise['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950';
      case 'advanced': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950';
    }
  };

  const getCategoryIcon = (category: Exercise['category']) => {
    switch (category) {
      case 'chest': return '💪';
      case 'back': return '🦾';
      case 'shoulders': return '🏋️';
      case 'arms': return '💪';
      case 'legs': return '🦵';
      case 'core': return '⚡';
      case 'compound': return '🔥';
      case 'neck-traps': return '🎯';
    }
  };

  const getCategoryColor = (category: Exercise['category']) => {
    switch (category) {
      case 'chest': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400';
      case 'back': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400';
      case 'shoulders': return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400';
      case 'arms': return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400';
      case 'legs': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
      case 'core': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400';
      case 'compound': return 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400';
      case 'neck-traps': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400';
    }
  };

  const getPhaseDescription = (phase: string) => {
    const descriptions: Record<string, string> = {
      'Phase One': 'Weeks 1-8: Shoulder Emphasis - Building foundation with incline pressing, overhead pressing, and weighted chinups',
      'Phase Two': 'Weeks 9-16: Chest Emphasis - Focus on weighted dips and chest development',
      'Phase Three': 'Weeks 17-24: Return to Strength - Back to shoulder emphasis for continued gains',
      'MEGA Phase One': 'Weeks 1-6: Maximum volume for rapid muscle growth',
      'MEGA Phase Two': 'Weeks 7-12: Continued muscle growth with new exercises',
      'Chest Specialization': 'Extra volume for chest development',
      'Shoulder Specialization': 'Extra volume for shoulder development',
      'Triceps Specialization': 'Extra volume for triceps development',
      'Back Specialization': 'Extra volume for back development',
      'Biceps Specialization': 'Extra volume for biceps development',
      'Legs Specialization': 'Extra volume for leg development',
      '3-Day Split': 'Advanced training split for more focused muscle group work',
      '3-Day Split Phase Two': 'Weeks 7-12: Alternative exercises and progression',
      'Heavy Deadlift Phase One': 'Sumo deadlifts with Bulgarian split squats',
      'Heavy Deadlift Phase Two': 'Sumo deadlifts with front squats',
      'Neck and Traps Bonus': 'Complete your physique with neck and trap development'
    };
    return descriptions[phase] || '';
  };

  const formatCategory = (category: Exercise['category']) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' & ');
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header with Program Context */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#20808D] via-[#1A96A8] to-[#1FB8CD] dark:from-[#1A6B76] dark:via-[#1A96A8] dark:to-[#1FB8CD] text-white rounded-2xl p-8 shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Dumbbell className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
                <p className="text-white/80 text-sm mt-1">
                  {exerciseLibrary.length} exercises from Greek God 2.0
                </p>
              </div>
            </div>
          </div>
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
        </div>

        {/* View Mode Toggle - Refined */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('by-phase')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'by-phase'
                ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white shadow-md'
                : 'bg-white dark:bg-[#161B22] text-[#5F6368] dark:text-[#8B949E] border border-[#E8EAED] dark:border-[#30363D] hover:border-[#20808D] dark:hover:border-[#1FB8CD] hover:text-[#202124] dark:hover:text-[#E6EDF3]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            By Phase
          </button>
          <button
            onClick={() => setViewMode('by-category')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'by-category'
                ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white shadow-md'
                : 'bg-white dark:bg-[#161B22] text-[#5F6368] dark:text-[#8B949E] border border-[#E8EAED] dark:border-[#30363D] hover:border-[#20808D] dark:hover:border-[#1FB8CD] hover:text-[#202124] dark:hover:text-[#E6EDF3]'
            }`}
          >
            <Target className="w-4 h-4" />
            By Muscle
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'all'
                ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white shadow-md'
                : 'bg-white dark:bg-[#161B22] text-[#5F6368] dark:text-[#8B949E] border border-[#E8EAED] dark:border-[#30363D] hover:border-[#20808D] dark:hover:border-[#1FB8CD] hover:text-[#202124] dark:hover:text-[#E6EDF3]'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            All
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-[#E8EAED] dark:border-[#30363D] p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5F6368] dark:text-[#8B949E] w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, muscle group, or equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-[#E8EAED] dark:border-[#30363D] rounded-xl bg-[#FCFCF9] dark:bg-[#0D1117] text-[#202124] dark:text-[#E6EDF3] placeholder:text-[#5F6368] dark:placeholder:text-[#8B949E] focus:ring-2 focus:ring-[#20808D] dark:focus:ring-[#1FB8CD] focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-4 flex items-center gap-2 text-[#5F6368] dark:text-[#8B949E] hover:text-[#20808D] dark:hover:text-[#1FB8CD] transition-colors font-medium text-sm"
          >
            <Filter className="w-4 h-4" />
            <span>
              {showFilters ? 'Hide Filters' : 'Advanced Filters'}
            </span>
            {hasActiveFilters && (
              <span className="bg-[#20808D] dark:bg-[#1FB8CD] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {[selectedCategory !== 'all', selectedDifficulty !== 'all', selectedEquipment !== 'all', selectedPhase !== 'all'].filter(Boolean).length}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-[#E8EAED] dark:border-[#30363D] space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#5F6368] dark:text-[#8B949E] uppercase tracking-wide mb-3">
                  Program Phase
                </label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E8EAED] dark:border-[#30363D] rounded-xl bg-[#FCFCF9] dark:bg-[#0D1117] text-[#202124] dark:text-[#E6EDF3] focus:ring-2 focus:ring-[#20808D] dark:focus:ring-[#1FB8CD] focus:border-transparent text-sm"
                >
                  <option value="all">All Phases</option>
                  {allPhases.map(phase => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5F6368] dark:text-[#8B949E] uppercase tracking-wide mb-3">
                  Muscle Group
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All', count: categoryStats.all },
                    { value: 'chest', label: 'Chest', count: categoryStats.chest },
                    { value: 'back', label: 'Back', count: categoryStats.back },
                    { value: 'shoulders', label: 'Shoulders', count: categoryStats.shoulders },
                    { value: 'arms', label: 'Arms', count: categoryStats.arms },
                    { value: 'legs', label: 'Legs', count: categoryStats.legs },
                    { value: 'core', label: 'Core', count: categoryStats.core },
                    { value: 'compound', label: 'Compound', count: categoryStats.compound },
                    { value: 'neck-traps', label: 'Neck', count: categoryStats['neck-traps'] },
                  ].map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        selectedCategory === cat.value
                          ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white shadow-md scale-105'
                          : 'bg-[#FCFCF9] dark:bg-[#0D1117] text-[#5F6368] dark:text-[#8B949E] border border-[#E8EAED] dark:border-[#30363D] hover:border-[#20808D] dark:hover:border-[#1FB8CD] hover:text-[#202124] dark:hover:text-[#E6EDF3]'
                      }`}
                    >
                      {cat.label} <span className="opacity-60">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5F6368] dark:text-[#8B949E] uppercase tracking-wide mb-3">
                  Difficulty Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All Levels' },
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ].map(diff => (
                    <button
                      key={diff.value}
                      onClick={() => setSelectedDifficulty(diff.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        selectedDifficulty === diff.value
                          ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white shadow-md scale-105'
                          : 'bg-[#FCFCF9] dark:bg-[#0D1117] text-[#5F6368] dark:text-[#8B949E] border border-[#E8EAED] dark:border-[#30363D] hover:border-[#20808D] dark:hover:border-[#1FB8CD] hover:text-[#202124] dark:hover:text-[#E6EDF3]'
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5F6368] dark:text-[#8B949E] uppercase tracking-wide mb-3">
                  Equipment Type
                </label>
                <select
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E8EAED] dark:border-[#30363D] rounded-xl bg-[#FCFCF9] dark:bg-[#0D1117] text-[#202124] dark:text-[#E6EDF3] focus:ring-2 focus:ring-[#20808D] dark:focus:ring-[#1FB8CD] focus:border-transparent text-sm"
                >
                  <option value="all">All Equipment</option>
                  {allEquipment.map(eq => (
                    <option key={eq} value={eq}>{eq}</option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredExercises.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">
              <span className="font-bold text-[#202124] dark:text-[#E6EDF3]">{filteredExercises.length}</span> exercise{filteredExercises.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {/* Exercise Display - Table */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#F5F5F5] dark:bg-[#161B22] mb-4">
              <Dumbbell className="w-10 h-10 text-[#5F6368] dark:text-[#8B949E]" />
            </div>
            <h3 className="text-xl font-bold text-[#202124] dark:text-[#E6EDF3] mb-2">
              No exercises found
            </h3>
            <p className="text-[#5F6368] dark:text-[#8B949E] mb-4">
              Try adjusting your search or filters
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[#20808D] dark:text-[#1FB8CD] hover:underline font-medium text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === 'by-phase' ? (
          <div className="space-y-10">
            {Object.entries(exercisesByPhase).map(([phase, exercises]) => (
              <div key={phase} className="space-y-4">
                <div className="bg-gradient-to-r from-white to-[#FCFCF9] dark:from-[#161B22] dark:to-[#0D1117] rounded-2xl p-5 border border-[#E8EAED] dark:border-[#30363D]">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-[#202124] dark:text-[#E6EDF3]">
                      {phase}
                    </h2>
                    <Badge variant="outline">{exercises.length} exercises</Badge>
                  </div>
                  {getPhaseDescription(phase) && (
                    <p className="text-sm text-[#5F6368] dark:text-[#8B949E] leading-relaxed">
                      {getPhaseDescription(phase)}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-[#E8EAED] dark:border-[#30363D] overflow-hidden bg-white dark:bg-[#161B22]">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="min-w-[180px]">Exercise</TableHead>
                          <TableHead className="min-w-[100px] hidden sm:table-cell">Category</TableHead>
                          <TableHead className="text-center min-w-[60px]">Day</TableHead>
                          <TableHead className="min-w-[120px] hidden md:table-cell">Training Method</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exercises.map((exercise) => (
                          <TableRow
                            key={exercise.id}
                            onClick={() => setSelectedExercise(exercise)}
                            className="cursor-pointer hover:bg-[#F5F5F5] dark:hover:bg-[#0D1117] transition-colors"
                          >
                            <TableCell className="font-semibold">{exercise.name}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge variant="outline">
                                {formatCategory(exercise.category)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {exercise.workoutDay ? (
                                <Badge className="bg-[#20808D] dark:bg-[#1FB8CD] hover:bg-[#1A6B76] dark:hover:bg-[#1A96A8]">
                                  {exercise.workoutDay}
                                </Badge>
                              ) : (
                                <span className="text-[#5F6368] dark:text-[#8B949E] text-sm">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-[#5F6368] dark:text-[#8B949E] hidden md:table-cell">
                              {exercise.trainingMethod}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'by-category' ? (
          <div className="space-y-10">
            {Object.entries({
              chest: 'Chest',
              back: 'Back',
              shoulders: 'Shoulders',
              arms: 'Arms',
              legs: 'Legs',
              core: 'Core',
              compound: 'Compound Movements',
              'neck-traps': 'Neck & Traps'
            }).map(([category, label]) => {
              const categoryExercises = filteredExercises.filter(ex => ex.category === category);
              if (categoryExercises.length === 0) return null;

              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#20808D] to-[#1FB8CD] dark:from-[#1A6B76] dark:to-[#1FB8CD] rounded-xl">
                      <span className="text-3xl">{getCategoryIcon(category as Exercise['category'])}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-[#202124] dark:text-[#E6EDF3]">
                        {label}
                      </h2>
                      <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">
                        {categoryExercises.length} exercises
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E8EAED] dark:border-[#30363D] overflow-hidden bg-white dark:bg-[#161B22]">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="min-w-[180px]">Exercise</TableHead>
                            <TableHead className="min-w-[100px] hidden sm:table-cell">Category</TableHead>
                            <TableHead className="text-center min-w-[60px]">Day</TableHead>
                            <TableHead className="min-w-[120px] hidden md:table-cell">Training Method</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryExercises.map((exercise) => (
                            <TableRow
                              key={exercise.id}
                              onClick={() => setSelectedExercise(exercise)}
                              className="cursor-pointer hover:bg-[#F5F5F5] dark:hover:bg-[#0D1117] transition-colors"
                            >
                              <TableCell className="font-semibold">{exercise.name}</TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge variant="outline">
                                  {formatCategory(exercise.category)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                {exercise.workoutDay ? (
                                  <Badge className="bg-[#20808D] dark:bg-[#1FB8CD]">
                                    {exercise.workoutDay}
                                  </Badge>
                                ) : (
                                  <span className="text-[#5F6368] dark:text-[#8B949E] text-sm">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-[#5F6368] dark:text-[#8B949E] hidden md:table-cell">
                                {exercise.trainingMethod}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E8EAED] dark:border-[#30363D] overflow-hidden bg-white dark:bg-[#161B22]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[180px]">Exercise</TableHead>
                    <TableHead className="min-w-[100px] hidden sm:table-cell">Category</TableHead>
                    <TableHead className="text-center min-w-[60px]">Day</TableHead>
                    <TableHead className="min-w-[120px] hidden md:table-cell">Training Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExercises.map((exercise) => (
                    <TableRow
                      key={exercise.id}
                      onClick={() => setSelectedExercise(exercise)}
                      className="cursor-pointer hover:bg-[#F5F5F5] dark:hover:bg-[#0D1117] transition-colors"
                    >
                      <TableCell className="font-semibold">{exercise.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">
                          {formatCategory(exercise.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {exercise.workoutDay ? (
                          <Badge className="bg-[#20808D] dark:bg-[#1FB8CD]">
                            {exercise.workoutDay}
                          </Badge>
                        ) : (
                          <span className="text-[#5F6368] dark:text-[#8B949E] text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-[#5F6368] dark:text-[#8B949E] hidden md:table-cell">
                        {exercise.trainingMethod}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="bg-white dark:bg-[#161B22] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-[#161B22] border-b border-[#E8EAED] dark:border-[#30363D] p-6 rounded-t-2xl z-10">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3] flex-1 leading-tight">
                  {selectedExercise.name}
                </h2>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="shrink-0 p-2 rounded-xl text-[#5F6368] dark:text-[#8B949E] hover:bg-[#F5F5F5] dark:hover:bg-[#0D1117] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${getCategoryColor(selectedExercise.category)}`}>
                  {getCategoryIcon(selectedExercise.category)} {selectedExercise.category.charAt(0).toUpperCase() + selectedExercise.category.slice(1).replace('-', ' & ')}
                </span>
                <span className={`text-xs px-3 py-1.5 rounded-xl font-medium uppercase tracking-wide ${getDifficultyColor(selectedExercise.difficulty)}`}>
                  {selectedExercise.difficulty}
                </span>
                {selectedExercise.workoutDay && (
                  <span className="text-xs font-bold bg-[#20808D] dark:bg-[#1FB8CD] text-white px-3 py-1.5 rounded-xl">
                    Workout {selectedExercise.workoutDay}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#5F6368] dark:text-[#8B949E] uppercase tracking-wide mb-2">Description</h3>
                <p className="text-[#202124] dark:text-[#E6EDF3] leading-relaxed">{selectedExercise.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#5F6368] dark:text-[#8B949E] uppercase tracking-wide mb-3">Target Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.muscleGroups.map(mg => (
                    <span key={mg} className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-xl font-medium text-sm border border-blue-200 dark:border-blue-900">
                      {mg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#FCFCF9] dark:bg-[#0D1117] rounded-xl p-4 border border-[#E8EAED] dark:border-[#30363D]">
                  <div className="text-xs font-bold text-[#5F6368] dark:text-[#8B949E] uppercase tracking-wide mb-2">Training Method</div>
                  <div className="text-[#202124] dark:text-[#E6EDF3] font-semibold text-sm">{selectedExercise.trainingMethod}</div>
                </div>
                <div className="bg-[#FCFCF9] dark:bg-[#0D1117] rounded-xl p-4 border border-[#E8EAED] dark:border-[#30363D]">
                  <div className="text-xs font-bold text-[#5F6368] dark:text-[#8B949E] uppercase tracking-wide mb-2">Sets × Reps</div>
                  <div className="text-[#202124] dark:text-[#E6EDF3] font-semibold text-sm">{selectedExercise.sets} sets × {selectedExercise.repRange}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#5F6368] dark:text-[#8B949E] uppercase tracking-wide mb-3">Required Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.equipment.map(eq => (
                    <span key={eq} className="bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 px-3 py-2 rounded-xl text-sm border border-purple-200 dark:border-purple-900">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {selectedExercise.phase && selectedExercise.phase.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#5F6368] dark:text-[#8B949E] uppercase tracking-wide mb-3">Program Phases</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.phase.map(phase => (
                      <span key={phase} className="bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 px-3 py-2 rounded-xl text-sm border border-green-200 dark:border-green-900">
                        {phase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedExercise.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-200 dark:border-yellow-900/50 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <span className="text-xl shrink-0">💡</span>
                    <div>
                      <h3 className="text-sm font-bold text-[#202124] dark:text-[#E6EDF3] mb-1">Important Notes</h3>
                      <p className="text-sm text-[#202124] dark:text-[#E6EDF3] leading-relaxed">{selectedExercise.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedExercise.variations && selectedExercise.variations.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#5F6368] dark:text-[#8B949E] uppercase tracking-wide mb-3">Variations</h3>
                  <ul className="space-y-2">
                    {selectedExercise.variations.map(variation => (
                      <li key={variation} className="flex items-start gap-2 text-[#202124] dark:text-[#E6EDF3] text-sm">
                        <span className="text-[#20808D] dark:text-[#1FB8CD] mt-0.5">•</span>
                        {variation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ExerciseLibrary;
