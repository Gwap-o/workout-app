// Progress & Analytics Page

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { ExerciseProgressChart } from '@/components/charts/ExerciseProgressChart';
import { BodyweightChart } from '@/components/charts/BodyweightChart';
import { FitnessStandardsTracker } from '@/components/charts/FitnessStandardsTracker';
import { WorkoutCalendarHeatmap } from '@/components/charts/WorkoutCalendarHeatmap';
import { StreakCounter } from '@/components/charts/StreakCounter';
import { BodyMeasurementsTracker } from '@/components/progress/BodyMeasurementsTracker';
import { ProgressPhotosGallery } from '@/components/progress/ProgressPhotosGallery';
import { useProgressAnalytics } from '@/lib/hooks/useProgressAnalytics';
import { Loader2, TrendingUp } from 'lucide-react';

type TimePeriod = '4w' | '8w' | '6m' | '1y' | 'all';

export default function Progress() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('8w');
  const [selectedExercise, setSelectedExercise] = useState<string | undefined>(undefined);

  const {
    loading,
    error,
    availableExercises,
    getExerciseChartData,
    bodyweightChartData,
    bodyweightLogs,
    streakData,
    weightChangeRate,
    tierProgressData,
    workoutSessions,
  } = useProgressAnalytics({ timePeriod, exercise: selectedExercise });

  // Get user bodyweight for fitness standards
  const userBodyweight = useMemo(() => {
    if (bodyweightLogs.length > 0) {
      return Number(bodyweightLogs[0].weight);
    }
    return 180; // Default
  }, [bodyweightLogs]);

  // Get goal weight from user profile (would need to fetch from profile)
  const goalWeight = userBodyweight + 10; // Placeholder

  // Exercise chart data
  const exerciseChartData = useMemo(() => {
    if (!selectedExercise) return [];
    return getExerciseChartData(selectedExercise);
  }, [selectedExercise, getExerciseChartData]);

  // Calendar heatmap data (current month)
  const calendarMonth = new Date();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#20808D] dark:text-[#1FB8CD]" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Card>
          <CardContent className="flex items-center justify-center h-64 text-red-600 dark:text-red-400">
            <p>Error loading progress data: {error}</p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2 text-[#202124] dark:text-[#E6EDF3]">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-[#20808D] dark:text-[#1FB8CD]" />
          Progress & Analytics
        </h1>
        <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#8B949E]">
          Track your workout progression, body measurements, and fitness milestones
        </p>
      </div>

      {/* Time Period Filter */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <Label htmlFor="time-period">Time Period:</Label>
        <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
          <SelectTrigger id="time-period" className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4w">Last 4 Weeks</SelectItem>
            <SelectItem value="8w">Last 8 Weeks</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="standards">Standards</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Streak Counter */}
          <StreakCounter streakData={streakData} />

          {/* Calendar Heatmap */}
          <WorkoutCalendarHeatmap sessions={workoutSessions} month={calendarMonth} />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#202124] dark:text-[#E6EDF3]">Total Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#202124] dark:text-[#E6EDF3]">{workoutSessions.length}</p>
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">
                  in selected period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#202124] dark:text-[#E6EDF3]">Exercises Tracked</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#202124] dark:text-[#E6EDF3]">{availableExercises.length}</p>
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">
                  different exercises
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-[#202124] dark:text-[#E6EDF3]">Weight Change Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#202124] dark:text-[#E6EDF3]">
                  {weightChangeRate !== null ? (
                    <>
                      {weightChangeRate > 0 ? '+' : ''}
                      {weightChangeRate.toFixed(2)}
                    </>
                  ) : (
                    'N/A'
                  )}
                </p>
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">lbs/week</p>
              </CardContent>
            </Card>
          </div>

          {/* Bodyweight Chart */}
          <BodyweightChart
            data={bodyweightChartData}
            goalWeight={goalWeight}
            showMovingAverage
          />
        </TabsContent>

        {/* Exercises Tab */}
        <TabsContent value="exercises" className="space-y-6">
          {/* Exercise Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="exercise-select">Select Exercise:</Label>
            <Select
              value={selectedExercise || ''}
              onValueChange={(value) => setSelectedExercise(value)}
            >
              <SelectTrigger id="exercise-select" className="w-full sm:w-64">
                <SelectValue placeholder="Choose an exercise" />
              </SelectTrigger>
              <SelectContent>
                {availableExercises.length === 0 ? (
                  <div className="px-2 py-2 text-center text-xs text-[#5F6368] dark:text-[#8B949E]">
                    No exercises
                  </div>
                ) : (
                  availableExercises.map((exercise) => (
                    <SelectItem key={exercise} value={exercise}>
                      {exercise}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Exercise Progression Chart */}
          {selectedExercise ? (
            <ExerciseProgressChart
              data={exerciseChartData}
              title={`${selectedExercise} Progression`}
              description="Track your volume and estimated 1RM over time"
              showEstimatedMax
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-[#5F6368] dark:text-[#8B949E]">
                <p>Select an exercise to view progression</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Body Tab */}
        <TabsContent value="body" className="space-y-6">
          {/* Bodyweight Chart */}
          <BodyweightChart
            data={bodyweightChartData}
            goalWeight={goalWeight}
            showMovingAverage
          />

          {/* Body Measurements */}
          <BodyMeasurementsTracker
            recentLogs={bodyweightLogs}
            onMeasurementAdded={() => {
              // Refresh data (already handled by hook)
            }}
          />
        </TabsContent>

        {/* Fitness Standards Tab */}
        <TabsContent value="standards" className="space-y-6">
          <FitnessStandardsTracker
            tierProgress={tierProgressData}
            userBodyweight={userBodyweight}
          />
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos" className="space-y-6">
          <ProgressPhotosGallery />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
