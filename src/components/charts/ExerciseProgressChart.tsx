// Exercise Progression Line Chart Component

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExerciseProgressPoint } from '@/lib/utils/analytics';

interface ExerciseProgressChartProps {
  data: ExerciseProgressPoint[];
  title: string;
  description?: string;
  showEstimatedMax?: boolean;
  height?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload as ExerciseProgressPoint;

  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
      <p className="font-semibold text-sm mb-2">{data.displayDate}</p>
      <div className="space-y-1 text-xs">
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-medium">Top Set:</span> {data.weight} lbs × {data.reps} reps
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-medium">Total Volume:</span> {data.volume.toLocaleString()} lbs
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-medium">Est. 1RM:</span> {data.estimatedMax} lbs
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-medium">Sets:</span> {data.sets}
        </p>
        {data.metadata?.hitProgression && (
          <p className="text-green-600 dark:text-green-400 font-medium">Progression Hit! ⬆</p>
        )}
      </div>
    </div>
  );
};

export const ExerciseProgressChart = ({
  data,
  title,
  description,
  showEstimatedMax = true,
  height = 400,
}: ExerciseProgressChartProps) => {
  const chartData = useMemo(() => data, [data]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available. Start logging workouts to see your progress!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="displayDate"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              stroke="currentColor"
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              stroke="currentColor"
              label={{ value: 'Volume (lbs)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
              name="Total Volume"
            />
            {showEstimatedMax && (
              <Line
                type="monotone"
                dataKey="estimatedMax"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: '#8b5cf6' }}
                name="Est. 1RM"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
