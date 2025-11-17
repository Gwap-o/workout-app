import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, TrendingUp, Utensils, BarChart3, Settings } from 'lucide-react';

export function Dashboard() {
  const quickActions = [
    {
      to: '/workout',
      icon: Dumbbell,
      title: 'Log Workout',
      description: 'Track your sets, reps, and weights with intelligent progression',
      color: 'bg-[#20808D] dark:bg-[#1FB8CD]',
    },
    {
      to: '/history',
      icon: TrendingUp,
      title: 'Workout History',
      description: 'View past workouts and track your progression over time',
      color: 'bg-[#20808D] dark:bg-[#1FB8CD]',
    },
    {
      to: '/nutrition',
      icon: Utensils,
      title: 'Nutrition',
      description: 'Calculate macros and build meal plans',
      color: 'bg-[#20808D] dark:bg-[#1FB8CD]',
    },
    {
      to: '/progress',
      icon: BarChart3,
      title: 'Progress',
      description: 'View charts, stats, and track your transformation',
      color: 'bg-[#20808D] dark:bg-[#1FB8CD]',
    },
    {
      to: '/settings',
      icon: Settings,
      title: 'Settings',
      description: 'Manage your profile, preferences, and phase rotation',
      color: 'bg-[#5F6368] dark:bg-[#8B949E]',
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#202124] dark:text-[#E6EDF3] mb-2">Welcome back!</h2>
        <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#8B949E]">Ready to track your next workout?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to} className="group">
            <Card className="h-full hover:shadow-lg dark:hover:shadow-none bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D] transition-shadow">
              <CardHeader className="p-4 sm:p-6">
                <div className={`${action.color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3`}>
                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl text-[#202124] dark:text-[#E6EDF3]">{action.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-[#5F6368] dark:text-[#8B949E]">
                  {action.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-white dark:bg-[#1C2128] border-[#E8EAED] dark:border-[#30363D]">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-[#202124] dark:text-[#E6EDF3]">Your Journey</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-[#5F6368] dark:text-[#8B949E]">Track your progress and build strength</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#F5F5F5] dark:bg-[#161B22] p-4 rounded-lg border border-[#E8EAED] dark:border-[#30363D]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm sm:text-base font-semibold text-[#202124] dark:text-[#E6EDF3]">Total Workouts</h3>
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-[#20808D] dark:text-[#1FB8CD]" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#E6EDF3]">0</p>
              <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">Start logging to track</p>
            </div>

            <div className="bg-[#F5F5F5] dark:bg-[#161B22] p-4 rounded-lg border border-[#E8EAED] dark:border-[#30363D]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm sm:text-base font-semibold text-[#202124] dark:text-[#E6EDF3]">Current Streak</h3>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#20808D] dark:text-[#1FB8CD]" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#E6EDF3]">0 weeks</p>
              <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">Keep consistent!</p>
            </div>

            <div className="bg-[#F5F5F5] dark:bg-[#161B22] p-4 rounded-lg border border-[#E8EAED] dark:border-[#30363D]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm sm:text-base font-semibold text-[#202124] dark:text-[#E6EDF3]">Current Phase</h3>
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#20808D] dark:text-[#1FB8CD]" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-[#E6EDF3]">Phase 1</p>
              <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">Week 1 of 8</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
