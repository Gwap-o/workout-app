import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, TrendingUp, Utensils, BarChart3, Settings, Activity, Calendar } from 'lucide-react';

export function Dashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#E6EDF3] mb-2">
            Welcome back!
          </h2>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#8B949E]">
            Ready to crush your next workout?
          </p>
        </div>

        {/* Primary Action - Log Workout */}
        <Link to="/workout" className="block mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-[#20808D] to-[#1FB8CD] hover:from-[#1A6B76] hover:to-[#19A5B8] border-0 overflow-hidden transition-all hover:shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      Start Today's Workout
                    </h3>
                    <p className="text-sm sm:text-base text-white/90">
                      Log sets, reps, and track your progress
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-white text-[#20808D] hover:bg-white/90 font-semibold whitespace-nowrap"
                >
                  Let's Go
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Stats Overview */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-[#202124] dark:text-[#E6EDF3] mb-4">
            Your Progress
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D] overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-[#5F6368] dark:text-[#8B949E] mb-1">
                      Total Workouts
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#E6EDF3] truncate">
                      0
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-[#20808D] dark:text-[#1FB8CD]" />
                  </div>
                </div>
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">
                  Start logging to track
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D] overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-[#5F6368] dark:text-[#8B949E] mb-1">
                      Current Streak
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#E6EDF3] truncate">
                      0
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#20808D] dark:text-[#1FB8CD]" />
                  </div>
                </div>
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">
                  Keep consistent!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D] overflow-hidden sm:col-span-2 lg:col-span-1">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-[#5F6368] dark:text-[#8B949E] mb-1">
                      Current Phase
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#E6EDF3] truncate">
                      Phase 1
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#20808D] dark:text-[#1FB8CD]" />
                  </div>
                </div>
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">
                  Week 1 of 8
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#202124] dark:text-[#E6EDF3] mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link to="/history" className="group">
              <Card className="h-full hover:shadow-lg dark:hover:shadow-none hover:border-[#20808D] dark:hover:border-[#1FB8CD] bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D] transition-all overflow-hidden">
                <CardContent className="p-4 sm:p-5 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-[#20808D]/20 dark:group-hover:bg-[#1FB8CD]/20 transition-colors">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#20808D] dark:text-[#1FB8CD]" />
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-[#202124] dark:text-[#E6EDF3] mb-1">
                    History
                  </h4>
                  <p className="text-xs text-[#5F6368] dark:text-[#8B949E] line-clamp-2">
                    View past workouts
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/progress" className="group">
              <Card className="h-full hover:shadow-lg dark:hover:shadow-none hover:border-[#20808D] dark:hover:border-[#1FB8CD] bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D] transition-all overflow-hidden">
                <CardContent className="p-4 sm:p-5 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-[#20808D]/20 dark:group-hover:bg-[#1FB8CD]/20 transition-colors">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#20808D] dark:text-[#1FB8CD]" />
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-[#202124] dark:text-[#E6EDF3] mb-1">
                    Analytics
                  </h4>
                  <p className="text-xs text-[#5F6368] dark:text-[#8B949E] line-clamp-2">
                    Track progress
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/nutrition" className="group">
              <Card className="h-full hover:shadow-lg dark:hover:shadow-none hover:border-[#20808D] dark:hover:border-[#1FB8CD] bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D] transition-all overflow-hidden">
                <CardContent className="p-4 sm:p-5 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#20808D]/10 dark:bg-[#1FB8CD]/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-[#20808D]/20 dark:group-hover:bg-[#1FB8CD]/20 transition-colors">
                    <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-[#20808D] dark:text-[#1FB8CD]" />
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-[#202124] dark:text-[#E6EDF3] mb-1">
                    Nutrition
                  </h4>
                  <p className="text-xs text-[#5F6368] dark:text-[#8B949E] line-clamp-2">
                    Macros & meals
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/settings" className="group">
              <Card className="h-full hover:shadow-lg dark:hover:shadow-none hover:border-[#5F6368] dark:hover:border-[#8B949E] bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D] transition-all overflow-hidden">
                <CardContent className="p-4 sm:p-5 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5F6368]/10 dark:bg-[#8B949E]/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-[#5F6368]/20 dark:group-hover:bg-[#8B949E]/20 transition-colors">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-[#5F6368] dark:text-[#8B949E]" />
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-[#202124] dark:text-[#E6EDF3] mb-1">
                    Settings
                  </h4>
                  <p className="text-xs text-[#5F6368] dark:text-[#8B949E] line-clamp-2">
                    Preferences
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
