// Bodyweight Trend Chart Component

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
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartDataPoint } from '@/lib/utils/analytics';

interface BodyweightChartProps {
  data: ChartDataPoint[];
  goalWeight?: number;
  showMovingAverage?: boolean;
  height?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload as ChartDataPoint;
  const movingAvg = data.metadata?.movingAverage;

  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
      <p className="font-semibold text-sm mb-2">{data.displayDate}</p>
      <div className="space-y-1 text-xs">
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-medium">Weight:</span> {data.value.toFixed(1)} lbs
        </p>
        {movingAvg && (
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">7-Day Avg:</span> {movingAvg} lbs
          </p>
        )}
      </div>
    </div>
  );
};

export const BodyweightChart = ({
  data,
  goalWeight,
  showMovingAverage = true,
  height = 400,
}: BodyweightChartProps) => {
  const chartData = useMemo(() => data, [data]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bodyweight Trend</CardTitle>
          <CardDescription>Track your weight over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No bodyweight data. Log your weight to see trends!
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate y-axis domain for better visualization
  const weights = chartData.map((d) => d.value);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const range = maxWeight - minWeight;
  const padding = range * 0.1 || 5; // 10% padding or 5 lbs minimum

  const yMin = Math.floor(minWeight - padding);
  const yMax = Math.ceil(maxWeight + padding);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bodyweight Trend</CardTitle>
        <CardDescription>
          Track your weight over time with 7-day moving average
        </CardDescription>
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
              domain={[yMin, yMax]}
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              stroke="currentColor"
              label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            {goalWeight && (
              <ReferenceLine
                y={goalWeight}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{
                  value: `Goal: ${goalWeight} lbs`,
                  position: 'right',
                  fill: '#10b981',
                  fontSize: 12,
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
              name="Daily Weight"
            />
            {showMovingAverage && (
              <Line
                type="monotone"
                dataKey="metadata.movingAverage"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="7-Day Average"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
