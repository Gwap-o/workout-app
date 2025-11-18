import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { DeloadWeek } from '@/types';
import { isInDeloadWeek, calculateDeloadWeekDates } from '@/lib/utils/deloadUtils';

/**
 * Hook for managing deload weeks
 */
export const useDeload = () => {
  const [currentDeload, setCurrentDeload] = useState<DeloadWeek | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch current active deload week
   */
  const fetchCurrentDeload = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No user logged in');
      }

      // Get current date
      const today = new Date().toISOString().split('T')[0];

      // Fetch active deload week (where today is between start and end date)
      const { data, error: fetchError } = await supabase
        .from('deload_weeks')
        .select('*')
        .eq('user_id', user.id)
        .lte('start_date', today)
        .gte('end_date', today)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        throw fetchError;
      }

      // data will be an array, take the first element or null
      setCurrentDeload(data && data.length > 0 ? data[0] : null);
    } catch (err) {
      console.error('Error fetching deload:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch deload');
      setCurrentDeload(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Start a new deload week
   */
  const startDeload = async (
    reason: 'plateau' | 'scheduled' | 'manual',
    reductionPercentage: number = 10
  ): Promise<DeloadWeek | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No user logged in');
      }

      // Calculate deload week dates (7 days from today)
      const dates = calculateDeloadWeekDates();

      // Insert new deload week
      const { data, error: insertError } = await supabase
        .from('deload_weeks')
        .insert({
          user_id: user.id,
          start_date: dates.start,
          end_date: dates.end,
          reason,
          weight_reduction_percentage: reductionPercentage,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setCurrentDeload(data);
      return data;
    } catch (err) {
      console.error('Error starting deload:', err);
      setError(err instanceof Error ? err.message : 'Failed to start deload');
      return null;
    }
  };

  /**
   * End current deload week early
   */
  const endDeload = async (): Promise<boolean> => {
    try {
      if (!currentDeload) {
        return false;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No user logged in');
      }

      // Set end_date to today to end the deload
      const today = new Date().toISOString().split('T')[0];

      const { error: updateError } = await supabase
        .from('deload_weeks')
        .update({ end_date: today })
        .eq('id', currentDeload.id)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      setCurrentDeload(null);
      return true;
    } catch (err) {
      console.error('Error ending deload:', err);
      setError(err instanceof Error ? err.message : 'Failed to end deload');
      return false;
    }
  };

  /**
   * Check if currently in a deload week
   */
  const isDeloadActive = (): boolean => {
    if (!currentDeload) return false;

    return isInDeloadWeek(
      new Date(),
      currentDeload.start_date,
      currentDeload.end_date
    );
  };

  /**
   * Get deload reduction percentage
   */
  const getReductionPercentage = (): number => {
    return currentDeload?.weight_reduction_percentage || 10;
  };

  // Fetch on mount
  useEffect(() => {
    fetchCurrentDeload();
  }, []);

  return {
    currentDeload,
    loading,
    error,
    isDeloadActive: isDeloadActive(),
    reductionPercentage: getReductionPercentage(),
    startDeload,
    endDeload,
    refetch: fetchCurrentDeload,
  };
};
