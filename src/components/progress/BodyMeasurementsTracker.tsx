// Body Measurements Tracker Component

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Ruler, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { BodyweightLog } from '@/types';

interface Measurements {
  chest?: number;
  waist?: number;
  arms?: number;
  shoulders?: number;
  neck?: number;
  thighs?: number;
  calves?: number;
}

interface BodyMeasurementsTrackerProps {
  recentLogs: BodyweightLog[];
  onMeasurementAdded?: () => void;
}

export const BodyMeasurementsTracker = ({
  recentLogs,
  onMeasurementAdded,
}: BodyMeasurementsTrackerProps) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [measurements, setMeasurements] = useState<Measurements>({});

  // Get most recent measurement for comparison
  const latestLog = recentLogs[0];
  const previousLog = recentLogs[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase.from('bodyweight_logs').insert({
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        weight: latestLog?.weight || 0, // Keep current weight
        measurements,
      });

      if (error) throw error;

      setShowForm(false);
      setMeasurements({});
      onMeasurementAdded?.();
    } catch (err) {
      console.error('Error saving measurements:', err);
      alert('Failed to save measurements');
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (current?: number, previous?: number): number | null => {
    if (current === undefined || previous === undefined) return null;
    return current - previous;
  };

  const formatChange = (change: number | null): JSX.Element | null => {
    if (change === null) return null;

    const isIncrease = change > 0;
    const Icon = isIncrease ? TrendingUp : change < 0 ? TrendingDown : Minus;
    const colorClass = isIncrease
      ? 'text-green-600 dark:text-green-400'
      : change < 0
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-600 dark:text-gray-400';

    return (
      <span className={`flex items-center gap-1 text-xs ${colorClass}`}>
        <Icon className="w-3 h-3" />
        {Math.abs(change).toFixed(1)}"
      </span>
    );
  };

  const measurementFields: Array<{ key: keyof Measurements; label: string }> = [
    { key: 'chest', label: 'Chest' },
    { key: 'waist', label: 'Waist' },
    { key: 'arms', label: 'Arms (flexed)' },
    { key: 'shoulders', label: 'Shoulders' },
    { key: 'thighs', label: 'Thighs' },
    { key: 'calves', label: 'Calves' },
    { key: 'neck', label: 'Neck' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Body Measurements
            </CardTitle>
            <CardDescription>Track your measurements over time (in inches)</CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? 'outline' : 'default'}
          >
            {showForm ? 'Cancel' : <><Plus className="w-4 h-4 mr-1" /> Log Measurements</>}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {measurementFields.map(({ key, label }) => (
                <div key={key}>
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    value={measurements[key] || ''}
                    onChange={(e) =>
                      setMeasurements((prev) => ({
                        ...prev,
                        [key]: e.target.value ? parseFloat(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Save Measurements'}
            </Button>
          </form>
        ) : latestLog?.measurements ? (
          <div className="space-y-4">
            {/* Current Measurements */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {measurementFields.map(({ key, label }) => {
                const current = latestLog.measurements?.[key as keyof typeof latestLog.measurements];
                const previous = previousLog?.measurements?.[key as keyof typeof latestLog.measurements];
                const change = calculateChange(current, previous);

                if (!current) return null;

                return (
                  <div
                    key={key}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">{current.toFixed(1)}"</p>
                      {formatChange(change)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            {previousLog && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Compared to previous measurement
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Ruler className="w-12 h-12 mb-3 opacity-50" />
            <p>No measurements logged yet</p>
            <p className="text-sm mt-1">Click "Log Measurements" to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
