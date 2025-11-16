import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, TrendingUp, Utensils, BarChart3, Settings, User } from 'lucide-react';

export function Dashboard() {
  const { user, logout } = useAuth();

  const quickActions = [
    {
      to: '/workout',
      icon: Dumbbell,
      title: 'Log Workout',
      description: 'Track your sets, reps, and weights with intelligent progression',
      color: 'bg-blue-500',
    },
    {
      to: '/history',
      icon: TrendingUp,
      title: 'Workout History',
      description: 'View past workouts and track your progression over time',
      color: 'bg-green-500',
    },
    {
      to: '/nutrition',
      icon: Utensils,
      title: 'Nutrition',
      description: 'Calculate macros and build meal plans',
      color: 'bg-orange-500',
    },
    {
      to: '/progress',
      icon: BarChart3,
      title: 'Progress',
      description: 'View charts, stats, and track your transformation',
      color: 'bg-purple-500',
    },
    {
      to: '/settings',
      icon: Settings,
      title: 'Settings',
      description: 'Manage your profile, preferences, and phase rotation',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Greek God Tracker
              </h1>
              <p className="text-sm text-gray-600 mt-1">Kinobody 2.0 Program</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 font-medium">
                  {user?.email?.split('@')[0]}
                </span>
              </div>
              <Button variant="destructive" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Ready to track your next workout?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to} className="group">
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{action.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Journey</CardTitle>
            <CardDescription>Track your progress through the Greek God 2.0 program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-900">Total Workouts</h3>
                  <Dumbbell className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-700">0</p>
                <p className="text-xs text-blue-600 mt-1">Start logging to track</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-green-900">Current Streak</h3>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-700">0 weeks</p>
                <p className="text-xs text-green-600 mt-1">Keep consistent!</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-purple-900">Current Phase</h3>
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-700">Phase 1</p>
                <p className="text-xs text-purple-600 mt-1">Week 1 of 8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
