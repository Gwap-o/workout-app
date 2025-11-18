import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { IndicatorExerciseCard } from '@/components/progress/IndicatorExerciseCard';
import {
  INDICATOR_DISPLAY_ORDER,
  getIndicatorMuscleGroups,
  type IndicatorExerciseName,
} from '@/lib/constants/indicatorExercises';

export const IndicatorDashboard = () => {
  const [filter, setFilter] = useState<'all' | 'chest' | 'shoulders' | 'back' | 'legs'>(
    'all'
  );

  const muscleGroups = getIndicatorMuscleGroups();

  // Filter exercises based on selected muscle group
  const filteredExercises =
    filter === 'all'
      ? INDICATOR_DISPLAY_ORDER
      : Object.entries(muscleGroups)
          .filter(([group]) => group.toLowerCase() === filter)
          .flatMap(([_, exercises]) => exercises || []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#20808D] to-[#1FB8CD] dark:from-[#1A6B76] dark:to-[#20808D] rounded-lg p-8 shadow-lg text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                ⚡ Indicator Exercises Dashboard
              </h1>
              <p className="text-white/90 text-lg mb-4">
                Track your progress on the 6 most important exercises in the Greek God
                2.0 program
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <p className="text-sm text-white/90 mb-2">
                  <strong>Why these exercises matter:</strong>
                </p>
                <p className="text-sm text-white/80">
                  These 6 indicator exercises are your north star. If you're progressing
                  on these lifts, you're building the Greek God physique. Focus on these
                  above all else.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-[#1C2128] rounded-lg shadow border border-[#E8EAED] dark:border-[#30363D] p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[#5F6368] dark:text-[#8B949E] mr-2">
              Filter by muscle group:
            </span>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === 'all'
                  ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white'
                  : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
              }`}
            >
              All (6)
            </button>
            <button
              onClick={() => setFilter('chest')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === 'chest'
                  ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white'
                  : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
              }`}
            >
              Chest (2)
            </button>
            <button
              onClick={() => setFilter('shoulders')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === 'shoulders'
                  ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white'
                  : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
              }`}
            >
              Shoulders (1)
            </button>
            <button
              onClick={() => setFilter('back')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === 'back'
                  ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white'
                  : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
              }`}
            >
              Back (1)
            </button>
            <button
              onClick={() => setFilter('legs')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === 'legs'
                  ? 'bg-[#20808D] dark:bg-[#1FB8CD] text-white'
                  : 'bg-[#F5F5F5] dark:bg-[#161B22] text-[#202124] dark:text-[#E6EDF3] hover:bg-[#E8EAED] dark:hover:bg-[#1C2128]'
              }`}
            >
              Legs (2)
            </button>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#1C2128] rounded-lg shadow border border-[#E8EAED] dark:border-[#30363D] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-xl">⚡</span>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">
                  --
                </p>
                <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">
                  At Greek God Level
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C2128] rounded-lg shadow border border-[#E8EAED] dark:border-[#30363D] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">
                  --
                </p>
                <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">
                  Currently Progressing
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1C2128] rounded-lg shadow border border-[#E8EAED] dark:border-[#30363D] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <span className="text-xl">⏸️</span>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-[#202124] dark:text-[#E6EDF3]">
                  --
                </p>
                <p className="text-sm text-[#5F6368] dark:text-[#8B949E]">
                  Plateaued (Need Focus)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Pro Tips for Indicator Exercise Progress
              </h3>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>
                  • <strong>Focus on these above all else</strong> - Progress on
                  indicator exercises = progress on your physique
                </li>
                <li>
                  • <strong>Don't plateau</strong> - If stuck for 2+ weeks, take a
                  deload week then come back stronger
                </li>
                <li>
                  • <strong>Form is king</strong> - Perfect form on these exercises
                  prevents injuries and builds real strength
                </li>
                <li>
                  • <strong>Track every workout</strong> - Small incremental progress
                  compounds over time
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Indicator Exercise Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#202124] dark:text-[#E6EDF3]">
            {filter === 'all'
              ? 'All Indicator Exercises'
              : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Indicators`}
          </h2>
          {filteredExercises.map((exerciseName) => (
            <IndicatorExerciseCard
              key={exerciseName}
              exerciseName={exerciseName as IndicatorExerciseName}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-[#20808D] to-[#1FB8CD] dark:from-[#1A6B76] dark:to-[#20808D] rounded-lg p-6 shadow-lg text-white text-center">
          <h3 className="text-xl font-bold mb-2">
            Ready to build your Greek God physique?
          </h3>
          <p className="text-white/90 mb-4">
            Focus on progressive overload on these 6 exercises and watch your
            physique transform.
          </p>
          <a
            href="/log-workout"
            className="inline-block px-6 py-3 bg-white text-[#20808D] dark:text-[#1A6B76] rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Log Your Next Workout →
          </a>
        </div>
      </div>
    </Layout>
  );
};
