// Workout Calendar Heatmap Component
// GitHub-style contribution calendar for workout consistency

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO } from 'date-fns';
import type { WorkoutSession } from '@/types';

interface WorkoutCalendarHeatmapProps {
  sessions: WorkoutSession[];
  month?: Date; // Default to current month
}

interface DayData {
  date: string;
  count: number;
  workoutType: 'A' | 'B' | 'both' | null;
  intensity: 'none' | 'low' | 'medium' | 'high';
}

const getIntensityColor = (intensity: 'none' | 'low' | 'medium' | 'high', workoutType: 'A' | 'B' | 'both' | null): string => {
  if (intensity === 'none') return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700';

  // Workout A = Blue, Workout B = Green, Both = Purple
  if (workoutType === 'A') {
    if (intensity === 'high') return 'bg-blue-700 border-blue-800';
    if (intensity === 'medium') return 'bg-blue-500 border-blue-600';
    return 'bg-blue-300 border-blue-400';
  }

  if (workoutType === 'B') {
    if (intensity === 'high') return 'bg-green-700 border-green-800';
    if (intensity === 'medium') return 'bg-green-500 border-green-600';
    return 'bg-green-300 border-green-400';
  }

  // Both workouts (shouldn't happen with guardrails, but handle it)
  if (workoutType === 'both') {
    return 'bg-purple-600 border-purple-700';
  }

  return 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
};

export const WorkoutCalendarHeatmap = ({
  sessions,
  month = new Date(),
}: WorkoutCalendarHeatmapProps) => {
  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Create session map by date
    const sessionMap = new Map<string, WorkoutSession[]>();
    sessions.forEach((session) => {
      const dateStr = session.date;
      if (!sessionMap.has(dateStr)) {
        sessionMap.set(dateStr, []);
      }
      sessionMap.get(dateStr)!.push(session);
    });

    // Build day data
    const dayData: DayData[] = allDays.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const daySessions = sessionMap.get(dateStr) || [];

      if (daySessions.length === 0) {
        return {
          date: dateStr,
          count: 0,
          workoutType: null,
          intensity: 'none' as const,
        };
      }

      // Determine workout type
      let workoutType: 'A' | 'B' | 'both' | null = null;
      if (daySessions.length === 1) {
        workoutType = daySessions[0].workout_type;
      } else {
        workoutType = 'both'; // Multiple workouts (rare)
      }

      // Determine intensity based on duration
      let intensity: 'low' | 'medium' | 'high' = 'medium';
      const avgDuration = daySessions.reduce((sum, s) => sum + (s.duration || 60), 0) / daySessions.length;

      if (avgDuration < 45) intensity = 'low';
      else if (avgDuration > 75) intensity = 'high';

      return {
        date: dateStr,
        count: daySessions.length,
        workoutType,
        intensity,
      };
    });

    // Organize into weeks (Sunday to Saturday)
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];

    // Add empty days at the start of the month
    const firstDayOfWeek = getDay(monthStart); // 0 = Sunday
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: '',
        count: 0,
        workoutType: null,
        intensity: 'none',
      });
    }

    dayData.forEach((day) => {
      currentWeek.push(day);

      // Start new week on Sunday (or if we have 7 days)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add remaining days
    if (currentWeek.length > 0) {
      // Fill rest of week with empty days
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: '',
          count: 0,
          workoutType: null,
          intensity: 'none',
        });
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }, [sessions, month]);

  const monthName = format(month, 'MMMM yyyy');
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate monthly stats
  const totalWorkouts = sessions.filter((s) => {
    const sessionMonth = format(parseISO(s.date), 'yyyy-MM');
    const targetMonth = format(month, 'yyyy-MM');
    return sessionMonth === targetMonth;
  }).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Calendar - {monthName}</CardTitle>
        <CardDescription>
          {totalWorkouts} workout{totalWorkouts !== 1 ? 's' : ''} this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {/* Day labels */}
          <div className="flex gap-1 mb-2">
            {dayLabels.map((label) => (
              <div
                key={label}
                className="w-10 h-6 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="space-y-1">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.map((day) => {
                  if (!day.date) {
                    // Empty day (before month starts or after ends)
                    return (
                      <div
                        key={`empty-${weekIndex}-${Math.random()}`}
                        className="w-10 h-10 rounded border border-transparent"
                      />
                    );
                  }

                  const dayNum = format(parseISO(day.date), 'd');
                  const colorClass = getIntensityColor(day.intensity, day.workoutType);

                  return (
                    <div
                      key={day.date}
                      className={`w-10 h-10 rounded border flex items-center justify-center text-xs font-medium transition-all hover:scale-110 cursor-pointer ${colorClass}`}
                      title={`${format(parseISO(day.date), 'MMM d')}${
                        day.workoutType ? ` - Workout ${day.workoutType}` : ' - Rest Day'
                      }`}
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Legend:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                <span>Rest Day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border bg-blue-500 border-blue-600" />
                <span>Workout A</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border bg-green-500 border-green-600" />
                <span>Workout B</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
