-- Migration: Create deload_weeks table
-- Feature: Deload Week Tracking (#9)
-- Created: 2025-11-17

-- Create deload_weeks table
CREATE TABLE IF NOT EXISTS deload_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Deload period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Deload metadata
  reason TEXT NOT NULL CHECK (reason IN ('plateau', 'scheduled', 'manual')),
  weight_reduction_percentage INTEGER NOT NULL DEFAULT 10 CHECK (weight_reduction_percentage BETWEEN 5 AND 20),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_deload_weeks_user_id ON deload_weeks(user_id);
CREATE INDEX IF NOT EXISTS idx_deload_weeks_dates ON deload_weeks(user_id, start_date, end_date);

-- Enable Row Level Security
ALTER TABLE deload_weeks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own deload weeks"
  ON deload_weeks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deload weeks"
  ON deload_weeks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deload weeks"
  ON deload_weeks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deload weeks"
  ON deload_weeks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE deload_weeks IS 'Tracks deload weeks for recovery periods in training';
COMMENT ON COLUMN deload_weeks.reason IS 'Reason for deload: plateau, scheduled, or manual';
COMMENT ON COLUMN deload_weeks.weight_reduction_percentage IS 'Percentage to reduce all working weights (5-20%)';
